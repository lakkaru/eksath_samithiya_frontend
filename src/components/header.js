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
  const [roles, setRoles] = useState([]) // Store roles
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [memberName, setMemberName] = useState("") // State to store member's name

  // Menu states
  const [memberAnchorEl, setMemberAnchorEl] = useState(null)
  const [loanSchemeAnchorEl, setLoanSchemeAnchorEl] = useState(null) // Loan Scheme Menu

  const memberMenuOpen = Boolean(memberAnchorEl)
  const loanSchemeMenuOpen = Boolean(loanSchemeAnchorEl)

  // Handlers for menus
  const handleMemberMenuOpen = event => setMemberAnchorEl(event.currentTarget)
  const handleMemberMenuClose = () => setMemberAnchorEl(null)

  const handleLoanSchemeMenuOpen = event =>
    setLoanSchemeAnchorEl(event.currentTarget)
  const handleLoanSchemeMenuClose = () => setLoanSchemeAnchorEl(null)

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (token) {
      try {
        const decodedToken = jwtDecode(token)
        const expirationTime = decodedToken.exp * 1000 // Convert to milliseconds
        const timeRemaining = expirationTime - Date.now()
        setRoles(decodedToken.roles || [])
        setMemberName(decodedToken.name || "") // Set the member's name
        console.log("timeRemaining: ", timeRemaining)
        if (timeRemaining > 0) {
          // Set a timeout to log out the user
            setIsAuthenticated(true)
        } else {
          // Token already expired, log out immediately
          handleLogout()
        }
      } catch (error) {
        console.error("Error decoding token:", error)
        setIsAuthenticated(false)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    setRoles([])
    setIsAuthenticated(false)
    navigate("/login/user-login")
  }

  const routeLabels = {
    "/member/ProfileEdit/": "Member Profile Edit",
    "/member/Home/": "Member Home",
    "/login/UserLogin": "User Login",
  }

  const pathname = window.location.pathname
  const displayName =
    routeLabels[pathname] || pathname.split("/").filter(Boolean).pop() || "Home"

  // Admin menus based on roles
  const isViceSecretary = roles.includes("vice-secretary")
  const isLoanTreasurer = roles.includes("loan-treasurer")

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
                {/* Member Menus */}
                <Button
                  color="inherit"
                  onClick={() => navigate("/payments")}
                  sx={{ textTransform: "none" }}
                  disabled
                >
                  Payments
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate("/fines")}
                  sx={{ textTransform: "none" }}
                  disabled
                >
                  Fines
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate("/loan")}
                  sx={{ textTransform: "none" }}
                  disabled
                >
                  Loan
                </Button>

                {/* Role-specific Admin Menus */}
                {isViceSecretary && (
                  <Button
                    color="inherit"
                    onClick={() => navigate("/attendance")}
                    sx={{ textTransform: "none" }}
                  >
                    Attendance
                  </Button>
                )}
                {isLoanTreasurer && (
                  <>
                    <Button
                      color="inherit"
                      onClick={handleLoanSchemeMenuOpen}
                      sx={{ textTransform: "none" }}
                    >
                      Loan Schemes
                    </Button>
                    <Menu
                      anchorEl={loanSchemeAnchorEl}
                      open={loanSchemeMenuOpen}
                      onClose={handleLoanSchemeMenuClose}
                    >
                      <MenuItem
                        onClick={() => {
                          navigate("/loan/new-loan")
                          handleLoanSchemeMenuClose()
                        }}
                      >
                        New Loan
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          navigate("/loan/search")
                          handleLoanSchemeMenuClose()
                        }}
                      >
                        Loan Search
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          navigate("/loan/active-loans")
                          handleLoanSchemeMenuClose()
                        }}
                      >
                        Active Loans
                      </MenuItem>
                    </Menu>
                  </>
                )}

                {/* Profile Menu */}
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
                  <MenuItem
                    onClick={() => {
                      navigate("/member/home")
                      handleMemberMenuClose()
                    }}
                  >
                    Home
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate("/member/profile-edit")
                      handleMemberMenuClose()
                    }}
                  >
                    Edit Profile
                  </MenuItem>
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
                onClick={() => navigate("/login/user-login")}
                sx={{ textTransform: "none" }}
              >
                Login
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>

      {/* Current Route Display with Member Name */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "1024px",
          margin: "0 auto",
          textAlign: "left",
          padding: "8px",
          background: "#f5f5f5",
          borderTop: "1px solid #ddd",
          display: "flex",
          justifyContent: "space-between", // Aligns name to the right
          alignItems: "center",
        }}
      >
        <Typography variant="body2" color="textSecondary">
          Samithiya/ {displayName}
        </Typography>
        {isAuthenticated && (
          <Typography variant="body2" color="textSecondary">
            ආයුබෝවන්, {memberName}
          </Typography>
        )}
      </Box>
    </header>
  )
}

export default Header
