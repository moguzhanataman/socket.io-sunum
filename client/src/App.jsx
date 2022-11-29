import React, { useEffect, useState } from "react"
import { useRef } from "react"
import { useSocket } from "./useSocket"
import { useStickyState } from "./useStickyState"

function App() {
  const {
    socket,
    isConnected,
    messages,
    rooms,
    currentRoom,
    joinRoom,
    nick,
    setNick,
  } = useSocket()
  const inputRef = useRef(null)

  const sendMessage = (e) => {
    e.preventDefault()
    const msg = inputRef.current.value

    if (msg === "" || nick === "") {
      return
    }

    socket.emit("msg", {
      msg: inputRef.current?.value,
      nick: nick,
      time: Date.now(),
    })
    inputRef.current.value = ""
  }

  const changeNickname = (e) => {
    const newNick = e.target.value
    setNick(newNick)
  }

  return (
    <div className="container">
      <h1>Chat App</h1>
      connected?: {isConnected ? "true" : "false"}
      <form id="form" onSubmit={sendMessage}>
        Nickname:
        <input type="text" defaultValue={nick} onChange={changeNickname} />
        <main className="horizontalPanel">
          <ul className="rooms">
            {rooms.map((room) => (
              <li
                key={room}
                className={room === currentRoom ? "joinedRoom" : ""}
                onClick={() => {
                  if (room !== currentRoom) {
                    joinRoom(room)
                  }
                }}
              >
                {room}
              </li>
            ))}
          </ul>
          <div id="messages" className="messages">
            {messages.map((message) => (
              <div key={message.id} className="message">
                {message.nick}: {message.msg}
              </div>
            ))}
          </div>
        </main>
        <div className="textBox">
          Message: <input type="text" id="input" ref={inputRef} />
          <input type="submit" value="Send" />
        </div>
      </form>
    </div>
  )
}

export default App
