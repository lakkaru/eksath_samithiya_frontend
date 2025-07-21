import React, { useState, useEffect } from "react"
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert
} from "@mui/material"
import {
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from "@mui/icons-material"
import dayjs from "dayjs"
import { navigate } from "gatsby"

import Layout from "../../components/layout"
import AuthComponent from "../../components/common/AuthComponent"
import api from "../../utils/api"
const baseUrl = process.env.GATSBY_API_BASE_URL

export default function ActiveLoans() {
  const [roles, setRoles] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeLoans, setActiveLoans] = useState([])
  const [loading, setLoading] = useState(false)

  // Delete functionality
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [loanToDelete, setLoanToDelete] = useState(null)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

  const isLoanCreatedToday = (loanDate) => {
    const today = dayjs().startOf('day')
    const loanDay = dayjs(loanDate).startOf('day')
    return today.isSame(loanDay)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('si-LK', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount)
  }

  const formatDate = (date) => {
    return dayjs(date).format('YYYY/MM/DD')
  }

  const handleViewMore = memberId => {
    navigate(`/loan/search?memberId=${memberId}`)
  }

  const handleDeleteClick = (loan) => {
    setLoanToDelete(loan)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      const response = await api.delete(`${baseUrl}/loan/${loanToDelete._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
      })

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: 'ණය සාර්ථකව ඉවත් කරන ලදී',
          severity: 'success'
        })
        setDeleteDialogOpen(false)
        setLoanToDelete(null)
        fetchActiveLoans() // Refresh the data
      }
    } catch (error) {
      console.error("Error deleting loan:", error)
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'ණය ඉවත් කිරීමේදී දෝෂයක් සිදුවිය',
        severity: 'error'
      })
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setLoanToDelete(null)
  }

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const handleAuthStateChange = ({ isAuthenticated, roles }) => {
    setIsAuthenticated(isAuthenticated)
    setRoles(roles)
    if (!isAuthenticated || !roles.includes("loan-treasurer")) {
      navigate("/login/user-login")
    }
  }

  const fetchActiveLoans = async () => {
    setLoading(true)
    try {
      const response = await api.get(`${baseUrl}/loan/active-loans`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
      })
      setActiveLoans(response.data.activeLoans)
    } catch (error) {
      console.error("Error fetching data:", error)
      setSnackbar({
        open: true,
        message: 'දත්ත ලබා ගැනීමේදී දෝෂයක් සිදුවිය',
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchActiveLoans()
    }
  }, [isAuthenticated])
  return (
    <Layout>
      <AuthComponent onAuthStateChange={handleAuthStateChange} />
      <section style={{ padding: "20px" }}>
        <Box sx={{ width: "100%", margin: "0 auto" }}>
          <Paper sx={{ padding: "20px", borderRadius: "10px" }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ textAlign: "center", marginBottom: "30px", color: "#2c3e50" }}
            >
              ක්‍රියාකාරී ණය
            </Typography>

            {/* Active Loans Table */}
            <Box sx={{ marginBottom: "30px" }}>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#e8f5e8" }}>
                      <TableCell sx={{ fontWeight: "bold" }}>ණය දිනය</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>ණය අංකය</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>සාමාජික අංකය</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>සාමාජිකයා</TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>ණය මුදල</TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>ඉතිරි මුදල</TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold" }}>නොගෙවු මාස</TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold" }}>ක්‍රියා</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          <Typography>පූරණය වෙමින්...</Typography>
                        </TableCell>
                      </TableRow>
                    ) : activeLoans.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          <Typography>ක්‍රියාකාරී ණය නොමැත</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      activeLoans.map((loan, index) => (
                        <TableRow key={index}>
                          <TableCell>{formatDate(loan.loanDate)}</TableCell>
                          <TableCell>{loan.loanNumber}</TableCell>
                          <TableCell>{loan.memberId?.member_id || 'N/A'}</TableCell>
                          <TableCell>{loan.memberId?.name || 'N/A'}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold" }}>
                            {formatCurrency(loan.loanAmount)}
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold", color: loan.loanRemainingAmount > 0 ? "#d32f2f" : "#2e7d32" }}>
                            {formatCurrency(loan.loanRemainingAmount)}
                          </TableCell>
                          <TableCell align="center" sx={{ color: loan.unpaidDuration > 2 ? "#d32f2f" : "#2e7d32" }}>
                            {loan.unpaidDuration}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleViewMore(loan.memberId?.member_id)}
                              sx={{ marginRight: 0.5 }}
                              title="බලන්න"
                            >
                              <ViewIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteClick(loan)}
                              title="ඉවත් කරන්න"
                              disabled={!isLoanCreatedToday(loan.loanDate)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Paper>
        </Box>
      </section>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>ණය ඉවත් කරන්න</DialogTitle>
        <DialogContent>
          <Typography>
            ඔබට මෙම ණය ස්ථිරවම ඉවත් කිරීමට අවශ්‍යද?
          </Typography>
          {loanToDelete && (
            <Box sx={{ marginTop: 2, padding: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
              <Typography><strong>සාමාජිකයා:</strong> {loanToDelete.memberId?.name}</Typography>
              <Typography><strong>ණය අංකය:</strong> {loanToDelete.loanNumber}</Typography>
              <Typography><strong>ණය මුදල:</strong> {formatCurrency(loanToDelete.loanAmount)}</Typography>
              <Typography><strong>ඉතිරි මුදල:</strong> {formatCurrency(loanToDelete.loanRemainingAmount)}</Typography>
              <Typography><strong>දිනය:</strong> {formatDate(loanToDelete.loanDate)}</Typography>
            </Box>
          )}
          <Alert severity="warning" sx={{ marginTop: 2 }}>
            <strong>සෘණය:</strong> අද දිනයේ එකතු කරන ලද ණය පමණක් ඉවත් කළ හැක. මෙය අහම්බෙන් එකතු කරන ලද ණය සඳහා පමණි.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>
            අවලංගු කරන්න
          </Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error" startIcon={<DeleteIcon />}>
            ඉවත් කරන්න
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Layout>
  )
}
