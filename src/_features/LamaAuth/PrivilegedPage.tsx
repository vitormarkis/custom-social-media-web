import { useLamaAuth } from "./context"
import { Navigate } from "react-router-dom"

function PrivilegedPage({ children }: { children: JSX.Element }) {
  const user = JSON.parse(localStorage.getItem("lamaUser")!) || null
  const { logout } = useLamaAuth()

  if (!user) {
    logout()
    return <Navigate to="/login" />
  }

  const isAuth = "id" in user && "username" in user
  if (!isAuth) {
    logout()
    return <Navigate to="/login" />
  }

  return children
}

export default PrivilegedPage
