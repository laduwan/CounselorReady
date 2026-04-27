// ═══════════════════════════════════════════════════════════════
//  INDIVIDUAL COURSE PURCHASE — Add these to payments.js
//  Replace existing purchase-course and purchased-courses routes
// ═══════════════════════════════════════════════════════════════

// ── POST /api/payments/purchase-course ──────────────────────
// Creates a Stripe Checkout Session for one-time course purchase
router.post('/purchase-course', protect, async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ error: 'courseId is required' });
    }

    // Look up course
    const course = await mongoose.connection.db
      .collection('interactivecourses')
      .findOne({ _id: new mongoose.Types.ObjectId(courseId) });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (!course.price || course.price <= 0) {
      return res.status(400).json({ error: 'This course is free — no purchase needed' });
    }

    // Check if already purchased
    const user = await User.findById(req.user._id);
    const alreadyPurchased = (user.purchasedCourses || []).some(
      pc => pc.courseId?.toString() === courseId
    );
    if (alreadyPurchased) {
      return res.status(400).json({ error: 'You already own this course' });
    }

    // Get or create Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        metadata: { userId: user._id.toString() }
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(course.price * 100), // cents
          product_data: {
            name: course.title,
            description: course.description || `${course.ceHours || 0} CE Hours`,
            metadata: { courseId: courseId, slug: course.slug }
          }
        },
        quantity: 1
      }],
      metadata: {
        type: 'course_purchase',
        courseId: courseId,
        userId: user._id.toString(),
        slug: course.slug
      },
      success_url: `${process.env.CLIENT_URL}/purchase-success.html?session_id={CHECKOUT_SESSION_ID}&slug=${course.slug}`,
      cancel_url: `${process.env.CLIENT_URL}/course-details.html?slug=${course.slug}&cancelled=true`
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Purchase course error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});


// ── GET /api/payments/purchased-courses ─────────────────────
// Returns list of course IDs the user has purchased
router.get('/purchased-courses', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const purchased = (user.purchasedCourses || []).map(pc => ({
      courseId: pc.courseId,
      purchasedAt: pc.purchasedAt,
      amount: pc.amount
    }));
    res.json({ purchased });
  } catch (error) {
    console.error('Get purchased courses error:', error);
    res.status(500).json({ error: 'Failed to fetch purchased courses' });
  }
});


// ═══════════════════════════════════════════════════════════════
//  WEBHOOK ADDITION — Inside your existing webhook handler,
//  add this case for checkout.session.completed:
// ═══════════════════════════════════════════════════════════════

// Inside the webhook switch/if block that handles Stripe events:
//
//   case 'checkout.session.completed': {
//     const session = event.data.object;
//     
//     // Only handle course purchases (not subscriptions)
//     if (session.metadata?.type === 'course_purchase') {
//       const { courseId, userId, slug } = session.metadata;
//       
//       await User.findByIdAndUpdate(userId, {
//         $addToSet: {
//           purchasedCourses: {
//             courseId: new mongoose.Types.ObjectId(courseId),
//             slug: slug,
//             purchasedAt: new Date(),
//             amount: session.amount_total / 100,
//             stripeSessionId: session.id
//           }
//         }
//       });
//       
//       console.log(`✓ Course purchase recorded: user=${userId} course=${slug}`);
//     }
//     break;
//   }


// ═══════════════════════════════════════════════════════════════
//  USER MODEL ADDITION — Add to your User schema if not present:
// ═══════════════════════════════════════════════════════════════

// purchasedCourses: [{
//   courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'InteractiveCourse' },
//   slug: String,
//   purchasedAt: { type: Date, default: Date.now },
//   amount: Number,
//   stripeSessionId: String
// }]
