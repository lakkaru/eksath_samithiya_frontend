import React, { useState } from "react"
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
// import Axios from "axios"
import api from '../../utils/api'
// import { navigate } from "gatsby"

const baseUrl = process.env.GATSBY_API_BASE_URL
// const token = localStorage.getItem("authToken")
let token = null;

if (typeof window !== "undefined") {
  token = localStorage.getItem("authToken");
}


export default function NewLoan() {
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
      await api.get(`${baseUrl}/loan/memberInfo/${member_id}`, {
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
    api.get(`${baseUrl}/member/getMemberById/${guarantor1_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => {
        // console.log("gu1: ", response.data)
        setGuarantor1(response?.data?.member)
      })
      .catch(error => {
        console.error("api error : ", error)
        setAlert({
          open: true,
          severity: "error",
          message: "Error on member searching. Please try again",
        })
      })
  }
  const getGuarantor2ById = e => {
    api.get(`${baseUrl}/member/getMemberById/${guarantor2_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => {
        setGuarantor2(response?.data?.member)
      })
      .catch(error => {
        console.error("Axios error : ", error)
      })
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

    api.post(`${baseUrl}/loan/create`, postData, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => {
        console.log("Loan recorded successfully:", response.data)

        setAlert({
          open: true,
          severity: "success",
          message: "New Loan has recorded successfully.",
        })
        // Reset form fields
        setLoanNumber("")
        setLoanAmount("")
        setLoanDate(dayjs())
        setGuarantor1_id("")
        setGuarantor2_id("")
      })
      .catch(error => {
        console.error("Error recording loan:", error)
        setAlert({
          open: true,
          severity: "error",
          message: "New Loan has did not recorded",
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
  // console.log('existingLoan: ', existingLoan)
  return (
    <Layout>
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
            label="Member ID"
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
            Search
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
            <Typography> {member.name} is having an ongoing loan.</Typography>
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
                label="Guarantor_1 ID"
                variant="outlined"
                type="number"
                value={guarantor1_id}
                onChange={e => setGuarantor1_id(e.target.value)}
                onBlur={getGuarantor1ById}
              />
              <Button variant="contained" onClick={getGuarantor1ById}>
                Search
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
                label="Guarantor_2 ID"
                variant="outlined"
                type="number"
                value={guarantor2_id}
                onChange={e => setGuarantor2_id(e.target.value)}
                onBlur={getGuarantor2ById}
              />
              <Button variant="contained" onClick={getGuarantor2ById}>
                Search
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
                    label={"Loan Date"}
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
                label="Loan Number"
                variant="outlined"
                type="number"
                value={loanNumber}
                onChange={e => setLoanNumber(e.target.value)}
              />
              <TextField
                id="loan_amount"
                label="Loan Amount"
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
                  !loanAmount || !loanNumber || !guarantor1 || !guarantor2
                }
                sx={{ float: "right" }}
              >
                Apply
              </Button>
            </Box>
          </Box>
        )}
      </section>
    </Layout>
  )
}
