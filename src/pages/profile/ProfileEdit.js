import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Grid2, Alert, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Axios from "axios";

import Layout from "../../components/layout";

export default function ProfileEdit() {
  const [memberData, setMemberData] = useState({
    password: "",
    confirmPassword: "",
    mobile: "",
    whatsApp: "",
    email: "",
    address: "",
  });

  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle confirm password visibility

  useEffect(() => {
    // Fetch current member data from API
    const token = localStorage.getItem("authToken");

    Axios.get("http://localhost:3001/member/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        console.log('response.data :', response.data);
        setMemberData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching member data:", error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMemberData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (memberData.password !== memberData.confirmPassword) {
      setPasswordError("Passwords do not match!");
      return;
    }

    const { confirmPassword, ...dataToUpdate } = memberData; // Remove confirmPassword from the data to send

    const token = localStorage.getItem("authToken");

    Axios.put("http://localhost:3001/member/profile", dataToUpdate, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        setFeedback({
          type: "success",
          message: "Profile updated successfully!",
        });
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        setFeedback({
          type: "error",
          message: "Failed to update profile. Please try again.",
        });
      });
  };

  // Toggle password visibility
  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  // Clear password field on focus
  const handleFocus = (e) => {
    const { name } = e.target;
    if (name === "password" || name === "confirmPassword") {
      setMemberData((prev) => ({ ...prev, [name]: "" }));
    }
  };

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
          Edit Profile
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
          <Grid2 item size={12}>
            <TextField
              fullWidth
              label="New Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={memberData.password}
              onChange={handleInputChange}
              onFocus={handleFocus}
              placeholder="Enter new password"
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
          <Grid2 item size={12}>
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={memberData.confirmPassword}
              onChange={handleInputChange}
              onFocus={handleFocus}
              placeholder="Confirm your password"
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
          <Grid2 item size={12}>
            <TextField
              fullWidth
              label="Mobile Number"
              name="mobile"
              type="text"
              value={memberData.mobile}
              onChange={handleInputChange}
              placeholder="Enter mobile number"
            />
          </Grid2>
          <Grid2 item size={12}>
            <TextField
              fullWidth
              label="whatsApp Number"
              name="whatsApp"
              type="text"
              value={memberData.whatsApp}
              onChange={handleInputChange}
              placeholder="Enter whatsApp number"
            />
          </Grid2>
          <Grid2 item size={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="text"
              value={memberData.email}
              onChange={handleInputChange}
              placeholder="Enter email"
            />
          </Grid2>
          <Grid2 item size={12}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              type="text"
              value={memberData.address}
              onChange={handleInputChange}
              placeholder="Enter address"
              multiline
              rows={3}
            />
          </Grid2>
          <Grid2 item size={12} sx={{ textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{ textTransform: "none" }}
            >
              Update Profile
            </Button>
          </Grid2>
        </Grid2>
      </Box>
    </Layout>
  );
}
