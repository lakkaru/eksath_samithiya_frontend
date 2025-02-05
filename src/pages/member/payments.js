import React, { useEffect, useState } from "react"
import Layout from "../../components/layout"
import StickyHeadTable from "../../components/StickyHeadTable"
import { Box, Typography, Paper } from "@mui/material"

import api from "../../utils/api"
import { useMember } from "../../context/MemberContext"
const baseUrl = process.env.GATSBY_API_BASE_URL

export default function Payments() {
  const { memberData } = useMember()
  const [memberInfo, setMemberInfo] = useState(memberData)
  const [loading, setLoading] = useState(true) // Handle loading state
  const [error, setError] = useState(null)
  const [groupedPayments, setGroupedPayments] = useState({})
  //   const [perviousDue, setPerviousDue] = useState()
  //   const [member, setMember] = useState({})
  // console.log(member)

  const columnsArray = [
    { id: "date", label: "දිනය", minWidth: 50 },
    { id: "memAmount", label: "සාමාජික මුදල්", minWidth: 50 },
    { id: "fineAmount", label: "දඩ මුදල් ", minWidth: 50 },
  ]
  // console.log('groupedPayments:', groupedPayments["2024"]?.totals.memAmount);
  //   let fines = []
  //   const getMemberAccountById = async () => {
  //     try {
  // Step 1: Get all dues
  //   const dueResponse = await Axios.get(
  //     `http://127.0.0.1:3001/api/getAllDueById?member_id=${memberId}`
  //   )
  //   const previousDue = dueResponse.data.due.previousDue
  //   setPerviousDue(previousDue.totalDue) // Set the previous due
  //   // fines = dueResponse.data.due.fines
  //   // console.log("Previous Due:", fines)

  //   // Step 2: Get payments
  //   const paymentsResponse = await Axios.get(
  //     `http://127.0.0.1:3001/api/getPaymentsById?member_id=${memberId}`
  // //   )
  //   const { payments, member, fines } = paymentsResponse.data
  //   setMember(member) // Set the member details
  //   // console.log("Member Details:", member)

  //   // Step 3: Process and group payments
  //   const formattedPayments = payments.map(payment => ({
  //     ...payment,
  //     date:
  //       payment.date !== "Total"
  //         ? new Date(payment.date)
  //             .toISOString()
  //             .split("T")[0]
  //             .replace(/-/g, "/")
  //         : "Total",
  //   }))

  //   const grouped = formattedPayments.reduce((acc, payment) => {
  //     if (payment.date === "Total") return acc // Skip the global total row
  //     const year = payment.date.split("/")[0] // Extract the year
  //     if (!acc[year]) {
  //       acc[year] = {
  //         payments: [],
  //         totals: { memAmount: 0, fineAmount: 0 },
  //       }
  //     }

  //     acc[year].payments.push(payment)

  //     acc[year].totals.memAmount += payment.memAmount || 0
  //     acc[year].totals.fineAmount += payment.fineAmount || 0

  //     return acc
  //   }, {})

  // Add totals to each year's group
  //       Object.keys(grouped).forEach(year => {
  //         grouped[year].payments.push({
  //           date: "Total",
  //           memAmount: grouped[year].totals.memAmount,
  //           fineAmount: grouped[year].totals.fineAmount,
  //         })
  //       })

  //       setGroupedPayments(grouped)
  //       // console.log("Grouped Payments:", grouped);
  //     } catch (error) {
  //       console.error("Error in getMemberAccountById:", error)
  //     }
  //   }
  //   let membershipDue = 0
  //   const currentMonth = new Date().getMonth() + 1 // Get the current month (1-based)
  //   if (member.siblingsCount === 0) {
  //     membershipDue = currentMonth * 300
  //   } else {
  //     membershipDue = currentMonth * 300 * (1.3 * member.siblingsCount)
  //   }

  //   const totalFines = fines.reduce((total, fine) => total + fine.amount, 0)
  //   // console.log("membershipDue:", membershipDue)
  //   const totalDue = (perviousDue + membershipDue)||0
  //   let membershipDue = 0
  //   let totalFines = 0
  //   let totalDue = 0

  console.log("groupedPayments :", groupedPayments)
  useEffect(() => {
    if (!memberData) {
      //get memberData if page reload and context is empty
      const fetchMemberData = async () => {
        try {
          const response = await api.get(`${baseUrl}/member/info`)
          // console.log("response: ", response.data)
          setMemberInfo(response.data)
        } catch (err) {
          console.error("Error fetching member data:", err)
          setError("Failed to load member data. Please try again later.")
          setMemberInfo(null)
        } finally {
          setLoading(false)
        }
      }
      fetchMemberData()
    }
    //getting payments of member
    const fetchPayments = async () => {
      try {
        const response = await api.get(`${baseUrl}/member/payments`)
        console.log("response: ", response.data)
        setGroupedPayments(response.data.payments)
      } catch (err) {
        console.error("Error fetching payments:", err)
        setError("Failed to load payments. Please try again later.")
        setGroupedPayments(null)
      }
    }

    fetchPayments()
  }, [])
  // console.log(memberInfo?.previousDue?.totalDue<0).
  const membershipDue = memberInfo?.membershipDue
  const totalDue =
    memberInfo?.previousDue?.totalDue +
      memberInfo?.membershipDue +
      memberInfo?.fineTotal || "0"

  return (
    <Layout>
      <section>
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
            }}
          >
            පැරණි හිඟ රු. {memberInfo?.previousDue?.totalDue}
          </Typography>
          <Typography
            sx={{
              fontWeight: "800",
              fontSize: { xs: ".6rem", sm: "1rem" },
            }}
          >
            සාමාජික මුදල් හිඟ රු.
            {membershipDue}
          </Typography>

          <Typography
            sx={{ fontWeight: "800", fontSize: { xs: ".6rem", sm: "1rem" } }}
          >
            දඩ මුදල් රු.
            {memberInfo?.fineTotal || "0"}
          </Typography>
          <Typography
            sx={{
              fontWeight: "800",
              fontSize: { xs: ".6rem", sm: "1rem" },
              color: totalDue < 0 ? "green" : "orange",
            }}
          >
            හිඟ එකතුව රු.
            {totalDue}
          </Typography>
        </Box>
      </section>
      {groupedPayments &&
        Object.keys(groupedPayments)
          .sort((a, b) => b - a) // Sort years in descending order
          .map(year => (
            <Box key={year} sx={{ marginBottom: "20px" }}>
              <Typography
                variant="h6"
                align="center"
                sx={{ marginBottom: "10px" }}
              >
                Payments for {year}
              </Typography>
              <Paper elevation={3} sx={{ padding: "20px" }}>
                <StickyHeadTable
                  columnsArray={columnsArray}
                  dataArray={groupedPayments[year]?.payments || []} // Ensure `payments` is defined
                  headingAlignment={"left"}
                  dataAlignment={"left"}
                />
              </Paper>
            </Box>
          ))}
    </Layout>
  )
}
