import React, { useState } from "react"
import Layout from "../../components/layout"
import { Box, Button, Paper, TextField, Typography } from "@mui/material"

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

  const handleAuthStateChange = ({ isAuthenticated, roles }) => {
    setIsAuthenticated(isAuthenticated)
    setRoles(roles)
    if (!roles.includes("vice-secretary")) {
      navigate("/login/user-login")
    }
  }

  const getMemberById = e => {
    console.log("search:", memberId)
    api
      .get(`${baseUrl}/member/getMemberAllInfoById?member_id=${memberId}`)
      .then(response => {
        console.log("memberData:", response?.data?.memberData)
        const member = response?.data?.memberData || {}
        setMember(member || {})
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
  //   console.log("dependentsDataArray:", dependentsDataArray)
  return (
    <Layout>
      <AuthComponent onAuthStateChange={handleAuthStateChange} />
      {/* member search */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          padding: "20px",
          gap: "50px",
        }}
      >
        <Typography>සාමාජික අංකය</Typography>
        <TextField
          id="outlined-basic"
          label="Your ID"
          variant="outlined"
          type="number"
          value={memberId}
          onChange={e => setMemberId(e.target.value)}
          // onBlur={e => setMemberId(e.target.value)}
        />
        <Button variant="contained" onClick={getMemberById}>
          Search
        </Button>
      </Box>
      {/* member basic info */}
      <Box sx={{ display: "flex", gap: 5, alignItems: "center" }}>
        <Typography> {member.memberDetails?.name}</Typography>
        <Typography> {member.memberDetails?.area}</Typography>
        <Typography> {member.memberDetails?.status}</Typography>
        <Typography> මාසික සාමාජික මුදල:- {member.membershipRate}</Typography>
      </Box>
      <hr />
      {/* member account summery */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
          gap: "20px",
        }}
      >
        <Typography
          sx={{
            fontWeight: "800",
            fontSize: { xs: ".6rem", sm: "1rem" },
            color: member.memberDetails?.previousDue < 0 ? "green" : "orange",
          }}
        >
          {member.memberDetails?.previousDue < 0 && (
            <>2024 ඉතිරිය රු. {Math.abs(member.memberDetails.previousDue)}</>
          )}
          {member.memberDetails?.previousDue >= 0 && (
            <>2024 හිඟ රු. {Math.abs(member.memberDetails.previousDue)}</>
          )}
        </Typography>
        <Typography
          sx={{
            fontWeight: "800",
            fontSize: { xs: ".6rem", sm: "1rem" },
            color: member.currentMembershipDue < 0 ? "green" : "orange",
          }}
        >
          { member.currentMembershipDue < 0 && (
            <>සාමාජික මුදල් ඉතිරිය රු. {Math.abs( member.currentMembershipDue)}</>
          )}
          { member.currentMembershipDue >= 0 && (
            <>සාමාජික මුදල් හිඟ රු. {Math.abs( member.currentMembershipDue)}</>
          )}
        </Typography>

        {/* <Typography
          sx={{
            fontWeight: "800",
            fontSize: { xs: ".6rem", sm: "1rem" },
            color: "orange",
          }}
        >
          දඩ මුදල් රු.
          {memberInfo?.fineTotal || "0"}
        </Typography> */}
        <Typography
          sx={{
            fontWeight: "800",
            fontSize: { xs: ".6rem", sm: "1rem" },
            color: member.totalDue < 0 ? "green" : "orange",
          }}
        >
          {member.totalDue < 0 && <>ඉතිරි මුදල රු. {Math.abs(member.totalDue)}</>}
          {member.totalDue >= 0 && <>හිඟ එකතුව රු. {Math.abs(member.totalDue)}</>}
        </Typography>
      </Box>

      <Box sx={{ marginBottom: "20px" }}>
        <Typography variant="h6" align="center" sx={{ marginBottom: "10px" }}>
          යැපෙන්නන්
        </Typography>
        <Paper elevation={3} sx={{ padding: "20px" }}>
          <StickyHeadTable
            columnsArray={dependentsColumnsArray}
            dataArray={dependentsDataArray}
            totalRow={false}
            headingAlignment={"left"}
            dataAlignment={"left"}
          />
        </Paper>
      </Box>
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
    </Layout>
  )
}
