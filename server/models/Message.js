const JsonStorage = require('../utils/jsonStorage');

class Message {
  constructor() {
    this.storage = new JsonStorage('messages');
  }

  async save(messageData) {
    // Validate required fields
    if (!messageData.name || !messageData.name.trim()) {
      throw new Error('Name is required');
    }
    if (!messageData.email || !messageData.email.trim()) {
      throw new Error('Email is required');
    }
    if (!messageData.message || !messageData.message.trim()) {
      throw new Error('Message is required');
    }

    return this.storage.create({
      name: messageData.name.trim(),
      email: messageData.email.trim(),
      message: messageData.message.trim(),
      timestamp: new Date()
    });
  }

  async find() {
    return this.storage.findAll();
  }

  // Method to sort messages by timestamp descending
  async findSorted() {
    const messages = this.storage.findAll();
    return messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }
}

module.exports = new Message();