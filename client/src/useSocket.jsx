import { useEffect, useState } from "react"
import { io } from "socket.io-client"

const socket = io("localhost:3000")

export function useSocket() {
  const [messages, setMessages] = useState([])
  const [isConnected, setIsConnected] = useState(socket.connected)

  useEffect(() => {
    console.log("socket useEffect hook called")

    socket.on("connect", () => {
      setIsConnected(true)
      console.log("connected")
    })

    socket.on("disconnect", () => {
      setIsConnected(false)
    })

    socket.on("msg", (msg) => {
      console.log("received msg", msg)
      setMessages((messages) => [...messages, msg])
    })

    return () => {
      socket.off("connect")
      socket.off("disconnect")
      socket.off("msg")
    }
  }, [])

  return [socket, isConnected, messages]
}
