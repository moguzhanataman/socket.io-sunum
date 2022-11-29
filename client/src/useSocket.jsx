import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import { useStickyState } from "./useStickyState"

const socket = io("localhost:3000")

export function useSocket() {
  const [messages, setMessages] = useState([])
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [nick, setNick] = useStickyState("", "nickname")
  const [rooms, setRooms] = useState([])
  const [currentRoom, setCurrentRoom] = useState(null)

  function joinRoom(room) {
    socket.emit("joinRoom", { room, nick })
    setCurrentRoom(room)
    setMessages([])
  }

  useEffect(() => {
    console.log({ nick })

    if (nick !== "") {
      socket.emit("changeNick", { nick })
      console.log({ nick })
    }
  }, [nick])

  useEffect(() => {
    console.log("socket useEffect hook called")

    socket.on("connect", () => {
      setIsConnected(true)
      console.log("connected", nick)
      //   socket.emit("connected", {nick, time: Date.now()})
    })

    socket.on("disconnect", () => {
      setIsConnected(false)
    })

    socket.on("msg", (msg) => {
      console.log("received msg", msg)
      setMessages((messages) => [...messages, msg])
    })

    socket.on("rooms", (rooms) => {
      console.log("channels", rooms)
      setCurrentRoom(rooms[0])
      setRooms(rooms)
    })

    return () => {
      socket.off("connect")
      socket.off("disconnect")
      socket.off("msg")
    }
  }, [])

  return {
    socket,
    isConnected,
    messages,
    rooms,
    currentRoom,
    joinRoom,
    nick,
    setNick,
  }
}
