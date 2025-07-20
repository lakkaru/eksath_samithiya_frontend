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

export default function SearchByName() {
  //un authorized access preventing
  const [roles, setRoles] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" })
  const [loading, setLoading] = useState(false)
  const [searchName, setSearchName] = useState("")
  const [searchedName, setSearchedName] = useState("")
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

  // Table columns definition
  const columnsArray = [
    { id: "member_id", label: "සාමාජික අංකය", minWidth: 80 },
    { id: "name", label: "නම", minWidth: 150 },
    { id: "relationship", label: "සම්බන්ධතාවය", minWidth: 120 },
    { id: "area", label: "ප්‍රදේශය", minWidth: 120 },
    { id: "mobile", label: "ජංගම දුරකථනය", minWidth: 120 },
    { id: "whatsApp", label: "WhatsApp", minWidth: 120 },
    { id: "status", label: "තත්වය", minWidth: 100 },
  ]

  const handleSearch = async () => {
    if (!searchName.trim()) {
      showAlert("කරුණාකර නමක් ඇතුලත් කරන්න", "error")
      return
    }

    setLoading(true)
    setSearchPerformed(true)
    setSearchedName(searchName.trim())

    try {
      const response = await api.get(`${baseUrl}/member/searchByName?name=${encodeURIComponent(searchName.trim())}`)
      
      if (response.data.success) {
        setMembers(response.data.members || [])
        if (response.data.members.length === 0) {
          showAlert(`"${searchName.trim()}" නමට ගැලපෙන සාමාජිකයන් හමු නොවිය`, "info")
        } else {
          const memberCount = response.data.members.length
          showAlert(`"${searchName.trim()}" නමට ගැලපෙන සාමාජිකයන්/යැපෙන්නන් ${memberCount} පවුලකින් හමුවිය`, "success")
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
    setSearchName("")
    setSearchedName("")
    setMembers([])
    setSearchPerformed(false)
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  // Map member data for table display - create separate rows for members and dependents
  const tableData = []
  
  members.forEach(member => {
    const statusTranslation = {
      "regular": "සාමාන්‍ය",
      "funeral-free": "අවමංගල්‍ය වැඩවලින් නිදහස්",
      "attendance-free": "පැමිණීමෙන් නිදහස්",
      "free": "නිදහස්",
    }[member.status] || member.status

    // Add member row only if member name matches
    if (member.matchInfo?.memberNameMatches) {
      tableData.push({
        member_id: member.member_id,
        name: member.name,
        relationship: "සාමාජිකයා",
        area: member.area || "-",
        mobile: member.mobile || "-",
        whatsApp: member.whatsApp || "-",
        status: statusTranslation,
      })
    }

    // Add only the matching dependents (not all dependents)
    if (member.matchInfo?.matchingDependents && member.matchInfo.matchingDependents.length > 0) {
      member.matchInfo.matchingDependents.forEach(matchingDep => {
        // Find the full dependent info from the member's dependents array
        const fullDependent = member.dependents.find(dep => dep.name === matchingDep.name)
        
        tableData.push({
          member_id: member.member_id,
          name: matchingDep.name,
          relationship: matchingDep.relationship || "යැපෙන්නා",
          area: member.area || "-", // Dependents inherit member's area
          mobile: "-", // Dependents don't have their own contact info
          whatsApp: "-",
          status: fullDependent?.dateOfDeath ? "මියගිය" : "ජීවත්",
        })
      })
    }
  })

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
            නම අනුව සාමාජිකයන් සෙවීම (සාමාජිකයන් සහ යැපෙන්නන්)
          </Typography>

          {/* Search Section */}
          <Paper elevation={3} sx={{ padding: "20px", marginBottom: "20px" }}>
            <Grid2 container spacing={3} alignItems="center">
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  fullWidth
                  label="සාමාජිකයාගේ නම හෝ යැපෙන්නාගේ නම"
                  placeholder="නමේ කොටසක් ටයිප් කරන්න..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
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
                {searchedName && ` - "${searchedName}"`}
                {tableData.length > 0 && ` (${tableData.length} ප්‍රතිඵල)`}
              </Typography>
              
              {tableData.length > 0 ? (
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
                    {searchedName 
                      ? `"${searchedName}" නමට ගැලපෙන සාමාජිකයන් හමු නොවිය`
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
