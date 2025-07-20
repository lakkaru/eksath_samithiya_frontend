import React, { useState } from "react"
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Snackbar,
  Paper,
  Grid2,
  MenuItem,
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import Layout from "../../components/layout"
import { navigate } from "gatsby"
import api from "../../utils/api"

//un authorized access preventing
import loadable from "@loadable/component"
const AuthComponent = loadable(() =>
  import("../../components/common/AuthComponent")
)

const baseUrl = process.env.GATSBY_API_BASE_URL

export default function AddExpense() {
  //un authorized access preventing
  const [roles, setRoles] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" })
  const [loading, setLoading] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    date: new Date(),
    category: "",
    description: "",
    amount: "",
    paidTo: "",
    beneficiaryMemberId: "",
  })

  const expenseCategories = [
    "මරණ ප්‍රතිලාභ ගෙවීම්",
    "ක්ෂණික ප්‍රතිලාභ ගෙවීම්",
    "ද්‍රව්‍ය ආධාර හිග",
    "මළවුන් රැගෙන යාමේ ගාස්තු",
    "කූඩාරම් හසුරුවීම - කම්කරු ගාස්තු",
    "පිඟන් නිකුත් කිරීම",
    "පුටු නිකුත් කිරීම", 
    "බුෆේ සෙට් නිකුත් කිරීම",
    "ශබ්ද විකාශන හසුරුවීම",
    "මිලදී ගැනීම්",
    "කම්කරු ගාස්තු",
    "ප්‍රවාහන වියදම්",
    "කාර්යාල වියදම්",
    "සභා වියදම්",
    "නඩත්තු වියදම්",
    "සේවකයින්ගේ වැටුප්",
    "විදුලි බිල්පත්",
    "බැංකු තැන්පතු",
    "අනෙකුත්",
  ]

  // Categories that require beneficiaryMemberId but not description/paidTo
  const memberBenefitCategories = [
    "මරණ ප්‍රතිලාභ ගෙවීම්",
    "ක්ෂණික ප්‍රතිලාභ ගෙවීම්", 
    "මළවුන් රැගෙන යාමේ ගාස්තු",
    "ද්‍රව්‍ය ආධාර හිග"
  ]

  // Categories that require description but not paidTo (internal services)
  const serviceCategories = [
    "කූඩාරම් හසුරුවීම - කම්කරු ගාස්තු",
    "පිඟන් නිකුත් කිරීම",
    "පුටු නිකුත් කිරීම",
    "බුෆේ සෙට් නිකුත් කිරීම",
    "ශබ්ද විකාශන හසුරුවීම",
    "විදුලි බිල්පත්"
  ]

  const isMemberBenefitCategory = (category) => {
    return memberBenefitCategories.includes(category)
  }

  const isServiceCategory = (category) => {
    return serviceCategories.includes(category)
  }

  const handleAuthStateChange = ({ isAuthenticated, roles }) => {
    setIsAuthenticated(isAuthenticated)
    setRoles(roles)
    if (!roles.includes("treasurer")) {
      navigate("/login/user-login")
    }
  }

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false })
  }

  const showAlert = (message, severity = "success") => {
    setAlert({ open: true, message, severity })
  }

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    })
  }

  const handleDateChange = (newDate) => {
    setFormData({
      ...formData,
      date: newDate,
    })
  }

  const validateForm = () => {
    const errors = []

    // Always required fields
    if (!formData.date) errors.push("දිනය")
    if (!formData.category) errors.push("වියදම් වර්ගය")
    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) 
      errors.push("වලංගු මුදල")

    const isMemberBenefit = isMemberBenefitCategory(formData.category)
    const isService = isServiceCategory(formData.category)

    if (isMemberBenefit) {
      // For member benefit categories: require beneficiaryMemberId
      if (!formData.beneficiaryMemberId || parseInt(formData.beneficiaryMemberId) <= 0) {
        errors.push("ප්‍රතිලාභ ලබන සාමාජික අංකය")
      }
    } else if (isService) {
      // For service categories: require description only
      if (!formData.description.trim()) errors.push("විස්තරය")
    } else {
      // For other categories: require description and paidTo
      if (!formData.description.trim()) errors.push("විස්තරය")
      if (!formData.paidTo.trim()) errors.push("ගෙවන ලද තැන")
    }

    if (errors.length > 0) {
      showAlert(`කරුණාකර ${errors.join(", ")} ඇතුලත් කරන්න`, "error")
      return false
    }

    return true
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      const isMemberBenefit = isMemberBenefitCategory(formData.category)
      const isService = isServiceCategory(formData.category)
      
      const expenseData = {
        date: formData.date.toISOString(),
        category: formData.category,
        amount: parseFloat(formData.amount),
      }

      if (isMemberBenefit) {
        // For member benefit categories
        expenseData.beneficiaryMemberId = parseInt(formData.beneficiaryMemberId)
      } else if (isService) {
        // For service categories: only description needed
        expenseData.description = formData.description.trim()
      } else {
        // For other categories: both description and paidTo needed
        expenseData.description = formData.description.trim()
        expenseData.paidTo = formData.paidTo.trim()
      }

      const response = await api.post(`${baseUrl}/account/expense`, expenseData)

      if (response.data.success) {
        showAlert("වියදම සාර්ථකව ඇතුලත් කරන ලදී!", "success")
        
        // Reset form
        setFormData({
          date: new Date(),
          category: "",
          description: "",
          amount: "",
          paidTo: "",
          beneficiaryMemberId: "",
        })
      }
    } catch (error) {
      console.error("Error adding expense:", error)
      const errorMessage = error.response?.data?.error || "වියදම ඇතුලත් කිරීමේදී දෝෂයක් සිදුවිය"
      showAlert(errorMessage, "error")
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setFormData({
      date: new Date(),
      category: "",
      description: "",
      amount: "",
      paidTo: "",
      reference: "",
    })
  }

  return (
    <Layout>
      <AuthComponent onAuthStateChange={handleAuthStateChange} />
      <section>
        <Snackbar
          open={alert.open}
          autoHideDuration={6000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          sx={{ marginTop: "25vh" }}
        >
          <Alert onClose={handleCloseAlert} severity={alert.severity}>
            {alert.message}
          </Alert>
        </Snackbar>

        <Box
          sx={{
            maxWidth: "800px",
            margin: "20px auto",
            padding: "20px",
          }}
        >
          <Typography
            variant="h5"
            sx={{ marginBottom: "20px", textAlign: "center" }}
          >
            වියදම් ඇතුලත් කිරීම
          </Typography>

          <Paper elevation={3} sx={{ padding: "30px" }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <form onSubmit={handleSubmit}>
                <Grid2 container spacing={3}>
                  {/* Date */}
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <DatePicker
                      label="දිනය"
                      value={formData.date}
                      onChange={handleDateChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                        },
                      }}
                    />
                  </Grid2>

                  {/* Category */}
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      select
                      label="වියදම් වර්ගය"
                      value={formData.category}
                      onChange={handleInputChange("category")}
                      required
                    >
                      {expenseCategories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid2>

                  {/* Description - Only for non-member benefit categories */}
                  {!isMemberBenefitCategory(formData.category) && (
                    <Grid2 size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="විස්තරය"
                        multiline
                        rows={3}
                        value={formData.description}
                        onChange={handleInputChange("description")}
                        placeholder="වියදම සම්බන්ධයෙන් විස්තර ලියන්න..."
                        required
                      />
                    </Grid2>
                  )}

                  {/* Amount */}
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="මුදල (රු.)"
                      type="number"
                      value={formData.amount}
                      onChange={handleInputChange("amount")}
                      inputProps={{
                        min: 0,
                        step: 0.01,
                      }}
                      required
                    />
                  </Grid2>

                  {/* Paid To - Only for categories that are not member benefits or services */}
                  {!isMemberBenefitCategory(formData.category) && !isServiceCategory(formData.category) && (
                    <Grid2 size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="ගෙවන ලද තැන/පුද්ගලයා"
                        value={formData.paidTo}
                        onChange={handleInputChange("paidTo")}
                        placeholder="ගෙවීම් ලබන ආයතනය හෝ පුද්ගලයා"
                        required
                      />
                    </Grid2>
                  )}

                  {/* Beneficiary Member ID - Only for member benefit categories */}
                  {isMemberBenefitCategory(formData.category) && (
                    <Grid2 size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="ප්‍රතිලාභ ලබන සාමාජික අංකය"
                        type="number"
                        value={formData.beneficiaryMemberId}
                        onChange={handleInputChange("beneficiaryMemberId")}
                        placeholder="සාමාජික අංකය"
                        required
                        inputProps={{
                          min: 1,
                        }}
                      />
                    </Grid2>
                  )}

                  {/* Buttons */}
                  <Grid2 size={{ xs: 12 }}>
                    <Box sx={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "20px" }}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        sx={{ textTransform: "none", minWidth: "120px" }}
                      >
                        {loading ? "සුරකිමින්..." : "සුරකින්න"}
                      </Button>
                      <Button
                        type="button"
                        variant="outlined"
                        color="secondary"
                        onClick={handleClear}
                        disabled={loading}
                        sx={{ textTransform: "none", minWidth: "120px" }}
                      >
                        මකන්න
                      </Button>
                    </Box>
                  </Grid2>
                </Grid2>
              </form>
            </LocalizationProvider>
          </Paper>
        </Box>
      </section>
    </Layout>
  )
}
