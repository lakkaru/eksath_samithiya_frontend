import React, { useState } from "react"
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material"
import { navigate } from "gatsby"
import loadable from "@loadable/component"
import MenuIcon from "@mui/icons-material/Menu" // For mobile menu icon

const AuthComponent = loadable(() => import("./common/AuthComponent"))

const Header = ({ siteTitle }) => {
  const [roles, setRoles] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [memberName, setMemberName] = useState("")
  const [memberAnchorEl, setMemberAnchorEl] = useState(null)
  const [loanSchemeAnchorEl, setLoanSchemeAnchorEl] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isViceSecretary = roles.includes("vice-secretary")
  const isLoanTreasurer = roles.includes("loan-treasurer")

  const handleMemberMenuOpen = event => setMemberAnchorEl(event.currentTarget)
  const handleMemberMenuClose = () => setMemberAnchorEl(null)
  const handleLoanSchemeMenuOpen = event =>
    setLoanSchemeAnchorEl(event.currentTarget)
  const handleLoanSchemeMenuClose = () => setLoanSchemeAnchorEl(null)

  const handleAuthStateChange = ({ isAuthenticated, roles, memberName }) => {
    setIsAuthenticated(isAuthenticated)
    setRoles(roles)
    setMemberName(memberName)
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    setRoles([])
    setIsAuthenticated(false)
    setMemberName("")
    navigate("/login/user-login")
  }

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header>
      <AuthComponent onAuthStateChange={handleAuthStateChange} />
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
              sx={{
                flexGrow: 1,
                cursor: "pointer",
                display: { xs: "block", sm: "block" }, // Display on all screens
              }}
              onClick={() => navigate("/")}
            >
              {siteTitle}
            </Typography>

            {/* Mobile Menu Button */}
            <IconButton
              color="inherit"
              sx={{ display: { xs: "block", sm: "none" } }} // Only show on mobile (xs)
              onClick={handleMobileMenuToggle}
            >
              <MenuIcon />
            </IconButton>

            {/* Desktop Buttons */}
            <Box sx={{ display: { xs: "none", sm: "flex" } }}>
              {isAuthenticated && (
                <>
                  <Button
                    color="inherit"
                    onClick={() => navigate("/member/payments")}
                    sx={{ textTransform: "none" }}
                  >
                    Payments
                  </Button>
                  <Button
                    color="inherit"
                    onClick={() => navigate("/loan")}
                    sx={{ textTransform: "none" }}
                    disabled
                  >
                    Loan
                  </Button>

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
                        open={Boolean(loanSchemeAnchorEl)}
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

                  <Button
                    color="inherit"
                    onClick={handleMemberMenuOpen}
                    sx={{ textTransform: "none" }}
                  >
                    My Profile
                  </Button>
                  <Menu
                    anchorEl={memberAnchorEl}
                    open={Boolean(memberAnchorEl)}
                    onClose={handleMemberMenuClose}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
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
              )}
              {!isAuthenticated && (
                <Button
                  color="inherit"
                  onClick={() => navigate("/login/user-login")}
                  sx={{ textTransform: "none" }}
                >
                  Login
                </Button>
              )}
            </Box>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <Box
                sx={{
                  position: "absolute",
                  top: "64px",
                  right: "0",
                  width: "100%",
                  backgroundColor: "white",
                  color: "black",
                  boxShadow: 3,
                  display: { xs: "block", sm: "none" },
                }}
              >
                {isAuthenticated && (
                  <>
                    <Button
                      color="inherit"
                      onClick={() => navigate("/member/payments")}
                      sx={{ textTransform: "none", width: "100%" }}
                    >
                      Payments
                    </Button>
                    <Button
                      color="inherit"
                      onClick={() => navigate("/loan")}
                      sx={{ textTransform: "none", width: "100%" }}
                      disabled
                    >
                      Loan
                    </Button>
                    {isViceSecretary && (
                      <Button
                        color="inherit"
                        onClick={() => navigate("/attendance")}
                        sx={{ textTransform: "none", width: "100%" }}
                      >
                        Attendance
                      </Button>
                    )}
                    {isLoanTreasurer && (
                      <Button
                        color="inherit"
                        onClick={handleLoanSchemeMenuOpen}
                        sx={{ textTransform: "none", width: "100%" }}
                      >
                        Loan Schemes
                      </Button>
                    )}
                    <Button
                      color="inherit"
                      onClick={handleMemberMenuOpen}
                      sx={{ textTransform: "none", width: "100%" }}
                    >
                      My Profile
                    </Button>
                  </>
                )}
                {!isAuthenticated && (
                  <Button
                    color="inherit"
                    onClick={() => navigate("/login/user-login")}
                    sx={{ textTransform: "none" , marginLeft:'auto'}}
                  >
                    Login
                  </Button>
                )}
              </Box>
            )}
          </Toolbar>
        </AppBar>
      </Box>

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
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {isAuthenticated && (
          <Typography variant="body2" color="textSecondary">
            {" "}
            ආයුබෝවන්, {memberName}
          </Typography>
        )}
      </Box>
    </header>
  )
}

export default Header
