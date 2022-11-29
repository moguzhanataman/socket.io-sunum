import React, { useEffect, useState } from "react"
import { useRef } from "react"
import { useSocket } from "./useSocket"
import { useStickyState } from "./useStickyState"

function App() {
  const [nick, setNick] = useStickyState("", "nickname")
  const [socket, isConnected, messages] = useSocket()
  const inputRef = useRef(null)

  const sendMessage = (e) => {
    e.preventDefault()
    const msg = inputRef.current.value

    if (msg === "") {
      return
    }

    socket.emit("msg", {
      msg: inputRef.current?.value,
      nick: nick,
      time: Date.now(),
    })
  }

  return (
    <div className="content">
      <h1>Chat App</h1>
      connected?: {isConnected ? "true" : "false"}
      <form id="form" onSubmit={sendMessage}>
        Nickname:
        <input
          type="text"
          defaultValue={nick}
          onChange={(e) => {
            const newNick = e.target.value
            setNick(newNick)
          }}
        />
        <ul id="messages" className="messages">
          {messages.map((message) => (
            <li key={message.id}>{message.msg}</li>
          ))}
        </ul>
        <div className="textBox">
          Message: <input type="text" id="input" ref={inputRef} />
          <input type="submit" value="Send" />
        </div>
      </form>
    </div>
  )
}

export default App
