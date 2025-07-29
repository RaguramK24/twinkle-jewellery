const MessageSchema = require('./MessageSchema');

class Message {
  async save(messageData) {
    const message = new MessageSchema({
      name: messageData.name.trim(),
      email: messageData.email.trim(),
      phone: messageData.phone ? messageData.phone.trim() : undefined,
      message: messageData.message.trim()
    });

    return await message.save();
  }

  async find() {
    return await MessageSchema.find();
  }

  // Method to sort messages by timestamp descending
  async findSorted() {
    return await MessageSchema.find().sort({ createdAt: -1 });
  }
}

module.exports = new Message();