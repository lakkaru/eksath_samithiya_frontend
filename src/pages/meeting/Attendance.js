import React, { useState, useEffect } from "react"
import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
} from "@mui/material"
import Layout from "../../components/layout"

import AttendanceChart from "../../components/common/AttendanceChart"

import { navigate } from "gatsby"
import api from "../../utils/api"
import loadable from "@loadable/component"
const AuthComponent = loadable(() =>
  import("../../components/common/AuthComponent")
)

// const Axios = require("axios")
const baseUrl = process.env.GATSBY_API_BASE_URL

export default function Attendance() {
  //un authorized access preventing
  const [roles, setRoles] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [totalMembers, setTotalMembers] = useState(0)
  const [memberId, setMemberId] = useState("")
  const [memberIds, setMemberIds] = useState([])
  const [memberIdMap, setMemberIdMap] = useState({})
  const [attendance, setAttendance] = useState([])
  //   const [attendance, setAttendance] = useState([])
  // const [dependents, setDependents] = useState([])
  const [member, setMember] = useState({})
  const [deceasedOptions, setDeceasedOptions] = useState([])
  const [selectedDeceased, setSelectedDeceased] = useState("")
  const [funeralId, setFuneralId] = useState("")

  const handleAuthStateChange = ({ isAuthenticated, roles }) => {
    setIsAuthenticated(isAuthenticated)
    setRoles(roles)
    if (!isAuthenticated || !roles.includes("vice-secretary")) {
      navigate("/login/user-login")
    }
  }

  useEffect(() => {
    // Getting number of members
    api
      .get(`${baseUrl}/member/getNextId`)
      .then(response => {
        setTotalMembers(response?.data?.nextMemberId - 1 || "Not Available")
      })
      .catch(error => {
        // Handle error
      })

    // api
    //   .get(`${baseUrl}/member/getMemberIdsForFuneralAttendance`)
    //   .then(response => {
    //     const ids = response.data.memberIds || []
    //     //   console.log(ids)
    //     setMemberIds(ids)
    //     const idMap = {}
    //     ids.forEach(id => {
    //       idMap[id] = true // Mark valid member IDs
    //     })
    //     setMemberIdMap(idMap)
    //     //   setAttendance(ids.map(() => false)) // Initialize attendance only for valid IDs
    //   })
  }, [member])

//   const getMemberById = e => {
//     console.log("search:", memberId)
//     api
//       .get(`${baseUrl}/member/getMembershipDeathById?member_id=${memberId}`)
//       .then(response => {
//         console.log(response?.data?.data)
//         const data = response?.data?.data || {}
//         setMember(data.member || {})
//         // setDependents(data.dependents || [])

//         // Prepare deceased options
//         const deceased = []
//         // console.log(data.member?.dateOfDeath)
//         if (data.member?.dateOfDeath) {
//           deceased.push({
//             name: data.member.name,
//             id: "member",
//             isMember: true,
//           })
//           // console.log(deceased)
//         }
//         data.dependents.forEach(dependent => {
//           if (dependent.dateOfDeath) {
//             deceased.push({
//               name: dependent.name,
//               id: dependent._id,
//               isMember: false,
//             })
//           }
//           // deceased.push({
//           //   name: dependent.name,
//           //   id: dependent._id,
//           //   isMember: false,
//           // });
//         })
//         setDeceasedOptions(deceased)
//       })
//       .catch(error => {
//         console.error("Axios error: ", error)
//       })
//   }

//   const handleSelectChange = event => {
//     setSelectedDeceased(event.target.value)
//     let deceased_id
//     // console.log('get funeral id', event.target.value)
//     if (event.target.value === "member") {
//       deceased_id = member._id
//     } else {
//       deceased_id = event.target.value
//     }
//     api
//       .get(`${baseUrl}/funeral/getFuneralId?deceased_id=${deceased_id}`)
//       .then(response => {
//         console.log("funeral Id : ", response.data)
//         setFuneralId(response.data)
//       })
//       .catch(error => {
//         console.error("Axios error: ", error)
//       })
//   }

  const saveAttendance = async ({ absentMemberIds , selectedDate}) => {
    const absentData = { date: new Date(selectedDate), absentArray: absentMemberIds }
    
    try {
      const response = await api.post(`${baseUrl}/meeting/absents`, { absentData })
      return response.data
    } catch (error) {
      console.error("Error saving attendance:", error)
      throw error
    }
  }

  return (
    <Layout>
      <AuthComponent onAuthStateChange={handleAuthStateChange} />
      <section>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            padding: "20px",
            gap: "50px",
          }}
        >
          {/* <Typography>සාමාජික අංකය</Typography>
          <TextField
            id="outlined-basic"
            label="Your ID"
            variant="outlined"
            type="number"
            value={memberId}
            onChange={e => setMemberId(e.target.value)}
            // onBlur={e => setMemberId(e.target.value)}
          /> */}
          {/* <Button variant="contained" onClick={getMemberById}>
            Search
          </Button> */}
          <Box
            sx={
              {
                // marginTop: "20px",
              }
            }
          >
            {/* <Typography>Deceased Options</Typography> */}
           
          </Box>
        </Box>
        {/* <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography>{member.name}</Typography>
          <Typography>{member.area}</Typography>
          <Typography>{member.mob_tel}</Typography>
          <Typography>{member.res_tel}</Typography>
        </Box> */}

        <AttendanceChart
          chartName={"Meeting Attendance"}
          saveAttendance={saveAttendance}
        ></AttendanceChart>
      </section>
    </Layout>
  )
}
