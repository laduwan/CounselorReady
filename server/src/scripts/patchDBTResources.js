import { MongoClient } from 'mongodb';

const client = await MongoClient.connect(process.env.MONGODB_URI);
const db = client.db();
const col = db.collection('interactivecourses');

const dbtResources = [
  { title: 'DBT Distress Tolerance Quick Reference', type: 'docx',
    url: 'https://res.cloudinary.com/dzfscjhdx/raw/upload/v1773126418/DBT_Distress_Tolerance_Quick_Reference_kvzboc.docx',
    description: 'Quick reference card for distress tolerance skills' },
  { title: 'DBT Interpersonal Effectiveness Guide', type: 'docx',
    url: 'https://res.cloudinary.com/dzfscjhdx/raw/upload/v1773126418/DBT_Interpersonal_Effectiveness_Guide_o846xs.docx',
    description: 'DEAR MAN, GIVE, FAST skills guide' },
  { title: 'DBT Chain Analysis Worksheet', type: 'docx',
    url: 'https://res.cloudinary.com/dzfscjhdx/raw/upload/v1773126418/DBT_Chain_Analysis_Worksheet_kdgv7m.docx',
    description: 'Behavioral chain analysis worksheet for session use' },
  { title: 'DBT Diary Card Template', type: 'docx',
    url: 'https://res.cloudinary.com/dzfscjhdx/raw/upload/v1773126418/DBT_Diary_Card_Template_lfzylp.docx',
    description: 'Daily skills tracking diary card' },
  { title: 'DBT Check the Facts Worksheet', type: 'docx',
    url: 'https://res.cloudinary.com/dzfscjhdx/raw/upload/v1773126417/DBT_Check_the_Facts_Worksheet_r22oyd.docx',
    description: 'Emotion regulation worksheet for checking facts' },
];

const r = await col.findOneAndUpdate(
  { title: { $regex: /dialectical behavior therapy/i } },
  { $set: { resources: dbtResources } },
  { returnDocument: 'after' }
);
console.log(`DBT: ${r?.title} — ${r?.resources?.length} resources`);

await client.close();
