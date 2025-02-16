import React, { useState, useEffect } from "react"
import { navigate } from "gatsby"

import api from "../../utils/api"
import Layout from "../../components/layout"
import { Box, Button, Snackbar, TextField, Typography } from "@mui/material"
import AuthComponent from "../../components/common/AuthComponent"
import StickyHeadTable from "../../components/StickyHeadTable"
// import { useMember } from "../../context/MemberContext"
const baseUrl = process.env.GATSBY_API_BASE_URL

export default function MemberLoan() {
  //un authorized access preventing
  const [roles, setRoles] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [loan, setLoan] = useState(null)
  const [earlyPayments, setEarlyPayments] = useState([])
  const [calculatedInterest, setCalculatedInterest] = useState(null)
  //   const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(false)

  const loanColumns = [
    { id: "date", label: "ණය වු දිනය", minWidth: 50 },
    { id: "id", label: "අංකය", minWidth: 50 },
    // { id: "amount", label: "Loan Amount", minWidth: 50 },
    { id: "remaining", label: "ඉතිරි මුදල", minWidth: 50 },
    { id: "interest", label: "පොලිය", minWidth: 50 },
    { id: "penaltyInterest", label: "දඩ පොලිය", minWidth: 50 },
    { id: "installment", label: "වාරිකය", minWidth: 50 },
    { id: "due", label: "මුළු මුදල", minWidth: 50, align: "right" },
  ]
  const paymentColumns = [
    { id: "date", label: "දිනය", minWidth: 50 },
    { id: "payedTotal", label: "මුළු මුදල", minWidth: 50 },
    { id: "amount", label: "ණය මුදල", minWidth: 50 },
    { id: "interest", label: "පොලිය", minWidth: 50 },
    { id: "penaltyInterest", label: "දඩ පොලිය", minWidth: 50 },
    { id: "actions", label: "", minWidth: 50 },
  ]
  // const { memberData } = useMember()
  // console.log('memberData: ', memberData)
  //un authorized access preventing
  const handleAuthStateChange = ({ isAuthenticated, roles }) => {
    setIsAuthenticated(isAuthenticated)
    setRoles(roles)
    if (!isAuthenticated ) {
      navigate("/login/user-login")
    }
  }

  useEffect(() => {
    api
      .get(`${baseUrl}/member/myLoan`)
      .then(res => {
        console.log("res: ", res.data)
        setLoan(res.data.loan)
        setCalculatedInterest(res.data.calculatedInterest)
        setEarlyPayments(res.data.groupedPayments)
      })
      .catch(error => {
        console.error("Error getting member loan:", error)
      })
  }, [])

  return (
    <Layout>
      <AuthComponent onAuthStateChange={handleAuthStateChange} />
      <section>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            padding: 2,
          }}
        >
          {/* <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <TextField
            label="Member ID"
            value={memberInputId}
            onChange={handleIdChange}
            sx={{ maxWidth: "100px" }}
          />
          <Button
            variant="contained"
            onClick={() => handleSearch(paymentDate)}
          >
            Loan Search
          </Button>
        </Box> */}
          {/* {loan && ( */}
            {/* // <Box sx={{ display: "flex", justifyContent: "space-between" }}> */}
              <Typography sx={{ fontSize: ".8rem" }}>
                ඇපකරු1:- {loan?.guarantor1Id.member_id} /{" "}
                {loan?.guarantor1Id.name}, {loan?.guarantor1Id.mobile}
              </Typography>
              <Typography sx={{ fontSize: ".8rem" }}>
                ඇපකරු2:- {loan?.guarantor2Id.member_id} /{" "}
                {loan?.guarantor2Id.name}, {loan?.guarantor2Id.mobile}
              </Typography>
            {/* </Box> */}
          {/* )} */}
        </Box>

        {loading && <Typography>Loading...</Typography>}
        {/* {!loading && member && !loan && (
          <Typography>No loan found for {member.name}.</Typography>
        )} */}
        {/* {!loading && loan && (
          <Typography sx={{ fontSize: ".8rem" }}>
            ණයකරු:- {member?.member_id} / {member?.name} / {member?.area} /{" "}
            {member?.mobile}
          </Typography>
        )} */}

        {!loading && loan && (
          <>
            <StickyHeadTable
              columnsArray={loanColumns}
              dataArray={[
                {
                  date: new Date(loan.loanDate).toLocaleDateString("en-CA"),
                  id: loan.loanNumber,
                  // amount: loan.loanAmount,
                  remaining: loan.loanRemainingAmount || "-",
                  interest: calculatedInterest.int || "-",
                  penaltyInterest: calculatedInterest.penInt || "-",
                  installment: calculatedInterest.installment || "",
                  due: loan.loanRemainingAmount+calculatedInterest.int+calculatedInterest.penInt || "-",
                },
              ]}
            />
            <hr></hr>
          <Typography>ණය ආපසු ගෙවීම් </Typography>
          <StickyHeadTable 
            columnsArray={paymentColumns}
            dataArray={earlyPayments.map(val => ({
              date: new Date(val.date).toLocaleDateString("en-CA"),
              payedTotal:
                val.principleAmount +
                val.interestAmount +
                val.penaltyInterestAmount,
              amount: val.principleAmount,
              interest: val.interestAmount || "-",
              penaltyInterest: val.penaltyInterestAmount || "-",
              // actions: (
              //   <Button
              //     variant="contained"
              //     color="error"
              //     onClick={() => handleDeletePayment(val._id)}
              //   >
              //     Delete
              //   </Button>
              // ),
            }))} 
            /> 
            {/* <Box sx={{ marginTop: 2, padding: 2, border: "1px solid #ccc" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Payment Date"
                value={paymentDate}
                onChange={handleDateChange}
                format="YYYY/MM/DD"
              />
            </LocalizationProvider>
            <TextField
              label="Payment Amount"
              type="number"
              value={paymentAmount}
              onChange={e => {
                setPaymentAmount(e.target.value)
                calculatePaymentSplit(e.target.value)
              }}
              sx={{ mx: "20px" }}
            />
            <Typography>
              Paying Penalty Interest: Rs. {payingPenaltyInterest}
            </Typography>
            <Typography>Paying Interest: Rs. {payingInterest}</Typography>
            <Typography>Paying Principal: Rs. {payingPrincipal}</Typography>
            <Button
              variant="contained"
              onClick={handleLoanPayment}
              disabled={
                parseFloat(paymentAmount) <
                loan.interest + loan.penaltyInterest
              }
            >
              Pay
            </Button>
          </Box>*/}
          </>
        )}
        {/* <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Payment recorded successfully"
      /> */}
      </section>
    </Layout>
  )
}
