import React, { useEffect, useState } from "react"
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material"
import Axios from "axios"
import { navigate } from "gatsby"

import Layout from "../../components/layout"

const baseUrl = process.env.GATSBY_API_BASE_URL
// const token = localStorage.getItem("authToken")
let token = null;

if (typeof window !== "undefined") {
  token = localStorage.getItem("authToken");
}


const MemberHomePage = () => {
  const [memberData, setMemberData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const response = await Axios.get(`${baseUrl}/member/info`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        // console.log("response: ", response.data)
        setMemberData(response.data)
      } catch (err) {
        console.error("Error fetching member data:", err)
        setError("Failed to load member data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchMemberData()
  }, [])

  if (loading) {
    return (
      <Layout>
        <Typography>Loading...</Typography>
      </Layout>
    )
  }

  if (error) {
    navigate("../404")
    return <Typography color="error">{error}</Typography>
  }

  return (
    <Layout>
      <Box
        sx={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "16px",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Member Details
        </Typography>
        <Paper
          elevation={3}
          sx={{
            padding: "16px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <List>
            <ListItem>
              <ListItemText
                primary="Area"
                secondary={memberData?.area || "N/A"}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Address"
                secondary={memberData?.address || "N/A"}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Mobile Number"
                secondary={memberData?.mobile || "N/A"}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="WhatsApp Number"
                secondary={memberData?.whatsApp || "N/A"}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Email"
                secondary={memberData?.email || "N/A"}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Previous Due"
                secondary={`${
                  memberData?.previousDue
                    ? `LKR ${memberData?.previousDue}`
                    : "N/A"
                }`}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Fine Total"
                secondary={`${
                  memberData?.fineTotal ? `LKR ${memberData?.fineTotal}` : "N/A"
                }`}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Membership Due"
                secondary={`${
                  memberData?.membershipDue
                    ? `LKR ${memberData?.membershipDue}`
                    : "N/A"
                }`}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Meeting Absents"
                secondary={
                  memberData?.meetingAbsents
                    ? `${memberData?.meetingAbsents} times`
                    : "N/A"
                }
              />
            </ListItem>
            <Divider />
            {/* Dependents */}
            <ListItem>
              <ListItemText primary="Dependents" />
            </ListItem>
            {memberData?.dependents && memberData.dependents.length > 0 ? (
              <List sx={{ pl: 4 }}>
                {memberData.dependents.map((dependent, index) => (
                  <ListItem
                    disableGutters
                    key={index}
                    sx={{ py: "3px", my: "3px" }}
                  >
                    <ListItemText
                      primary={`${index + 1}. ${dependent}${
                        index !== memberData.dependents.length - 1 ? ", " : ""
                      }`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <ListItem>
                <ListItemText secondary="යැපෙන්නන් නොමැත." />
              </ListItem>
            )}
          </List>
        </Paper>
      </Box>
    </Layout>
  )
}

export default MemberHomePage
