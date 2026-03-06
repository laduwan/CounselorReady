/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
printf 'import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
await mongoose.connect(process.env.MONGODB_URI);
const db=mongoose.connection.db;
const c=db.collection("interactivecourses");
const all=await c.find({}).toArray();
for(const d of all){
const types={};
(d.sections||[]).forEach(s=>(s.contentBlocks||[]).forEach(b=>{types[b.type]=(types[b.type]||0)+1}));
const total=Object.values(types).reduce((a,b)=>a+b,0);
const hasOnlyText=Object.keys(types).length<=2;
if(d.sections?.length>0 && hasOnlyText && total<10){
console.log(d.slug,"| secs:",d.sections?.length,"| blocks:",total,"| types:",JSON.stringify(types),"| aQs:",d.assessment?.questions?.length||0);
}}
await mongoose.disconnect();
' > src/scripts/inspect2.js
