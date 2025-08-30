const mongoose = require('mongoose');

const notificationLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  type: String,
  recipient: String,
  message: String,
  status: String,
  externalId: String,
  error: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('NotificationLog', notificationLogSchema);
