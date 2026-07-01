// Standalone test of the CORRECTED gate logic against Ke's real policy:
//   - No-card trial: 2 courses lifetime, each <= 1 CE hour
//   - Card on file:  4 courses/month, each <= 1 CE hour
//   - active/lifetime paid plan: unlimited
//   - purchased / admin / accessType:free: always

const FREE_COURSES_PER_MONTH = 4;
const TRIAL_COURSES_TOTAL    = 2;
const FREE_MAX_COURSE_HOURS  = 1;
function currentMonthKey(){ return new Date().toISOString().slice(0,7); }
function effectiveFreeCoursesUsed(u){
  if(!u) return 0;
  if(u.freeCoursesResetMonth !== currentMonthKey()) return 0;
  return u.freeCoursesUsedThisMonth ?? 0;
}
function hasCardOnFile(u){ return !!u?.subscription?.stripeCustomerId; }

// CORRECTED hasPaidOrFreeAccess: trial NO LONGER unlimited
function hasPaidOrFreeAccess(user, course){
  if(!user) return false;
  if(user.role === 'admin') return true;
  if(course.accessType === 'free') return true;
  const purchased = user.purchasedCourses?.some(pc => pc.courseId?.toString() === course._id.toString());
  if(purchased) return true;
  const status = user.subscription?.status || 'free';
  const plan   = user.subscription?.plan   || 'free';
  // Only genuinely-paid ongoing plans get unlimited. trial is NOT here anymore.
  return ['active','lifetime'].includes(status) && plan !== 'free';
}

// CORRECTED freeTierDecision: handles trial (2 total) vs card-on-file (4/month)
function freeTierDecision(user, course){
  const courseHours = course.ceHours || course.ceuHours || 1;
  if(courseHours > FREE_MAX_COURSE_HOURS){
    return { allowed:false, code:'OVER_FREE_HOUR_LIMIT',
      message:'Free access covers 1 CE-hour courses only. Purchase this course or upgrade to enroll.' };
  }
  const status = user?.subscription?.status || 'free';
  if(status === 'trial' && !hasCardOnFile(user)){
    const usedTrial = user.trialCoursesUsed ?? 0;
    if(usedTrial >= TRIAL_COURSES_TOTAL){
      return { allowed:false, code:'TRIAL_LIMIT',
        message:`Your free trial includes ${TRIAL_COURSES_TOTAL} one-hour courses. Add a card for 4 free courses every month, or purchase this course.` };
    }
    return { allowed:true, code:'TRIAL_OK' };
  }
  // free plan OR trial-with-card OR card-on-file users: 4/month, 1-hr each
  if(effectiveFreeCoursesUsed(user) >= FREE_COURSES_PER_MONTH){
    return { allowed:false, code:'MONTHLY_LIMIT',
      message:`You've used your ${FREE_COURSES_PER_MONTH} free courses this month. Purchase this course or upgrade for unlimited access.` };
  }
  return { allowed:true, code:'FREE_OK' };
}

// access decision = paid OR free-tier-allowed
function canEnroll(user, course){
  if(hasPaidOrFreeAccess(user,course)) return {allowed:true, via:'paid/owned'};
  return freeTierDecision(user, course);
}

// ---- TEST CASES ----
const C1 = { _id:'c1', ceHours:1 };   // 1-CE course
const C6 = { _id:'c6', ceHours:6 };   // 6-CE TeleMental
const C4 = { _id:'c4', ceHours:4 };   // 4-CE Neurobiology

let pass=0, fail=0;
function t(name, got, want){
  const ok = got.allowed === want;
  console.log(`${ok?'✓':'✗'} ${name} -> allowed=${got.allowed}${got.code?' ('+got.code+')':''}`);
  ok?pass++:fail++;
}

// The T'Challa scenario: no-card trial
const trialNoCard0 = { subscription:{status:'trial'}, trialCoursesUsed:0 };
const trialNoCard2 = { subscription:{status:'trial'}, trialCoursesUsed:2 };

t('no-card trial, 1st 1-CE course', canEnroll(trialNoCard0, C1), true);
t('no-card trial, after 2 used, 1-CE', canEnroll(trialNoCard2, C1), false);
t('no-card trial, 6-CE TeleMental (THE BUG)', canEnroll(trialNoCard0, C6), false);
t('no-card trial, 4-CE Neurobiology', canEnroll(trialNoCard0, C4), false);

// Card on file: 4/month, 1-hr each
const cardFresh = { subscription:{status:'trial', stripeCustomerId:'cus_x'}, freeCoursesResetMonth:currentMonthKey(), freeCoursesUsedThisMonth:0 };
const cardMaxed = { subscription:{status:'trial', stripeCustomerId:'cus_x'}, freeCoursesResetMonth:currentMonthKey(), freeCoursesUsedThisMonth:4 };
t('card-on-file, 1-CE within 4/mo', canEnroll(cardFresh, C1), true);
t('card-on-file, 5th course this month', canEnroll(cardMaxed, C1), false);
t('card-on-file, 6-CE course', canEnroll(cardFresh, C6), false);

// Paid plans unlimited
const paid = { subscription:{status:'active', plan:'professional'} };
t('active paid plan, 6-CE course', canEnroll(paid, C6), true);
const life = { subscription:{status:'lifetime', plan:'lifetime'} };
t('lifetime, 6-CE course', canEnroll(life, C6), true);

// Purchased single course
const bought = { subscription:{status:'free'}, purchasedCourses:[{courseId:'c6'}] };
t('purchased the 6-CE course', canEnroll(bought, C6), true);

// admin
t('admin, anything', canEnroll({role:'admin',subscription:{}}, C6), true);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
