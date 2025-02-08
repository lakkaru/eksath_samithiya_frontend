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
// import Axios from "axios"
import api from '../../utils/api'
import { navigate } from "gatsby"

import { useMember } from "../../context/MemberContext";
import Layout from "../../components/layout"

const baseUrl = process.env.GATSBY_API_BASE_URL
// const token = localStorage.getItem("authToken")
// let token = null;

// if (typeof window !== "undefined") {
//   token = localStorage.getItem("authToken");
// }


const MemberHomePage = () => {
  const { memberData, setMemberData } = useMember();
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  // console.log('memberData: ', memberData)

  useEffect(() => {
    
    const fetchMemberData = async () => {
      try {
        const response = await api.get(`${baseUrl}/member/info`)
        // console.log("response: ", response.data)
        setMemberData(response.data)
      } catch (err) {
        console.error("Error fetching member data:", err)
        setError("Failed to load member data. Please try again later.")
        setMemberData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchMemberData()
  }, [])
// console.log('memberData: ', memberData)
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
        <Typography variant="h5" gutterBottom>
        සාමාජික තොරතුරු
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
                primary="බල ප්‍රදේශය"
                secondary={memberData?.area || "ලබා දී නැත"}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="ලිපිනය"
                secondary={memberData?.address || "ලබා දී නැත"}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="ජංගම දුරකථන අංකය"
                secondary={memberData?.mobile || "ලබා දී නැත"}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="WhatsApp අංකය"
                secondary={memberData?.whatsApp || "ලබා දී නැත"}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Email"
                secondary={memberData?.email || "ලබා දී නැත"}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="පසුගිය වසර හිඟ"
                secondary={`${
                  memberData?.previousDue
                    ? `LKR ${memberData?.previousDue}`
                    : "නැත"
                }`}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="දඩ මුදල් එකතුව"
                secondary={`${
                  memberData?.fineTotal ? `LKR ${memberData?.fineTotal}` : 'නැත'
                }`}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="සාමාජික මුදල් හිඟ"
                secondary={`${
                  memberData?.membershipDue
                    ? `LKR ${memberData?.membershipDue}`
                    : 'නැත'
                }`}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="මහාසභාවට නොපැමිණිම්"
                secondary={
                  memberData?.meetingAbsents
                    ? `${memberData?.meetingAbsents} times`
                    : "නැත"
                }
              />
            </ListItem>
            <Divider />
            {/* Dependents */}
            <ListItem>
              <ListItemText primary="යැපෙන්නන් ලේඛනය" sx={{textDecoration:'underline', textAlign: 'left'}}/>
            </ListItem>
            {memberData?.dependents && memberData.dependents.length > 0 ? (
              <List sx={{ pl: 2 }}>
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
