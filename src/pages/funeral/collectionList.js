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
  Grid,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material"
import {
  Print as PrintIcon,
} from "@mui/icons-material"
import Layout from "../../components/layout"
import AuthComponent from "../../components/common/AuthComponent"
import api from "../../utils/api"

const baseUrl = process.env.GATSBY_API_BASE_URL

export default function CollectionList() {
  const [members, setMembers] = useState([])
  const [selectedArea, setSelectedArea] = useState("")
  const [areas, setAreas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isViceSecretary, setIsViceSecretary] = useState(false)

  useEffect(() => {
    fetchAreas()
  }, [])

  const handleAuthStateChange = (authData) => {
    if (authData && authData.roles && authData.roles.includes("vice-secretary")) {
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

  const fetchMembersForCollection = async () => {
    if (!selectedArea) {
      setError("කරුණාකර ප්‍රදේශය තෝරන්න")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Get members for collection using the specialized endpoint
      const response = await api.get(`${baseUrl}/member/forCollection?area=${selectedArea}`)
      
      if (response.data.success) {
        setMembers(response.data.members)
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

  const handlePrint = () => {
    window.print()
  }

  const generatePrintContent = () => {
    return (
      <Box className="print-content" sx={{ display: 'none', '@media print': { display: 'block' } }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            විල්බාගෙදර එක්සත් අවමංගල්‍යාධාර සමිතිය
          </Typography>
          <Typography variant="h5" sx={{ mb: 2 }}>
            අතිරේක ද්‍රව්‍ය එකතු කිරීමේ ලැයිස්තුව
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ textAlign: 'left', mb: 3 }}>
            {/* <Typography variant="h6" sx={{ mb: 1 }}>
              <strong>සාමාජික අංකය: </strong> .............................
            </Typography>
            <Typography variant="h6" sx={{ mb: 1 }}>
              <strong>මියගිය අයගේ නම: </strong> ...............................................................................
            </Typography> */}
            <Typography variant="h6" sx={{ mb: 1 }}>
              <strong>ප්‍රදේශය: </strong> {selectedArea}
            </Typography>
            {/* <Typography variant="h6">
              <strong>දිනය: </strong> ........................../............../.........................
            </Typography> */}
          </Box>
        </Box>

        <TableContainer>
          <Table size="small" sx={{ border: '1px solid black' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ border: '1px solid black', textAlign: 'center', fontWeight: 'bold' }}>අංකය</TableCell>
                <TableCell sx={{ border: '1px solid black', textAlign: 'center', fontWeight: 'bold' }}>සා. අංකය</TableCell>
                <TableCell sx={{ border: '1px solid black', textAlign: 'center', fontWeight: 'bold' }}>නම</TableCell>
                <TableCell sx={{ border: '1px solid black', textAlign: 'center', fontWeight: 'bold' }}>දිනය</TableCell>
                <TableCell sx={{ border: '1px solid black', textAlign: 'center', fontWeight: 'bold' }}>සා. අංකය</TableCell>
                
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map((member, index) => (
                <TableRow key={member._id}>
                  <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>{index + 1}</TableCell>
                  <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>{member.member_id}</TableCell>
                  <TableCell sx={{ border: '1px solid black', textAlign: 'left', pl: 1 }}>{member.name}</TableCell>
                  <TableCell sx={{ border: '1px solid black', height: '40px', minWidth: '150px' }}></TableCell>
                  <TableCell sx={{ border: '1px solid black', height: '40px' }}></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>මුළු මුදල:</strong> .................................
            </Typography>
            <Typography variant="body1">
              <strong>මුළු පොල්:</strong> .............................
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2">
              ............................................................................. <br />
              එකතු කරන්නාගේ නම
            </Typography>
          </Box>
        </Box> */}
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
        <Box className="screen-content" sx={{ '@media print': { display: 'none' } }}>
          <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold', color: '#1976d2' }}>
            අතිරේක ද්‍රව්‍ය එකතු කිරීමේ ලැයිස්තුව
          </Typography>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <FormControl fullWidth>
                  <InputLabel>ප්‍රදේශය තෝරන්න</InputLabel>
                  <Select
                    value={selectedArea}
                    label="ප්‍රදේශය තෝරන්න"
                    onChange={(e) => setSelectedArea(e.target.value)}
                  >
                    {areas.map((area) => (
                      <MenuItem key={area} value={area}>
                        {area}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <Button
                  variant="contained"
                  onClick={fetchMembersForCollection}
                  disabled={!selectedArea || loading}
                  sx={{ mr: 2, height: '56px' }}
                  fullWidth
                >
                  {loading ? <CircularProgress size={24} /> : 'ලැයිස්තුව ජනනය කරන්න'}
                </Button>
              </Grid>

              {members.length > 0 && (
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<PrintIcon />}
                    onClick={handlePrint}
                    fullWidth
                  >
                    මුද්‍රණය කරන්න
                  </Button>
                </Grid>
              )}
            </Grid>
          </Paper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {members.length > 0 && (
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                ප්‍රදර්ශන ලැයිස්තුව ({members.length} සාමාජිකයින්)
              </Typography>
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>අංකය</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>සාමාජික අංකය</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>නම</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>ප්‍රදේශය</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {members.slice(0, 10).map((member, index) => (
                      <TableRow key={member._id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{member.member_id}</TableCell>
                        <TableCell>{member.name}</TableCell>
                        <TableCell>{member.area}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {members.length > 10 && (
                <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
                  සහ තවත් {members.length - 10} සාමාජිකයින්... (සම්පූර්ණ ලැයිස්තුව මුද්‍රණය කිරීමේදී පෙන්නුම් කෙරේ)
                </Typography>
              )}
            </Paper>
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
            .print-content, .print-content * {
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
