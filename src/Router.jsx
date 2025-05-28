import { Routes, Route } from "react-router-dom"
import { Login } from "./pages/Login"
import { ChatHistory } from "./pages/ChatHistory"

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/history" element={<ChatHistory />} />
    </Routes>
  )
}