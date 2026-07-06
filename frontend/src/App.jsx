import { Routes, Route } from "react-router-dom"
import AuthPage from "./pages/AuthPage"
import ChatPage from "./pages/ChatPage"
import ProtectedRoute from "./components/ProtectedRoute"
import { Toaster } from "sonner"

export default function App() {
  return <>
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/chat" element={
        <ProtectedRoute>
          <ChatPage />
        </ProtectedRoute>
      } />
    </Routes>
    <Toaster position="top-right"
      richColors
      closeButton
      duration={3000}
      theme="light" // will change into dark when we code for dark mode
    />
  </>
}