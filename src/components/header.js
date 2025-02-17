import React, { useEffect, useState } from "react"
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Divider,
} from "@mui/material"
import { navigate } from "gatsby"
import loadable from "@loadable/component"
import MenuIcon from "@mui/icons-material/Menu" // For mobile menu icon

import api from "../../src/utils/api"

const AuthComponent = loadable(() => import("./common/AuthComponent"))

const baseUrl = process.env.GATSBY_API_BASE_URL

const Header = ({ siteTitle }) => {
  const [roles, setRoles] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [memberName, setMemberName] = useState("")
  const [memberId, setMemberId] = useState()
  const [hasLoan, setHasLoan] = useState(false)
  const [memberAnchorEl, setMemberAnchorEl] = useState(null)
  const [membershipAnchorEl, setMemberShipAnchorEl] = useState(null)
  const [loanSchemeAnchorEl, setLoanSchemeAnchorEl] = useState(null)
  const [receiptAnchorEl, setReceiptAnchorEl] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isViceSecretary = roles.includes("vice-secretary")
  const isLoanTreasurer = roles.includes("loan-treasurer")
  const isTreasurer = roles.includes("treasurer")

  const handleMemberMenuOpen = event => setMemberAnchorEl(event.currentTarget)
  const handleMemberMenuClose = () => setMemberAnchorEl(null)
  const handleMembershipMenuOpen = event => setMemberShipAnchorEl(event.currentTarget)
  const handleMembershipMenuClose = () => setMemberShipAnchorEl(null)
  const handleLoanSchemeMenuOpen = event =>
    setLoanSchemeAnchorEl(event.currentTarget)
  const handleLoanSchemeMenuClose = () => setLoanSchemeAnchorEl(null)
  const handleReceiptMenuOpen = event => setReceiptAnchorEl(event.currentTarget)
  const handleReceiptMenuClose = () => setReceiptAnchorEl(null)

  const handleAuthStateChange = ({
    isAuthenticated,
    roles,
    memberName,
    member_id,
  }) => {
    setIsAuthenticated(isAuthenticated)
    setRoles(roles)
    setMemberName(memberName)
    setMemberId(member_id)
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
  useEffect(() => {
    api
      .get(`${baseUrl}/member/hasLoan`)
      .then(response => {
        console.log(response?.data.loan)
        setHasLoan(response?.data.loan)
      })
      .catch(error => {
        console.error("Axios error: ", error)
      })
  }, [])

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
                  {isViceSecretary && (
                    <>
                      <Button
                        color="inherit"
                        onClick={handleMembershipMenuOpen}
                        sx={{ textTransform: "none" }}
                      >
                        සාමාජිකත්වය
                      </Button>
                      <Menu
                        anchorEl={membershipAnchorEl}
                        open={Boolean(membershipAnchorEl)}
                        onClose={handleMembershipMenuClose}
                      >
                        <MenuItem
                          onClick={() => {
                            navigate("/member/deathById")
                            handleMembershipMenuClose()
                          }}
                        >
                          අවමංගල්‍ය
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            navigate("/")
                            handleMembershipMenuClose()
                          }}
                        >
                          Loan Search
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            navigate("/")
                            handleMembershipMenuClose()
                          }}
                        >
                          Active Loans
                        </MenuItem>
                      </Menu>
                      <Divider
                        orientation="vertical"
                        flexItem
                        sx={{ bgcolor: "white", mx: 2 }}
                      />
                    </>
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
                      <Divider
                        orientation="vertical"
                        flexItem
                        sx={{ bgcolor: "white", mx: 2 }}
                      />
                    </>
                  )}

                  {isTreasurer && (
                    <>
                      <Button
                        color="inherit"
                        // onClick={() => navigate("/member/payments")}
                        onClick={handleReceiptMenuOpen}
                        sx={{ textTransform: "none" }}
                      >
                        මුදල් ලැබීම්
                      </Button>
                      <Menu
                        anchorEl={receiptAnchorEl}
                        open={Boolean(receiptAnchorEl)}
                        onClose={handleReceiptMenuClose}
                      >
                        <MenuItem
                          onClick={() => {
                            navigate("/account/receipts")
                            handleReceiptMenuClose()
                          }}
                        >
                          Add Receipts
                        </MenuItem>
                      </Menu>
                      <Divider
                        orientation="vertical"
                        flexItem
                        sx={{ bgcolor: "white", mx: 2 }}
                      />
                    </>
                  )}
                  <Button
                    color="inherit"
                    onClick={() => navigate("/member/payments")}
                    sx={{ textTransform: "none" }}
                  >
                    මුදල් ගෙවීම්
                  </Button>

                  <Button
                    color="inherit"
                    onClick={() => navigate("/member/loan")}
                    sx={{ textTransform: "none" }}
                    disabled={!hasLoan}
                  >
                    ණය
                  </Button>
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ bgcolor: "white", mx: 2 }}
                  />

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
                    anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
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
                  backgroundColor: "#f5f5f5",
                  color: "black",
                  boxShadow: 3,
                  zIndex: 1000,
                  display: { xs: "block", sm: "none" },
                }}
              >
                {isAuthenticated && (
                  <>
                    {isViceSecretary && (
                      <>
                        <Typography sx={{ textAlign: "center", color: "teal" }}>
                        උප ලේකම්
                        </Typography>
                        <Button
                          color="inherit"
                          onClick={() => navigate("/attendance")}
                          sx={{ textTransform: "none", width: "100%" }}
                        >
                          සාමාජිකත්වය
                        </Button>
                        <hr />
                      </>
                    )}
                    {isLoanTreasurer && (
                      <>
                        <Typography sx={{ textAlign: "center", color: "teal" }}>
                        ණය භාණ්ඩාගාරික
                        </Typography>
                        <Button
                          color="inherit"
                          onClick={handleLoanSchemeMenuOpen}
                          sx={{ textTransform: "none", width: "100%" }}
                        >
                          Loan Schemes
                        </Button>
                        <hr />
                      </>
                    )}
                    {isTreasurer && (
                      <>
                        <Typography sx={{ textAlign: "center", color: "teal" }}>
                        භාණ්ඩාගාරික
                        </Typography>
                        <Button
                          color="inherit"
                          // onClick={() => navigate("/member/payments")}
                          onClick={handleReceiptMenuOpen}
                          sx={{ textTransform: "none", width: "100%" }}
                        >
                          මුදල් ලැබීම්
                        </Button>
                        <hr />
                        {/* <Menu
                          anchorEl={receiptAnchorEl}
                          open={Boolean(receiptAnchorEl)}
                          onClose={handleReceiptMenuClose}
                          anchorOrigin={{
                            horizontal: "right",
                            vertical: "bottom",
                          }}
                        >
                          <MenuItem
                            onClick={() => {
                              navigate("/account/receipts")
                              handleReceiptMenuClose()
                            }}
                          >
                            Add Receipts
                          </MenuItem>
                        </Menu> */}
                      </>
                    )}
                    <Button
                      color="inherit"
                      onClick={() => navigate("/member/payments")}
                      sx={{ textTransform: "none", width: "100%" }}
                    >
                      මුදල් ගෙවීම්
                    </Button>
                    <Button
                      color="inherit"
                      onClick={() => navigate("/member/loan")}
                      sx={{ textTransform: "none", width: "100%" }}
                      disabled={!hasLoan}
                    >
                      ණය
                    </Button>
                    <hr />
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
                    sx={{
                      textTransform: "none",
                      marginLeft: "auto",
                      justifyContent: "flex-end",
                      width: "100%",
                    }}
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
          justifyContent: "flex-end",
          padding: "8px",
          background: "#f5f5f5",
          borderTop: "1px solid #ddd",
          display: "flex",
          // justifyContent: "space-between",
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
