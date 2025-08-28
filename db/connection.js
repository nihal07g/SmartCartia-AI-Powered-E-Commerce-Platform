
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartcartia';
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: false,
  maxPoolSize: 20,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let isConnected = false;

async function connectWithRetry() {
  if (isConnected) return;
  try {
    await mongoose.connect(MONGODB_URI, options);
    isConnected = true;
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    setTimeout(connectWithRetry, 5000);
  }
}

mongoose.connection.on('connected', () => {
  isConnected = true;
});
mongoose.connection.on('disconnected', () => {
  isConnected = false;
  connectWithRetry();
});

module.exports = {
  connectWithRetry,
  mongoose,
};