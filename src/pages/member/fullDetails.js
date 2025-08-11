import React, { useState } from "react"
import Layout from "../../components/layout"
import { Box, Button, Paper, TextField, Typography, Grid, Divider } from "@mui/material"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SummarizeIcon from '@mui/icons-material/Summarize';
import GroupIcon from '@mui/icons-material/Group';
import GavelIcon from '@mui/icons-material/Gavel';
import PaymentsIcon from '@mui/icons-material/Payments';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

import { navigate } from "gatsby"
import api from "../../utils/api"
import loadable from "@loadable/component"
import StickyHeadTable from "../../components/StickyHeadTable"
const AuthComponent = loadable(() =>
  import("../../components/common/AuthComponent")
)

const baseUrl = process.env.GATSBY_API_BASE_URL

export default function FullDetails() {
  //un authorized access preventing
  const [roles, setRoles] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [memberId, setMemberId] = useState("")
  const [member, setMember] = useState({})

  const [loan, setLoan] = useState(null)
  const [earlyPayments, setEarlyPayments] = useState([])
  const [calculatedInterest, setCalculatedInterest] = useState(null)

  const handleAuthStateChange = ({ isAuthenticated, roles }) => {
    setIsAuthenticated(isAuthenticated)
    setRoles(roles)
    const allowedRoles = ["vice-secretary", "treasurer", "loan-treasurer", "auditor"]
    if (!isAuthenticated || !roles.some(role => allowedRoles.includes(role))) {
      navigate("/login/user-login")
    }
  }

  const getMemberById = e => {
    // console.log("search:", memberId)
    api
      .get(`${baseUrl}/member/getMemberAllInfoById?member_id=${memberId}`)
      .then(response => {
        // console.log("memberData:", response?.data?.memberData)
        const member = response?.data?.memberData || {}
        setMember(member || {})
        //getting loan info of the member
        // api
        // .get(`${baseUrl}/member/memberLoan?member_id=${member.memberDetails._id}`)
        // .then(res => {
        //   console.log("Loan res: ", res.data)
        //   setLoan(res.data?.loan||null)
        //   setCalculatedInterest(res.data?.calculatedInterest||[])
        //   setEarlyPayments(res.data?.groupedPayments||null)
        // })
        // .catch(error => {
        //   console.error("Error getting member loan:", error)
        // })
      })
      .catch(error => {
        console.error("Axios error: ", error)
      })
  }

  const dependentsColumnsArray = [
    {
      id: "name",
      label: "නම",
      minWidth: 50,
    },
    { id: "relationship", label: "නෑකම", minWidth: 50 },
    { id: "death", label: "", minWidth: 50 },
  ]
  const dependentsDataArray =
    member.memberDetails?.dependents.map(dependent => {
      return {
        name: dependent.name,
        relationship: dependent.relationship,
        death: dependent.dateOfDeath != null ? "මිය ගොස් ඇත" : "",
      }
    }) || []
  const paymentsColumnsArray = [
    { id: "date", label: "දිනය", minWidth: 50 },
    { id: "memAmount", label: "සාමාජික මුදල් ගෙවීම්", minWidth: 50 },
    { id: "fineAmount", label: "දඩ මුදල් ගෙවීම්", minWidth: 50 },
  ]
  const finesColumnsArray = [
    { id: "date", label: "දිනය", minWidth: 50 },
    { id: "fineType", label: "කාරණය", minWidth: 50 },
    { id: "fineAmount", label: "දඩ මුදල ", minWidth: 50 },
  ]

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
  const loanPaymentColumns = [
    { id: "date", label: "දිනය", minWidth: 50 },
    { id: "payedTotal", label: "මුළු මුදල", minWidth: 50 },
    { id: "amount", label: "ණය මුදල", minWidth: 50 },
    { id: "interest", label: "පොලිය", minWidth: 50 },
    { id: "penaltyInterest", label: "දඩ පොලිය", minWidth: 50 },
    { id: "actions", label: "", minWidth: 50 },
  ]
  //   console.log("dependentsDataArray:", dependentsDataArray)
  return (
    <Layout>
      <AuthComponent onAuthStateChange={handleAuthStateChange} />
      {/* Member Search */}
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, mb: 3, mt: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
            <AccountCircleIcon color="primary" sx={{ mr: 1 }} />
            <Typography>සාමාජික අංකය</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="outlined-basic"
              label="Your ID"
              variant="outlined"
              type="number"
              value={memberId}
              onChange={e => setMemberId(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button variant="contained" onClick={getMemberById} fullWidth>
              Search
            </Button>
          </Grid>
        </Grid>
      </Paper>
      {/* Member Basic Info */}
      <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 2, bgcolor: '#f5f7fa' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3} sx={{ display: 'flex', alignItems: 'center' }}>
            <SummarizeIcon color="primary" sx={{ mr: 1 }} />
            <Typography fontWeight={700}>{member.memberDetails?.name}</Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography>{member.memberDetails?.area}</Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography>
              {{
                regular: "සාමාන්‍ය",
                "funeral-free": "අවමංගල්‍ය වැඩවලින් නිදහස්",
                "attendance-free": "පැමිණීමෙන් නිදහස්",
                free: "නිදහස්",
              }[member.memberDetails?.status] || member.memberDetails?.status}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography>මාසික සාමාජික මුදල: {member.membershipRate}</Typography>
          </Grid>
        </Grid>
      </Paper>
      {/* Guarantor Info */}
      {member.loanInfo?.asGuarantor?.length > 0 && (
        <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 }, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <GroupIcon color="primary" sx={{ mr: 1 }} />
            <Typography fontWeight={700}>ඇපවීම්</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {member.loanInfo?.asGuarantor?.map((val, key) => (
              <Typography key={key} sx={{ mr: 2 }}>
                {val.memberId.name} - {val.loanNumber}
              </Typography>
            ))}
          </Box>
        </Paper>
      )}
      {/* Account Summary */}
      <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 3, bgcolor: '#e3f2fd' }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ fontWeight: 800, fontSize: { xs: '.8rem', sm: '1.1rem' }, color: member.memberDetails?.previousDue < 0 ? 'green' : 'orange' }}>
            {member.memberDetails?.previousDue < 0 ? `2024 ඉතිරිය රු. ${Math.abs(member.memberDetails.previousDue)}` : `2024 හිඟ රු. ${Math.abs(member.memberDetails?.previousDue || 0)}`}
          </Typography>
          <Typography sx={{ fontWeight: 800, fontSize: { xs: '.8rem', sm: '1.1rem' }, color: member.currentMembershipDue < 0 ? 'green' : 'orange' }}>
            {member.currentMembershipDue < 0 ? `සාමාජික මුදල් ඉතිරිය රු. ${Math.abs(member.currentMembershipDue)}` : `සාමාජික මුදල් හිඟ රු. ${Math.abs(member.currentMembershipDue || 0)}`}
          </Typography>
          <Typography sx={{ fontWeight: 800, fontSize: { xs: '.8rem', sm: '1.1rem' }, color: member.totalDue < 0 ? 'green' : 'orange' }}>
            {member.totalDue < 0 ? `ඉතිරි මුදල රු. ${Math.abs(member.totalDue)}` : `හිඟ එකතුව රු. ${Math.abs(member.totalDue || 0)}`}
          </Typography>
        </Box>
      </Paper>
      <Divider sx={{ mb: 3 }} />
      {/* Dependents */}
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <GroupIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">යැපෙන්නන්</Typography>
        </Box>
        <StickyHeadTable
          columnsArray={dependentsColumnsArray}
          dataArray={dependentsDataArray}
          totalRow={false}
          headingAlignment={"left"}
          dataAlignment={"left"}
        />
      </Paper>
      {member.fines &&
        Object.keys(member.fines)
          .sort((a, b) => b - a) // Sort years in descending order
          .map(year => (
            <Box key={year} sx={{ marginBottom: "20px" }}>
              <Typography
                variant="h6"
                align="center"
                sx={{ marginBottom: "10px" }}
              >
                {year} - වසරේ දඩ මුදල්
              </Typography>
              <Paper elevation={3} sx={{ padding: "20px" }}>
                <StickyHeadTable
                  columnsArray={finesColumnsArray}
                  dataArray={member.fines[year]?.fines || []} // Access fines data through member.fines
                  headingAlignment={"left"}
                  dataAlignment={"left"}
                />
              </Paper>
            </Box>
          ))}
      {member.groupedPayments &&
        Object.keys(member.groupedPayments)
          .sort((a, b) => b - a) // Sort years in descending order
          .map(year => (
            <Box key={year} sx={{ marginBottom: "20px" }}>
              <Typography
                variant="h6"
                align="center"
                sx={{ marginBottom: "10px" }}
              >
                {year} - වසරේ ගෙවීම්
              </Typography>
              <Paper elevation={3} sx={{ padding: "20px" }}>
                <StickyHeadTable
                  columnsArray={paymentsColumnsArray}
                  dataArray={member.groupedPayments[year]?.payments || []} // Ensure `payments` is defined
                  headingAlignment={"left"}
                  dataAlignment={"left"}
                />
              </Paper>
            </Box>
          ))}
      <hr />
      {member.loanInfo?.loan && (
        <>
          <Typography variant="h6" align="center" sx={{ marginBottom: "10px" }}>
            ණය ලබා ගැනීම්
          </Typography>
          <Paper elevation={3} sx={{ padding: "20px" }}>
            <StickyHeadTable
              columnsArray={loanColumns}
              dataArray={[
                {
                  date: new Date(
                    member.loanInfo.loan.loanDate
                  ).toLocaleDateString("en-CA"),
                  id: member.loanInfo.loan.loanNumber,
                  // amount: loan.loanAmount,
                  remaining: member.loanInfo.loan.loanRemainingAmount || "-",
                  interest: member.loanInfo.calculatedInterest.int || "-",
                  penaltyInterest:
                    member.loanInfo.calculatedInterest.penInt || "-",
                  installment:
                    member.loanInfo.calculatedInterest.installment || "",
                  due:
                    member.loanInfo.loan.loanRemainingAmount +
                      member.loanInfo.calculatedInterest.int +
                      member.loanInfo.calculatedInterest.penInt || "-",
                },
              ]}
            />
          </Paper>
          <hr />
          <Typography variant="h6" align="center" sx={{ marginBottom: "10px" }}>
            ණය ගෙවීම්
          </Typography>
          <Paper elevation={3} sx={{ padding: "20px" }}>
            <StickyHeadTable
              columnsArray={loanPaymentColumns}
              dataArray={member.loanInfo.groupedPayments.map(val => ({
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
          </Paper>
        </>
      )}
    </Layout>
  )
}
