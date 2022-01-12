const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../messages", "Post.json");

module.exports = class Messages {
  constructor(from, to, topic, message, toAdmins) {
    this.from = from;
    this.to = to;
    this.topic = topic;
    this.message = message;
    this.toAdmins = toAdmins;
    this.readed = false;
    this.createdAt = Date.now();
    crypto.randomBytes(32, (err, result) => {
      this._id = result.toString("hex");
    });
  }

  static fetchAllMessages(cb) {
    fs.readFile(filePath, (err, data) => {
      if (data) {
        cb(JSON.parse(data));
      } else {
        cb([]);
      }
    });
  }

  save() {
    Messages.fetchAllMessages((messages) => {
      messages.push(this);
      fs.writeFile(filePath, JSON.stringify(messages), () => {});
    });
  }

  static messageReaded(msgId) {
    const error = new Error();
    Messages.fetchAllMessages((messages) => {
      const msgIndex = messages.findIndex(
        (m) => m._id.toString() === msgId.toString()
      );
      if (msgIndex < 0) {
        error.statusCode = 404;
        error.msg = "Message not found.";
        throw error;
      }
      messages[msgIndex].readed = true;
    });
  }

  static deleteMessage(msgId) {
    Messages.fetchAllMessages((messages) => {
      const newDb = messages.filter(
        (m) => m._id.toString() !== msgId.toString()
      );
      fs.writeFile(filePath, JSON.stringify(newDb), () => {});
    });
  }
};
