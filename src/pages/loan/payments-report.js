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
  Card,
  CardContent,
  Alert
} from "@mui/material"
import {
  Print as PrintIcon,
  Download as DownloadIcon
} from "@mui/icons-material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs from "dayjs"
import { navigate } from "gatsby"

import Layout from "../../components/layout"
import AuthComponent from "../../components/common/AuthComponent"
import api from "../../utils/api"

const baseUrl = process.env.GATSBY_API_BASE_URL

export default function LoanPaymentsReport() {
  const [roles, setRoles] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [payments, setPayments] = useState([])
  
  // Date range filters
  const [startDate, setStartDate] = useState(dayjs().startOf('month'))
  const [endDate, setEndDate] = useState(dayjs())

  // Summary data
  const [summary, setSummary] = useState({
    totalPayments: 0,
    totalAmount: 0,
    totalPrincipal: 0,
    totalInterest: 0,
    totalPenaltyInterest: 0
  })

  const handleAuthStateChange = ({ isAuthenticated, roles }) => {
    setIsAuthenticated(isAuthenticated)
    setRoles(roles)
    if (!roles.includes("loan-treasurer")) {
      navigate("/login/user-login")
    }
  }

  const fetchPaymentsData = async () => {
    if (!startDate || !endDate) {
      alert("කරුණාකර දින පරාසය තෝරන්න")
      return
    }

    setLoading(true)
    try {
      const response = await api.get(`${baseUrl}/loan/payments-report`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        },
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
      })

      if (response.data.success) {
        const paymentsData = response.data.payments || []
        setPayments(paymentsData)
        
        // Calculate summary
        const totalAmount = paymentsData.reduce((sum, payment) => sum + payment.amount, 0)
        const totalPrincipal = paymentsData.reduce((sum, payment) => sum + payment.principalAmount, 0)
        const totalInterest = paymentsData.reduce((sum, payment) => sum + payment.interestAmount, 0)
        const totalPenaltyInterest = paymentsData.reduce((sum, payment) => sum + payment.penaltyInterestAmount, 0)

        setSummary({
          totalPayments: paymentsData.length,
          totalAmount,
          totalPrincipal,
          totalInterest,
          totalPenaltyInterest
        })
      }
    } catch (error) {
      console.error("Error fetching payments data:", error)
      alert("ගෙවීම් දත්ත ලබා ගැනීමේදී දෝෂයක් සිදුවිය")
    } finally {
      setLoading(false)
    }
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

  const handlePrint = () => {
    window.print()
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
              ණය ගෙවීම් වාර්තාව
            </Typography>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {/* Date Range Filter */}
              <Grid2 container spacing={3} sx={{ marginBottom: "30px" }}>
                <Grid2 size={{ xs: 12, sm: 3 }}>
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
                <Grid2 size={{ xs: 12, sm: 3 }}>
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
                <Grid2 size={{ xs: 12, sm: 3 }}>
                  <Button
                    variant="contained"
                    onClick={fetchPaymentsData}
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
                <Grid2 size={{ xs: 12, sm: 3 }}>
                  <Button
                    variant="outlined"
                    startIcon={<PrintIcon />}
                    onClick={handlePrint}
                    disabled={payments.length === 0}
                    sx={{ 
                      height: "56px", 
                      width: "100%",
                      textTransform: "none" 
                    }}
                  >
                    මුද්‍රණය කරන්න
                  </Button>
                </Grid2>
              </Grid2>
            </LocalizationProvider>

            {payments.length > 0 && (
              <Box id="report-content">
                {/* Report Header */}
                <Box sx={{ textAlign: "center", marginBottom: "30px" }} className="print-only">
                  <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
                    එක්සත් සමිතිය
                  </Typography>
                  <Typography variant="h5" sx={{ marginBottom: "10px" }}>
                    ණය ගෙවීම් වාර්තාව
                  </Typography>
                  <Typography variant="h6">
                    {startDate.format('YYYY/MM/DD')} සිට {endDate.format('YYYY/MM/DD')} දක්වා
                  </Typography>
                </Box>

                {/* Summary Alerts */}
                <Box sx={{ marginBottom: "30px" }}>
                  <Alert severity="success" sx={{ marginBottom: "10px", fontSize: "1.1em" }}>
                    <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
                      මුළු ගෙවන ලද මුදල: {formatCurrency(summary.totalAmount)}
                    </Typography>
                  </Alert>
                  <Alert severity="warning" sx={{ marginBottom: "10px", fontSize: "1.1em" }}>
                    <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
                      මුළු ණය මුදල: {formatCurrency(summary.totalPrincipal)}
                    </Typography>
                  </Alert>
                  <Alert severity="error" sx={{ marginBottom: "10px", fontSize: "1.1em" }}>
                    <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
                      මුළු පොලිය: {formatCurrency(summary.totalInterest + summary.totalPenaltyInterest)}
                    </Typography>
                  </Alert>
                </Box>

                {/* Payments Table */}
                <Box sx={{ marginBottom: "30px" }}>
                  <Typography variant="h5" sx={{ marginBottom: "15px", color: "#2e7d32" }}>
                    ගෙවීම් විස්තර
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ backgroundColor: "#e8f5e8" }}>
                          <TableCell sx={{ fontWeight: "bold" }}>දිනය</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>සාමාජික අංකය</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>සාමාජිකයා</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>ණය අංකය</TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold" }}>මුළු මුදල</TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold" }}>ණය මුදල</TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold" }}>පොලිය</TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold" }}>දඩ පොලිය</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {payments.map((payment, index) => (
                          <TableRow key={index}>
                            <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                            <TableCell>{payment.memberId?.member_id || 'N/A'}</TableCell>
                            <TableCell>{payment.memberId?.name || 'N/A'}</TableCell>
                            <TableCell>{payment.loanId?.loanNumber || 'N/A'}</TableCell>
                            <TableCell align="right" sx={{ fontWeight: "bold" }}>
                              {formatCurrency(payment.amount)}
                            </TableCell>
                            <TableCell align="right">
                              {formatCurrency(payment.principalAmount)}
                            </TableCell>
                            <TableCell align="right">
                              {formatCurrency(payment.interestAmount)}
                            </TableCell>
                            <TableCell align="right">
                              {formatCurrency(payment.penaltyInterestAmount)}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}>
                          <TableCell colSpan={4} sx={{ fontWeight: "bold", fontSize: "1.1em" }}>
                            මුළු එකතුව
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold", fontSize: "1.1em" }}>
                            {formatCurrency(summary.totalAmount)}
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold", fontSize: "1.1em" }}>
                            {formatCurrency(summary.totalPrincipal)}
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold", fontSize: "1.1em" }}>
                            {formatCurrency(summary.totalInterest)}
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold", fontSize: "1.1em" }}>
                            {formatCurrency(summary.totalPenaltyInterest)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>

                {/* Report Footer */}
                <Box sx={{ marginTop: "40px", textAlign: "center" }} className="print-only">
                  <Typography variant="body2" color="textSecondary">
                    වාර්තාව සකස් කළ දිනය: {dayjs().format('YYYY/MM/DD')}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    එක්සත් සමිතිය - ණය භාණ්ඩාගාරික වාර්තාව
                  </Typography>
                </Box>
              </Box>
            )}

            {payments.length === 0 && !loading && (
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
