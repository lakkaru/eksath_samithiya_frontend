import React, { useEffect, useState } from "react"
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
} from "@mui/material"
import { navigate } from "gatsby"
const { jwtDecode } = require("jwt-decode")

const Header = ({ siteTitle }) => {
  const [roles, setRoles] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Menu states
  const [memberAnchorEl, setMemberAnchorEl] = useState(null)

  const memberMenuOpen = Boolean(memberAnchorEl)

  // Handlers for menus
  const handleMemberMenuOpen = event => setMemberAnchorEl(event.currentTarget)
  const handleMemberMenuClose = () => setMemberAnchorEl(null)

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (token) {
      try {
        const decodedToken = jwtDecode(token) // Decode using the corrected import
        setRoles(decodedToken.roles || [])
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Error decoding token:", error)
        setIsAuthenticated(false)
      }
    }
    //customizing url for better visibility
    const pathname = window.location.pathname
    const fileName = pathname.split("/").filter(Boolean).pop()

    if (fileName) {
      window.history.replaceState(null, "", `/${fileName}`)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    setRoles([])
    setIsAuthenticated(false)
    navigate("/login/UserLogin")
  }

  const routeLabels = {
    "/": "Home",
    "/profile/EditProfile": "Edit Profile",
    "/login/UserLogin": "User Login",
    // "/members/addNewMember": "Add New Member",
    // "/members/editMember": "Edit Member",
    // "/funerals/viewFunerals": "View Funerals",
  }

  const pathname = window.location.pathname
  const displayName =
    routeLabels[pathname] || pathname.split("/").filter(Boolean).pop() || "Home"

  return (
    <header>
      <Box
        sx={{
          flexGrow: 1,
          maxWidth: "1024px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography
              variant="h6"
              sx={{ flexGrow: 1, cursor: "pointer" }}
              onClick={() => navigate("/")}
            >
              {siteTitle}
            </Typography>

            {isAuthenticated ? (
              <>
                {/* Member Menu */}
                <Button
                  color="inherit"
                  onClick={handleMemberMenuOpen}
                  sx={{ textTransform: "none" }}
                >
                  My Profile
                </Button>
                <Menu
                  anchorEl={memberAnchorEl}
                  open={memberMenuOpen}
                  onClose={handleMemberMenuClose}
                >
                  {/* Profile Edit */}
                  <MenuItem
                    onClick={() => {
                      navigate("/profile/ProfileEdit") // Redirect to profile edit page
                      handleMemberMenuClose()
                    }}
                  >
                    Edit Profile
                  </MenuItem>

                  {/* Logout */}
                  <MenuItem
                    onClick={() => {
                      handleLogout()
                      handleMemberMenuClose()
                    }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                color="inherit"
                onClick={() => navigate("/login/UserLogin")}
                sx={{ textTransform: "none" }}
              >
                Login
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>

      {/* Current Route Display */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "1024px",
          margin: "0 auto",
          textAlign: "left",
          padding: "8px",
          background: "#f5f5f5",
          borderTop: "1px solid #ddd",
        }}
      >
        <Typography variant="body2" color="textSecondary">
          Samithiya/ {displayName}
        </Typography>
      </Box>
    </header>
  )
}

export default Header
