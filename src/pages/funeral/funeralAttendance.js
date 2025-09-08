import React, { useState, useEffect } from "react"
import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  Alert,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress
} from "@mui/material"
import Layout from "../../components/layout"

import FuneralAttChart from "../../components/common/FuneralAttChart"

import { navigate } from "gatsby"
import api from "../../utils/api"
import { getFineSettings } from "../../utils/settingsHelper"
import loadable from "@loadable/component"
const AuthComponent = loadable(() =>
  import("../../components/common/AuthComponent")
)

const baseUrl = process.env.GATSBY_API_BASE_URL

export default function FuneralAttendance() {
  // Authentication
  const [roles, setRoles] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Member and funeral data
  const [totalMembers, setTotalMembers] = useState(0)
  const [memberId, setMemberId] = useState("")
  const [memberIds, setMemberIds] = useState([])
  const [memberIdMap, setMemberIdMap] = useState({})
  const [attendance, setAttendance] = useState([])
  const [member, setMember] = useState({})
  const [deceasedOptions, setDeceasedOptions] = useState([])
  const [selectedDeceased, setSelectedDeceased] = useState("")
  const [funeralId, setFuneralId] = useState("")
  const [currentFuneral, setCurrentFuneral] = useState(null)
  const [originalAbsents, setOriginalAbsents] = useState([])

  // UI states
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [hasChanges, setHasChanges] = useState(false)
  
  // Fine settings
  const [fineSettings, setFineSettings] = useState({
    funeralAttendanceFine: 100,
    funeralWorkFine: 1000,
    cemeteryWorkFine: 1000
  })

  const handleAuthStateChange = ({ isAuthenticated, roles }) => {
    console.log("Auth state change:", { isAuthenticated, roles })
    setIsAuthenticated(isAuthenticated)
    setRoles(roles)
    if (!isAuthenticated || !(roles.includes("vice-secretary") || roles.includes("treasurer") || roles.includes("auditor"))) {
      console.log("Access denied: not authenticated or insufficient roles")
      navigate("/login/user-login")
    }
  }

  useEffect(() => {
    if (!isAuthenticated || !(roles.includes("vice-secretary") || roles.includes("treasurer") || roles.includes("auditor"))) {
      console.log("Waiting for authentication...")
      return
    }

    console.log("Fetching data for authenticated user...")
    
    // Fetch fine settings first
    const loadFineSettings = async () => {
      try {
        const settings = await getFineSettings()
        setFineSettings(settings)
      } catch (error) {
        console.error("Error fetching fine settings:", error)
        // Keep default values if fetch fails
      }
    }
    loadFineSettings()
    
    // Getting number of members
    api
      .get(`${baseUrl}/member/getNextId`)
      .then(response => {
        console.log("Next Id : ", response.data.nextMemberId)
        setTotalMembers(response?.data?.nextMemberId - 1 || "Not Available")
      })
      .catch(error => {
        console.log("Error fetching next ID: ", error)
      })

    api
      .get(`${baseUrl}/member/getMemberIdsForFuneralAttendance`)
      .then(response => {
        console.log("Member IDs response:", response.data)
        const ids = response.data.memberIds || []
        setMemberIds(ids)
        const idMap = {}
        ids.forEach(id => {
          idMap[id] = true
        })
        setMemberIdMap(idMap)
      })
      .catch(error => {
        console.error("Error fetching member IDs for funeral attendance:", error)
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.log("Authentication failed, redirecting to login")
          navigate("/login/user-login")
        }
      })
  }, [isAuthenticated, roles])

  const getMemberById = e => {
    console.log("search:", memberId)
    setLoading(true)
    setError("")
    setSuccess("")
    
    api
      .get(`${baseUrl}/member/getMembershipDeathById?member_id=${memberId}`)
      .then(response => {
        console.log(response?.data?.data)
        const data = response?.data?.data || {}
        setMember(data.member || {})

        // Prepare deceased options
        const deceased = []
        if (data.member?.dateOfDeath) {
          deceased.push({
            name: data.member.name,
            id: "member",
            isMember: true,
          })
        }
        data.dependents.forEach(dependent => {
          if (dependent.dateOfDeath) {
            deceased.push({
              name: dependent.name,
              id: dependent._id,
              isMember: false,
            })
          }
        })
        setDeceasedOptions(deceased)
        
        if (deceased.length === 0) {
          setError("මෙම සාමාජිකයා සඳහා මරණ සටහන් නොමැත")
        }
      })
      .catch(error => {
        console.error("Axios error: ", error)
        setError("සාමාජික තොරතුරු ලබා ගැනීමේදී දෝෂයක් ඇති විය")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleSelectChange = event => {
    setSelectedDeceased(event.target.value)
    setError("")
    setSuccess("")
    
    let deceased_id
    if (event.target.value === "member") {
      deceased_id = member._id
    } else {
      deceased_id = event.target.value
    }
    
    setLoading(true)
    api
      .get(`${baseUrl}/funeral/getFuneralId?deceased_id=${deceased_id}`)
      .then(response => {
        console.log("funeral Id response: ", response.data)
        let funeralIdData = response.data
        
        // Ensure we have a string ID, not an object
        if (typeof funeralIdData === 'object' && funeralIdData._id) {
          funeralIdData = funeralIdData._id
        }
        
        // Validate that we have a valid ID
        if (!funeralIdData || funeralIdData === 'undefined' || funeralIdData === 'null') {
          throw new Error("අවමංගල්‍ය උත්සවයේ ID ලබා ගත නොහැකි විය")
        }
        
        setFuneralId(funeralIdData)
        
        // Load existing attendance data for this funeral
        return api.get(`${baseUrl}/funeral/getFuneralById/${funeralIdData}`)
      })
      .then(response => {
        const funeral = response.data.funeral
        setCurrentFuneral(funeral)
        setOriginalAbsents([...(funeral.eventAbsents || [])])
        setHasChanges(false)
        console.log("Current funeral data:", funeral)
      })
      .catch(error => {
        console.error("Error fetching funeral data:", error)
        setError("අවමංගල්‍ය තොරතුරු ලබා ගැනීමේදී දෝෂයක් ඇති විය")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const saveAttendance = ({ absentMemberIds }) => {
    console.log("Absent received:", absentMemberIds, funeralId)
    
    if (!funeralId) {
      setError("අවමංගල්‍ය උත්සවයක් තෝරන්න")
      return
    }

    // Check if there are changes
    const currentAbsents = absentMemberIds.sort()
    const originalAbsentsSorted = originalAbsents.sort()
    const hasActualChanges = JSON.stringify(currentAbsents) !== JSON.stringify(originalAbsentsSorted)
    
    if (!hasActualChanges) {
      setError("කිසිම වෙනස්කමක් නොමැත")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")
    
    const absentData = { funeral_id: funeralId, absentArray: absentMemberIds }
    
    api
      .post(`${baseUrl}/funeral/funeralAbsents`, { absentData })
      .then(response => {
        console.log(response.data)
        const { finesAdded = 0, finesRemoved = 0, excludedFromFines = 0 } = response.data
        
        let successMsg = "අවමංගල්‍ය පැමිණීම සාර්ථකව යාවත්කාලීන කරන ලදී"
        
        if (finesAdded > 0 && finesRemoved > 0) {
          successMsg += ` (දඩ ${finesAdded}ක් එකතු කර ${finesRemoved}ක් ඉවත් කරන ලදී)`
        } else if (finesAdded > 0) {
          successMsg += ` (දඩ ${finesAdded}ක් එකතු කරන ලදී)`
        } else if (finesRemoved > 0) {
          successMsg += ` (දඩ ${finesRemoved}ක් ඉවත් කරන ලදී)`
        }
        
        if (excludedFromFines > 0) {
          successMsg += ` (වැඩ පැවරුම් සහිත සාමාජිකයන් ${excludedFromFines} දෙනෙකු දඩයෙන් හැර ගන්නා ලදී)`
        }
        
        setSuccess(successMsg)
        setOriginalAbsents([...absentMemberIds])
        setHasChanges(false)
        
        // Scroll to top to show success message and updated information
        window.scrollTo({ top: 0, behavior: 'smooth' })
        
        // Clear success message after 5 seconds
        setTimeout(() => setSuccess(""), 5000)
        
        // Update current funeral data
        setCurrentFuneral(prev => ({
          ...prev,
          eventAbsents: absentMemberIds
        }))
      })
      .catch(error => {
        console.error("Axios error: ", error)
        setError(error.response?.data?.message || "පැමිණීම සුරැකීමේදී දෝෂයක් ඇති විය")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const resetForm = () => {
    setMember({})
    setMemberId("")
    setDeceasedOptions([])
    setSelectedDeceased("")
    setFuneralId("")
    setCurrentFuneral(null)
    setOriginalAbsents([])
    setHasChanges(false)
    setError("")
    setSuccess("")
  }

  const handleMemberIdFocus = () => {
    // When user focuses on member ID field, clear all funeral-related data
    // This ensures clean state when searching for a new member
    if (funeralId || currentFuneral) {
      setMember({})
      setDeceasedOptions([])
      setSelectedDeceased("")
      setFuneralId("")
      setCurrentFuneral(null)
      setOriginalAbsents([])
      setHasChanges(false)
      setError("")
      setSuccess("")
    }
  }

  // Calculate fine-eligible absent members (excluding assigned workers and removed members)
  const calculateFineEligibleAbsents = () => {
    if (!currentFuneral || !currentFuneral.eventAbsents) return { 
      count: 0, 
      totalFine: 0, 
      totalAbsents: 0, 
      excludedCount: 0,
      breakdown: { cemetery: 0, funeral: 0, removed: 0 }
    }
    
    const eventAbsents = currentFuneral.eventAbsents || []
    
    // Get members who should be excluded from fines
    const cemeteryAssignedIds = (currentFuneral.cemeteryAssignments || []).map(assignment => assignment.member_id)
    const funeralAssignedIds = (currentFuneral.funeralAssignments || []).map(assignment => assignment.member_id)
    const removedMemberIds = (currentFuneral.removedMembers || []).map(member => member.member_id)
    
    const excludedFromFines = [
      ...cemeteryAssignedIds,
      ...funeralAssignedIds,
      ...removedMemberIds
    ]
    
    // Count only absent members who are eligible for fines
    const fineEligibleAbsents = eventAbsents.filter(memberId => !excludedFromFines.includes(memberId))
    const fineAmount = fineSettings.funeralAttendanceFine
    
    // Calculate breakdown of excluded members
    const cemeteryExcluded = eventAbsents.filter(memberId => cemeteryAssignedIds.includes(memberId)).length
    const funeralExcluded = eventAbsents.filter(memberId => funeralAssignedIds.includes(memberId)).length
    const removedExcluded = eventAbsents.filter(memberId => removedMemberIds.includes(memberId)).length
    
    return {
      count: fineEligibleAbsents.length,
      totalFine: fineEligibleAbsents.length * fineAmount,
      totalAbsents: eventAbsents.length,
      excludedCount: eventAbsents.length - fineEligibleAbsents.length,
      breakdown: {
        cemetery: cemeteryExcluded,
        funeral: funeralExcluded,
        removed: removedExcluded
      }
    }
  }

  return (
    <Layout>
      <AuthComponent onAuthStateChange={handleAuthStateChange} />
      <section>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, textAlign: "center" }}>
          අවමංගල්‍ය උත්සව පැමිණීම
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {/* Member Search Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                padding: "20px",
                gap: "20px",
                flexWrap: "wrap"
              }}
            >
              <Typography>සාමාජික අංකය</Typography>
              <TextField
                id="outlined-basic"
                label="Member ID"
                variant="outlined"
                type="number"
                value={memberId}
                onChange={e => setMemberId(e.target.value)}
                onFocus={handleMemberIdFocus}
                disabled={loading}
              />
              <Button 
                variant="contained" 
                onClick={getMemberById}
                disabled={loading || !memberId}
              >
                {loading ? <CircularProgress size={24} /> : "Search"}
              </Button>
              <Button 
                variant="outlined" 
                onClick={resetForm}
                disabled={loading}
              >
                Reset
              </Button>
            </Box>

            {member._id && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  සාමාජික තොරතුරු
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography><strong>නම:</strong> {member.name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography><strong>ප්‍රදේශය:</strong> {member.area}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography><strong>ජංගම දුරකථනය:</strong> {member.mob_tel}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography><strong>නිවසේ දුරකථනය:</strong> {member.res_tel}</Typography>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3 }}>
                  <Select
                    value={selectedDeceased}
                    onChange={handleSelectChange}
                    fullWidth
                    displayEmpty
                    disabled={loading || deceasedOptions.length === 0}
                  >
                    <MenuItem value="" disabled>
                      මියගිය අය තෝරන්න
                    </MenuItem>
                    {deceasedOptions.map(option => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.isMember ? `${option.name} (සාමාජිකයා)` : `${option.name} (යැපෙන්නෙකු)`}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Funeral Information */}
        {currentFuneral && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                අවමංගල්‍ය තොරතුරු
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>දිනය:</strong> {new Date(currentFuneral.date).toLocaleDateString('si-LK')}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>සාමාජිකයා:</strong> {currentFuneral.member_id?.name}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography><strong>මුළු නොපැමිණි සාමාජිකයන්:</strong> {calculateFineEligibleAbsents().totalAbsents}</Typography>
                  <Typography><strong>දඩයට යෝග්‍ය නොපැමිණි සාමාජිකයන්:</strong> {calculateFineEligibleAbsents().count}</Typography>
                  {calculateFineEligibleAbsents().excludedCount > 0 && (
                    <>
                      <Typography color="info.main" sx={{ fontSize: '0.9rem', mt: 1 }}>
                        <strong>දඩයෙන් හැර ගත් සාමාජිකයන්:</strong> {calculateFineEligibleAbsents().excludedCount}
                      </Typography>
                      <Box sx={{ ml: 2, fontSize: '0.85rem' }}>
                        {calculateFineEligibleAbsents().breakdown.cemetery > 0 && (
                          <Typography color="text.secondary">
                            • සුසන භූමි වැඩ: {calculateFineEligibleAbsents().breakdown.cemetery}
                          </Typography>
                        )}
                        {calculateFineEligibleAbsents().breakdown.funeral > 0 && (
                          <Typography color="text.secondary">
                            • අවමංගල්‍ය වැඩ: {calculateFineEligibleAbsents().breakdown.funeral}
                          </Typography>
                        )}
                        {calculateFineEligibleAbsents().breakdown.removed > 0 && (
                          <Typography color="text.secondary">
                            • ඉවත් කළ සාමාජිකයන්: {calculateFineEligibleAbsents().breakdown.removed}
                          </Typography>
                        )}
                      </Box>
                    </>
                  )}
                  <Typography color="error" sx={{ fontSize: '0.9rem', mt: 1 }}>
                    <strong>දඩ මුදල (එක් අයෙකු සඳහා):</strong> රු. {process.env.GATSBY_FUNERAL_ATTENDANCE_FINE_VALUE || 100}
                  </Typography>
                  <Typography color="error" sx={{ fontSize: '0.9rem' }}>
                    <strong>මුළු දඩ මුදල:</strong> රු. {calculateFineEligibleAbsents().totalFine}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Only show the attendance chart when a funeral is selected and loaded */}
        {funeralId && currentFuneral && (
          <FuneralAttChart
            chartName={"Funeral Attendance"}
            saveAttendance={saveAttendance}
            initialAbsents={originalAbsents}
            funeralId={funeralId}
            loading={loading}
          />
        )}

        {/* Show helpful message when no funeral is selected */}
        {!funeralId && (
          <Card sx={{ mt: 3, textAlign: 'center', py: 4 }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                අවමංගල්‍ය පැමිණීම සටහන් කිරීම සඳහා
              </Typography>
              <Typography color="text.secondary">
                කරුණාකර ඉහත සාමාජික අංකයක් ඇතුළත් කර "Search" ක්ලික් කරන්න
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                ඉන්පසු මියගිය පුද්ගලයා තෝරන්න
              </Typography>
            </CardContent>
          </Card>
        )}
      </section>
    </Layout>
  )
}
