import React, { useState, useEffect } from "react"
import Layout from "../../components/layout"
// import BasicDatePicker from "../../components/basicDatePicker"
// import { Box, Button } from "@mui/material"
import StickyHeadTable from "../../components/StickyHeadTable"
import { Button, Typography } from "@mui/material"

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

export default function ActiveLoans() {
  //un authorized access preventing
  const [roles, setRoles] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [activeLoans, setActiveLoans] = useState([])

  const loanColumnsArray = [
    { id: "date", label: "ණය දිනය", minWidth: 50 },
    { id: "loanNumber", label: "ණය අංකය", minWidth: 50 },
    { id: "memberId", label: "සාමාජික අංකය", minWidth: 50 },
    { id: "member", label: "සාමාජිකයා", minWidth: 50 },
    { id: "remaining", label: "ඉතිරි මුදල", minWidth: 50 },
    { id: "unpaidMonths", label: "නොගෙවු මාස", minWidth: 50 },
    { id: "view", label: "", minWidth: 50, align: "right" },
    // { id: "interest", label: "Interest", minWidth: 50 },
    // { id: "penaltyInterest", label: "Penalty Int.", minWidth: 50 },
    // { id: "due", label: "Due Amount", minWidth: 50, align: "right" },
  ]

  const handleViewMore = memberId => {
    // console.log(memberId)
    navigate(`/loan/search?memberId=${memberId}`)
  }

  //un authorized access preventing
  const handleAuthStateChange = ({ isAuthenticated, roles }) => {
    setIsAuthenticated(isAuthenticated)
    setRoles(roles)
    if (!isAuthenticated || !roles.includes("loan-treasurer")) {
      navigate("/login/user-login")
    }
  }
  useEffect(() => {
    api
      .get(`${baseUrl}/loan/active-loans`)
      .then(res => {
        // console.log(res.data)
        setActiveLoans(res.data.activeLoans)
      })
      .catch(error => {
        console.error("Error fetching data:", error)
        // navigate('../404')
      })
  }, [])
  return (
    <Layout>
      <AuthComponent onAuthStateChange={handleAuthStateChange} />
      <section>
        <Typography>ක්‍රියාකාරී ණය</Typography>
        <StickyHeadTable
          columnsArray={loanColumnsArray}
          dataArray={activeLoans.map(val => ({
            date: new Date(val.loanDate).toLocaleDateString(),
            loanNumber: val.loanNumber,
            memberId: val.memberId.member_id,
            member: val.memberId.name,
            remaining: val.loanRemainingAmount,
            unpaidMonths: val.unpaidDuration,
            view: (
              <Button
                variant="contained"
                onClick={() => handleViewMore(val.memberId.member_id)} // Pass the loan ID to the handler
              >
                View
              </Button>
            ),
          }))}
          headingAlignment={"left"}
          dataAlignment={"left"}
        />
      </section>
    </Layout>
  )
}
