const { randomUUID } = require("crypto")
const express = require("express")
const app = express()
const http = require("http")
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)

const rooms = ["Room1", "Room2", "Room3"]
const roomUsers = {}

const MESSAGE_TYPES = {
  chatMessage: "msg", // contains: nick(string), msg (string), time (UTC timestamp)
  joinRoom: "joinRoom", // nick, room
  typing: "typing", // nick, isStarted (true for started, false for ended)
  changeNick: "changeNick",
}

app.get("/", (req, res) => {
  res.send({ roomUsers, rooms })
})

io.on("connection", (socket) => {
  console.log("client connected", socket.id)

  // Send channel list and join first of them
  socket.emit("rooms", rooms)
  socket.join(rooms[0])
  joinRoom(rooms[0], socket)

  function myRoom() {
    return roomUsers[socket.id]
  }

  socket.on(MESSAGE_TYPES.chatMessage, (payload) => {
    console.log({ payload })
    payload.id = randomUUID()
    console.log({ myRoom: myRoom(), payload })
    io.to(myRoom()).emit(MESSAGE_TYPES.chatMessage, payload)
    // io.emit("msg", payload)
  })

  socket.on(MESSAGE_TYPES.joinRoom, (payload) => {
    console.log({ payload })
    joinRoom(payload.room, socket)
  })

  socket.on(MESSAGE_TYPES.changeNick, (payload) => {})

  socket.on("disconnect", (reason) => {
    console.log("a client disconnected, reason: ", reason)
    leaveRoom(socket)
  })
})

function joinRoom(room, socket) {
  if (roomUsers[socket.id]) {
    socket.leave(roomUsers[socket.id])
  }

  roomUsers[socket.id] = room
  socket.join(room)
}

function leaveRoom(socket) {
  roomUsers[socket.id] = undefined
}
server.listen(3000, () => {
  console.log("listening on *:3000")
})
