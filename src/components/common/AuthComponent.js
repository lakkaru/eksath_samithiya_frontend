import { useEffect, useState } from "react"
const { jwtDecode } = require("jwt-decode")

const AuthComponent = ({ onAuthStateChange }) => {
  const [roles, setRoles] = useState([])
  const [memberName, setMemberName] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  // const [loggingOut, setLoggingOut] = useState()

  useEffect(() => {
    let token = ""
    if (typeof window !== "undefined") {
      token = localStorage.getItem("authToken")
    }

    if (token) {
      try {
        const decodedToken = jwtDecode(token)
        const expirationTime = decodedToken.exp * 1000
        const timeRemaining = expirationTime - Date.now()

        if (timeRemaining > 0) {
          // setLoggingOut(() => handleLogout)
          setRoles(decodedToken.roles || [])
          setMemberName(decodedToken.name || "")
          setIsAuthenticated(true)
          if (onAuthStateChange) {
            onAuthStateChange({
              isAuthenticated: true,
              roles: decodedToken.roles || [],
              memberName: decodedToken.name || "",
              member_id:decodedToken.member_id
              // loggingOut: () => handleLogout,
            })
            // console.log(decodedToken)
          }
        } else {
          handleLogout()
        }
      } catch (error) {
        console.error("Error decoding token:", error)
        setIsAuthenticated(false)
        if (onAuthStateChange) {
          onAuthStateChange({ isAuthenticated: false, roles: [], memberName: "" })
        }
      }
    } else {
      // No token found - user is not authenticated
      setIsAuthenticated(false)
      if (onAuthStateChange) {
        onAuthStateChange({ isAuthenticated: false, roles: [], memberName: "" })
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    setRoles([])
    setIsAuthenticated(false)
    if (onAuthStateChange) {
      onAuthStateChange({ isAuthenticated: false, roles: [], memberName: "" })
    }
  }

  return null // This component does not render UI, just manages state
}

export default AuthComponent
