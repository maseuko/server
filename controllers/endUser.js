const CourseManager = require("../models/CourseManager");
const Messages = require("../models/Messages");
const COURSES = require("../constants/database").CURRENT_COURSES;
const USERS = require("../constants/database").USERS;

exports.fetchAllQuestions = (req, res, next) => {
  const courseId = req.body.courseId;
  const courseIndex = COURSES[0].findIndex(
    (q) => q._id.toString() === courseId.toString()
  );
  if (!(courseIndex >= 0)) {
    return res.status(404).json({ msg: "Course not exists." });
  }

  CourseManager.fetchAll(courseId, (questions) => {
    res.status(200).json(questions);
  });
};

exports.fetchSingleQuestion = (req, res, next) => {
  const courseId = req.body.courseId;
  const questionId = req.body.questionId;

  const courseIndex = COURSES[0].findIndex(
    (q) => q._id.toString() === courseId.toString()
  );
  if (!(courseIndex >= 0)) {
    return res.status(404).json({ msg: "Course not exists." });
  }

  CourseManager.findOne(courseId, questionId, (question) => {
    if (!question) {
      return res.status(404).json({ msg: "Question not found." });
    }
    res.status(200).json({ question });
  });
};

exports.sendEmail = (req, res, next) => {
  const message = req.body.message;
  const to = req.body.to;
  const from = req.body.from;
  const toAdmins = req.body.toAdmins;
  const topic = req.body.topic;

  const userIndex = USERS[0].findIndex(
    (u) => u._id.toString() === from.toString()
  );

  if (userIndex < 0) {
    return res.status(404).json({ msg: "User not found." });
  }

  const mess = new Messages(
    USERS[0][userIndex].email,
    to,
    topic,
    message,
    toAdmins
  );
  mess.save();
  return res.status(200).json({ msg: "Message sended." });
};

exports.mailReaded = (req, res, next) => {
  const messId = req.body._id;
  try {
    Messages.messageReaded(messId);
    return res.status(202).json("Status updated.");
  } catch (err) {
    next(err);
  }
};

exports.deleteMessage = (req, res, next) => {
  const messIds = req.body._ids;
  Messages.deleteMessage(messIds);
  return res.status(200).json("Message deleted.");
};

exports.getAllMessages = (req, res, next) => {
  const uid = req.body.uid;
  const userIndex = USERS[0].findIndex(
    (u) => u._id.toString() === uid.toString()
  );
  if (userIndex < 0) {
    return res.status(404).json({ msg: "User not found." });
  }

  Messages.fetchAllMessages((messages) => {
    const userMessages = messages.filter(
      (m) => m.to.toString() === USERS[0][userIndex].email.toString()
    );
    return res.status(200).json(userMessages);
  });
};
