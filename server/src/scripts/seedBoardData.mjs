import mongoose from 'mongoose';
await mongoose.connect(process.env.MONGODB_URI);
const db=mongoose.connection.db;
const bs=db.collection('boardsources');
const ba=db.collection('boardalerts');

// Sources
for(const s of [
  {state:'GA',boardName:'Georgia Composite Board',credentialTypes:['LPC','LCSW','LMFT'],url:'https://sos.ga.gov/index.php/licensing/plb/45',feedType:'webpage',isActive:true,checkFrequencyHours:168,consecutiveFailures:0,createdAt:new Date()},
  {state:'US',boardName:'NBCC',credentialTypes:['NCC','BC-TMH'],url:'https://www.nbcc.org/certification/ncc/renewal',feedType:'webpage',isActive:true,checkFrequencyHours:168,consecutiveFailures:0,createdAt:new Date()},
  {state:'TX',boardName:'Texas BHEC',credentialTypes:['LPC'],url:'https://www.bhec.texas.gov/texas-state-board-of-examiners-of-professional-counselors/index.html',feedType:'webpage',isActive:true,checkFrequencyHours:168,consecutiveFailures:0,createdAt:new Date()},
  {state:'ID',boardName:'Idaho BOL',credentialTypes:['LPC'],url:'https://ibol.idaho.gov/IBOL/BoardPage.aspx?Bureau=COU',feedType:'webpage',isActive:true,checkFrequencyHours:168,consecutiveFailures:0,createdAt:new Date()}
]){const e=await bs.findOne({url:s.url});if(!e){await bs.insertOne(s);console.log('ADD source:',s.state,s.boardName)}else console.log('SKIP:',s.state)}

// Alerts
for(const a of [
  {state:'GA',boardName:'Georgia Composite Board',credentialTypes:['LPC','LCSW','LMFT'],title:'GA 35 CE/2yr',summary:'35 CE hrs per 2-year cycle. 5 ethics hours must be synchronous.',category:'ce_requirement_change',severity:'info',isPublished:true,acknowledgedBy:[],createdAt:new Date()},
  {state:'GA',boardName:'Georgia Composite Board',credentialTypes:['LPC'],title:'CPCS 12 Supervision CE',summary:'12 CE hours in supervision-specific topics per renewal cycle.',category:'ce_requirement_change',severity:'important',isPublished:true,acknowledgedBy:[],createdAt:new Date()},
  {state:'US',boardName:'NBCC',credentialTypes:['NCC'],title:'NCC 100 CE/5yr',summary:'100 CE hours over 5 years. 3 ethics minimum. ACEP providers only.',category:'ce_requirement_change',severity:'info',isPublished:true,acknowledgedBy:[],createdAt:new Date()},
  {state:'US',boardName:'NBCC',credentialTypes:['BC-TMH'],title:'BC-TMH 20 Telehealth CE',summary:'20 telehealth CE hours per renewal, in addition to NCC base.',category:'ce_requirement_change',severity:'info',isPublished:true,acknowledgedBy:[],createdAt:new Date()},
  {state:'TX',boardName:'Texas BHEC',credentialTypes:['LPC'],title:'TX 24 CE/2yr',summary:'24 CE biennially. 3 ethics + 2 cultural diversity required.',category:'ce_requirement_change',severity:'info',isPublished:true,acknowledgedBy:[],createdAt:new Date()}
]){const e=await ba.findOne({title:a.title});if(!e){await ba.insertOne(a);console.log('ADD alert:',a.title)}else console.log('SKIP:',a.title)}

console.log('Done');
await mongoose.disconnect();
