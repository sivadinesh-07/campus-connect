const mongoose = require('mongoose');

// Cache connection across serverless invocations
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // Only set custom DNS locally if needed; avoid overriding in cloud environments
    if (process.env.NODE_ENV !== 'production') {
      try {
        const dns = require('dns');
        dns.setServers(['8.8.8.8', '8.8.4.4']);
      } catch (e) {
        // ignore if not allowed
      }
    }

    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongooseInstance) => {
      console.log(`MongoDB Connected: ${mongooseInstance.connection.host}`);
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error(`MongoDB Connection Error: ${error.message}`);
    throw error;
  }

  return cached.conn;
};

module.exports = connectDB;
