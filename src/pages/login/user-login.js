import React, { useState } from "react"
import Layout from "../../components/layout"
import { Box, Button, TextField, Alert, Typography } from "@mui/material"
import DownloadIcon from '@mui/icons-material/Download';
// import Axios from "axios"
import { navigate } from "gatsby" // Import navigate
import api from '../../utils/api'

const baseUrl = process.env.GATSBY_API_BASE_URL

export default function UserLogin() {
  const [member_id, setMember_id] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("ඔබගේ තොරතුරු ඇතුල් කරන්න.") // Default message
  const [isLoading, setIsLoading] = useState(false) // Loading state for button

  // Function to handle login
  const getAuthentication = e => {
    // console.log('Login Page')
    const credentials = { member_id, password }
    setIsLoading(true) // Show loading indicator

    api.post(`${baseUrl}/auth/login`, credentials)
      .then(response => {
        // console.log(response)
        localStorage.setItem("authToken", response.data.token)
        setError("") // Clear error on success
        navigate("/member/home") // Redirect to index page after login
      })
      .catch(error => {
        setIsLoading(false) // Hide loading indicator
        console.error("Axios error:", error)
        setError("සාමාජික අංකයට මුරපදය නොගැලපේ.") // Set error message
      })
  }

  // Disable login button until both fields are filled
  const isFormValid = member_id && password

  // Clear input fields on focus if error occurred
  const handleFocus = e => {
    error === "සාමාජික අංකයට මුරපදය නොගැලපේ."
      ? setError("නැවත උත්සහ කරන්න.")
      : setError("ඔබගේ තොරතුරු ඇතුල් කරන්න.") // Clear error on focus
    if (e.target.name === "member_id") {
      setMember_id("") // Clear member_id field
    } else if (e.target.name === "password") {
      setPassword("") // Clear password field
    }
  }

  // Handle Enter key press
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      getAuthentication(); // Trigger login when Enter is pressed
    }
  };

  return (
    <Layout>
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)' }}>
        <Box sx={{ width: { xs: '95%', sm: 400 }, mx: 'auto', mt: { xs: 6, sm: 12 } }}>
          <Box sx={{ boxShadow: 6, borderRadius: 4, bgcolor: 'white', p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ bgcolor: '#1976d2', borderRadius: '50%', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <DownloadIcon sx={{ color: 'white', fontSize: 36 }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
                පරිශීලක පිවිසුම
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                ඔබගේ සාමාජික අංකය සහ මුරපදය ඇතුල් කරන්න
              </Typography>
            </Box>
            <Box sx={{ width: '100%', mb: 2 }}>
              <Alert severity={error === "සාමාජික අංකයට මුරපදය නොගැලපේ." ? "error" : "info"} sx={{ fontSize: '0.95em', borderRadius: 2 }}>
                {error}
              </Alert>
            </Box>
            <TextField
              id="outlined-member-id"
              label="සාමාජික අංකය"
              variant="outlined"
              type="number"
              name="member_id"
              value={member_id}
              onChange={e => setMember_id(e.target.value)}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
              fullWidth
              sx={{ mb: 2, borderRadius: 2 }}
              InputProps={{ sx: { fontSize: '1.1em', borderRadius: 2 } }}
            />
            <TextField
              id="outlined-password"
              label="මුරපදය"
              variant="outlined"
              type="password"
              name="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
              fullWidth
              sx={{ mb: 3, borderRadius: 2 }}
              InputProps={{ sx: { fontSize: '1.1em', borderRadius: 2 } }}
            />
            <Button
              color="primary"
              variant="contained"
              onClick={getAuthentication}
              disabled={!isFormValid || isLoading}
              fullWidth
              sx={{ py: 1.5, fontWeight: 'bold', fontSize: '1.1em', borderRadius: 2, boxShadow: 2, background: 'linear-gradient(135deg, #1976d2 0%, #388eea 100%)' }}
            >
              {isLoading ? "පිවිසෙමින්..." : "පිවිසෙන්න"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Layout>
  )
}
