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
  Alert,
  Chip,
  Grid2
} from "@mui/material"
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from "@mui/icons-material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { navigate } from "gatsby"

import Layout from "../../components/layout"
import AuthComponent from "../../components/common/AuthComponent"
import api from "../../utils/api"

const baseUrl = process.env.GATSBY_API_BASE_URL

export default function ViewIncome() {
  const [roles, setRoles] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [incomes, setIncomes] = useState([])
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" })
  const [totalAmount, setTotalAmount] = useState(0)
  
  // Date range filters
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [endDate, setEndDate] = useState(new Date())
  
  // Delete confirmation dialog
  const [deleteDialog, setDeleteDialog] = useState({ open: false, incomeId: null })
  
  // View details dialog
  const [viewDialog, setViewDialog] = useState({ open: false, income: null })

  const handleAuthStateChange = ({ isAuthenticated, roles }) => {
    setIsAuthenticated(isAuthenticated)
    setRoles(roles)
    if (!roles.includes("treasurer")) {
      navigate("/login/user-login")
    }
  }

  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity })
  }

  const handleCloseAlert = () => {
    setAlert({ open: false, message: "", severity: "success" })
  }

  const fetchIncomes = async () => {
    if (!startDate || !endDate) {
      showAlert("කරුණාකර දින පරාසය තෝරන්න", "error")
      return
    }

    setLoading(true)
    try {
      const response = await api.get(`${baseUrl}/account/incomes`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      })

      if (response.data.success) {
        setIncomes(response.data.incomes)
        setTotalAmount(response.data.totalAmount || 0)
        showAlert(`${response.data.incomes.length} ආදායම් සොයා ගන්නා ලදී`, "success")
      }
    } catch (error) {
      console.error("Error fetching incomes:", error)
      showAlert("ආදායම් ලබා ගැනීමේදී දෝෂයක් සිදුවිය", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (incomeId) => {
    try {
      const response = await api.delete(`${baseUrl}/account/income/${incomeId}`)
      
      if (response.data.success) {
        const deletedIncome = incomes.find(income => income._id === incomeId)
        const updatedIncomes = incomes.filter(income => income._id !== incomeId)
        setIncomes(updatedIncomes)
        setTotalAmount(prevTotal => prevTotal - (deletedIncome?.amount || 0))
        setDeleteDialog({ open: false, incomeId: null })
        showAlert("ආදායම සාර්ථකව මකා දමන ලදී", "success")
      }
    } catch (error) {
      console.error("Error deleting income:", error)
      showAlert("ආදායම මකා දැමීමේදී දෝෂයක් සිදුවිය", "error")
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('si-LK', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount)
  }

  const formatDate = (dateInput) => {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput)
    return date.toLocaleDateString('si-LK')
  }

  const getCategoryChipColor = (category) => {
    const serviceIncomeCategories = [
      "කූඩාරම් කුලිය",
      "පිඟන් කුලිය", 
      "පුටු කුලිය",
      "බුෆේ සෙට් කුලිය",
      "ශබ්ද විකාශන කුලිය"
    ]
    
    const financialIncomeCategories = [
      "බැංකු පොලී ආදායම"
    ]

    const donationCategories = [
      "වෙනත් සංවිධානවලින් පරිත්‍යාග",
      "පුද්ගලික පරිත්‍යාග",
      "රජයේ ආධාර"
    ]
    
    if (serviceIncomeCategories.includes(category)) return "primary"
    if (financialIncomeCategories.includes(category)) return "success"
    if (donationCategories.includes(category)) return "secondary"
    return "default"
  }

  // Load incomes on component mount
  useEffect(() => {
    if (isAuthenticated && roles.includes("treasurer")) {
      fetchIncomes()
    }
  }, [isAuthenticated, roles])

  if (!isAuthenticated) {
    return (
      <Layout>
        <AuthComponent onAuthStateChange={handleAuthStateChange} />
        <Box sx={{ padding: "20px", textAlign: "center" }}>
          <Typography>පුරනය වන්න...</Typography>
        </Box>
      </Layout>
    )
  }

  return (
    <Layout>
      <AuthComponent onAuthStateChange={handleAuthStateChange} />
      <section style={{ padding: "20px" }}>
        <Box sx={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Paper sx={{ padding: "30px", borderRadius: "10px" }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ textAlign: "center", marginBottom: "30px", color: "#2c3e50" }}
            >
              ආදායම් පෙන්වන්න
            </Typography>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              {/* Date Range Filter */}
              <Grid2 container spacing={3} sx={{ marginBottom: "30px" }}>
                <Grid2 size={{ xs: 12, sm: 4 }}>
                  <DatePicker
                    label="ආරම්භක දිනය"
                    value={startDate}
                    onChange={setStartDate}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                      },
                    }}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4 }}>
                  <DatePicker
                    label="අවසාන දිනය"
                    value={endDate}
                    onChange={setEndDate}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                      },
                    }}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4 }}>
                  <Button
                    variant="contained"
                    onClick={fetchIncomes}
                    disabled={loading}
                    sx={{ 
                      height: "56px", 
                      width: "100%",
                      textTransform: "none" 
                    }}
                  >
                    {loading ? "සොයමින්..." : "ආදායම් සොයන්න"}
                  </Button>
                </Grid2>
              </Grid2>
            </LocalizationProvider>

            {/* Total Amount Summary */}
            {incomes.length > 0 && (
              <Box sx={{ marginTop: "20px", marginBottom: "10px" }}>
                <Paper sx={{ padding: "20px", backgroundColor: "#e8f5e8", border: "1px solid #4caf50" }}>
                  <Typography variant="h6" sx={{ textAlign: "center", color: "#2e7d32", fontWeight: "bold" }}>
                    තෝරාගත් දින පරාසයේ මුළු ආදායම: {formatCurrency(totalAmount)}
                  </Typography>
                  <Typography variant="body2" sx={{ textAlign: "center", color: "#666", marginTop: "5px" }}>
                    {formatDate(startDate)} සිට {formatDate(endDate)} දක්වා
                  </Typography>
                </Paper>
              </Box>
            )}

            {/* Incomes Table */}
            {incomes.length > 0 && (
              <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableCell sx={{ fontWeight: "bold" }}>දිනය</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>වර්ගය</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>විස්තර</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="right">මුදල</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>ක්‍රියා</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {incomes.map((income) => (
                      <TableRow key={income._id} hover>
                        <TableCell>{formatDate(income.date)}</TableCell>
                        <TableCell>
                          <Chip 
                            label={income.category} 
                            color={getCategoryChipColor(income.category)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {income.source && (
                            <Typography variant="body2" sx={{ marginBottom: "2px" }}>
                              <strong>ප්‍රභවය:</strong> {income.source}
                            </Typography>
                          )}
                          {income.description && (
                            <Typography variant="body2" sx={{ marginBottom: "2px" }}>
                              <strong>විස්තරය:</strong> {income.description}
                            </Typography>
                          )}
                          {!income.source && !income.description && "-"}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold", color: "#2e7d32" }}>
                          {formatCurrency(income.amount)}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => setViewDialog({ open: true, income })}
                            color="primary"
                            size="small"
                          >
                            <ViewIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => navigate(`/account/edit-income?id=${income._id}`)}
                            color="warning"
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => setDeleteDialog({ open: true, incomeId: income._id })}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {incomes.length === 0 && !loading && (
              <Box sx={{ textAlign: "center", marginTop: "40px" }}>
                <Typography variant="h6" color="textSecondary">
                  තෝරාගත් දින පරාසයේ ආදායම් සොයා ගත නොහැක
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>
      </section>

      {/* View Details Dialog */}
      <Dialog 
        open={viewDialog.open} 
        onClose={() => setViewDialog({ open: false, income: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>ආදායම් විස්තර</DialogTitle>
        <DialogContent>
          {viewDialog.income && (
            <Box sx={{ padding: "10px" }}>
              <Typography><strong>දිනය:</strong> {formatDate(viewDialog.income.date)}</Typography>
              <Typography><strong>වර්ගය:</strong> {viewDialog.income.category}</Typography>
              <Typography><strong>මුදල:</strong> {formatCurrency(viewDialog.income.amount)}</Typography>
              {viewDialog.income.description && (
                <Typography><strong>විස්තරය:</strong> {viewDialog.income.description}</Typography>
              )}
              {viewDialog.income.source && (
                <Typography><strong>ප්‍රභවය:</strong> {viewDialog.income.source}</Typography>
              )}
              <Typography><strong>එක් කළ දිනය:</strong> {formatDate(viewDialog.income.created_at)}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog({ open: false, income: null })}>
            වසන්න
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialog.open} 
        onClose={() => setDeleteDialog({ open: false, incomeId: null })}
      >
        <DialogTitle>ආදායම මකා දැමීම</DialogTitle>
        <DialogContent>
          <Typography>
            ඔබට මෙම ආදායම මකා දැමීමට අවශ්‍ය බව විශ්වාසද? මෙම ක්‍රියාව ආපසු හැරවිය නොහැක.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, incomeId: null })}>
            අවලංගු කරන්න
          </Button>
          <Button 
            onClick={() => handleDelete(deleteDialog.incomeId)}
            color="error"
            variant="contained"
          >
            මකා දමන්න
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Layout>
  )
}
