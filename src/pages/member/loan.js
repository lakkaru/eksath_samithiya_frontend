import React, { useState, useEffect } from "react"
import { navigate } from "gatsby"
import api from "../../utils/api"
import Layout from "../../components/layout"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Container,
  CircularProgress,
  Alert,
  Grid,
  Divider,
  Paper
} from "@mui/material"
import AuthComponent from "../../components/common/AuthComponent"
import StickyHeadTable from "../../components/StickyHeadTable"
import { TrendingUp, Warning, AccountBalance, Gavel } from "@mui/icons-material"

const baseUrl = process.env.GATSBY_API_BASE_URL

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('si-LK', {
    style: 'currency',
    currency: 'LKR'
  }).format(Math.abs(amount) || 0)
}

const getStatusColor = (amount) => {
  if (amount < 0) return "success"
  if (amount > 0) return "error"
  return "info"
}

const getStatusIcon = (amount) => {
  if (amount < 0) return <TrendingUp />
  if (amount > 0) return <Warning />
  return <AccountBalance />
}

export default function MemberLoan() {
  const [roles, setRoles] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loan, setLoan] = useState(null)
  const [earlyPayments, setEarlyPayments] = useState([])
  const [calculatedInterest, setCalculatedInterest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Calculate totals for payment table (after earlyPayments is defined)
  const paymentTotals = earlyPayments && earlyPayments.length > 0 ? earlyPayments.reduce(
    (acc, val) => {
      acc.payedTotal += (val.principleAmount || 0) + (val.interestAmount || 0) + (val.penaltyInterestAmount || 0);
      acc.amount += val.principleAmount || 0;
      acc.interest += val.interestAmount || 0;
      acc.penaltyInterest += val.penaltyInterestAmount || 0;
      return acc;
    },
    { payedTotal: 0, amount: 0, interest: 0, penaltyInterest: 0 }
  ) : { payedTotal: 0, amount: 0, interest: 0, penaltyInterest: 0 };

  // Prepare payment data array with total row at the end
  const paymentDataArray = [
    ...earlyPayments.map(val => ({
      date: new Date(val.date).toLocaleDateString("en-CA"),
      payedTotal:
        val.principleAmount +
        val.interestAmount +
        val.penaltyInterestAmount,
      amount: val.principleAmount,
      interest: val.interestAmount || "-",
      penaltyInterest: val.penaltyInterestAmount || "-",
    })),
    earlyPayments.length > 0 ? {
      date: 'එකතුව',
      payedTotal: formatCurrency(paymentTotals.payedTotal),
      amount: formatCurrency(paymentTotals.amount),
      interest: formatCurrency(paymentTotals.interest),
      penaltyInterest: formatCurrency(paymentTotals.penaltyInterest)
    } : null
  ].filter(Boolean);

  const loanColumns = [
    { id: "date", label: "ණය වු දිනය", minWidth: 50 },
    { id: "id", label: "අංකය", minWidth: 50 },
    { id: "remaining", label: "ඉතිරි මුදල", minWidth: 50 },
    { id: "interest", label: "පොලිය", minWidth: 50 },
    { id: "penaltyInterest", label: "දඩ පොලිය", minWidth: 50 },
    { id: "installment", label: "වාරිකය", minWidth: 50 },
    { id: "due", label: "මුළු මුදල", minWidth: 50, align: "right" },
  ]
  const paymentColumns = [
    { id: "date", label: "දිනය", minWidth: 50 },
    { id: "payedTotal", label: "මුළු මුදල", minWidth: 50 },
    { id: "amount", label: "ණය මුදල", minWidth: 50 },
    { id: "interest", label: "පොලිය", minWidth: 50 },
    { id: "penaltyInterest", label: "දඩ පොලිය", minWidth: 50 },
  ]

  const handleAuthStateChange = ({ isAuthenticated, roles }) => {
    setIsAuthenticated(isAuthenticated)
    setRoles(roles)
    if (!isAuthenticated) {
      navigate("/login/user-login")
    }
  }

  useEffect(() => {
    setLoading(true)
    api
      .get(`${baseUrl}/member/myLoan`)
      .then(res => {
        setLoan(res.data.loan)
        setCalculatedInterest(res.data.calculatedInterest)
        setEarlyPayments(res.data.groupedPayments)
        setError("")
      })
      .catch(error => {
        setError("Loan data not found or failed to load.")
        setLoan(null)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout>
      <AuthComponent onAuthStateChange={handleAuthStateChange} />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" align="center" sx={{ mb: 3, fontWeight: "bold" }}>
          ඔබගේ ණය තොරතුරු
        </Typography>
        {loading && (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 6 }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2, color: "#666" }}>
              ණය තොරතුරු පූරණය වේ...
            </Typography>
          </Box>
        )}
        {error && !loading && (
          <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
        )}
        {!loading && !error && !loan && (
          <Paper elevation={2} sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
            <Typography variant="h6" color="textSecondary">
              ඔබට ලියාපදිංචි ණය තොරතුරු නොමැත
            </Typography>
          </Paper>
        )}
        {!loading && loan && (
          <>
            {/* Loan Summary Card */}
            <Card elevation={4} sx={{ mb: 4, borderRadius: 3 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      ණය අංකය: {loan.loanNumber}
                    </Typography>
                    {/* <Chip
                      label={loan.status === 'active' ? 'සක්‍රීය' : 'අවසන්'}
                      color={loan.status === 'active' ? 'success' : 'default'}
                      sx={{ mt: 1 }}
                    /> */}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      <strong>ඉතිරි ණය මුදල:</strong> {formatCurrency(loan.loanRemainingAmount)}
                    </Typography>
                    <Typography variant="body1">
                      <strong>ණය වාරිකය:</strong> {calculatedInterest?.installment ? formatCurrency(calculatedInterest.installment) : 0}
                    </Typography>
                    <Typography variant="body1">
                      <strong>පොලිය:</strong> {calculatedInterest?.int ? formatCurrency(calculatedInterest.int) : 0}
                    </Typography>
                    <Typography variant="body1">
                      <strong>දඩ පොලිය:</strong> {calculatedInterest?.penInt ? formatCurrency(calculatedInterest.penInt) : 0}
                    </Typography>
                    <Typography variant="body1">
                      <strong>මුළු මුදල:</strong> {(calculatedInterest?.installment ? formatCurrency(calculatedInterest.installment) :0) + (calculatedInterest?.penInt ? formatCurrency(calculatedInterest.penInt) : 0) + (calculatedInterest?.int ? formatCurrency(calculatedInterest.int) : 0)}
                    </Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" color="textSecondary">
                  <strong>ඇපකරු1:</strong> {loan?.guarantor1Id?.member_id} / {loan?.guarantor1Id?.name}, {loan?.guarantor1Id?.mobile}
                  <br />
                  <strong>ඇපකරු2:</strong> {loan?.guarantor2Id?.member_id} / {loan?.guarantor2Id?.name}, {loan?.guarantor2Id?.mobile}
                </Typography>
              </CardContent>
            </Card>

            {/* Payment History Card */}
            <Card elevation={2} sx={{ mb: 4, borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                  ණය ආපසු ගෙවීම්
                </Typography>
                <StickyHeadTable
                  columnsArray={paymentColumns}
                  dataArray={paymentDataArray}
                />
              </CardContent>
            </Card>
          </>
        )}
      </Container>
    </Layout>
  )
}
