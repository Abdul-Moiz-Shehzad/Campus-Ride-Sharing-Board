const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Remove stale email unique index if it exists, since the app no longer uses email.
    try {
      const collection = conn.connection.db.collection('users');
      const indexes = await collection.indexes();
      const emailIndex = indexes.find((index) => index.name === 'email_1');
      if (emailIndex) {
        await collection.dropIndex('email_1');
        console.log('Removed stale email_1 index from users collection.');
      }
    } catch (indexError) {
      console.warn('Index removal check skipped:', indexError.message);
    }

    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
