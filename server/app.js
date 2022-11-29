const express = require("express")
const app = express()
const http = require("http")
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)

const MESSAGE_TYPES = {
  chatMessage: "msg", // contains: nick(string), msg (string), time (UTC timestamp)
  join: "join", // nick, channelName
  typing: "typing", // nick, isStarted (true for started, false for ended)
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

io.on("connection", (socket) => {
  socket.on(MESSAGE_TYPES.chatMessage, (payload) => {
    console.log({ payload })
    io.emit("msg", payload.msg)
  })
})

server.listen(3000, () => {
  console.log("listening on *:3000")
})
