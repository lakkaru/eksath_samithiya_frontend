import React, { useState } from "react"
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid2,
  Alert,
  Snackbar
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { navigate } from "gatsby"

import Layout from "../../components/layout"
import AuthComponent from "../../components/common/AuthComponent"
import api from "../../utils/api"

const baseUrl = process.env.GATSBY_API_BASE_URL

export default function AddIncome() {
  const [roles, setRoles] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" })

  // Form data
  const [formData, setFormData] = useState({
    date: new Date(),
    category: "",
    description: "",
    amount: "",
    source: ""
  })

  // Income category definitions
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

  const otherIncomeCategories = [
    "වෙනත් ආදායම්",
    "විශේෂ ඉසව්"
  ]

  const allCategories = [...serviceIncomeCategories, ...financialIncomeCategories, ...donationCategories, ...otherIncomeCategories]

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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    const { date, category, amount, description, source } = formData

    if (!date || !category || !amount) {
      showAlert("දිනය, ප්‍රවර්ගය සහ මුදල අවශ්‍ය වේ", "error")
      return false
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      showAlert("වලංගු මුදල් ප්‍රමාණයක් ඇතුලත් කරන්න", "error")
      return false
    }

    const isServiceIncome = serviceIncomeCategories.includes(category)
    const isDonation = donationCategories.includes(category)

    if (isServiceIncome) {
      if (!description.trim()) {
        showAlert("සේවා ආදායම් සඳහා විස්තරය අවශ්‍ය වේ", "error")
        return false
      }
    } else if (isDonation) {
      if (!source.trim()) {
        showAlert("පරිත්‍යාග සඳහා ප්‍රභවය අවශ්‍ය වේ", "error")
        return false
      }
    } else {
      if (!description.trim()) {
        showAlert("විස්තරය අවශ්‍ය වේ", "error")
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setSubmitting(true)
    
    try {
      const response = await api.post(`${baseUrl}/account/income`, {
        date: formData.date.toISOString(),
        category: formData.category,
        description: formData.description,
        amount: parseFloat(formData.amount),
        source: formData.source
      })

      if (response.data.success) {
        showAlert("ආදායම සාර්ථකව ඇතුලත් කරන ලදී", "success")
        // Reset form
        setFormData({
          date: new Date(),
          category: "",
          description: "",
          amount: "",
          source: ""
        })
      }
    } catch (error) {
      console.error("Error adding income:", error)
      showAlert("ආදායම ඇතුලත් කිරීමේදී දෝෂයක් සිදුවිය: " + (error.response?.data?.error || error.message), "error")
    } finally {
      setSubmitting(false)
    }
  }

  // Determine which fields to show based on category
  const isServiceIncome = serviceIncomeCategories.includes(formData.category)
  const isDonation = donationCategories.includes(formData.category)
  const isFinancialIncome = financialIncomeCategories.includes(formData.category)

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
        <Box sx={{ maxWidth: "800px", margin: "0 auto" }}>
          <Paper sx={{ padding: "30px", borderRadius: "10px" }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ textAlign: "center", marginBottom: "30px", color: "#2c3e50" }}
            >
              ආදායම් ඇතුලත් කරන්න
            </Typography>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <form onSubmit={handleSubmit}>
                <Grid2 container spacing={3}>
                  {/* Date */}
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <DatePicker
                      label="දිනය *"
                      value={formData.date}
                      onChange={(newValue) => handleInputChange("date", newValue)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true
                        },
                      }}
                    />
                  </Grid2>

                  {/* Category */}
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth required>
                      <InputLabel>ප්‍රවර්ගය</InputLabel>
                      <Select
                        value={formData.category}
                        label="ප්‍රවර්ගය"
                        onChange={(e) => handleInputChange("category", e.target.value)}
                      >
                        <MenuItem disabled>
                          <em>සේවා ආදායම්</em>
                        </MenuItem>
                        {serviceIncomeCategories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                        <MenuItem disabled>
                          <em>මූල්‍ය ආදායම්</em>
                        </MenuItem>
                        {financialIncomeCategories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                        <MenuItem disabled>
                          <em>පරිත්‍යාග</em>
                        </MenuItem>
                        {donationCategories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                        <MenuItem disabled>
                          <em>වෙනත්</em>
                        </MenuItem>
                        {otherIncomeCategories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid2>

                  {/* Amount */}
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      required
                      type="number"
                      label="මුදල (LKR)"
                      value={formData.amount}
                      onChange={(e) => handleInputChange("amount", e.target.value)}
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </Grid2>

                  {/* Source - for donations */}
                  {isDonation && (
                    <Grid2 size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        required
                        label="ප්‍රභවය / පරිත්‍යාග දෙන්නා"
                        value={formData.source}
                        onChange={(e) => handleInputChange("source", e.target.value)}
                        placeholder="සංවිධානය, පුද්ගලයා හෝ ආයතනය"
                      />
                    </Grid2>
                  )}

                  {/* Description */}
                  <Grid2 size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      required={!isDonation}
                      multiline
                      rows={3}
                      label="විස්තරය"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder={
                        isServiceIncome 
                          ? "කවුද, කුමන අවස්ථාවට, කී දිනකට ආදී විස්තර"
                          : isDonation
                          ? "පරිත්‍යාගයේ අරමුණ හෝ වෙනත් විස්තර (විකල්ප)"
                          : "ආදායමේ සම්පූර්ණ විස්තර"
                      }
                    />
                  </Grid2>

                  {/* Submit Button */}
                  <Grid2 size={{ xs: 12 }}>
                    <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={() => navigate("/account/view-income")}
                        disabled={submitting}
                      >
                        අවලංගු කරන්න
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={submitting}
                        sx={{ minWidth: "150px" }}
                      >
                        {submitting ? "ඇතුලත් කරමින්..." : "ඇතුලත් කරන්න"}
                      </Button>
                    </Box>
                  </Grid2>
                </Grid2>
              </form>
            </LocalizationProvider>
          </Paper>
        </Box>
      </section>

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
