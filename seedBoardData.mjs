import mongoose from 'mongoose';
await mongoose.connect(process.env.MONGODB_URI);
const db=mongoose.connection.db;
const bs=db.collection('boardsources');
const ba=db.collection('boardalerts');

// Sources
for(const s of [
  {state:'GA',boardName:'Georgia Composite Board',credentialTypes:['LPC','LCSW','LMFT'],url:'https://sos.ga.gov/index.php/licensing/plb/45',feedType:'webpage',isActive:true,checkFrequencyHours:168,consecutiveFailures:0,createdAt:new Date()},
  {state:'US',boardName:'NBCC',credentialTypes:['NCC','BC-TMH','CCMHC'],url:'https://www.nbcc.org/certification/ncc/renewal',feedType:'webpage',isActive:true,checkFrequencyHours:168,consecutiveFailures:0,createdAt:new Date()},
  {state:'US',boardName:'NBCC News',credentialTypes:['NCC','BC-TMH'],url:'https://www.nbcc.org/news',feedType:'webpage',isActive:true,checkFrequencyHours:72,consecutiveFailures:0,createdAt:new Date()},
  {state:'TX',boardName:'Texas BHEC',credentialTypes:['LPC'],url:'https://www.bhec.texas.gov/texas-state-board-of-examiners-of-professional-counselors/index.html',feedType:'webpage',isActive:true,checkFrequencyHours:168,consecutiveFailures:0,createdAt:new Date()},
  {state:'ID',boardName:'Idaho BOL',credentialTypes:['LPC'],url:'https://ibol.idaho.gov/IBOL/BoardPage.aspx?Bureau=COU',feedType:'webpage',isActive:true,checkFrequencyHours:168,consecutiveFailures:0,createdAt:new Date()},
  {state:'US',boardName:'American Counseling Association',credentialTypes:['LPC','LMHC','NCC'],url:'https://www.counseling.org/news',feedType:'webpage',isActive:true,checkFrequencyHours:72,consecutiveFailures:0,createdAt:new Date()},
  {state:'US',boardName:'ACA CE Requirements',credentialTypes:['LPC','LMHC'],url:'https://www.counseling.org/continuing-education',feedType:'webpage',isActive:true,checkFrequencyHours:168,consecutiveFailures:0,createdAt:new Date()},
  {state:'US',boardName:'American Psychological Association',credentialTypes:['Psychologist','PsyD','PhD'],url:'https://www.apa.org/education/ce',feedType:'webpage',isActive:true,checkFrequencyHours:168,consecutiveFailures:0,createdAt:new Date()},
  {state:'US',boardName:'APA News',credentialTypes:['Psychologist','PsyD','PhD'],url:'https://www.apa.org/news',feedType:'webpage',isActive:true,checkFrequencyHours:72,consecutiveFailures:0,createdAt:new Date()},
  {state:'US',boardName:'NASW - CE Info',credentialTypes:['LCSW','CSW','MSW'],url:'https://www.socialworkers.org/Careers/Continuing-Education',feedType:'webpage',isActive:true,checkFrequencyHours:168,consecutiveFailures:0,createdAt:new Date()},
  {state:'US',boardName:'NASW News',credentialTypes:['LCSW','CSW'],url:'https://www.socialworkers.org/News',feedType:'webpage',isActive:true,checkFrequencyHours:72,consecutiveFailures:0,createdAt:new Date()},
  {state:'US',boardName:'AAMFT',credentialTypes:['LMFT','MFT'],url:'https://www.aamft.org/CE',feedType:'webpage',isActive:true,checkFrequencyHours:168,consecutiveFailures:0,createdAt:new Date()}
]){const e=await bs.findOne({url:s.url});if(!e){await bs.insertOne(s);console.log('ADD source:',s.state,s.boardName)}else console.log('SKIP:',s.boardName)}

// Alerts
for(const a of [
  {state:'GA',boardName:'Georgia Composite Board',credentialTypes:['LPC','LCSW','LMFT'],title:'GA 35 CE/2yr',summary:'35 CE hrs per 2-year cycle. 5 ethics hours must be synchronous.',category:'ce_requirement_change',severity:'info',isPublished:true,acknowledgedBy:[],createdAt:new Date()},
  {state:'GA',boardName:'Georgia Composite Board',credentialTypes:['LPC'],title:'CPCS 12 Supervision CE',summary:'12 CE hours in supervision-specific topics per renewal cycle.',category:'ce_requirement_change',severity:'important',isPublished:true,acknowledgedBy:[],createdAt:new Date()},
  {state:'US',boardName:'NBCC',credentialTypes:['NCC'],title:'NCC 100 CE/5yr',summary:'100 CE hours over 5 years. 3 ethics minimum. ACEP providers only.',category:'ce_requirement_change',severity:'info',isPublished:true,acknowledgedBy:[],createdAt:new Date()},
  {state:'US',boardName:'NBCC',credentialTypes:['BC-TMH'],title:'BC-TMH 20 Telehealth CE',summary:'20 telehealth CE hours per renewal, in addition to NCC base.',category:'ce_requirement_change',severity:'info',isPublished:true,acknowledgedBy:[],createdAt:new Date()},
  {state:'TX',boardName:'Texas BHEC',credentialTypes:['LPC'],title:'TX 24 CE/2yr',summary:'24 CE biennially. 3 ethics + 2 cultural diversity required.',category:'ce_requirement_change',severity:'info',isPublished:true,acknowledgedBy:[],createdAt:new Date()},
  {state:'US',boardName:'ACA',credentialTypes:['LPC','LMHC'],title:'ACA Continuing Education Standards',summary:'ACA recommends ongoing CE aligned with CACREP standards. Check your state board for specific hour requirements.',category:'ce_requirement_change',severity:'info',isPublished:true,acknowledgedBy:[],createdAt:new Date()},
  {state:'US',boardName:'APA',credentialTypes:['Psychologist','PsyD','PhD'],title:'APA CE Requirements',summary:'Most states require 20-40 CE hours per renewal for psychologists. APA-approved sponsors satisfy requirements in all 50 states.',category:'ce_requirement_change',severity:'info',isPublished:true,acknowledgedBy:[],createdAt:new Date()},
  {state:'US',boardName:'NASW',credentialTypes:['LCSW','CSW'],title:'NASW CE Standards for Social Workers',summary:'NASW credential holders must complete 20-48 CE hours per cycle depending on credential level. Ethics CE required.',category:'ce_requirement_change',severity:'info',isPublished:true,acknowledgedBy:[],createdAt:new Date()},
  {state:'US',boardName:'AAMFT',credentialTypes:['LMFT','MFT'],title:'AAMFT CE for Marriage & Family Therapists',summary:'AAMFT Approved Supervisors need 18 CE hours per cycle. State LMFT requirements vary (typically 30-40 hrs/2yr).',category:'ce_requirement_change',severity:'info',isPublished:true,acknowledgedBy:[],createdAt:new Date()}
]){const e=await ba.findOne({title:a.title});if(!e){await ba.insertOne(a);console.log('ADD alert:',a.title)}else console.log('SKIP:',a.title)}

console.log('Done');
await mongoose.disconnect();
