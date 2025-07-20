import React, { useState } from "react"
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Alert,
  Snackbar,
  Paper,
  Grid2,
} from "@mui/material"
import Layout from "../../components/layout"
import StickyHeadTable from "../../components/StickyHeadTable"
import { navigate } from "gatsby"
import api from "../../utils/api"

//un authorized access preventing
import loadable from "@loadable/component"
const AuthComponent = loadable(() =>
  import("../../components/common/AuthComponent")
)

const baseUrl = process.env.GATSBY_API_BASE_URL

export default function SearchByArea() {
  //un authorized access preventing
  const [roles, setRoles] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" })
  const [loading, setLoading] = useState(false)
  const [selectedArea, setSelectedArea] = useState("")
  const [searchedArea, setSearchedArea] = useState("")
  const [members, setMembers] = useState([])
  const [searchPerformed, setSearchPerformed] = useState(false)

  const handleAuthStateChange = ({ isAuthenticated, roles }) => {
    setIsAuthenticated(isAuthenticated)
    setRoles(roles)
    if (!roles.includes("vice-secretary")) {
      navigate("/login/user-login")
    }
  }

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false })
  }

  const showAlert = (message, severity = "success") => {
    setAlert({ open: true, message, severity })
  }

  const areas = [
    "අලුත්වතු ගංගොඩ",
    "වලව් ගංගොඩ 1",
    "වලව් ගංගොඩ 2",
    "ගොඩවිටිගෙදර",
    "කහඹිලියාව",
    "කොලොන්ගස්යාය",
    "මහවතු ගංගොඩ 1",
    "මහවතු ගංගොඩ 2",
    "මැද ගංගොඩ",
    "වැව ඉහළ",
  ]

  // Table columns definition
  const columnsArray = [
    { id: "member_id", label: "සාමාජික අංකය", minWidth: 80 },
    { id: "name", label: "නම", minWidth: 150 },
    { id: "mobile", label: "ජංගම දුරකථනය", minWidth: 120 },
    { id: "whatsApp", label: "WhatsApp", minWidth: 120 },
    { id: "status", label: "තත්වය", minWidth: 100 },
  ]

  const handleSearch = async () => {
    if (!selectedArea) {
      showAlert("කරුණාකර ප්‍රදේශයක් තෝරන්න", "error")
      return
    }

    setLoading(true)
    setSearchPerformed(true)
    setSearchedArea(selectedArea) // Set the searched area when search is performed

    try {
      const response = await api.get(`${baseUrl}/member/searchByArea?area=${encodeURIComponent(selectedArea)}`)
      
      if (response.data.success) {
        setMembers(response.data.members || [])
        if (response.data.members.length === 0) {
          showAlert(`"${selectedArea}" ප්‍රදේශයේ සාමාජිකයන් හමු නොවිය`, "info")
        } else {
          showAlert(`"${selectedArea}" ප්‍රදේශයේ සාමාජිකයන් ${response.data.members.length} දෙනෙකු හමුවිය`, "success")
        }
      }
    } catch (error) {
      console.error("Error searching members:", error)
      const errorMessage = error.response?.data?.error || "සාමාජිකයන් සෙවීමේදී දෝෂයක් සිදුවිය"
      showAlert(errorMessage, "error")
      setMembers([])
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setSelectedArea("")
    setSearchedArea("")
    setMembers([])
    setSearchPerformed(false)
  }

  // Map member data for table display
  const tableData = members.map(member => ({
    member_id: member.member_id,
    name: member.name,
    mobile: member.mobile || "-",
    whatsApp: member.whatsApp || "-",
    address: member.address || "-",
    status: {
      "regular": "සාමාන්‍ය",
      "funeral-free": "අවමංගල්‍ය වැඩවලින් නිදහස්",
      "attendance-free": "පැමිණීමෙන් නිදහස්",
      "free": "නිදහස්",
    }[member.status] || member.status,
  }))

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
            maxWidth: "1200px",
            margin: "20px auto",
            padding: "20px",
          }}
        >
          <Typography
            variant="h5"
            sx={{ marginBottom: "20px", textAlign: "center" }}
          >
            ප්‍රදේශය අනුව සාමාජිකයන් සෙවීම
          </Typography>

          {/* Search Section */}
          <Paper elevation={3} sx={{ padding: "20px", marginBottom: "20px" }}>
            <Grid2 container spacing={3} alignItems="center">
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  fullWidth
                  select
                  label="ප්‍රදේශය තෝරන්න"
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                >
                  {areas.map((area) => (
                    <MenuItem key={area} value={area}>
                      {area}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid2>
              
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                <Box sx={{ display: "flex", gap: "10px" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSearch}
                    disabled={loading}
                    sx={{ textTransform: "none" }}
                  >
                    {loading ? "සොයමින්..." : "සොයන්න"}
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleClear}
                    disabled={loading}
                    sx={{ textTransform: "none" }}
                  >
                    මකන්න
                  </Button>
                </Box>
              </Grid2>
            </Grid2>
          </Paper>

          {/* Results Section */}
          {searchPerformed && (
            <Paper elevation={3} sx={{ padding: "20px" }}>
              <Typography variant="h6" sx={{ marginBottom: "15px" }}>
                සෙවුම් ප්‍රතිඵල
                {searchedArea && ` - ${searchedArea}`}
                {members.length > 0 && ` (${members.length} දෙනා)`}
              </Typography>
              
              {members.length > 0 ? (
                <StickyHeadTable
                  columnsArray={columnsArray}
                  dataArray={tableData}
                  headingAlignment="left"
                  dataAlignment="left"
                  totalRow={false}
                  hidePagination={false}
                />
              ) : (
                <Box
                  sx={{
                    textAlign: "center",
                    padding: "40px",
                    color: "text.secondary",
                  }}
                >
                  <Typography variant="body1">
                    {searchedArea 
                      ? `"${searchedArea}" ප්‍රදේශයේ සාමාජිකයන් හමු නොවිය`
                      : "සෙවුම් ප්‍රතිඵල මෙහි පෙන්වනු ඇත"
                    }
                  </Typography>
                </Box>
              )}
            </Paper>
          )}
        </Box>
      </section>
    </Layout>
  )
}
