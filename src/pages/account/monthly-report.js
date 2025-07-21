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
  Grid2,
  Chip,
  Divider,
  Card,
  CardContent,
  Alert
} from "@mui/material"
import {
  Print as PrintIcon,
  Download as DownloadIcon,
  Save as SaveIcon
} from "@mui/icons-material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { navigate } from "gatsby"

import Layout from "../../components/layout"
import AuthComponent from "../../components/common/AuthComponent"
import api from "../../utils/api"

const baseUrl = process.env.GATSBY_API_BASE_URL

export default function MonthlyReport() {
  const [roles, setRoles] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [reportData, setReportData] = useState(null)
  
  // Date range filters
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [endDate, setEndDate] = useState(new Date())

  const handleAuthStateChange = ({ isAuthenticated, roles }) => {
    setIsAuthenticated(isAuthenticated)
    setRoles(roles)
    if (!roles.includes("treasurer")) {
      navigate("/login/user-login")
    }
  }

  const fetchReportData = async () => {
    if (!startDate || !endDate) {
      alert("කරුණාකර දින පරාසය තෝරන්න")
      return
    }

    setLoading(true)
    try {
      const [incomesResponse, expensesResponse, lastBalanceResponse] = await Promise.all([
        api.get(`${baseUrl}/account/incomes`, {
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
          }
        }),
        api.get(`${baseUrl}/account/expenses`, {
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
          }
        }),
        // Get the last stored balance before this period
        api.get(`${baseUrl}/period-balance/last-balance`, {
          params: {
            beforeDate: startDate.toISOString()
          }
        })
      ])

      if (incomesResponse.data.success && expensesResponse.data.success && lastBalanceResponse.data.success) {
        const incomes = incomesResponse.data.incomes || []
        const expenses = expensesResponse.data.expenses || []
        const lastBalance = lastBalanceResponse.data.balance
        
        // Starting balances for this period (from last stored balance or initial amounts)
        const periodStartCashOnHand = lastBalance.endingCashOnHand
        const periodStartBankDeposit = lastBalance.endingBankDeposit

        // Calculate totals by category
        const incomeByCategory = calculateIncomeByCategory(incomes)
        const expenseByCategory = calculateExpenseByCategory(expenses)
        
        // Calculate bank transactions during the period
        const periodBankDeposits = expenses
          .filter(expense => expense.category === 'බැංකු තැන්පතු')
          .reduce((sum, expense) => sum + expense.amount, 0)

        // Calculate bank withdrawals from incomes
        const periodBankWithdrawals = incomes
          .filter(income => income.category === 'බැංකු මුදල් ආපසු ගැනීම')
          .reduce((sum, income) => sum + income.amount, 0)

        const totalIncome = incomesResponse.data.totalAmount || 0
        const totalExpense = expensesResponse.data.totalAmount || 0
        const netCashFlow = totalIncome - totalExpense
        
        // Calculate current balances (end of selected period)
        const currentBankDeposit = periodStartBankDeposit + periodBankDeposits - periodBankWithdrawals
        const currentCashOnHand = periodStartCashOnHand + netCashFlow

        setReportData({
          period: { startDate, endDate },
          incomes,
          expenses,
          incomeByCategory,
          expenseByCategory,
          totals: {
            totalIncome,
            totalExpense,
            netCashFlow,
            periodBankDeposits,
            periodBankWithdrawals,
            currentCashOnHand,
            currentBankDeposit,
            periodStartCashOnHand, // Starting balance for this period
            periodStartBankDeposit // Starting balance for this period
          }
        })
      }
    } catch (error) {
      console.error("Error fetching report data:", error)
      alert("වාර්තා දත්ත ලබා ගැනීමේදී දෝෂයක් සිදුවිය")
    } finally {
      setLoading(false)
    }
  }

  const calculateIncomeByCategory = (incomes) => {
    const categoryTotals = {}
    incomes.forEach(income => {
      const category = income.category
      categoryTotals[category] = (categoryTotals[category] || 0) + income.amount
    })
    return categoryTotals
  }

  const calculateExpenseByCategory = (expenses) => {
    const categoryTotals = {}
    expenses.forEach(expense => {
      const category = expense.category
      categoryTotals[category] = (categoryTotals[category] || 0) + expense.amount
    })
    return categoryTotals
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('si-LK', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount)
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('si-LK')
  }

  const handlePrint = () => {
    window.print()
  }

  const handleSaveBalance = async () => {
    if (!reportData) return

    try {
      const response = await api.post(`${baseUrl}/period-balance/save-balance`, {
        periodEndDate: endDate.toISOString(),
        endingCashOnHand: reportData.totals.currentCashOnHand,
        endingBankDeposit: reportData.totals.currentBankDeposit,
        totalIncome: reportData.totals.totalIncome,
        totalExpense: reportData.totals.totalExpense,
        netCashFlow: reportData.totals.netCashFlow
      })

      if (response.data.success) {
        alert("කාල සීමාවේ ශේෂය සාර්ථකව සුරකින ලදී!")
      } else {
        alert("ශේෂය සුරැකීමේදී දෝෂයක් සිදුවිය")
      }
    } catch (error) {
      console.error("Error saving balance:", error)
      alert("ශේෂය සුරැකීමේදී දෝෂයක් සිදුවිය")
    }
  }

  const getIncomeColor = (category) => {
    if (category === 'සාමාජික ගාස්තු' || category === 'දඩ මුදල්') return "info"
    if (category.includes('කුලිය')) return "primary"
    if (category.includes('බැංකු')) return "success"
    if (category.includes('පරිත්‍යාග')) return "secondary"
    return "default"
  }

  const getExpenseColor = (category) => {
    if (category.includes('ප්‍රතිලාභ') || category.includes('ආධාර')) return "error"
    if (category.includes('කම්කරු') || category.includes('සේවා')) return "warning"
    if (category.includes('කාර්යාල') || category.includes('සභා')) return "info"
    if (category.includes('බැංකු')) return "success"
    return "default"
  }

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
      <section style={{ padding: "20px" }} className="no-print">
        <Box sx={{ maxWidth: "1400px", margin: "0 auto" }}>
          <Paper sx={{ padding: "30px", borderRadius: "10px" }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ textAlign: "center", marginBottom: "30px", color: "#2c3e50" }}
            >
              මාසික ආදායම්/වියදම් වාර්තාව
            </Typography>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              {/* Date Range Filter */}
              <Grid2 container spacing={2} sx={{ marginBottom: "30px" }}>
                <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
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
                <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
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
                <Grid2 size={{ xs: 12, sm: 4, md: 2.4 }}>
                  <Button
                    variant="contained"
                    onClick={fetchReportData}
                    disabled={loading}
                    sx={{ 
                      height: "56px", 
                      width: "100%",
                      textTransform: "none" 
                    }}
                  >
                    {loading ? "සකසමින්..." : "වාර්තාව සකසන්න"}
                  </Button>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4, md: 2.4 }}>
                  <Button
                    variant="outlined"
                    startIcon={<PrintIcon />}
                    onClick={handlePrint}
                    disabled={!reportData}
                    sx={{ 
                      height: "56px", 
                      width: "100%",
                      textTransform: "none" 
                    }}
                  >
                    මුද්‍රණය කරන්න
                  </Button>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4, md: 2.4 }}>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveBalance}
                    disabled={!reportData}
                    sx={{ 
                      height: "56px", 
                      width: "100%",
                      textTransform: "none" 
                    }}
                  >
                    ශේෂය සුරකින්න
                  </Button>
                </Grid2>
              </Grid2>
            </LocalizationProvider>

            {reportData && (
              <Box id="report-content">
                {/* Report Header */}
                <Box sx={{ textAlign: "center", marginBottom: "30px" }} className="print-only">
                  <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
                    එක්සත් සමිතිය
                  </Typography>
                  <Typography variant="h5" sx={{ marginBottom: "10px" }}>
                    මාසික ආදායම්/වියදම් වාර්තාව
                  </Typography>
                  <Typography variant="h6">
                    {formatDate(reportData.period.startDate)} සිට {formatDate(reportData.period.endDate)} දක්වා
                  </Typography>
                </Box>

                {/* Summary Cards */}
                <Grid2 container spacing={3} sx={{ marginBottom: "30px" }}>
                  <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card sx={{ bgcolor: "#e8f5e8" }}>
                      <CardContent>
                        <Typography variant="h6" color="#2e7d32">කාල සීමාවේ මුළු ආදායම</Typography>
                        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#2e7d32" }}>
                          {formatCurrency(reportData.totals.totalIncome)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card sx={{ bgcolor: "#ffebee" }}>
                      <CardContent>
                        <Typography variant="h6" color="#d32f2f">කාල සීමාවේ මුළු වියදම</Typography>
                        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#d32f2f" }}>
                          {formatCurrency(reportData.totals.totalExpense)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card sx={{ 
                      bgcolor: reportData.totals.netCashFlow >= 0 ? "#e8f5e8" : "#ffebee"
                    }}>
                      <CardContent>
                        <Typography variant="h6" color={
                          reportData.totals.netCashFlow >= 0 ? "#2e7d32" : "#d32f2f"
                        }>
                          ශුද්ධ මුදල් ප්‍රවාහය
                        </Typography>
                        <Typography variant="h4" sx={{ 
                          fontWeight: "bold", 
                          color: reportData.totals.netCashFlow >= 0 ? "#2e7d32" : "#d32f2f"
                        }}>
                          {formatCurrency(reportData.totals.netCashFlow)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid2>
                </Grid2>

                {/* Current Balances */}
                <Grid2 container spacing={3} sx={{ marginBottom: "30px" }}>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Card sx={{ bgcolor: "#e3f2fd", border: "2px solid #1976d2" }}>
                      <CardContent>
                        <Typography variant="h6" color="#1976d2" sx={{ marginBottom: "10px" }}>
                          වර්තමාන බැංකු තැන්පතු
                        </Typography>
                        <Typography variant="body2" color="#666" sx={{ marginBottom: "5px" }}>
                          කාල සීමාව ආරම්භයේ: {formatCurrency(reportData.totals.periodStartBankDeposit)}
                        </Typography>
                        <Typography variant="body2" color="#666" sx={{ marginBottom: "5px" }}>
                          කාල සීමාවේ තැන්පතු: +{formatCurrency(reportData.totals.periodBankDeposits)}
                        </Typography>
                        <Typography variant="body2" color="#666" sx={{ marginBottom: "10px" }}>
                          කාල සීමාවේ ආපසු ගැනීම්: -{formatCurrency(reportData.totals.periodBankWithdrawals)}
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1976d2" }}>
                          {formatCurrency(reportData.totals.currentBankDeposit)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Card sx={{ 
                      bgcolor: reportData.totals.currentCashOnHand >= 0 ? "#e8f5e8" : "#ffebee",
                      border: `2px solid ${reportData.totals.currentCashOnHand >= 0 ? "#2e7d32" : "#d32f2f"}`
                    }}>
                      <CardContent>
                        <Typography variant="h6" color={
                          reportData.totals.currentCashOnHand >= 0 ? "#2e7d32" : "#d32f2f"
                        } sx={{ marginBottom: "10px" }}>
                          වර්තමාන අත ඉතිරි මුදල
                        </Typography>
                        <Typography variant="body2" color="#666" sx={{ marginBottom: "5px" }}>
                          කාල සීමාව ආරම්භයේ: {formatCurrency(reportData.totals.periodStartCashOnHand)}
                        </Typography>
                        <Typography variant="body2" color="#666" sx={{ marginBottom: "10px" }}>
                          කාල සීමාවේ ශුද්ධ ප්‍රවාහය: {reportData.totals.netCashFlow >= 0 ? '+' : ''}{formatCurrency(reportData.totals.netCashFlow)}
                        </Typography>
                        <Typography variant="h4" sx={{ 
                          fontWeight: "bold", 
                          color: reportData.totals.currentCashOnHand >= 0 ? "#2e7d32" : "#d32f2f"
                        }}>
                          {formatCurrency(reportData.totals.currentCashOnHand)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid2>
                </Grid2>

                {/* Net Cash Flow Alert */}
                <Alert 
                  severity={reportData.totals.netCashFlow >= 0 ? "success" : "warning"}
                  sx={{ marginBottom: "15px" }}
                >
                  <Typography variant="h6">
                    මෙම කාල සීමාවේ ශුද්ධ මුදල් ප්‍රවාහය: {" "}
                    <strong>{formatCurrency(reportData.totals.netCashFlow)}</strong>
                    {reportData.totals.netCashFlow >= 0 ? " (ධනාත්මක)" : " (ඍණාත්මක)"}
                  </Typography>
                </Alert>

                {/* Total Assets Alert */}
                <Alert 
                  severity="info"
                  sx={{ marginBottom: "30px" }}
                >
                  <Typography variant="h6">
                    මුළු වත්කම් (බැංකු + අත ඉතිරි): {" "}
                    <strong>{formatCurrency(reportData.totals.currentBankDeposit + reportData.totals.currentCashOnHand)}</strong>
                  </Typography>
                </Alert>

                {/* Income Summary */}
                <Box sx={{ marginBottom: "30px" }}>
                  <Typography variant="h5" sx={{ marginBottom: "15px", color: "#2e7d32" }}>
                    ආදායම් සාරාංශය
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ backgroundColor: "#e8f5e8" }}>
                          <TableCell sx={{ fontWeight: "bold" }}>ප්‍රවර්ගය</TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold" }}>මුදල</TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold" }}>ප්‍රතිශතය</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.entries(reportData.incomeByCategory).map(([category, amount]) => (
                          <TableRow key={category}>
                            <TableCell>
                              <Chip 
                                label={category} 
                                color={getIncomeColor(category)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: "bold" }}>
                              {formatCurrency(amount)}
                            </TableCell>
                            <TableCell align="right">
                              {((amount / reportData.totals.totalIncome) * 100).toFixed(1)}%
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                          <TableCell sx={{ fontWeight: "bold" }}>මුළු ආදායම</TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold", fontSize: "1.1em" }}>
                            {formatCurrency(reportData.totals.totalIncome)}
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold" }}>100.0%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>

                {/* Expense Summary */}
                <Box sx={{ marginBottom: "30px" }}>
                  <Typography variant="h5" sx={{ marginBottom: "15px", color: "#d32f2f" }}>
                    වියදම් සාරාංශය
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ backgroundColor: "#ffebee" }}>
                          <TableCell sx={{ fontWeight: "bold" }}>ප්‍රවර්ගය</TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold" }}>මුදල</TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold" }}>ප්‍රතිශතය</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.entries(reportData.expenseByCategory).map(([category, amount]) => (
                          <TableRow key={category}>
                            <TableCell>
                              <Chip 
                                label={category} 
                                color={getExpenseColor(category)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: "bold" }}>
                              {formatCurrency(amount)}
                            </TableCell>
                            <TableCell align="right">
                              {((amount / reportData.totals.totalExpense) * 100).toFixed(1)}%
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                          <TableCell sx={{ fontWeight: "bold" }}>මුළු වියදම</TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold", fontSize: "1.1em" }}>
                            {formatCurrency(reportData.totals.totalExpense)}
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold" }}>100.0%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>

                {/* Report Footer */}
                <Box sx={{ marginTop: "40px", textAlign: "center" }} className="print-only">
                  <Divider sx={{ marginBottom: "20px" }} />
                  <Typography variant="body2" color="textSecondary">
                    වාර්තාව සකස් කළ දිනය: {formatDate(new Date())}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    එක්සත් සමිතිය - භාණ්ඩාගාරික වාර්තාව
                  </Typography>
                </Box>
              </Box>
            )}

            {!reportData && (
              <Box sx={{ textAlign: "center", marginTop: "40px" }}>
                <Typography variant="h6" color="textSecondary">
                  වාර්තාව නිර්මාණය කිරීමට මුල කරන්න
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>
      </section>

      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
        
        @media screen {
          .print-only {
            display: none !important;
          }
        }
      `}</style>
    </Layout>
  )
}
