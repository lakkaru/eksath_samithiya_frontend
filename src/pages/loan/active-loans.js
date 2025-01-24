import React, { useState, useEffect } from "react"
import Layout from "../../components/layout"
// import BasicDatePicker from "../../components/basicDatePicker"
// import { Box, Button } from "@mui/material"
import StickyHeadTable from "../../components/StickyHeadTable"
import { Typography } from "@mui/material"
// import StickyHeadTable from "../../components/StickyHeadTable"
// import { navigate } from "gatsby"

const Axios = require("axios")

const baseUrl = process.env.GATSBY_API_BASE_URL
// const token = localStorage.getItem("authToken")
let token = null;

if (typeof window !== "undefined") {
  token = localStorage.getItem("authToken");
}


export default function ActiveLoans() {
  const [activeLoans, setActiveLoans] = useState([])

  const loanColumnsArray = [
    { id: "date", label: "Loan Date", minWidth: 50 },
    { id: "loanNumber", label: "Loan Number", minWidth: 50 },
    { id: "memberId", label: "ID", minWidth: 50 },
    { id: "member", label: "Member", minWidth: 50 },
    { id: "remaining", label: "Remaining Amount", minWidth: 50 },
    { id: "view", label: "", minWidth: 50, align: "right" },
    // { id: "interest", label: "Interest", minWidth: 50 },
    // { id: "penaltyInterest", label: "Penalty Int.", minWidth: 50 },
    // { id: "due", label: "Due Amount", minWidth: 50, align: "right" },
  ]

  // const handleViewMore = memberId => {
  //   // console.log(memberId)
  //   navigate(`/loan/loanSearch?memberId=${memberId}`)
  // }
  useEffect(() => {
    Axios.get(`${baseUrl}/loan/active-loans`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        // console.log(res.data.activeLoans)
        setActiveLoans(res.data.activeLoans)
      })
      .catch(error => {
        console.error("Error fetching data:", error)
        // navigate('../404')
      })
  }, [])
  return (
    <Layout>
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
            // view: (
            //   <Button
            //   variant="contained"
            //     onClick={() => handleViewMore(val.memberId.member_id)} // Pass the loan ID to the handler
            //   >
            //     View
            //   </Button>
            // ),
          }))}
          headingAlignment={"left"}
          dataAlignment={"left"}
        />
      </section>
    </Layout>
  )
}
