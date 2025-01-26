import React, { useState } from "react"
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
import loadable from "@loadable/component"

const AuthComponent = loadable(() => import("./common/AuthComponent"))
// import AuthComponent from "./common/AuthComponent"

const Header = ({ siteTitle }) => {
  const [roles, setRoles] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [memberName, setMemberName] = useState("")
  const [memberAnchorEl, setMemberAnchorEl] = useState(null)
  const [membersAnchorEl, setMembersAnchorEl] = useState(null)
  const [loanSchemeAnchorEl, setLoanSchemeAnchorEl] = useState(null)

  const memberMenuOpen = Boolean(memberAnchorEl)
  // const membersMenuOpen = Boolean(membersAnchorEl)
  const loanSchemeMenuOpen = Boolean(loanSchemeAnchorEl)

  const handleMemberMenuOpen = event => setMemberAnchorEl(event.currentTarget)
  const handleMemberMenuClose = () => setMemberAnchorEl(null)
  // const handleMembersMenuOpen = event => setMembersAnchorEl(event.currentTarget)
  // const handleMembersMenuClose = () => setMembersAnchorEl(null)

  const handleLoanSchemeMenuOpen = event =>
    setLoanSchemeAnchorEl(event.currentTarget)
  const handleLoanSchemeMenuClose = () => setLoanSchemeAnchorEl(null)

  const handleAuthStateChange = ({ isAuthenticated, roles, memberName }) => {
    // console.log('member-name:', memberName)
    setIsAuthenticated(isAuthenticated)
    setRoles(roles)
    setMemberName(memberName)
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    setRoles([])
    setIsAuthenticated(false)
    setMemberName('')
    navigate("/login/user-login")
  }

  const isViceSecretary = roles.includes("vice-secretary")
  const isLoanTreasurer = roles.includes("loan-treasurer")

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
              sx={{ flexGrow: 1, cursor: "pointer" }}
              onClick={() =>{navigate("/")}}
            >
              {siteTitle}
            </Typography>

            {isAuthenticated ? (
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
                {/* <>
                    <Button
                      color="inherit"
                      onClick={handleMembersMenuOpen}
                      sx={{ textTransform: "none" }}
                    >
                      Members
                    </Button>
                    <Menu
                      anchorEl={membersAnchorEl}
                      open={membersMenuOpen}
                      onClose={handleMembersMenuClose}
                    >
                      <MenuItem
                        onClick={() => {
                          navigate("#")
                          handleLoanSchemeMenuClose()
                        }}
                      >
                        Members of Area
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
                  </> */}

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
        <Typography variant="body2" color="textSecondary">
          
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
