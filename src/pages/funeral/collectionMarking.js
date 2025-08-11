import React, { useState, useEffect } from "react"
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid2,
  Divider,
  Alert,
  CircularProgress,
  TextField,
  Checkbox,
} from "@mui/material"
import { Print as PrintIcon } from "@mui/icons-material"
import Layout from "../../components/layout"
import AuthComponent from "../../components/common/AuthComponent"
import api from "../../utils/api"

const baseUrl = process.env.GATSBY_API_BASE_URL

export default function CollectionMarking() {
  const [members, setMembers] = useState([])
  const [selectedArea, setSelectedArea] = useState("")
  const [areas, setAreas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isViceSecretary, setIsViceSecretary] = useState(false)

  // Collection data
  const [collectionData, setCollectionData] = useState({})

  useEffect(() => {
    fetchAreas()
  }, [])

  const handleAuthStateChange = authData => {
    if (
      authData &&
      authData.roles &&
      authData.roles.includes("vice-secretary")
    ) {
      setIsViceSecretary(true)
    } else {
      setIsViceSecretary(false)
    }
  }

  const fetchAreas = async () => {
    try {
      const response = await api.get(`${baseUrl}/member/areas`)
      if (response.data.success) {
        setAreas(response.data.areas)
      }
    } catch (error) {
      console.error("Error fetching areas:", error)
      setError("ප්‍රදේශ තොරතුරු ලබා ගැනීමේදී දෝෂයක් සිදුවිය")
    }
  }

  const fetchMembersForMarking = async () => {
    if (!selectedArea) {
      setError("කරුණාකර ප්‍රදේශය තෝරන්න")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await api.get(
        `${baseUrl}/member/forCollectionMarking?area=${selectedArea}`
      )

      if (response.data.success) {
        setMembers(response.data.members)
        // Initialize collection data
        const initialData = {}
        response.data.members.forEach(member => {
          initialData[member._id] = {
            collected: false,
            money: "",
            coconut: "",
          }
        })
        setCollectionData(initialData)
      } else {
        setError("සාමාජිකයින් ලබා ගැනීමේදී දෝෂයක් සිදුවිය")
      }
    } catch (error) {
      console.error("Error fetching members:", error)
      setError("සාමාජිකයින් ලබා ගැනීමේදී දෝෂයක් සිදුවිය")
    } finally {
      setLoading(false)
    }
  }

  const handleCollectionChange = (memberId, field, value) => {
    setCollectionData(prev => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        [field]: value,
      },
    }))
  }

  const handlePrint = () => {
    window.print()
  }

  const calculateTotals = () => {
    const collected = members.filter(
      member => collectionData[member._id]?.collected
    )

    return {
      totalCollected: collected.length,
    }
  }

  const generatePrintContent = () => {
    const totals = calculateTotals()

    return (
      <Box
        className="print-content"
        sx={{ display: "none", "@media print": { display: "block" } }}
      >
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            විල්බාගෙදර එක්සත් අවමංගල්‍යාධාර සමිතිය
          </Typography>
          <Typography variant="h5" sx={{ mb: 2 }}>
            අතිරේක ආධාර සලකුණු කිරීම
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ textAlign: "left", mb: 3 , display:'flex'}}>
            <Box>
              <Typography variant="h6" sx={{ mb: 1 }}>
                <strong>සාමාජික අංකය:</strong> .............................
              </Typography>
              <Typography variant="h6" sx={{ mb: 1 }}>
                <strong>මියගිය පුද්ගලයාගේ නම:</strong>{" "}
                ................................................................
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ mb: 1 }}>
                <strong>ප්‍රදේශය:</strong> {selectedArea}
              </Typography>
              <Typography variant="h6">
                <strong>දිනය:</strong> .............................
              </Typography>
            </Box>
          </Box>
        </Box>

        <TableContainer>
          <Table size="small" sx={{ border: "1px solid black" }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    border: "1px solid black",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  අංකය
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid black",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  සා. අංකය
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid black",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  නම
                </TableCell>
                {/* <TableCell
                  sx={{
                    border: "1px solid black",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  එකතු කළා
                </TableCell> */}
                <TableCell
                  sx={{
                    border: "1px solid black",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  මුදල
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid black",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  පොල්
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map((member, index) => (
                <TableRow key={member._id}>
                  <TableCell
                    sx={{ border: "1px solid black", textAlign: "center" }}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid black", textAlign: "center" }}
                  >
                    {member.member_id}
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid black", textAlign: "left", pl: 1 }}
                  >
                    {member.name}
                  </TableCell>
                  {/* <TableCell
                    sx={{ border: "1px solid black", textAlign: "center" }}
                  >
                    {collectionData[member._id]?.collected ? "✓" : ""}
                  </TableCell> */}
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      textAlign: "center",
                      height: "40px",
                    }}
                  >
                    {collectionData[member._id]?.money || ""}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      textAlign: "center",
                      height: "40px",
                    }}
                  >
                    {collectionData[member._id]?.coconut || ""}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <Box sx={{ textAlign: "left" }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>මුළු මුදල:</strong> .................................
            </Typography>
            <Typography variant="body1">
              <strong>පොල් ගණන:</strong> .............................
            </Typography>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="body2">
              .............................................................................{" "}
              <br />
              එකතු කරන්නාගේ නම සහ අත්සන
            </Typography>
          </Box>
        </Box>
      </Box>
    )
  }

  if (!isViceSecretary) {
    return (
      <Layout>
        <AuthComponent onAuthStateChange={handleAuthStateChange} />
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Alert severity="error">
            මෙම පිටුවට ප්‍රවේශය උප ලේකම්වරුන්ට පමණක් සීමා වේ
          </Alert>
        </Container>
      </Layout>
    )
  }

  return (
    <Layout>
      <AuthComponent onAuthStateChange={handleAuthStateChange} />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Screen Content */}
        <Box
          className="screen-content"
          sx={{ "@media print": { display: "none" } }}
        >
          <Typography
            variant="h4"
            sx={{
              mb: 3,
              textAlign: "center",
              fontWeight: "bold",
              color: "#1976d2",
            }}
          >
            අතිරේක ආධාර සලකුණු කිරීමේ ලැයිස්තුව
          </Typography>

          {/* Area Selection */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 12, md: 8 }}>
                <FormControl fullWidth>
                  <InputLabel>ප්‍රදේශය තෝරන්න</InputLabel>
                  <Select
                    value={selectedArea}
                    label="ප්‍රදේශය තෝරන්න"
                    onChange={e => setSelectedArea(e.target.value)}
                  >
                    {areas.map(area => (
                      <MenuItem key={area} value={area}>
                        {area}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <Button
                  variant="contained"
                  onClick={fetchMembersForMarking}
                  disabled={!selectedArea || loading}
                  sx={{ height: "56px" }}
                  fullWidth
                >
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    "සාමාජිකයින් ලබා ගන්න"
                  )}
                </Button>
              </Grid2>
            </Grid2>
          </Paper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {members.length > 0 && (
            <>
              {/* Collection Marking Table */}
              <Paper sx={{ p: 2, mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">
                    සාමාජිකයින් ({members.length})
                  </Typography>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<PrintIcon />}
                    onClick={handlePrint}
                  >
                    මුද්‍රණය කරන්න
                  </Button>
                </Box>

                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableCell sx={{ fontWeight: "bold" }}>අංකය</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          සා. අංකය
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>නම</TableCell>
                        {/* <TableCell sx={{ fontWeight: "bold" }}>
                          එකතු කළා
                        </TableCell> */}
                        {/* <TableCell sx={{ fontWeight: "bold" }}>මුදල</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>පොල්</TableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {members.map((member, index) => (
                        <TableRow key={member._id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{member.member_id}</TableCell>
                          <TableCell>{member.name}</TableCell>
                          {/* <TableCell>
                            <Checkbox
                              checked={
                                collectionData[member._id]?.collected || false
                              }
                              onChange={e =>
                                handleCollectionChange(
                                  member._id,
                                  "collected",
                                  e.target.checked
                                )
                              }
                            />
                          </TableCell> */}
                          {/* <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              value={collectionData[member._id]?.money || ""}
                              onChange={e =>
                                handleCollectionChange(
                                  member._id,
                                  "money",
                                  e.target.value
                                )
                              }
                              disabled={!collectionData[member._id]?.collected}
                              sx={{ width: 80 }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              value={collectionData[member._id]?.coconut || ""}
                              onChange={e =>
                                handleCollectionChange(
                                  member._id,
                                  "coconut",
                                  e.target.value
                                )
                              }
                              disabled={!collectionData[member._id]?.collected}
                              sx={{ width: 80 }}
                            />
                          </TableCell> */}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Summary */}
                {/* <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    backgroundColor: "#f8f9fa",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    සාරාංශය
                  </Typography>
                  <Grid2 container spacing={2}>
                    <Grid2 size={{ xs: 12 }}>
                      <Typography>
                        <strong>එකතු කළ සාමාජිකයින්:</strong>{" "}
                        {calculateTotals().totalCollected}
                      </Typography>
                    </Grid2>
                  </Grid2>
                </Box> */}
              </Paper>
            </>
          )}
        </Box>

        {/* Print Content */}
        {generatePrintContent()}

        {/* Print Styles */}
        <style jsx global>{`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-content,
            .print-content * {
              visibility: visible;
            }
            .print-content {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            @page {
              margin: 1cm;
              size: A4;
            }
          }
        `}</style>
      </Container>
    </Layout>
  )
}
