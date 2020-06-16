const express = require("express");
socketio = require("socket.io");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const app = express();
const { addUser, removeUser, getUser } = require("./users");
app.use(cors());
const server = app.listen(PORT, () =>
  console.log(`Server has started on ${PORT}`)
);

const io = require("socket.io")(server);
app.get("/", (req, res) => {
  res.send("Chat server is running");
});

io.on("connection", (socket) => {
  socket.on("join", ({ name, room }, callback) => {
    const { user } = addUser({ id: socket.id, name, room });
    socket.join(user.room);
    socket.emit("message", {
      //message when user logins
      user: "Admin",
      text: `${user.name}, Welcome to the room, ${user.room}`,
    });
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "Admin", text: `${user.name}, has joined` });
    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", { user: user.name, text: message });

    callback();
  });
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", {
        user: "Admin",
        text: `${user.name} has left`,
      });
    }
  });
});

module.exports = server;
