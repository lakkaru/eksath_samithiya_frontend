import React, { useState, useEffect } from "react"
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid2,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"
// import Axios from "axios"
import api from "../../utils/api"
// import { navigate } from "gatsby"

import Layout from "../../components/layout"
import { navigate } from "gatsby"

const baseUrl = process.env.GATSBY_API_BASE_URL
// const token = localStorage.getItem("authToken")
// let token = null;

// if (typeof window !== "undefined") {
//   token = localStorage.getItem("authToken");
// }

export default function ProfileEdit() {
  const [memberData, setMemberData] = useState({
    password: "",
    confirmPassword: "",
    mobile: "",
    whatsApp: "",
    email: "",
    address: "",
  })

  const [feedback, setFeedback] = useState({ type: "", message: "" })
  const [passwordError, setPasswordError] = useState("")
  const [showPassword, setShowPassword] = useState(false) // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false) // State to toggle confirm password visibility

  useEffect(() => {
    // Fetch current member data from API
    api
      .get(`${baseUrl}/member/profile`)
      .then(response => {
        // console.log("response.data :", response.data)
        setMemberData(prev => ({
          ...prev,
          mobile: response.data.mobile || "",
          whatsApp: response.data.whatsApp || "",
          email: response.data.email || "",
          address: response.data.address || "",
        }))
      })
      .catch(error => {
        console.error("Error fetching member data:", error)
      })
  }, [])

  const handleInputChange = e => {
    const { name, value } = e.target
    setMemberData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    if (memberData.password !== memberData.confirmPassword) {
      setPasswordError("Passwords do not match!")
      return
    }

    const { confirmPassword, ...dataToUpdate } = memberData // Remove confirmPassword from the data to send
    api
      .put(`${baseUrl}/member/profile`, dataToUpdate)
      .then(() => {
        navigate("/member/home")
        setFeedback({
          type: "success",
          message: "අලුත් තොරතුරු සාර්ථකව ඇතුලත් කරන ලදී !",
        })
      })
      .catch(error => {
        console.error("Error updating profile:", error)
        setFeedback({
          type: "error",
          message:
            "තොරතුරු ඇතුලත් කිරීම අසාර්ථක විය.  කරුණාකර නැවත උත්සහ කරන්න. ",
        })
      })
  }

  // Toggle password visibility
  const handleClickShowPassword = () => {
    setShowPassword(prev => !prev)
  }

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(prev => !prev)
  }

  // Clear password field on focus
  const handleFocus = e => {
    const { name } = e.target
    if (name === "password" || name === "confirmPassword") {
      setMemberData(prev => ({ ...prev, [name]: "" }))
    }
  }

  return (
    <Layout>
      <Box
        sx={{
          maxWidth: "600px",
          margin: "20px auto",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          background: "#fff",
        }}
      >
        <Typography
          variant="h5"
          sx={{ marginBottom: "20px", textAlign: "center" }}
        >
          සාමාජික තොරතුරු වෙනස් කිරීම
        </Typography>

        {feedback.message && (
          <Alert severity={feedback.type} sx={{ marginBottom: "20px" }}>
            {feedback.message}
          </Alert>
        )}

        {passwordError && (
          <Alert severity="error" sx={{ marginBottom: "20px" }}>
            {passwordError}
          </Alert>
        )}

        <Grid2 container spacing={3}>
          <Grid2 size={12}>
            <TextField
              fullWidth
              label="නව මුර පදය"
              name="password"
              type={showPassword ? "text" : "password"}
              value={memberData.password}
              onChange={handleInputChange}
              onFocus={handleFocus}
              placeholder="නව මුර පදය ඇතුලත් කරන්න"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid2>
          <Grid2 size={12}>
            <TextField
              fullWidth
              label="නව මුර පදය"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={memberData.confirmPassword}
              onChange={handleInputChange}
              onFocus={handleFocus}
              placeholder="නව මුර පදය තහවුරු කරන්න"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowConfirmPassword}>
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid2>
          <Grid2 size={12}>
            <TextField
              fullWidth
              label="ජංගම දුරකථන"
              name="mobile"
              type="text"
              value={memberData.mobile}
              onChange={handleInputChange}
              placeholder="ජංගම දුරකථන අංකය ඇතුලත් කරන්න"
            />
          </Grid2>
          <Grid2 size={12}>
            <TextField
              fullWidth
              label="WhatsApp අංකය"
              name="whatsApp"
              type="text"
              value={memberData.whatsApp}
              onChange={handleInputChange}
              placeholder="WhatsApp අංකය ඇතුලත් කරන්න"
            />
          </Grid2>
          <Grid2 size={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="text"
              value={memberData.email}
              onChange={handleInputChange}
              placeholder=" Email ඇතුලත් කරන්න"
            />
          </Grid2>
          <Grid2 size={12}>
            <TextField
              fullWidth
              label="ලිපිනය"
              name="address"
              type="text"
              value={memberData.address}
              onChange={handleInputChange}
              placeholder="ලිපිනය ඇතුලත් කරන්න"
              multiline
              rows={3}
            />
          </Grid2>
          <Grid2 size={12} sx={{ textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{ textTransform: "none" }}
            >
              නව තොරතුරු ඇතුලත් කරන්න
            </Button>
          </Grid2>
        </Grid2>
      </Box>
    </Layout>
  )
}
