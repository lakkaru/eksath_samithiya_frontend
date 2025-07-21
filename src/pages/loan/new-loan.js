import React, { useEffect, useState } from "react"
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Snackbar,
} from "@mui/material"
import Layout from "../../components/layout"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DemoContainer } from "@mui/x-date-pickers/internals/demo"
import dayjs from "dayjs"

import { navigate } from "gatsby"
import api from "../../utils/api"

//un authorized access preventing
import loadable from "@loadable/component"
const AuthComponent = loadable(() =>
  import("../../components/common/AuthComponent")
)
const baseUrl = process.env.GATSBY_API_BASE_URL
// const token = localStorage.getItem("authToken")
let token = null

if (typeof window !== "undefined") {
  token = localStorage.getItem("authToken")
}

export default function NewLoan() {
  //un authorized access preventing
  const [roles, setRoles] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [loading, setLoading] = useState(true) // Handle loading state
  const [error, setError] = useState(null)

  const [member_id, setMember_id] = useState("")
  const [member, setMember] = useState("")
  const [existingLoan, setExistingLoan] = useState(false)
  const [loanNumber, setLoanNumber] = useState("")
  const [loanAmount, setLoanAmount] = useState("")
  const [loanDate, setLoanDate] = useState(dayjs()) // Default to today
  const [guarantor1_id, setGuarantor1_id] = useState("")
  const [guarantor1, setGuarantor1] = useState("")
  const [guarantor2_id, setGuarantor2_id] = useState("")
  const [guarantor2, setGuarantor2] = useState("")

  const [alert, setAlert] = useState({ open: false, severity: "", message: "" }) // Alert state

  const handleCloseAlert = () =>
    setAlert({ open: false, severity: "", message: "" })

  const getMemberInfoById = async e => {
    try {
      await api
        .get(`${baseUrl}/loan/memberInfo/${member_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => {
          // console.log(response.data)
          setMember(response.data.member)
        })
        .catch(error => {
          setAlert({
            open: true,
            severity: "error",
            message: "No member Found.",
          })

          console.error("api error : ", error)
        })
    } catch (error) {
      // navigate('../404')
    }
  }

  const getGuarantor1ById = e => {
    // console.log("guarantor 1 :", guarantor1_id)
    api
      .get(`${baseUrl}/member/getMemberById/${guarantor1_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => {
        // console.log("gu1: ", response.data)
        const guarantorData = response?.data?.member
        setGuarantor1(guarantorData)
        // Check guarantor count after setting the guarantor - use the member's _id
        checkGuarantorCount(guarantorData?._id, guarantorData)
      })
      .catch(error => {
        console.error("api error : ", error)
        setAlert({
          open: true,
          severity: "error",
          message: "සාමාජික සෙවීමේදී දෝෂයක් සිදුවිය. කරුණාකර නැවත උත්සාහ කරන්න",
        })
        setGuarantor1({})
      })
  }
  const getGuarantor2ById = e => {
    api
      .get(`${baseUrl}/member/getMemberById/${guarantor2_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => {
        const guarantorData = response?.data?.member
        setGuarantor2(guarantorData)
        // Check guarantor count after setting the guarantor - use the member's _id
        checkGuarantorCount(guarantorData?._id, guarantorData)
      })
      .catch(error => {
        console.error("Axios error : ", error)
        setGuarantor2({})
      })
  }

  const checkGuarantorCount = async (memberId, guarantorData) => {
    try {
      const response = await api.get(`${baseUrl}/loan/active-loans`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      
      const activeLoans = response.data.activeLoans || []
      const guarantorCount = activeLoans.filter(loan => {
        const guarantor1Id = loan.guarantor1Id?._id || loan.guarantor1Id?.member_id || loan.guarantor1Id
        const guarantor2Id = loan.guarantor2Id?._id || loan.guarantor2Id?.member_id || loan.guarantor2Id
        return guarantor1Id === memberId || guarantor2Id === memberId
      }).length

      // Update the guarantor object with count
      guarantorData.guarantorCount = guarantorCount

      if (guarantorCount >= 2) {
        setAlert({
          open: true,
          severity: "warning",
          message: `මෙම සාමාජිකයා දැනටමත් ${guarantorCount} ණය සඳහා ඇපකරුවෙකු වේ. තවත් ණයකට ඇපකරුවෙකු වීමට නොහැක.`,
        })
      }
    } catch (error) {
      console.error("Error checking guarantor count:", error)
    }
  }

  const handleApply = () => {
    if (!member?._id) {
      console.error("Member ID is missing. Cannot proceed with loan creation.")
      return
    }

    if (!guarantor1_id || !guarantor2_id) {
      console.error("Both guarantor IDs are required.")
      return
    }

    const postData = {
      memberId: member._id, // Use member's ObjectId here
      guarantor1Id: guarantor1._id,
      guarantor2Id: guarantor2._id,
      loanNumber,
      loanAmount,
      loanRemainingAmount: loanAmount,
      loanDate: loanDate.toISOString(), // Ensure ISO format for the date
    }

    api
      .post(`${baseUrl}/loan/create`, postData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => {
        console.log("Loan recorded successfully:", response.data)

        setAlert({
          open: true,
          severity: "success",
          message: "නව ණයක් සාර්ථකව සටහන් කර ඇත.",
        })
        // Reset form fields
        setLoanNumber("")
        setLoanAmount("")
        setLoanDate(dayjs())
        setGuarantor1_id("")
        setGuarantor1("")
        setGuarantor2_id("")
        setGuarantor2("")
      })
      .catch(error => {
        console.error("Error recording loan:", error)
        const errorMessage = error.response?.data?.message || "නව ණයක් සටහන් කිරීමට නොහැකි විය"
        setAlert({
          open: true,
          severity: "error",
          message: errorMessage,
        })
      })

    // Clear all fields
    resetFields()
  }

  const resetFields = () => {
    setMember_id("")
    setMember("")
    setExistingLoan(false)
    setLoanNumber("")
    setLoanAmount("")
    setLoanDate(dayjs())
    setGuarantor1_id("")
    setGuarantor1("")
    setGuarantor2_id("")
    setGuarantor2("")
  }

  //un authorized access preventing
  const handleAuthStateChange = ({ isAuthenticated, roles }) => {
    setIsAuthenticated(isAuthenticated)
    setRoles(roles)
    if (!isAuthenticated || !roles.includes("loan-treasurer")) {
      navigate("/login/user-login")
    }
  }

useEffect(()=>{
  const blacklistMembers = async () => {
    // console.log('first')
    try {
      const blacklisted = await api.get(`${baseUrl}/member/blacklist`)
      console.log("blacklisted: ", blacklisted.data)
    } catch (err) {
      console.error("Error fetching attendance data:", err)
    } finally {
      setLoading(false)
    }
  }
  blacklistMembers()
},[])

  // console.log('existingLoan: ', existingLoan)
  return (
    <Layout>
      <AuthComponent onAuthStateChange={handleAuthStateChange} />
      <section>
        <Snackbar
          open={alert.open}
          autoHideDuration={3000}
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
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            padding: "20px",
            gap: "50px",
          }}
        >
          <Typography>අයදුම්කරු </Typography>
          <TextField
            id="outlined-basic"
            label="සාමාජික අංකය"
            variant="outlined"
            type="number"
            value={member_id}
            onChange={e => {
              setMember_id(e.target.value)
              setMember({})
            }}
            // onBlur={getMemberById}
            onFocus={resetFields}
          />
          <Button variant="contained" onClick={getMemberInfoById}>
            සොයන්න
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography>{member.name}</Typography>
          <Typography>{member.area}</Typography>
          <Typography>{member.mobile}</Typography>
          {/* <Typography>{member.res_tel}</Typography> */}
        </Box>
        <hr style={{ padding: "2px", marginTop: "10px" }}></hr>
        {existingLoan && (
          <Box>
            <Typography> {member.name} සතුව දැනට ණයක් ඇත.</Typography>
          </Box>
        )}
        {Object.keys(member).length > 0 && !existingLoan && (
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                padding: "20px",
                gap: "50px",
              }}
            >
              {/* <Typography>Member ID</Typography> */}
              <TextField
                id="guarantor1_id"
                label="ඇපකරු 1 අංකය"
                variant="outlined"
                type="number"
                value={guarantor1_id}
                onChange={e => setGuarantor1_id(e.target.value)}
                onBlur={getGuarantor1ById}
              />
              <Button variant="contained" onClick={getGuarantor1ById}>
                සොයන්න
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                minHeight: "50px", // Prevent layout shifting
              }}
            >
              <Typography>{guarantor1.name}</Typography>
              <Typography>{guarantor1.area}</Typography>
              <Typography>{guarantor1.mobile}</Typography>
              {guarantor1.name && (
                <Typography 
                  sx={{ 
                    color: (guarantor1.guarantorCount || 0) >= 2 ? "#d32f2f" : "#2e7d32",
                    fontWeight: "bold"
                  }}
                >
                  ඇප අත්සන් කර ඇති ණය: {guarantor1.guarantorCount || 0}
                </Typography>
              )}
              {/* <Typography>{guarantor1.res_tel}</Typography> */}
            </Box>
            <hr></hr>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                padding: "20px",
                gap: "50px",
              }}
            >
              {/* <Typography>Member ID</Typography> */}
              <TextField
                id="guarantor2_id"
                label="ඇපකරු 2 අංකය"
                variant="outlined"
                type="number"
                value={guarantor2_id}
                onChange={e => setGuarantor2_id(e.target.value)}
                onBlur={getGuarantor2ById}
              />
              <Button variant="contained" onClick={getGuarantor2ById}>
                සොයන්න
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                minHeight: "50px", // Prevent layout shifting
              }}
            >
              <Typography>{guarantor2.name}</Typography>
              <Typography>{guarantor2.area}</Typography>
              <Typography>{guarantor2.mobile}</Typography>
              {guarantor2.name && (
                <Typography 
                  sx={{ 
                    color: (guarantor2.guarantorCount || 0) >= 2 ? "#d32f2f" : "#2e7d32",
                    fontWeight: "bold"
                  }}
                >
                  ඇප අත්සන් කර ඇති ණය: {guarantor2.guarantorCount || 0}
                </Typography>
              )}
              {/* <Typography>{guarantor2.res_tel}</Typography> */}
            </Box>

            <hr style={{ padding: "2px", marginTop: "10px" }}></hr>
            <Box
              sx={{
                display: "flex",
                alignItems: "end",
                gap: 2,
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    label={"ණය දිනය"}
                    value={loanDate}
                    onChange={newValue => setLoanDate(newValue)} // Update state with dayjs object
                    format="YYYY/MM/DD" // Use the desired display format
                    maxDate={dayjs()}
                    sx={{}}
                  />
                </DemoContainer>
              </LocalizationProvider>
              <TextField
                id="loan_number"
                label="ණය අංකය"
                variant="outlined"
                type="number"
                value={loanNumber}
                onChange={e => setLoanNumber(e.target.value)}
              />
              <TextField
                id="loan_amount"
                label="ණය මුදල"
                variant="outlined"
                type="number"
                value={loanAmount}
                onChange={e => setLoanAmount(e.target.value)}
              />
            </Box>

            <hr style={{ padding: "2px", marginTop: "10px" }}></hr>
            <Box>
              <Button
                variant="contained"
                onClick={handleApply}
                disabled={
                  !loanAmount || !loanNumber || !guarantor1 || !guarantor2 ||
                  (guarantor1.guarantorCount || 0) >= 2 || (guarantor2.guarantorCount || 0) >= 2
                }
                sx={{ float: "right" }}
              >
                ආයදන්න
              </Button>
            </Box>
          </Box>
        )}
      </section>
    </Layout>
  )
}
