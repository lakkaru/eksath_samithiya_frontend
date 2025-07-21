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
  const [membershipViceSecAnchorEl, setMembershipViceSecAnchorEl] = useState(null)
  const [attendanceAnchorEl, setAttendanceAnchorEl] = useState(null)
  const [loanSchemeAnchorEl, setLoanSchemeAnchorEl] = useState(null)
  const [receiptAnchorEl, setReceiptAnchorEl] = useState(null)
  const [expenseAnchorEl, setExpenseAnchorEl] = useState(null)
  const [reportAnchorEl, setReportAnchorEl] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isViceSecretary = roles.includes("vice-secretary")
  const isLoanTreasurer = roles.includes("loan-treasurer")
  const isTreasurer = roles.includes("treasurer")

  const handleMemberMenuOpen = event => setMemberAnchorEl(event.currentTarget)
  const handleMemberMenuClose = () => setMemberAnchorEl(null)
  const handleMembershipMenuOpen = event =>
    setMemberShipAnchorEl(event.currentTarget)
  const handleMembershipMenuClose = () => setMemberShipAnchorEl(null)
  const handleMembershipViceSecMenuOpen = event =>
    setMembershipViceSecAnchorEl(event.currentTarget)
  const handleMembershipViceSecMenuClose = () => setMembershipViceSecAnchorEl(null)
  const handleAttendanceMenuOpen = event =>
    setAttendanceAnchorEl(event.currentTarget)
  const handleAttendanceMenuClose = () => setAttendanceAnchorEl(null)
  const handleLoanSchemeMenuOpen = event =>
    setLoanSchemeAnchorEl(event.currentTarget)
  const handleLoanSchemeMenuClose = () => setLoanSchemeAnchorEl(null)
  const handleReceiptMenuOpen = event => setReceiptAnchorEl(event.currentTarget)
  const handleReceiptMenuClose = () => setReceiptAnchorEl(null)
  const handleExpenseMenuOpen = event => setExpenseAnchorEl(event.currentTarget)
  const handleExpenseMenuClose = () => setExpenseAnchorEl(null)

  const handleReportMenuOpen = event => setReportAnchorEl(event.currentTarget)
  const handleReportMenuClose = () => setReportAnchorEl(null)

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
                        variant="outlined"
                        color="inherit"
                        onClick={handleAttendanceMenuOpen}
                        sx={{ textTransform: "none" }}
                      >
                        පැමිණීම
                      </Button>
                      <Menu
                        anchorEl={attendanceAnchorEl}
                        open={Boolean(attendanceAnchorEl)}
                        onClose={handleAttendanceMenuClose}
                      >
                        <MenuItem
                          onClick={() => {
                            navigate("/funeral/funeralAttendance")
                            handleAttendanceMenuClose()
                          }}
                        >
                          අවමංගල්‍ය උත්සවය
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            navigate("/")
                            handleAttendanceMenuClose()
                          }}
                        >
                          සුසන භුමි කටයුතු
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            navigate("/meeting/Attendance")
                            handleAttendanceMenuClose()
                          }}
                        >
                          මහා සභාව
                        </MenuItem>
                        <hr/>
                        <MenuItem
                          onClick={() => {
                            navigate("/forms/MeetingSheet")
                            handleAttendanceMenuClose()
                          }}
                        >
                          
                          මහා සභාව ලේඛණය
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            navigate("/reports/meetingAttendance")
                            handleAttendanceMenuClose()
                          }}
                        >
                          
                          මහා සභාව පැමිණීම
                        </MenuItem>
                      </Menu>
                      <Button
                        color="inherit"
                        variant="outlined"
                        onClick={handleMembershipMenuOpen}
                        sx={{ textTransform: "none" }}
                      >
                        අවමංගල්‍ය
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
                          ඇතුලත් කිරීම
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            navigate("/funeral/assignment")
                            handleMembershipMenuClose()
                          }}
                        >
                          අවමංගල්‍ය පැවරීම
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            navigate("/funeral/extraDue")
                            handleMembershipMenuClose()
                          }}
                        >
                          ද්‍රව්‍ය ආධාර හිඟ
                        </MenuItem>
                      </Menu>

                      <Button
                        color="inherit"
                        variant="outlined"
                        onClick={() => navigate("/member/fullDetails")}
                        sx={{ textTransform: "none" }}
                      >
                        සාමාජික තොරතුරු
                      </Button>
                      <Button
                        color="inherit"
                        variant="outlined"
                        onClick={handleMembershipViceSecMenuOpen}
                        sx={{ textTransform: "none" }}
                      >
                        සාමාජිකත්වය
                      </Button>
                      <Menu
                        anchorEl={membershipViceSecAnchorEl}
                        open={Boolean(membershipViceSecAnchorEl)}
                        onClose={handleMembershipViceSecMenuClose}
                      >
                        <MenuItem
                          onClick={() => {
                            navigate("/member/add-member")
                            handleMembershipViceSecMenuClose()
                          }}
                        >
                          සාමාජිකයෙකු ඇතුලත් කිරීම
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            navigate("/member/search-by-area")
                            handleMembershipViceSecMenuClose()
                          }}
                        >
                          ප්‍රදේශය අනුව සෙවීම
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            navigate("/member/search-by-name")
                            handleMembershipViceSecMenuClose()
                          }}
                        >
                          නම අනුව සෙවීම
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
                        // variant="outlined"
                        onClick={() => navigate("/member/fullDetails")}
                        sx={{ textTransform: "none" }}
                      >
                        සාමාජික තොරතුරු
                      </Button>
                      <Button
                        color="inherit"
                        onClick={handleLoanSchemeMenuOpen}
                        sx={{ textTransform: "none" }}
                      >
                        ණය තොරතුරු
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
                        // variant="outlined"
                        onClick={() => navigate("/member/fullDetails")}
                        sx={{ textTransform: "none" }}
                      >
                        සාමාජික තොරතුරු
                      </Button>
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
                          සාමාජික මුදල්/හිඟ ලැබීම්
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            navigate("/account/add-income")
                            handleReceiptMenuClose()
                          }}
                        >
                          වෙනත් ආදායම් ඇතුලත් කරන්න
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            navigate("/account/view-income")
                            handleReceiptMenuClose()
                          }}
                        >
                          වෙනත් ආදායම් බලන්න
                        </MenuItem>
                      </Menu>
                      <Button
                        color="inherit"
                        onClick={handleExpenseMenuOpen}
                        sx={{ textTransform: "none" }}
                      >
                        මුදල් ගෙවීම්
                      </Button>
                      <Menu
                        anchorEl={expenseAnchorEl}
                        open={Boolean(expenseAnchorEl)}
                        onClose={handleExpenseMenuClose}
                      >
                        <MenuItem
                          onClick={() => {
                            navigate("/account/add-expense")
                            handleExpenseMenuClose()
                          }}
                        >
                          වියදම් ඇතුලත් කරන්න
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            navigate("/account/view-expenses")
                            handleExpenseMenuClose()
                          }}
                        >
                          වියදම් බලන්න
                        </MenuItem>
                      </Menu>
                      <Button
                        color="inherit"
                        onClick={handleReportMenuOpen}
                        sx={{ textTransform: "none" }}
                      >
                        වාර්තා
                      </Button>
                      <Menu
                        anchorEl={reportAnchorEl}
                        open={Boolean(reportAnchorEl)}
                        onClose={handleReportMenuClose}
                      >
                        <MenuItem
                          onClick={() => {
                            navigate("/account/monthly-report")
                            handleReportMenuClose()
                          }}
                        >
                          මාසික ආදායම්/වියදම් වාර්තාව
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
                    onClick={() => navigate("/member/fines")}
                    sx={{ textTransform: "none" }}
                  >
                    දඩ මුදල්
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
                          onClick={handleAttendanceMenuOpen}
                          sx={{ textTransform: "none", width: "100%" }}
                        >
                          පැමිණීම
                        </Button>
                        <Button
                          color="inherit"
                          // variant="outlined"
                          onClick={handleMembershipMenuOpen}
                          sx={{ textTransform: "none", width: "100%" }}
                        >
                          අවමංගල්‍ය
                        </Button>
                        <Button
                          color="inherit"
                          // variant="outlined"
                          onClick={() => navigate("/member/fullDetails")}
                          sx={{ textTransform: "none", width: "100%" }}
                        >
                          සාමාජික තොරතුරු
                        </Button>
                        <Typography sx={{ textAlign: "center", color: "gray", fontSize: "0.9rem", padding: "5px" }}>
                          සාමාජිකත්වය
                        </Typography>
                        <Button
                          color="inherit"
                          // variant="outlined"
                          onClick={() => navigate("/member/add-member")}
                          sx={{ textTransform: "none", width: "100%", paddingLeft: "20px" }}
                        >
                          • සාමාජිකයෙකු ඇතුලත් කිරීම
                        </Button>
                        <Button
                          color="inherit"
                          // variant="outlined"
                          onClick={() => navigate("/member/search-by-area")}
                          sx={{ textTransform: "none", width: "100%", paddingLeft: "20px" }}
                        >
                          • ප්‍රදේශය අනුව සෙවීම
                        </Button>
                        <Button
                          color="inherit"
                          // variant="outlined"
                          onClick={() => navigate("/member/search-by-name")}
                          sx={{ textTransform: "none", width: "100%", paddingLeft: "20px" }}
                        >
                          • නම අනුව සෙවීම
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
                          // variant="outlined"
                          onClick={() => navigate("/member/fullDetails")}
                          sx={{ textTransform: "none" }}
                        >
                          සාමාජික තොරතුරු
                        </Button>
                        <Button
                          color="inherit"
                          onClick={handleLoanSchemeMenuOpen}
                          sx={{ textTransform: "none", width: "100%" }}
                        >
                          ණය තොරතුරු
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
                          // variant="outlined"
                          onClick={() => navigate("/member/fullDetails")}
                          sx={{ textTransform: "none" }}
                        >
                          සාමාජික තොරතුරු
                        </Button>
                        <Button
                          color="inherit"
                          // onClick={() => navigate("/member/payments")}
                          onClick={handleReceiptMenuOpen}
                          sx={{ textTransform: "none", width: "100%" }}
                        >
                          මුදල් ලැබීම්
                        </Button>
                        <Button
                          color="inherit"
                          onClick={handleExpenseMenuOpen}
                          sx={{ textTransform: "none", width: "100%" }}
                        >
                          මුදල් ගෙවීම්
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
                            සාමාජික මුදල්/හිඟ ලැබීම්
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
                      onClick={() => navigate("/member/fines")}
                      sx={{ textTransform: "none", width: "100%" }}
                    >
                      දඩ මුදල්
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
