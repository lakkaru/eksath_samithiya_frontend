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
  Chip,
  Avatar,
  Badge,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material"
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  AccountBalance as AccountBalanceIcon,
  Groups as GroupsIcon,
  Payment as PaymentIcon,
  MonetizationOn as MonetizationOnIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Home as HomeIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material"
import { navigate } from "gatsby"
import loadable from "@loadable/component"

import api from "../../src/utils/api"

const AuthComponent = loadable(() => import("./common/AuthComponent"))

const baseUrl = process.env.GATSBY_API_BASE_URL


// ...existing imports...

const Header = ({ siteTitle }) => {
  // ...existing state...
  // State for 'මුදල්' (Money) parent menu
  const [moneyAnchorEl, setMoneyAnchorEl] = React.useState(null);
  const handleMoneyMenuOpen = (event) => {
    setMoneyAnchorEl(event.currentTarget);
  };
  const handleMoneyMenuClose = () => {
    setMoneyAnchorEl(null);
  };
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
  const [funeralAnchorEl, setFuneralAnchorEl] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isViceSecretary = roles.includes("vice-secretary")
  const isLoanTreasurer = roles.includes("loan-treasurer")
  const isTreasurer = roles.includes("treasurer")
  const isChairman = roles.includes("chairman")
  const hasLoanAccess = isLoanTreasurer || isTreasurer

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

  const handleFuneralMenuOpen = event => setFuneralAnchorEl(event.currentTarget)
  const handleFuneralMenuClose = () => setFuneralAnchorEl(null)

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

  const handleMobileNavigate = (path) => {
    setMobileMenuOpen(false)
    navigate(path)
  }
  useEffect(() => {
    // Only check for loan if user is authenticated
    if (isAuthenticated) {
      api
        .get(`${baseUrl}/member/hasLoan`)
        .then(response => {
          console.log(response?.data.loan)
          setHasLoan(response?.data.loan)
        })
        .catch(error => {
          console.error("Axios error: ", error)
        })
    } else {
      // Reset loan status when not authenticated
      setHasLoan(false)
    }
  }, [isAuthenticated])

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
        <AppBar 
          position="static" 
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
          }}
        >
          <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <Avatar 
                sx={{ 
                  bgcolor: 'white', 
                  color: '#667eea', 
                  mr: 2,
                  width: { xs: 32, sm: 40 },
                  height: { xs: 32, sm: 40 }
                }}
              >
                <AccountBalanceIcon 
                  sx={{ 
                    fontSize: { xs: '1.25rem', sm: '1.5rem' }
                  }} 
                />
              </Avatar>
              <Typography
                variant="h6"
                sx={{
                  flexGrow: 1,
                  cursor: "pointer",
                  fontWeight: 'bold',
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  color: 'white',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
                onClick={() => navigate("/")}
              >
                {siteTitle}
              </Typography>
            </Box>

            {/* Mobile Menu Button */}
            <IconButton
              color="inherit"
              sx={{ 
                display: { xs: "block", sm: "none" },
                bgcolor: 'rgba(255,255,255,0.1)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
              }}
              onClick={handleMobileMenuToggle}
            >
              <MenuIcon />
            </IconButton>

            {/* Desktop Buttons */}
            <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 1 }}>
              {isAuthenticated && (
                <>
                  {isViceSecretary && (
                    <>
                      <Button
                        variant="outlined"
                        color="inherit"
                        onClick={handleAttendanceMenuOpen}
                        startIcon={<GroupsIcon />}
                        sx={{ 
                          textTransform: "none",
                          borderColor: 'rgba(255,255,255,0.3)',
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          '&:hover': {
                            borderColor: 'rgba(255,255,255,0.5)',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                          }
                        }}
                      >
                        පැමිණීම
                      </Button>
                      <Menu
                        anchorEl={attendanceAnchorEl}
                        open={Boolean(attendanceAnchorEl)}
                        onClose={handleAttendanceMenuClose}
                        PaperProps={{
                          sx: {
                            mt: 1,
                            borderRadius: 2,
                            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                            '& .MuiMenuItem-root': {
                              py: 1.5,
                              px: 2,
                              borderRadius: 1,
                              mx: 1,
                              my: 0.5,
                              '&:hover': {
                                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                              }
                            }
                          }
                        }}
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
                          📋 මහා සභාව ලේඛණය
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            navigate("/reports/meetingAttendance")
                            handleAttendanceMenuClose()
                          }}
                        >
                          📊 මහා සභාව පැමිණීම
                        </MenuItem>
                      </Menu>
                      <Button
                        color="inherit"
                        variant="outlined"
                        onClick={handleMembershipMenuOpen}
                        startIcon={<MonetizationOnIcon />}
                        sx={{ 
                          textTransform: "none",
                          borderColor: 'rgba(255,255,255,0.3)',
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          '&:hover': {
                            borderColor: 'rgba(255,255,255,0.5)',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                          }
                        }}
                      >
                        අවමංගල්‍ය
                      </Button>
                      <Menu
                        anchorEl={membershipAnchorEl}
                        open={Boolean(membershipAnchorEl)}
                        onClose={handleMembershipMenuClose}
                        PaperProps={{
                          sx: {
                            mt: 1,
                            borderRadius: 2,
                            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                            '& .MuiMenuItem-root': {
                              py: 1.5,
                              px: 2,
                              borderRadius: 1,
                              mx: 1,
                              my: 0.5,
                              '&:hover': {
                                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                              }
                            }
                          }
                        }}
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
                        startIcon={<PersonIcon />}
                        sx={{ 
                          textTransform: "none",
                          borderColor: 'rgba(255,255,255,0.3)',
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          '&:hover': {
                            borderColor: 'rgba(255,255,255,0.5)',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                          }
                        }}
                      >
                        සාමාජික තොරතුරු
                      </Button>
                      <Button
                        color="inherit"
                        variant="outlined"
                        onClick={handleMembershipViceSecMenuOpen}
                        startIcon={<GroupsIcon />}
                        sx={{ 
                          textTransform: "none",
                          borderColor: 'rgba(255,255,255,0.3)',
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          '&:hover': {
                            borderColor: 'rgba(255,255,255,0.5)',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                          }
                        }}
                      >
                        සාමාජිකත්වය
                      </Button>
                      <Menu
                        anchorEl={membershipViceSecAnchorEl}
                        open={Boolean(membershipViceSecAnchorEl)}
                        onClose={handleMembershipViceSecMenuClose}
                        PaperProps={{
                          sx: {
                            mt: 1,
                            borderRadius: 2,
                            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                            '& .MuiMenuItem-root': {
                              py: 1.5,
                              px: 2,
                              borderRadius: 1,
                              mx: 1,
                              my: 0.5,
                              '&:hover': {
                                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                              }
                            }
                          }
                        }}
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
                        sx={{ 
                          bgcolor: "rgba(255,255,255,0.3)", 
                          mx: 2,
                          height: 32,
                          alignSelf: 'center'
                        }}
                      />
                    </>
                  )}

                  {hasLoanAccess && (
                    <>
                      {/* Show Member Details only for loan-treasurer, not for treasurer (treasurer has it in their own section) */}
                      {isLoanTreasurer && !isTreasurer && (
                        <Button
                          color="inherit"
                          onClick={() => navigate("/member/fullDetails")}
                          startIcon={<PersonIcon />}
                          sx={{ 
                            textTransform: "none",
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            '&:hover': {
                              backgroundColor: 'rgba(255,255,255,0.2)',
                            }
                          }}
                        >
                          සාමාජික තොරතුරු
                        </Button>
                      )}
                      <Button
                        color="inherit"
                        onClick={handleLoanSchemeMenuOpen}
                        startIcon={<MonetizationOnIcon />}
                        sx={{ 
                          textTransform: "none",
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.2)',
                          }
                        }}
                      >
                        ණය තොරතුරු
                      </Button>
                      <Menu
                        anchorEl={loanSchemeAnchorEl}
                        open={Boolean(loanSchemeAnchorEl)}
                        onClose={handleLoanSchemeMenuClose}
                        PaperProps={{
                          sx: {
                            mt: 1,
                            borderRadius: 2,
                            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                            '& .MuiMenuItem-root': {
                              py: 1.5,
                              px: 2,
                              borderRadius: 1,
                              mx: 1,
                              my: 0.5,
                              '&:hover': {
                                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                              }
                            }
                          }
                        }}
                      >
                        {/* Show New Loan only for loan-treasurer, not for treasurer */}
                        {isLoanTreasurer && !isTreasurer && (
                          <MenuItem
                            onClick={() => {
                              navigate("/loan/new-loan")
                              handleLoanSchemeMenuClose()
                            }}
                          >
                            නව ණයක්
                          </MenuItem>
                        )}
                        <MenuItem
                          onClick={() => {
                            navigate("/loan/search")
                            handleLoanSchemeMenuClose()
                          }}
                        >
                          ණය සෙවීම
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            navigate("/loan/active-loans")
                            handleLoanSchemeMenuClose()
                          }}
                        >
                          ක්‍රියාකාරී ණය
                        </MenuItem>
                        {/* Show Payments Report only for loan-treasurer, not for treasurer */}
                        {isLoanTreasurer && !isTreasurer && (
                          <MenuItem
                            onClick={() => {
                              navigate("/loan/payments-report")
                              handleLoanSchemeMenuClose()
                            }}
                          >
                            ගෙවීම් වාර්තාව
                          </MenuItem>
                        )}
                      </Menu>
                      <Divider
                        orientation="vertical"
                        flexItem
                        sx={{ 
                          bgcolor: "rgba(255,255,255,0.3)", 
                          mx: 2,
                          height: 32,
                          alignSelf: 'center'
                        }}
                      />
                    </>
                  )}

                  {isChairman && (
                    <>
                      <Button
                        color="inherit"
                        onClick={() => navigate("/member/fullDetails")}
                        startIcon={<PersonIcon />}
                        sx={{ 
                          textTransform: "none",
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.2)',
                          }
                        }}
                      >
                        සාමාජික තොරතුරු
                      </Button>
                      <Button
                        color="inherit"
                        onClick={() => navigate("/loan/active-loans")}
                        startIcon={<AccountBalanceIcon />}
                        sx={{ 
                          textTransform: "none",
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.2)',
                          }
                        }}
                      >
                        ක්‍රියාකාරී ණය
                      </Button>
                      <Button
                        color="inherit"
                        onClick={() => navigate("/reports/meetingAttendance")}
                        startIcon={<GroupsIcon />}
                        sx={{ 
                          textTransform: "none",
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.2)',
                          }
                        }}
                      >
                        මහා සභාව පැමිණීම
                      </Button>
                      <Button
                        color="inherit"
                        onClick={() => navigate("/account/monthly-report")}
                        startIcon={<AssessmentIcon />}
                        sx={{ 
                          textTransform: "none",
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.2)',
                          }
                        }}
                      >
                        මාසික ආදායම්/වියදම් වාර්තාව
                      </Button>
                      <Divider
                        orientation="vertical"
                        flexItem
                        sx={{ 
                          bgcolor: "rgba(255,255,255,0.3)", 
                          mx: 2,
                          height: 32,
                          alignSelf: 'center'
                        }}
                      />
                    </>
                  )}

                  {isTreasurer && (
                    <>
                      <Button
                        color="inherit"
                        onClick={handleMoneyMenuOpen}
                        startIcon={<PaymentIcon />}
                        sx={{
                          textTransform: "none",
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.2)',
                          }
                        }}
                      >
                        මුදල්
                      </Button>
                      <Menu
                        anchorEl={moneyAnchorEl}
                        open={Boolean(moneyAnchorEl)}
                        onClose={handleMoneyMenuClose}
                        PaperProps={{
                          sx: {
                            mt: 1,
                            borderRadius: 2,
                            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                            minWidth: 260,
                            '& .MuiMenuItem-root': {
                              py: 1.5,
                              px: 2,
                              borderRadius: 1,
                              mx: 1,
                              my: 0.5,
                              '&:hover': {
                                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                              }
                            }
                          }
                        }}
                      >
                        <MenuItem
                          onClick={handleReceiptMenuOpen}
                          sx={{ fontWeight: 600 }}
                        >
                          මුදල් ලැබීම්
                        </MenuItem>
                        <Menu
                          anchorEl={receiptAnchorEl}
                          open={Boolean(receiptAnchorEl)}
                          onClose={handleReceiptMenuClose}
                          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                          PaperProps={{
                            sx: {
                              mt: 1,
                              borderRadius: 2,
                              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                              minWidth: 220,
                              '& .MuiMenuItem-root': {
                                py: 1.5,
                                px: 2,
                                borderRadius: 1,
                                mx: 1,
                                my: 0.5,
                                '&:hover': {
                                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                }
                              }
                            }
                          }}
                        >
                          <MenuItem
                            onClick={() => {
                              navigate("/account/receipts")
                              handleReceiptMenuClose()
                              handleMoneyMenuClose()
                            }}
                          >
                            සාමාජික මුදල්/හිඟ ලැබීම්
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              navigate("/account/add-income")
                              handleReceiptMenuClose()
                              handleMoneyMenuClose()
                            }}
                          >
                            වෙනත් ආදායම් ඇතුලත් කරන්න
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              navigate("/account/view-income")
                              handleReceiptMenuClose()
                              handleMoneyMenuClose()
                            }}
                          >
                            වෙනත් ආදායම් බලන්න
                          </MenuItem>
                        </Menu>
                        <MenuItem
                          onClick={handleExpenseMenuOpen}
                          sx={{ fontWeight: 600 }}
                        >
                          මුදල් ගෙවීම්
                        </MenuItem>
                        <Menu
                          anchorEl={expenseAnchorEl}
                          open={Boolean(expenseAnchorEl)}
                          onClose={handleExpenseMenuClose}
                          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                          PaperProps={{
                            sx: {
                              mt: 1,
                              borderRadius: 2,
                              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                              minWidth: 220,
                              '& .MuiMenuItem-root': {
                                py: 1.5,
                                px: 2,
                                borderRadius: 1,
                                mx: 1,
                                my: 0.5,
                                '&:hover': {
                                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                }
                              }
                            }
                          }}
                        >
                          <MenuItem
                            onClick={() => {
                              navigate("/account/add-expense")
                              handleExpenseMenuClose()
                              handleMoneyMenuClose()
                            }}
                          >
                            වියදම් ඇතුලත් කරන්න
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              navigate("/account/view-expenses")
                              handleExpenseMenuClose()
                              handleMoneyMenuClose()
                            }}
                          >
                            වියදම් බලන්න
                          </MenuItem>
                        </Menu>
                        <MenuItem
                          onClick={handleReportMenuOpen}
                          sx={{ fontWeight: 600 }}
                        >
                          වාර්තා
                        </MenuItem>
                        <Menu
                          anchorEl={reportAnchorEl}
                          open={Boolean(reportAnchorEl)}
                          onClose={handleReportMenuClose}
                          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                          PaperProps={{
                            sx: {
                              mt: 1,
                              borderRadius: 2,
                              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                              minWidth: 220,
                              '& .MuiMenuItem-root': {
                                py: 1.5,
                                px: 2,
                                borderRadius: 1,
                                mx: 1,
                                my: 0.5,
                                '&:hover': {
                                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                }
                              }
                            }
                          }}
                        >
                          <MenuItem
                            onClick={() => {
                              navigate("/account/monthly-report")
                              handleReportMenuClose()
                              handleMoneyMenuClose()
                            }}
                          >
                            මාසික ආදායම්/වියදම් වාර්තාව
                          </MenuItem>
                        </Menu>
                      </Menu>
                      <Button
                        color="inherit"
                        onClick={handleFuneralMenuOpen}
                        startIcon={<MonetizationOnIcon />}
                        sx={{
                          textTransform: "none",
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.2)',
                          }
                        }}
                      >
                        අවමංගල්‍ය
                      </Button>
                      <Menu
                        anchorEl={funeralAnchorEl}
                        open={Boolean(funeralAnchorEl)}
                        onClose={handleFuneralMenuClose}
                        PaperProps={{
                          sx: {
                            mt: 1,
                            borderRadius: 2,
                            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                            minWidth: 220,
                            '& .MuiMenuItem-root': {
                              py: 1.5,
                              px: 2,
                              borderRadius: 1,
                              mx: 1,
                              my: 0.5,
                              '&:hover': {
                                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                              }
                            }
                          }
                        }}
                      >
                        <MenuItem
                          onClick={() => {
                            navigate("/funeral/extraDue")
                            handleFuneralMenuClose()
                          }}
                        >
                          ද්‍රව්‍ය ආධාර හිඟ
                        </MenuItem>
                      </Menu>
                      <Button
                        color="inherit"
                        onClick={() => navigate("/member/fullDetails")}
                        startIcon={<PersonIcon />}
                        sx={{
                          textTransform: "none",
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.2)',
                          }
                        }}
                      >
                        සාමාජික තොරතුරු
                      </Button>
                      <Divider
                        orientation="vertical"
                        flexItem
                        sx={{
                          bgcolor: "rgba(255,255,255,0.3)",
                          mx: 2,
                          height: 32,
                          alignSelf: 'center'
                        }}
                      />
                    </>
                  )}
                  {/* Account menu moved here - no separate buttons for payments, fines, loan */}
                  <Button
                    color="inherit"
                    onClick={handleMemberMenuOpen}
                    startIcon={<Avatar sx={{ width: 24, height: 24, bgcolor: 'white', color: '#667eea', fontSize: '0.75rem' }}>
                      {memberName.charAt(0).toUpperCase()}
                    </Avatar>}
                    sx={{ 
                      textTransform: "none",
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.2)',
                      },
                      borderRadius: 3,
                      px: 2
                    }}
                  >
                    මගේ ගිණුම
                  </Button>
                  <Menu
                    anchorEl={memberAnchorEl}
                    open={Boolean(memberAnchorEl)}
                    onClose={handleMemberMenuClose}
                    anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
                    PaperProps={{
                      sx: {
                        mt: 1,
                        borderRadius: 2,
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                        minWidth: 220,
                        '& .MuiMenuItem-root': {
                          py: 1.5,
                          px: 2,
                          borderRadius: 1,
                          mx: 1,
                          my: 0.5,
                          '&:hover': {
                            backgroundColor: 'rgba(102, 126, 234, 0.1)',
                          }
                        }
                      }
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        navigate("/member/home")
                        handleMemberMenuClose()
                      }}
                    >
                      <HomeIcon sx={{ mr: 1, fontSize: 20 }} />
                      මුල් පිටුව
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        navigate("/member/profile-edit")
                        handleMemberMenuClose()
                      }}
                    >
                      <EditIcon sx={{ mr: 1, fontSize: 20 }} />
                      ගිණුම සංස්කරණය
                    </MenuItem>
                    <Divider sx={{ my: 1 }} />
                    {/* Member financial services moved here */}
                    <MenuItem
                      onClick={() => {
                        navigate("/member/payments")
                        handleMemberMenuClose()
                      }}
                    >
                      <PaymentIcon sx={{ mr: 1, fontSize: 20 }} />
                      මුදල් ගෙවීම්
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        navigate("/member/fines")
                        handleMemberMenuClose()
                      }}
                    >
                      <MonetizationOnIcon sx={{ mr: 1, fontSize: 20 }} />
                      දඩ මුදල්
                    </MenuItem>
                    {hasLoan && (
                      <MenuItem
                        onClick={() => {
                          navigate("/member/loan")
                          handleMemberMenuClose()
                        }}
                        sx={{
                          backgroundColor: 'rgba(255,152,0,0.1)',
                          '&:hover': {
                            backgroundColor: 'rgba(255,152,0,0.2)',
                          }
                        }}
                      >
                        <AccountBalanceIcon sx={{ mr: 1, fontSize: 20, color: '#ff9800' }} />
                        ණය 
                        <Badge 
                          variant="dot" 
                          color="warning" 
                          sx={{ 
                            ml: 1,
                            '& .MuiBadge-badge': {
                              backgroundColor: '#ff9800',
                            }
                          }} 
                        />
                      </MenuItem>
                    )}
                    <Divider sx={{ my: 1 }} />
                    <MenuItem
                      onClick={() => {
                        handleLogout()
                        handleMemberMenuClose()
                      }}
                      sx={{
                        color: '#f44336',
                        '&:hover': {
                          backgroundColor: 'rgba(244, 67, 54, 0.1)',
                        }
                      }}
                    >
                      <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
                      ඉවත් වන්න
                    </MenuItem>
                  </Menu>
                </>
              )}
              {!isAuthenticated && (
                <Button
                  color="inherit"
                  onClick={() => navigate("/login/user-login")}
                  startIcon={<PersonIcon />}
                  sx={{ 
                    textTransform: "none",
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.2)',
                    },
                    borderRadius: 3,
                    px: 3
                  }}
                >
                  ප්‍රවේශය
                </Button>
              )}
            </Box>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <Paper
                elevation={8}
                sx={{
                  position: "absolute",
                  top: "100%",
                  left: "0",
                  right: "0",
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                  zIndex: 1000,
                  display: { xs: "block", sm: "none" },
                  borderRadius: 0,
                  borderTop: '3px solid #667eea',
                  borderBottom: '1px solid rgba(0,0,0,0.1)',
                  maxHeight: 'calc(100vh - 64px)',
                  overflowY: 'auto'
                }}
              >
                {isAuthenticated && (
                  <Box sx={{ p: 2 }}>
                    {/* User Info Header */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1.5, 
                      mb: 3,
                      p: 2,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: 2,
                      color: 'white'
                    }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'white', color: '#667eea', fontSize: '0.875rem' }}>
                        {memberName.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {memberName}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          සාමාජික අංකය: #{memberId}
                        </Typography>
                      </Box>
                    </Box>

                    {isViceSecretary && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ 
                          textAlign: "center", 
                          color: "#667eea", 
                          fontWeight: 'bold',
                          mb: 2,
                          py: 1,
                          backgroundColor: 'rgba(102, 126, 234, 0.1)',
                          borderRadius: 1
                        }}>
                          උප ලේකම්
                        </Typography>
                        <Button
                          color="inherit"
                          onClick={() => handleMobileNavigate("/forms/MeetingSheet")}
                          startIcon={<GroupsIcon />}
                          sx={{ 
                            textTransform: "none", 
                            width: "100%",
                            mb: 1,
                            justifyContent: 'flex-start',
                            backgroundColor: 'rgba(102, 126, 234, 0.15)',
                            border: '1px solid rgba(102, 126, 234, 0.2)',
                            '&:hover': { 
                              backgroundColor: 'rgba(102, 126, 234, 0.25)',
                              transform: 'translateX(2px)'
                            },
                            borderRadius: 2,
                            py: 1.5,
                            color: '#333',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          පැමිණීම
                        </Button>
                        <Button
                          color="inherit"
                          onClick={() => handleMobileNavigate("/member/deathById")}
                          startIcon={<MonetizationOnIcon />}
                          sx={{ 
                            textTransform: "none", 
                            width: "100%",
                            mb: 1,
                            justifyContent: 'flex-start',
                            backgroundColor: 'rgba(102, 126, 234, 0.15)',
                            border: '1px solid rgba(102, 126, 234, 0.2)',
                            '&:hover': { 
                              backgroundColor: 'rgba(102, 126, 234, 0.25)',
                              transform: 'translateX(2px)'
                            },
                            borderRadius: 2,
                            py: 1.5,
                            color: '#333',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          අවමංගල්‍ය
                        </Button>
                        <Button
                          color="inherit"
                          onClick={() => handleMobileNavigate("/member/fullDetails")}
                          startIcon={<PersonIcon />}
                          sx={{ 
                            textTransform: "none", 
                            width: "100%",
                            mb: 2,
                            justifyContent: 'flex-start',
                            backgroundColor: 'rgba(102, 126, 234, 0.15)',
                            border: '1px solid rgba(102, 126, 234, 0.2)',
                            '&:hover': { 
                              backgroundColor: 'rgba(102, 126, 234, 0.25)',
                              transform: 'translateX(2px)'
                            },
                            borderRadius: 2,
                            py: 1.5,
                            color: '#333',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          සාමාජික තොරතුරු
                        </Button>
                        <Typography variant="body2" sx={{ 
                          color: "#666", 
                          fontSize: "0.875rem", 
                          fontWeight: 'bold',
                          mb: 1,
                          ml: 2
                        }}>
                          සාමාජිකත්වය
                        </Typography>
                        <Button
                          color="inherit"
                          onClick={() => handleMobileNavigate("/member/add-member")}
                          sx={{ 
                            textTransform: "none", 
                            width: "100%", 
                            paddingLeft: "40px",
                            mb: 0.5,
                            justifyContent: 'flex-start',
                            backgroundColor: 'rgba(102, 126, 234, 0.05)',
                            '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.1)' },
                            borderRadius: 1,
                            py: 1,
                            color: '#555'
                          }}
                        >
                          • සාමාජිකයෙකු ඇතුලත් කිරීම
                        </Button>
                        <Button
                          color="inherit"
                          onClick={() => handleMobileNavigate("/member/search-by-area")}
                          sx={{ 
                            textTransform: "none", 
                            width: "100%", 
                            paddingLeft: "40px",
                            mb: 0.5,
                            justifyContent: 'flex-start',
                            backgroundColor: 'rgba(102, 126, 234, 0.05)',
                            '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.1)' },
                            borderRadius: 1,
                            py: 1,
                            color: '#555'
                          }}
                        >
                          • ප්‍රදේශය අනුව සෙවීම
                        </Button>
                        <Button
                          color="inherit"
                          onClick={() => handleMobileNavigate("/member/search-by-name")}
                          sx={{ 
                            textTransform: "none", 
                            width: "100%", 
                            paddingLeft: "40px",
                            mb: 2,
                            justifyContent: 'flex-start',
                            backgroundColor: 'rgba(102, 126, 234, 0.05)',
                            '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.1)' },
                            borderRadius: 1,
                            py: 1,
                            color: '#555'
                          }}
                        >
                          • නම අනුව සෙවීම
                        </Button>
                        <Divider sx={{ my: 2, backgroundColor: 'rgba(102, 126, 234, 0.2)' }} />
                      </Box>
                    )}
                    {isChairman && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ 
                          textAlign: "center", 
                          color: "#e91e63", 
                          fontWeight: 'bold',
                          mb: 2,
                          py: 1,
                          backgroundColor: 'rgba(233, 30, 99, 0.1)',
                          borderRadius: 1
                        }}>
                          සභාපති
                        </Typography>
                        <Button
                          color="inherit"
                          onClick={() => handleMobileNavigate("/member/fullDetails")}
                          startIcon={<PersonIcon />}
                          sx={{ 
                            textTransform: "none", 
                            width: "100%",
                            mb: 1,
                            justifyContent: 'flex-start',
                            backgroundColor: 'rgba(233, 30, 99, 0.15)',
                            border: '1px solid rgba(233, 30, 99, 0.2)',
                            '&:hover': { 
                              backgroundColor: 'rgba(233, 30, 99, 0.25)',
                              transform: 'translateX(2px)'
                            },
                            borderRadius: 2,
                            py: 1.5,
                            color: '#333',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          සාමාජික තොරතුරු
                        </Button>
                        <Button
                          color="inherit"
                          onClick={() => handleMobileNavigate("/loan/active-loans")}
                          startIcon={<AccountBalanceIcon />}
                          sx={{ 
                            textTransform: "none", 
                            width: "100%",
                            mb: 1,
                            justifyContent: 'flex-start',
                            backgroundColor: 'rgba(233, 30, 99, 0.15)',
                            border: '1px solid rgba(233, 30, 99, 0.2)',
                            '&:hover': { 
                              backgroundColor: 'rgba(233, 30, 99, 0.25)',
                              transform: 'translateX(2px)'
                            },
                            borderRadius: 2,
                            py: 1.5,
                            color: '#333',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          ක්‍රියාකාරී ණය
                        </Button>
                        <Button
                          color="inherit"
                          onClick={() => handleMobileNavigate("/reports/meetingAttendance")}
                          startIcon={<GroupsIcon />}
                          sx={{ 
                            textTransform: "none", 
                            width: "100%",
                            mb: 1,
                            justifyContent: 'flex-start',
                            backgroundColor: 'rgba(233, 30, 99, 0.15)',
                            border: '1px solid rgba(233, 30, 99, 0.2)',
                            '&:hover': { 
                              backgroundColor: 'rgba(233, 30, 99, 0.25)',
                              transform: 'translateX(2px)'
                            },
                            borderRadius: 2,
                            py: 1.5,
                            color: '#333',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          මහා සභාව පැමිණීම
                        </Button>
                        <Button
                          color="inherit"
                          onClick={() => handleMobileNavigate("/account/monthly-report")}
                          startIcon={<AssessmentIcon />}
                          sx={{ 
                            textTransform: "none", 
                            width: "100%",
                            mb: 2,
                            justifyContent: 'flex-start',
                            backgroundColor: 'rgba(233, 30, 99, 0.15)',
                            border: '1px solid rgba(233, 30, 99, 0.2)',
                            '&:hover': { 
                              backgroundColor: 'rgba(233, 30, 99, 0.25)',
                              transform: 'translateX(2px)'
                            },
                            borderRadius: 2,
                            py: 1.5,
                            color: '#333',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          මාසික ආදායම්/වියදම් වාර්තාව
                        </Button>
                        <Divider sx={{ my: 2, backgroundColor: 'rgba(233, 30, 99, 0.2)' }} />
                      </Box>
                    )}
                    {hasLoanAccess && !isTreasurer && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ 
                          textAlign: "center", 
                          color: "#667eea", 
                          fontWeight: 'bold',
                          mb: 2,
                          py: 1,
                          backgroundColor: 'rgba(102, 126, 234, 0.1)',
                          borderRadius: 1
                        }}>
                          ණය භාණ්ඩාගාරික
                        </Typography>
                        <Button
                          color="inherit"
                          onClick={() => handleMobileNavigate("/member/fullDetails")}
                          startIcon={<PersonIcon />}
                          sx={{ 
                            textTransform: "none", 
                            width: "100%",
                            mb: 2,
                            justifyContent: 'flex-start',
                            backgroundColor: 'rgba(102, 126, 234, 0.15)',
                            border: '1px solid rgba(102, 126, 234, 0.2)',
                            '&:hover': { 
                              backgroundColor: 'rgba(102, 126, 234, 0.25)',
                              transform: 'translateX(2px)'
                            },
                            borderRadius: 2,
                            py: 1.5,
                            color: '#333',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          සාමාජික තොරතුරු
                        </Button>
                        <Typography variant="body2" sx={{ 
                          color: "#666", 
                          fontSize: "0.875rem", 
                          fontWeight: 'bold',
                          mb: 1,
                          ml: 2
                        }}>
                          ණය තොරතුරු
                        </Typography>
                        <Button
                          color="inherit"
                          onClick={() => handleMobileNavigate("/loan/new-loan")}
                          sx={{ 
                            textTransform: "none", 
                            width: "100%", 
                            paddingLeft: "40px",
                            mb: 0.5,
                            justifyContent: 'flex-start',
                            backgroundColor: 'rgba(102, 126, 234, 0.05)',
                            '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.1)' },
                            borderRadius: 1,
                            py: 1,
                            color: '#555'
                          }}
                        >
                          • නව ණයක්
                        </Button>
                        <Button
                          color="inherit"
                          onClick={() => handleMobileNavigate("/loan/search")}
                          sx={{ 
                            textTransform: "none", 
                            width: "100%", 
                            paddingLeft: "40px",
                            mb: 0.5,
                            justifyContent: 'flex-start',
                            backgroundColor: 'rgba(102, 126, 234, 0.05)',
                            '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.1)' },
                            borderRadius: 1,
                            py: 1,
                            color: '#555'
                          }}
                        >
                          • ණය සෙවීම
                        </Button>
                        <Button
                          color="inherit"
                          onClick={() => handleMobileNavigate("/loan/active-loans")}
                          sx={{ 
                            textTransform: "none", 
                            width: "100%", 
                            paddingLeft: "40px",
                            mb: 0.5,
                            justifyContent: 'flex-start',
                            backgroundColor: 'rgba(102, 126, 234, 0.05)',
                            '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.1)' },
                            borderRadius: 1,
                            py: 1,
                            color: '#555'
                          }}
                        >
                          • ක්‍රියාකාරී ණය
                        </Button>
                        <Button
                          color="inherit"
                          onClick={() => handleMobileNavigate("/loan/payments-report")}
                          sx={{ 
                            textTransform: "none", 
                            width: "100%", 
                            paddingLeft: "40px",
                            mb: 2,
                            justifyContent: 'flex-start',
                            backgroundColor: 'rgba(102, 126, 234, 0.05)',
                            '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.1)' },
                            borderRadius: 1,
                            py: 1,
                            color: '#555'
                          }}
                        >
                          • ගෙවීම් වාර්තාව
                        </Button>
                        <Divider sx={{ my: 2, backgroundColor: 'rgba(102, 126, 234, 0.2)' }} />
                      </Box>
                    )}
                    {isTreasurer && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ 
                          textAlign: "center", 
                          color: "#00897b", 
                          fontWeight: 'bold',
                          mb: 2,
                          py: 1,
                          backgroundColor: 'rgba(0, 150, 136, 0.1)',
                          borderRadius: 1
                        }}>
                          භාණ්ඩාගාරික
                        </Typography>
                        <Button
                          color="inherit"
                          onClick={() => handleMobileNavigate("/member/fullDetails")}
                          startIcon={<PersonIcon />}
                          sx={{ 
                            textTransform: "none", 
                            width: "100%",
                            mb: 2,
                            justifyContent: 'flex-start',
                            backgroundColor: 'rgba(0, 150, 136, 0.15)',
                            border: '1px solid rgba(0, 150, 136, 0.2)',
                            '&:hover': { 
                              backgroundColor: 'rgba(0, 150, 136, 0.25)',
                              transform: 'translateX(2px)'
                            },
                            borderRadius: 2,
                            py: 1.5,
                            color: '#333',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          සාමාජික තොරතුරු
                        </Button>

                        {/* Grouped Financial Menu */}
                        <Accordion
                          sx={{
                            mb: 2,
                            backgroundColor: 'rgba(0, 150, 136, 0.1)',
                            '&:before': { display: 'none' },
                            borderRadius: 2,
                            overflow: 'hidden',
                            boxShadow: 'none',
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon sx={{ color: '#00897b' }} />}
                            sx={{
                              backgroundColor: 'rgba(0, 150, 136, 0.15)',
                              borderRadius: 2,
                              '&:hover': {
                                backgroundColor: 'rgba(0, 150, 136, 0.25)',
                              },
                              minHeight: 56,
                              '& .MuiAccordionSummary-content': {
                                alignItems: 'center',
                              }
                            }}
                          >
                            <PaymentIcon sx={{ mr: 2, color: '#00897b' }} />
                            <Typography sx={{ fontWeight: 'bold', color: '#333' }}>
                              මුදල්
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails sx={{ p: 0 }}>
                            {/* Money Receipts Accordion */}
                            <Accordion
                              sx={{
                                backgroundColor: 'transparent',
                                '&:before': { display: 'none' },
                                boxShadow: 'none',
                              }}
                            >
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon sx={{ color: '#666', fontSize: 20 }} />}
                                sx={{
                                  backgroundColor: 'rgba(0, 150, 136, 0.05)',
                                  '&:hover': { backgroundColor: 'rgba(0, 150, 136, 0.1)' },
                                  minHeight: 48,
                                  pl: 4,
                                }}
                              >
                                <Typography sx={{ fontWeight: 600, color: '#555' }}>
                                  මුදල් ලැබීම්
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails sx={{ p: 0, pl: 6 }}>
                                <Button
                                  color="inherit"
                                  onClick={() => handleMobileNavigate("/account/receipts")}
                                  sx={{ 
                                    textTransform: "none", 
                                    width: "100%",
                                    justifyContent: 'flex-start',
                                    backgroundColor: 'rgba(0, 150, 136, 0.02)',
                                    '&:hover': { backgroundColor: 'rgba(0, 150, 136, 0.05)' },
                                    borderRadius: 1,
                                    py: 1,
                                    mb: 0.5,
                                    color: '#555'
                                  }}
                                >
                                  • සාමාජික මුදල්/හිඟ ලැබීම්
                                </Button>
                                <Button
                                  color="inherit"
                                  onClick={() => handleMobileNavigate("/account/add-income")}
                                  sx={{ 
                                    textTransform: "none", 
                                    width: "100%",
                                    justifyContent: 'flex-start',
                                    backgroundColor: 'rgba(0, 150, 136, 0.02)',
                                    '&:hover': { backgroundColor: 'rgba(0, 150, 136, 0.05)' },
                                    borderRadius: 1,
                                    py: 1,
                                    mb: 0.5,
                                    color: '#555'
                                  }}
                                >
                                  • වෙනත් ආදායම් ඇතුලත් කරන්න
                                </Button>
                                <Button
                                  color="inherit"
                                  onClick={() => handleMobileNavigate("/account/view-income")}
                                  sx={{ 
                                    textTransform: "none", 
                                    width: "100%",
                                    justifyContent: 'flex-start',
                                    backgroundColor: 'rgba(0, 150, 136, 0.02)',
                                    '&:hover': { backgroundColor: 'rgba(0, 150, 136, 0.05)' },
                                    borderRadius: 1,
                                    py: 1,
                                    mb: 1,
                                    color: '#555'
                                  }}
                                >
                                  • වෙනත් ආදායම් බලන්න
                                </Button>
                              </AccordionDetails>
                            </Accordion>

                            {/* Money Expenses Accordion */}
                            <Accordion
                              sx={{
                                backgroundColor: 'transparent',
                                '&:before': { display: 'none' },
                                boxShadow: 'none',
                              }}
                            >
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon sx={{ color: '#666', fontSize: 20 }} />}
                                sx={{
                                  backgroundColor: 'rgba(0, 150, 136, 0.05)',
                                  '&:hover': { backgroundColor: 'rgba(0, 150, 136, 0.1)' },
                                  minHeight: 48,
                                  pl: 4,
                                }}
                              >
                                <Typography sx={{ fontWeight: 600, color: '#555' }}>
                                  මුදල් ගෙවීම්
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails sx={{ p: 0, pl: 6 }}>
                                <Button
                                  color="inherit"
                                  onClick={() => handleMobileNavigate("/account/add-expense")}
                                  sx={{ 
                                    textTransform: "none", 
                                    width: "100%",
                                    justifyContent: 'flex-start',
                                    backgroundColor: 'rgba(0, 150, 136, 0.02)',
                                    '&:hover': { backgroundColor: 'rgba(0, 150, 136, 0.05)' },
                                    borderRadius: 1,
                                    py: 1,
                                    mb: 0.5,
                                    color: '#555'
                                  }}
                                >
                                  • වියදම් ඇතුලත් කරන්න
                                </Button>
                                <Button
                                  color="inherit"
                                  onClick={() => handleMobileNavigate("/account/view-expenses")}
                                  sx={{ 
                                    textTransform: "none", 
                                    width: "100%",
                                    justifyContent: 'flex-start',
                                    backgroundColor: 'rgba(0, 150, 136, 0.02)',
                                    '&:hover': { backgroundColor: 'rgba(0, 150, 136, 0.05)' },
                                    borderRadius: 1,
                                    py: 1,
                                    mb: 1,
                                    color: '#555'
                                  }}
                                >
                                  • වියදම් බලන්න
                                </Button>
                              </AccordionDetails>
                            </Accordion>

                            {/* Reports Accordion */}
                            <Accordion
                              sx={{
                                backgroundColor: 'transparent',
                                '&:before': { display: 'none' },
                                boxShadow: 'none',
                              }}
                            >
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon sx={{ color: '#666', fontSize: 20 }} />}
                                sx={{
                                  backgroundColor: 'rgba(0, 150, 136, 0.05)',
                                  '&:hover': { backgroundColor: 'rgba(0, 150, 136, 0.1)' },
                                  minHeight: 48,
                                  pl: 4,
                                }}
                              >
                                <Typography sx={{ fontWeight: 600, color: '#555' }}>
                                  වාර්තා
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails sx={{ p: 0, pl: 6 }}>
                                <Button
                                  color="inherit"
                                  onClick={() => handleMobileNavigate("/account/monthly-report")}
                                  sx={{ 
                                    textTransform: "none", 
                                    width: "100%",
                                    justifyContent: 'flex-start',
                                    backgroundColor: 'rgba(0, 150, 136, 0.02)',
                                    '&:hover': { backgroundColor: 'rgba(0, 150, 136, 0.05)' },
                                    borderRadius: 1,
                                    py: 1,
                                    mb: 1,
                                    color: '#555'
                                  }}
                                >
                                  • මාසික ආදායම්/වියදම් වාර්තාව
                                </Button>
                              </AccordionDetails>
                            </Accordion>
                          </AccordionDetails>
                        </Accordion>

                        {/* Funeral Accordion */}
                        <Accordion
                          sx={{
                            mb: 2,
                            backgroundColor: 'rgba(0, 150, 136, 0.1)',
                            '&:before': { display: 'none' },
                            borderRadius: 2,
                            overflow: 'hidden',
                            boxShadow: 'none',
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon sx={{ color: '#00897b' }} />}
                            sx={{
                              backgroundColor: 'rgba(0, 150, 136, 0.15)',
                              borderRadius: 2,
                              '&:hover': {
                                backgroundColor: 'rgba(0, 150, 136, 0.25)',
                              },
                              minHeight: 56,
                              '& .MuiAccordionSummary-content': {
                                alignItems: 'center',
                              }
                            }}
                          >
                            <MonetizationOnIcon sx={{ mr: 2, color: '#00897b' }} />
                            <Typography sx={{ fontWeight: 'bold', color: '#333' }}>
                              අවමංගල්‍ය
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails sx={{ p: 0, pl: 2 }}>
                            <Button
                              color="inherit"
                              onClick={() => handleMobileNavigate("/funeral/extraDue")}
                              sx={{ 
                                textTransform: "none", 
                                width: "100%",
                                justifyContent: 'flex-start',
                                backgroundColor: 'rgba(0, 150, 136, 0.02)',
                                '&:hover': { backgroundColor: 'rgba(0, 150, 136, 0.05)' },
                                borderRadius: 1,
                                py: 1,
                                mb: 1,
                                color: '#555'
                              }}
                            >
                              • ද්‍රව්‍ය ආධාර හිඟ
                            </Button>
                          </AccordionDetails>
                        </Accordion>

                        {/* Loan menu items for treasurers */}
                        <Typography variant="body2" sx={{ 
                          color: "#666", 
                          fontSize: "0.875rem", 
                          fontWeight: 'bold',
                          mb: 1,
                          ml: 2
                        }}>
                          ණය තොරතුරු
                        </Typography>
                        <Button
                          color="inherit"
                          onClick={() => handleMobileNavigate("/loan/search")}
                          sx={{ 
                            textTransform: "none", 
                            width: "100%", 
                            paddingLeft: "40px",
                            mb: 0.5,
                            justifyContent: 'flex-start',
                            backgroundColor: 'rgba(0, 150, 136, 0.05)',
                            '&:hover': { backgroundColor: 'rgba(0, 150, 136, 0.1)' },
                            borderRadius: 1,
                            py: 1,
                            color: '#555'
                          }}
                        >
                          • ණය සෙවීම
                        </Button>
                        <Button
                          color="inherit"
                          onClick={() => handleMobileNavigate("/loan/active-loans")}
                          sx={{ 
                            textTransform: "none", 
                            width: "100%", 
                            paddingLeft: "40px",
                            mb: 2,
                            justifyContent: 'flex-start',
                            backgroundColor: 'rgba(0, 150, 136, 0.05)',
                            '&:hover': { backgroundColor: 'rgba(0, 150, 136, 0.1)' },
                            borderRadius: 1,
                            py: 1,
                            color: '#555'
                          }}
                        >
                          • ක්‍රියාකාරී ණය
                        </Button>
                        <Divider sx={{ my: 2, backgroundColor: 'rgba(0, 150, 136, 0.2)' }} />
                      </Box>
                    )}
                    {/* Common Member Account & Services */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ 
                        color: "#666", 
                        fontSize: "0.875rem", 
                        fontWeight: 'bold',
                        mb: 2,
                        ml: 1
                      }}>
                        මගේ ගිණුම
                      </Typography>
                      <Button
                        color="inherit"
                        onClick={() => handleMobileNavigate("/member/home")}
                        startIcon={<HomeIcon />}
                        sx={{ 
                          textTransform: "none",
                          width: "100%",
                          mb: 1,
                          justifyContent: 'flex-start',
                          backgroundColor: 'rgba(33, 150, 243, 0.15)',
                          border: '1px solid rgba(33, 150, 243, 0.2)',
                          '&:hover': { 
                            backgroundColor: 'rgba(33, 150, 243, 0.25)',
                            transform: 'translateX(2px)'
                          },
                          borderRadius: 2,
                          py: 1.5,
                          color: '#333',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        මුල් පිටුව
                      </Button>
                      <Button
                        color="inherit"
                        onClick={() => handleMobileNavigate("/member/profile-edit")}
                        startIcon={<EditIcon />}
                        sx={{ 
                          textTransform: "none",
                          width: "100%",
                          mb: 1,
                          justifyContent: 'flex-start',
                          backgroundColor: 'rgba(33, 150, 243, 0.15)',
                          border: '1px solid rgba(33, 150, 243, 0.2)',
                          '&:hover': { 
                            backgroundColor: 'rgba(33, 150, 243, 0.25)',
                            transform: 'translateX(2px)'
                          },
                          borderRadius: 2,
                          py: 1.5,
                          color: '#333',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        ගිණුම සංස්කරණය
                      </Button>
                      
                      {/* Divider for member financial services */}
                      <Divider sx={{ my: 2, backgroundColor: 'rgba(33, 150, 243, 0.2)' }} />
                      
                      {/* Member Financial Services */}
                      <Button
                        color="inherit"
                        onClick={() => handleMobileNavigate("/member/payments")}
                        startIcon={<PaymentIcon />}
                        sx={{ 
                          textTransform: "none", 
                          width: "100%",
                          mb: 1,
                          justifyContent: 'flex-start',
                          backgroundColor: 'rgba(76, 175, 80, 0.15)',
                          border: '1px solid rgba(76, 175, 80, 0.2)',
                          '&:hover': { 
                            backgroundColor: 'rgba(76, 175, 80, 0.25)',
                            transform: 'translateX(2px)'
                          },
                          borderRadius: 2,
                          py: 1.5,
                          color: '#333',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        මුදල් ගෙවීම්
                      </Button>
                      <Button
                        color="inherit"
                        onClick={() => handleMobileNavigate("/member/fines")}
                        startIcon={<MonetizationOnIcon />}
                        sx={{ 
                          textTransform: "none", 
                          width: "100%",
                          mb: 1,
                          justifyContent: 'flex-start',
                          backgroundColor: 'rgba(255, 152, 0, 0.15)',
                          border: '1px solid rgba(255, 152, 0, 0.2)',
                          '&:hover': { 
                            backgroundColor: 'rgba(255, 152, 0, 0.25)',
                            transform: 'translateX(2px)'
                          },
                          borderRadius: 2,
                          py: 1.5,
                          color: '#333',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        දඩ මුදල්
                      </Button>
                      {hasLoan && (
                        <Badge 
                          variant="dot" 
                          color="warning" 
                          sx={{
                            width: '100%',
                            '& .MuiBadge-badge': {
                              backgroundColor: '#ff9800',
                            }
                          }}
                        >
                          <Button
                            color="inherit"
                            onClick={() => handleMobileNavigate("/member/loan")}
                            startIcon={<AccountBalanceIcon />}
                            sx={{ 
                              textTransform: "none",
                              width: "100%",
                              mb: 1,
                              justifyContent: 'flex-start',
                              backgroundColor: 'rgba(255,152,0,0.15)',
                              border: '1px solid rgba(255,152,0,0.2)',
                              '&:hover': { 
                                backgroundColor: 'rgba(255,152,0,0.25)',
                                transform: 'translateX(2px)'
                              },
                              borderRadius: 2,
                              py: 1.5,
                              color: '#333',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            ණය <span style={{ marginLeft: 'auto', fontSize: '0.75rem' }}>● ක්‍රියාත්මක</span>
                          </Button>
                        </Badge>
                      )}
                      
                      {/* Logout button */}
                      <Divider sx={{ my: 2, backgroundColor: 'rgba(33, 150, 243, 0.2)' }} />
                      <Button
                        color="inherit"
                        onClick={handleLogout}
                        startIcon={<LogoutIcon />}
                        sx={{ 
                          textTransform: "none",
                          width: "100%",
                          justifyContent: 'flex-start',
                          backgroundColor: 'rgba(244, 67, 54, 0.1)',
                          '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.2)' },
                          borderRadius: 2,
                          py: 1.5,
                          color: '#d32f2f'
                        }}
                      >
                        ඉවත් වන්න
                      </Button>
                    </Box>
                  </Box>
                )}
                {!isAuthenticated && (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Button
                      color="inherit"
                      onClick={() => handleMobileNavigate("/login/user-login")}
                      startIcon={<PersonIcon />}
                      sx={{
                        textTransform: "none",
                        width: "100%",
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.2)' },
                        borderRadius: 2,
                        py: 2,
                        color: '#333',
                        fontWeight: 'bold'
                      }}
                    >
                      ප්‍රවේශය
                    </Button>
                  </Box>
                )}
              </Paper>
            )}
          </Toolbar>
        </AppBar>
      </Box>

      <Paper
        elevation={2}
        sx={{
          width: "100%",
          maxWidth: "1024px",
          margin: "0 auto",
          padding: "8px 16px",
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          borderRadius: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: 48,
        }}
      >
        {isAuthenticated && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ width: 28, height: 28, bgcolor: '#667eea', fontSize: '0.75rem' }}>
              {memberName.charAt(0).toUpperCase()}
            </Avatar>
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 'bold', 
                color: '#333',
                lineHeight: 1.2
              }}
            >
              ආයුබෝවන්, {memberName} <span style={{ color: '#666', fontSize: '0.75rem', fontWeight: 'normal' }}>#{memberId}</span>
            </Typography>
          </Box>
        )}
        {!isAuthenticated && (
          <Typography variant="body2" color="textSecondary">
            කරුණාකර පිවිසෙන්න
          </Typography>
        )}
        <Chip 
          label={`${new Date().toLocaleDateString('si-LK', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}`}
          size="small"
          sx={{
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            color: '#667eea',
            fontWeight: 'bold'
          }}
        />
      </Paper>
    </header>
  )
}

export default Header
