import React, { useEffect, useState } from "react"
import Layout from "../../components/layout"
import StickyHeadTable from "../../components/StickyHeadTable"
import { Box, Typography, Paper } from "@mui/material"

import api from "../../utils/api"
import { useMember } from "../../context/MemberContext"
const baseUrl = process.env.GATSBY_API_BASE_URL

export default function Fines() {
  const { memberData } = useMember()
  const [memberInfo, setMemberInfo] = useState(memberData)
  const [loading, setLoading] = useState(true) // Handle loading state
  const [error, setError] = useState(null)
  const [fines, setFines] = useState({})

  const columnsArray = [
    { id: "date", label: "දිනය", minWidth: 50 },
    { id: "fineType", label: "කාරණය", minWidth: 50 },
    { id: "fineAmount", label: "දඩ මුදල ", minWidth: 50 },
  ]
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
    //getting fines of member
    const fetchFines = async () => {
      try {
        const response = await api.get(`${baseUrl}/member/fines`)
        console.log("response: ", response.data)
        setFines(response.data.fines)
      } catch (err) {
        console.error("Error fetching fines:", err)
        setError("Failed to load fines. Please try again later.")
        setFines(null)
      }
    }

    fetchFines()
  }, [])
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
              color: memberInfo?.previousDue < 0 ? "green" : "orange",
            }}
          >
            {memberInfo?.previousDue < 0 && (
              <>පැරණි ඉතිරිය රු. {Math.abs(memberInfo.previousDue)}</>
            )}
            {memberInfo?.previousDue >= 0 && (
              <>පැරණි හිඟ රු. {Math.abs(memberInfo.previousDue)}</>
            )}
          </Typography>
          {/* <Typography
            sx={{
              fontWeight: "800",
              fontSize: { xs: ".6rem", sm: "1rem" },
              color: membershipDue < 0 ? "green" : "orange",
            }}
          >
            {membershipDue < 0 && (
              <>සාමාජික මුදල් ඉතිරිය රු. {Math.abs(membershipDue)}</>
            )}
            {membershipDue >= 0 && (
              <>සාමාජික මුදල් හිඟ රු. {Math.abs(membershipDue)}</>
            )}
          </Typography> */}

          <Typography
            sx={{
              fontWeight: "800",
              fontSize: { xs: ".6rem", sm: "1rem" },
              color: "orange",
            }}
          >
            දඩ මුදල් රු.
            {memberInfo?.fineTotal || "0"}
          </Typography>
          {/* <Typography
            sx={{
              fontWeight: "800",
              fontSize: { xs: ".6rem", sm: "1rem" },
              color: totalDue < 0 ? "green" : "orange",
            }}
          >
            {totalDue < 0 && <>ඉතිරි මුදල රු. {Math.abs(totalDue)}</>}
            {totalDue >= 0 && <>හිඟ එකතුව රු. {Math.abs(totalDue)}</>}
          </Typography> */}
        </Box>
        {console.log("data array", fines)}
        {fines.length>0 && (
          <StickyHeadTable
            columnsArray={columnsArray}
            dataArray={fines || []}
            headingAlignment={"center"}
            dataAlignment={"left"}
            totalRow={false}
            hidePagination={true}
          />
        )}
      </section>
    </Layout>
  )
}
