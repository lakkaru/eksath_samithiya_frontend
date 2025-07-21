import React, { useEffect, useState, useCallback } from "react"
import Layout from "../../components/layout"
import { Box, Button, TextField, Typography, Snackbar } from "@mui/material"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import StickyHeadTable from "../../components/StickyHeadTable"
import dayjs from "dayjs"
import { useLocation } from "@reach/router"
import { navigate } from "gatsby"

import api from "../../utils/api"
//un authorized access preventing
import loadable from "@loadable/component"
const AuthComponent = loadable(() =>
  import("../../components/common/AuthComponent")
)


const baseUrl = process.env.GATSBY_API_BASE_URL
// const token = localStorage.getItem("authToken")
// let token = null

// if (typeof window !== "undefined") {
//   token = localStorage.getItem("authToken")
// }

export default function Search() {
  //un authorized access preventing
  const [roles, setRoles] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [memberInputId, setMemberInputId] = useState("")
  const [member, setMember] = useState(null)
  const [loan, setLoan] = useState(null)
  const [earlyPayments, setEarlyPayments] = useState([])
  const [paymentDate, setPaymentDate] = useState(dayjs())
  const [paymentAmount, setPaymentAmount] = useState("")
  const [payingPenaltyInterest, setPayingPenaltyInterest] = useState(0)
  const [payingInterest, setPayingInterest] = useState(0)
  const [payingPrincipal, setPayingPrincipal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const location = useLocation()
  const queryParams = new URLSearchParams(location?.search)
  const memberId = queryParams.get("memberId")

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

  //calculating interest for loan according to payment date
  const calculateInterest = (
    loanDate,
    remainingAmount,
    lastInterestPaymentDate,
    paymentDate
  ) => {
    if (!loanDate || !remainingAmount || !paymentDate)
      return { int: 0, penInt: 0 }
    // console.log("paymentDate: ", paymentDate)
    const loanDateObj = new Date(loanDate)
    const lastIntPayDateObj = new Date(lastInterestPaymentDate || loanDate)
    const currentDate = new Date(paymentDate)
    // console.log("currentDate :", currentDate)
    const monthlyInterestRate = 0.03
    const loanPeriodMonths = 10

    let totalMonths =
      (currentDate.getFullYear() - loanDateObj.getFullYear()) * 12 +
      (currentDate.getMonth() - loanDateObj.getMonth())
    //adding one month if loan date is exceed
    if (currentDate.getDate() - loanDateObj.getDate() > 0) {
      totalMonths = totalMonths + 1
    }
    //getting installment
    let loanInstallment=0
    console.log('totalMonths:', totalMonths)
    console.log('remainingAmount:', remainingAmount)
    if (totalMonths<=10) {
      loanInstallment=(totalMonths*1000)-(10000-remainingAmount)
      // console.log(loanInstallment)
    } else {
      loanInstallment=(remainingAmount)
      // console.log(loanInstallment)
    }

    
    // console.log("totalMonths :", totalMonths)
    // console.log('lastIntPayDateObj.getFullYear():',lastIntPayDateObj.getFullYear())
    // console.log('lastIntPayDateObj.getMonth():',lastIntPayDateObj.getMonth())
    // console.log('loanDateObj.getMonth():',loanDateObj.getMonth())
    let lastPaymentMonths =
      (lastIntPayDateObj.getFullYear() - loanDateObj.getFullYear()) * 12 +
      (lastIntPayDateObj.getMonth() - loanDateObj.getMonth())
    // //adding one month if loan date is exceed
    if ((lastIntPayDateObj.getDate() - loanDateObj.getDate())>0) {
      lastPaymentMonths=lastPaymentMonths+1
    }
    // console.log("lastPaymentMonths :", lastPaymentMonths)

    const interestUnpaidMonths = Math.max(totalMonths - lastPaymentMonths, 0)
    // console.log("interestUnpaidMonths: ", interestUnpaidMonths)
    let penaltyMonths = 0
    //checking loan is over due
    if (totalMonths > 10) {
      //penalty months
      const dueMonths = totalMonths - loanPeriodMonths
      //checking if int payment has done before due
      if (interestUnpaidMonths > dueMonths) {
        penaltyMonths = dueMonths
      } else {
        penaltyMonths = interestUnpaidMonths
      }
    }
    // console.log('penaltyMonths: ', penaltyMonths)
    const interest =
      remainingAmount * interestUnpaidMonths * monthlyInterestRate
    const penaltyInterest =
      remainingAmount * penaltyMonths * monthlyInterestRate
    return { int: Math.round(interest), penInt: Math.round(penaltyInterest), installment:Math.round(loanInstallment+interest+penaltyInterest) }
  }

  const handleSearch = useCallback(
    async date => {
      // console.log("date on handle search: ", date)
      if (!memberInputId) return
      setLoading(true)
      try {
        // Fetch member info
        const {
          data: { member },
        } = await api.get(`${baseUrl}/member/getMemberById/${memberInputId}`)

        const memberResponse = member
        setMember(memberResponse)

        // If the member exists, fetch the loan data
        if (memberResponse?._id) {
          const { data: loanResponse } = await api.get(
            `${baseUrl}/loan/member/${memberResponse._id}`
          )

          const loanData = loanResponse?.loan

          if (loanData) {
            const allPayments = loanResponse?.groupedPayments || []
            const lastInterestPaymentDate =
              loanResponse?.lastIntPaymentDate?.date

            setEarlyPayments(allPayments)

            const calculatedInterest = calculateInterest(
              loanData.loanDate,
              loanData.loanRemainingAmount,
              lastInterestPaymentDate,
              date
            )

            setLoan({
              ...loanData,
              interest: calculatedInterest.int,
              penaltyInterest: calculatedInterest.penInt,
              installment:calculatedInterest.installment,
              dueAmount:
                loanData.loanRemainingAmount +
                calculatedInterest.int +
                calculatedInterest.penInt,
            })
          } else {
            // Set loan to null explicitly only when loanData is not present
            console.warn("No loan data found.")
            setLoan(null)
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        // navigate('../404')
      } finally {
        setLoading(false)
      }
    },
    [memberInputId]
  )

  const resetPaymentFields = () => {
    setPayingPrincipal(0)
    setPayingPenaltyInterest(0)
    setPayingInterest(0)
    setPaymentAmount("")
    // setPaymentDate(dayjs())
  }

  const calculatePaymentSplit = amount => {
    const payment = parseFloat(amount) || 0
    const penaltyInterestPart = Math.min(payment, loan.penaltyInterest || 0)
    const remainingAfterPenalty = payment - penaltyInterestPart
    const interestPart = Math.min(remainingAfterPenalty, loan.interest || 0)
    const remainingAfterInterest = remainingAfterPenalty - interestPart
    const principalPart = Math.max(remainingAfterInterest, 0)

    setPayingPenaltyInterest(penaltyInterestPart)
    setPayingInterest(interestPart)
    setPayingPrincipal(principalPart)
  }

  const handleIdChange = e => {
    setMemberInputId(e.target.value)
    setMember(null)
    setLoan(null)
    setPaymentDate(dayjs())
  }
  const handleDateChange = newDate => {
    if (newDate) {
      // console.log("newDate: ", newDate)
      setPaymentDate(newDate)
      handleSearch(newDate)
      resetPaymentFields()
    }
  }

  // const handleDeletePayment = async paymentId => {
  // console.log(loan._id)
  // console.log(paymentId)
  // }

  const handleLoanPayment = async () => {
    if (!paymentAmount || !loan?._id) return
    // console.log("paymentAmount: ", paymentAmount)
    // console.log("payingPrincipal: ", payingPrincipal)
    // console.log("payingInterest: ", payingInterest)
    // console.log("payingPenaltyInterest: ", payingPenaltyInterest)
    try {
      await api
        .post(
          `${baseUrl}/loan/payments`,
          {
            loanId: loan._id,
            amounts: {
              principle: parseFloat(payingPrincipal),
              interest: parseFloat(payingInterest),
              penaltyInterest: parseFloat(payingPenaltyInterest),
            },
            date: paymentDate,
          }
        )
        .then(res => {
          // console.log(res)
        })
      resetPaymentFields()
      setSnackbarOpen(true)
      await handleSearch()
    } catch (error) {
      console.error("Error recording payment:", error)
    }
  }

  //un authorized access preventing
  const handleAuthStateChange = ({ isAuthenticated, roles }) => {
    setIsAuthenticated(isAuthenticated)
    setRoles(roles)
    if (!isAuthenticated || (!roles.includes("loan-treasurer") && !roles.includes("treasurer"))) {
      navigate("/login/user-login")
    }
  }

  useEffect(() => {
    //for searching loan when visit  from another page
    if (memberId) {
      setMemberInputId(memberId)
      handleSearch(paymentDate)
    }
    // handleSearch(paymentDate)
  }, [memberId, handleSearch, paymentDate])

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
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <TextField
              label="සාමාජික අංකය"
              value={memberInputId}
              onChange={handleIdChange}
              sx={{ maxWidth: "100px" }}
            />
            <Button
              variant="contained"
              onClick={() => handleSearch(paymentDate)}
            >
              ණය සෙවීම
            </Button>
          </Box>
          {loan && (
            <Box>
              <Typography sx={{ fontSize: ".8rem" }}>
                ඇපකරු1:- {loan?.guarantor1Id.member_id} /{" "}
                {loan?.guarantor1Id.name}, {loan?.guarantor1Id.mobile}
              </Typography>
              <Typography sx={{ fontSize: ".8rem" }}>
                ඇපකරු2:- {loan?.guarantor2Id.member_id} /{" "}
                {loan?.guarantor2Id.name}, {loan?.guarantor2Id.mobile}
              </Typography>
            </Box>
          )}
        </Box>

        {loading && <Typography>පූරණය වෙමින්...</Typography>}
        {!loading && member && !loan && (
          <Typography>{member.name} සඳහා ණයක් සොයාගත නොහැකි විය.</Typography>
        )}
        {!loading && loan && (
          <Typography sx={{ fontSize: ".8rem" }}>
            ණයකරු:- {member?.member_id} / {member?.name} / {member?.area} /{" "}
            {member?.mobile}
          </Typography>
        )}

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
                  interest: loan.interest || "-",
                  penaltyInterest: loan.penaltyInterest || "-",
                  installment:loan.installment||'',
                  due: loan.dueAmount || "-",
                },
              ]}
            />
            <hr></hr>
            <Typography>ණය ආපසු ගෙවීම් </Typography>
            <StickyHeadTable 
              columnsArray={paymentColumns}
              totalRow={false}
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
            <Box sx={{ marginTop: 2, padding: 2, border: "1px solid #ccc" }}>
              {roles.includes("loan-treasurer") ? (
                <>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="ගෙවීමේ දිනය"
                      value={paymentDate}
                      onChange={handleDateChange}
                      format="YYYY/MM/DD"
                    />
                  </LocalizationProvider>
                  <TextField
                    label="ගෙවන මුදල"
                    type="number"
                    value={paymentAmount}
                    onChange={e => {
                      setPaymentAmount(e.target.value)
                      calculatePaymentSplit(e.target.value)
                    }}
                    sx={{ mx: "20px" }}
                  />
                  <Typography>
                    ගෙවන දඩ පොලිය: රු. {payingPenaltyInterest}
                  </Typography>
                  <Typography>ගෙවන පොලිය: රු. {payingInterest}</Typography>
                  <Typography>ගෙවන ණය මුදල: රු. {payingPrincipal}</Typography>
                  <Button
                    variant="contained"
                    onClick={handleLoanPayment}
                    disabled={
                      parseFloat(paymentAmount) <
                      loan.interest + loan.penaltyInterest
                    }
                  >
                    ගෙවන්න
                  </Button>
                </>
              ) : (
                <Typography sx={{ textAlign: "center", color: "#666", padding: "20px" }}>
                  ණය ගෙවීම් කළමනාකරණය කිරීමට ණය භාණ්ඩාගාරික අවසර අවශ්‍ය වේ.
                </Typography>
              )}
            </Box>
          </>
        )}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          message="ගෙවීම සාර්ථකව සටහන් කරන ලදී"
        />
      </section>
    </Layout>
  )
}
