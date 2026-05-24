cat > src/scripts/resetwc.js << 'EOF'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
await mongoose.connect(process.env.MONGODB_URI);
await mongoose.connection.db.collection('interactivecourses').updateMany(
  { courseCode: { $in: ['CR-610','CR-611','CR-612','CR-613','CR-614'] } },
  { $set: { wordCount: 0 } }
);
console.log('reset done');
process.exit(0);
EOF
