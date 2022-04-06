const ONLINE_USERS = require("../constants/database").ONLINE_USERS;
const INVALID_SESSIONS = [];

exports.disconnect = (socket) =>
  socket.on("disconnect", () => {
    console.log(`User disconected: ${socket.id}`);

    for (const uid in ONLINE_USERS) {
      const session_index = ONLINE_USERS[uid].findIndex(
        (session) => session.toString() === socket.id.toString()
      );
      if (session_index > -1) {
        ONLINE_USERS[uid] = ONLINE_USERS[uid].filter(
          (s) => s.toString() !== socket.id.toString()
        );
        if (ONLINE_USERS[uid].length === 0) {
          clearInterval(INVALID_SESSIONS[uid]);
        }
      }
    }
  });

exports.user_logged_in = (socket) =>
  socket.on("user_logged_in", (uid) => {
    socket.join(uid);
    if (!ONLINE_USERS[uid]) {
      ONLINE_USERS[uid] = [];
    }
    if (INVALID_SESSIONS[uid]) {
      clearInterval(INVALID_SESSIONS[uid]);
    }
    ONLINE_USERS[uid].push(socket.id);
    const interval = setInterval(() => {
      socket.broadcast.to(uid).emit("to_many_users", {
        sessions: ONLINE_USERS[uid],
        validSession: ONLINE_USERS[uid][ONLINE_USERS.length - 1],
      });
    }, 500);
    INVALID_SESSIONS[uid] = interval;

    console.log("Users online: ", ONLINE_USERS);
  });

exports.look_for_session = (socket) =>
  socket.on("look_for_session", (session, uid) => {
    socket.to(uid).emit("remove_access_for_session", session);
  });
