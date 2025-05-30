import React, { useState } from "react"
import Layout from "../../components/layout"
import { Box, Button, TextField, Alert } from "@mui/material"
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
      <Box
        sx={{
          maxWidth: { xs: '100%', sm: '80%', md: '50%' },
          margin: "auto",
          border: "1px solid gray",
          borderRadius: "20px",
          padding: "15px",
        }}
      >
        {/* Error feedback container with fixed height */}
        <Box
          sx={{
            marginBottom: "20px",
            minHeight: "40px", // Minimum height for the error message container
          }}
        >
          <Alert
            severity={
              error === "සාමාජික අංකයට මුරපදය නොගැලපේ." ? "error" : "info"
            }
          >
            {error}
          </Alert>
        </Box>

        {/* Member ID field */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px",
          }}
        >
          {/* <Typography>සාමාජික අංකය</Typography> */}
          <TextField
            id="outlined-basic"
            label="සාමාජික අංකය"
            variant="outlined"
            type="number"
            name="member_id"
            value={member_id}
            onChange={e => setMember_id(e.target.value)}
            onFocus={handleFocus} // Clear the field on focus
            onKeyDown={handleKeyDown} // Listen for Enter key
          />
        </Box>

        {/* Password field */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px",
          }}
        >
          {/* <Typography>මුරපදය</Typography> */}
          <TextField
            id="outlined-basic"
            label="මුරපදය"
            variant="outlined"
            type="password"
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onFocus={handleFocus} // Clear the field on focus
            onKeyDown={handleKeyDown} // Listen for Enter key
          />
        </Box>

        {/* Login Button */}
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", padding: "20px" }}
        >
          <Button
            color="primary"
            variant="contained"
            onClick={getAuthentication}
            disabled={!isFormValid || isLoading} // Disable if form is invalid or loading
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </Box>
      </Box>
    </Layout>
  )
}
