// inspectInteractive.cjs
// Dumps the full structure of all interactivecourses to see where content lives

const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI || "mongodb+srv://CounselorReady:QvizqheuvcU38k9v@counselorready.ouorgry.mongodb.net/counselorready?retryWrites=true&w=majority&appName=CounselorReady";

function getStructure(obj, prefix = '', depth = 0) {
  if (depth > 4) return; // limit depth
  if (!obj || typeof obj !== 'object') return;
  
  const entries = Array.isArray(obj) ? obj.map((v, i) => [i, v]) : Object.entries(obj);
  
  for (const [key, value] of entries) {
    const path = prefix ? `${prefix}.${key}` : String(key);
    
    if (Array.isArray(value)) {
      console.log(`  ${path}: Array[${value.length}]`);
      if (value.length > 0) {
        getStructure(value[0], `${path}[0]`, depth + 1);
      }
    } else if (value && typeof value === 'object' && !(value instanceof Date)) {
      console.log(`  ${path}: Object`);
      getStructure(value, path, depth + 1);
    } else {
      const preview = value !== null && value !== undefined 
        ? String(value).substring(0, 80) + (String(value).length > 80 ? '...' : '')
        : 'null';
      console.log(`  ${path}: ${typeof value} = "${preview}"`);
    }
  }
}

async function inspect() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected\n');
    
    const db = client.db('counselorready');
    const coll = db.collection('interactivecourses');
    const all = await coll.find({}).toArray();
    
    console.log(`Found ${all.length} interactivecourses\n`);
    
    for (const course of all) {
      console.log(`${'═'.repeat(60)}`);
      console.log(`📋 ${course.title}`);
      console.log(`${'═'.repeat(60)}`);
      console.log(`Top-level keys: ${Object.keys(course).join(', ')}\n`);
      getStructure(course);
      console.log('');
    }
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.close();
    console.log('🔒 Done');
  }
}

inspect();
