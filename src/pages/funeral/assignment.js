import React, { useState, useEffect } from "react"
// import Checkbox from "@mui/material/Checkbox"

import Layout from "../../components/layout"
import BasicDatePicker from "../../components/common/basicDatePicker"
import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
} from "@mui/material"
import StickyHeadTable from "../../components/StickyHeadTable" // Import the StickyHeadTable component
import dayjs from "dayjs"

import jsPDF from "jspdf"
import html2canvas from "html2canvas"

import { navigate } from "gatsby"
import api from "../../utils/api"
import loadable from "@loadable/component"
const AuthComponent = loadable(() =>
  import("../../components/common/AuthComponent")
)

const baseUrl = process.env.GATSBY_API_BASE_URL

// const Axios = require("axios")

export default function Assignment() {
  //un authorized access preventing
  const [roles, setRoles] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [memberId, setMemberId] = useState("")
  const [cemeteryAssignments, setCemeteryAssignments] = useState([])
  const [funeralAssignments, setFuneralAssignments] = useState([])
  const [allMembers, setAllMembers] = useState([])
  // const [dependents, setDependents] = useState([])
  const [member, setMember] = useState({})
  const [deceasedOptions, setDeceasedOptions] = useState([])
  const [selectedDeceased, setSelectedDeceased] = useState("")
  const [removedMembers, setRemovedMembers] = useState([]) // Track removed members
  const [releasedMembers, setReleasedMembers] = useState([]) // Track members with status 'free' or 'convenient'
  const [selectedDate, setSelectedDate] = useState(dayjs())

  const handleAuthStateChange = ({ isAuthenticated, roles }) => {
    setIsAuthenticated(isAuthenticated)
    setRoles(roles)
    if (!roles.includes("vice-secretary")) {
      navigate("/login/user-login")
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        let lastAssignedMember_id
        let lastRemovedMember_ids
        let allMembers = []
        let allAdmins = []

        // Fetch the last assigned member
        const fetchLastAssignedMember = async () => {
          await api
            .get(`${baseUrl}/funeral/getLastAssignmentInfo`)
            .then(response => {
              lastAssignedMember_id = response.data.lastMember_id
              lastRemovedMember_ids = response.data.removedMembers_ids
              // console.log("Last Member ID:", lastAssignedMember_id)
              // console.log("removedMembers:", lastRemovedMember_ids)}
            })
            .catch(error => {
              console.error("Error getting last assignment id:", error)
            })
        }

        // Fetch all members
        const fetchMembers = async () => {
          await api
            .get(`${baseUrl}/member/getActiveMembers`)
            .then(response => {
              console.log('allMembers: ',response.data.data)
              allMembers = response.data.data
            })
            .catch(error => {
              console.error("Error getting all members from DB:", error)
            })
        }
        // Fetch admins and area admins
        // console.log('area admins: ', member.area)
        const fetchAdmins = async () => {
          if (member.area) {
            await api
              .get(`${baseUrl}/member/getAdminsForFuneral?area=${member.area}`)
              .then(response => {
                console.log("Admins: ", response.data)
                allAdmins = response.data
              })
              .catch(error => {
                console.error("Error getting all members from DB:", error)
              })
          }
        }

        const filterMembers = () => {
          // Filter members beyond the last assigned member
          // and adding last removed members

          const nextMembers = allMembers.filter(
            member =>
              member.member_id > lastAssignedMember_id ||
              lastRemovedMember_ids.includes(member.member_id)
          )
          // console.log('nextMembers: ',nextMembers)

          // Members who are not free or convenient
          const activeMembers = nextMembers.filter(
            member =>
              member.status !== "free" &&
              member.status !== "convenient" &&
              member.status !== "Funeral-free" &&
              member.status !== "Attendance-free"
          )
          // console.log('activeMembers: ',activeMembers)
          //removing admins
          // console.log('allAdmins: ',allAdmins)
          const filteredMembers = activeMembers.filter(
            member => !allAdmins.includes(member.member_id)
          )
          console.log("lastRemovedMember_ids", lastRemovedMember_ids)

          // console.log('filteredMembers: ',filteredMembers)
          setAllMembers(filteredMembers)
          setCemeteryAssignments(filteredMembers.slice(0, 15)) // Assign first 15 to cemetery
          setFuneralAssignments(filteredMembers.slice(15, 30)) // Assign next 15 to funeral

          // Separate out 'free' or 'convenient' members
          const releasedMembers = nextMembers.filter(
            member =>
              member.member_id <= filteredMembers[14].member_id &&
              (member.status === "free" ||
                member.status === "convenient" ||
                member.status === "Funeral-free" ||
                member.status === "Attendance-free")
          )
          setReleasedMembers(releasedMembers)
        }
        // Execute sequentially
        await fetchLastAssignedMember()
        await fetchMembers()
        await fetchAdmins()
        filterMembers()
        // await nextMembers()
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [member.area])

  const getMemberById = e => {
    // console.log('search:', memberId)
    api
      .get(`${baseUrl}/member/getMembershipDeathById?member_id=${memberId}`)
      .then(response => {
        const data = response?.data?.data || {}
        console.log(data.member)
        setMember(data.member || {})
        // setDependents(data.dependents || [])

        // Prepare deceased options
        const deceased = []
        // console.log(data.member?.dateOfDeath)
        if (data.member?.dateOfDeath) {
          deceased.push({
            name: data.member.name,
            id: "member",
            isMember: true,
          })
        }
        data.dependents.forEach(dependent => {
          if (dependent.dateOfDeath) {
            deceased.push({
              name: dependent.name,
              id: dependent._id,
              isMember: false,
            })
          }
          // deceased.push({
          //   name: dependent.name,
          //   id: dependent._id,
          //   isMember: false,
          // });
        })
        setDeceasedOptions(deceased)
      })
      .catch(error => {
        console.error("Axios error: ", error)
      })
  }

  const handleSelectChange = event => {
    setSelectedDeceased(event.target.value)
  }

  const getNextMember = () => {
    return allMembers.find(
      member =>
        !cemeteryAssignments.includes(member) &&
        !funeralAssignments.includes(member) &&
        !removedMembers.includes(member)
    )
  }

  const handleRemoveMember = (type, index) => {
    if (type === "cemetery") {
      const updatedDiggers = [...cemeteryAssignments]
      const removedMember = updatedDiggers.splice(index, 1)[0]
      setRemovedMembers([...removedMembers, removedMember])

      // Move top member from parade to diggers
      const updatedParade = [...funeralAssignments]
      if (updatedParade.length > 0) {
        const paradeTopMember = updatedParade.shift()
        updatedDiggers.push(paradeTopMember)
      }

      // Add new member to parade
      const nextMember = getNextMember()
      if (nextMember) updatedParade.push(nextMember)

      setCemeteryAssignments(updatedDiggers)
      setFuneralAssignments(updatedParade)
    } else if (type === "parade") {
      const updatedParade = [...funeralAssignments]
      const removedMember = updatedParade.splice(index, 1)[0]
      setRemovedMembers([...removedMembers, removedMember])

      // Add new member to parade
      const nextMember = getNextMember()
      if (nextMember) updatedParade.push(nextMember)

      setFuneralAssignments(updatedParade)
    }
  }

  const columnsArray = [
    { id: "member_id", label: "සා. අංකය" },
    { id: "name", label: "නම" },
    {
      id: "remove",
      label: "Remove",
      //   minWidth: 100,
      renderCell: (row, index, type) => (
        <Button
          variant="outlined"
          color="inherit"
          sx={{ width: "20px", height: "20px" }}
          onClick={() => handleRemoveMember(type, index)}
        ></Button>
      ),
    },
  ]

  const formatDataForTable = (dataArray, type) =>
    dataArray.map((member, index) => ({
      member_id: member.member_id,
      name: member.name,
      remove: (
        <Button
          variant="outlined"
          color="inherit"
          sx={{ height: "30px" }}
          onClick={() => handleRemoveMember(type, index)}
        ></Button>
      ),
    }))

  const saveDuties = () => {
    console.log("removed: ", removedMembers)
    api
      .post(`${baseUrl}/funeral/createFuneral`, {
        date: selectedDate.format("YYYY-MM-DD"),
        member_id: member._id,
        deceased_id: selectedDeceased,
        cemeteryAssignments: cemeteryAssignments.map(member => ({
          _id: member._id,
          member_id: member.member_id,
          name: member.name,
        })),
        funeralAssignments: funeralAssignments.map(member => ({
          _id: member._id,
          member_id: member.member_id,
          name: member.name,
        })),
        removedMembers: removedMembers.map(member => ({
          _id: member._id,
          member_id: member.member_id,
          name: member.name,
        })), // Include removed members
      })
      .then(response => {
        console.log("Funeral duties saved successfully:", response.data)
        setSelectedDeceased("")
        setRemovedMembers([])
        setReleasedMembers([])
        setCemeteryAssignments([])
        setFuneralAssignments([])
      })
      .catch(error => {
        console.error("Error saving funeral duties:", error)
      })
  }

  const saveAsPDF = () => {
    const input = document.getElementById("assignments-content") // Target the content
    html2canvas(input, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")
      const imgWidth = 210 // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      pdf.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight)
      pdf.save("assignments.pdf")
    })
  }
  return (
    <Layout>
      <AuthComponent onAuthStateChange={handleAuthStateChange} />
      <section>
        <Typography variant="h6">අවමංගල්‍ය උත්සවයේ පැවරීම්</Typography>
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
            onChange={e => {
              setMemberId(e.target.value)
              setDeceasedOptions([])
            }}
            // onBlur={getMemberById}
          />
          <Button variant="contained" onClick={getMemberById}>
            Search
          </Button>
          <Box>
            {/* <Typography>Deceased Options</Typography> */}
            <Select
              value={selectedDeceased}
              onChange={handleSelectChange}
              fullWidth
              displayEmpty
            >
              <MenuItem value="" disabled>
                තෝරන්න
              </MenuItem>
              {deceasedOptions.map(option => (
                <MenuItem key={option.id} value={option.id}>
                  {option.isMember ? `${option.name}` : `${option.name}`}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
        <hr />
        {selectedDeceased && (
          <Box>
            <Box id="assignments-content">
              {/* assignments */}
              <Box
                sx={{
                  display: "flex",
                  gap: "20px",
                  alignItems: "stretch",
                  justifyContent: "space-between",
                  border: "1px solid #000",
                }}
              >
                <Box sx={{ width: "50%", border: "1px solid #000" }}>
                  <Typography
                    sx={{
                      textAlign: "center",
                      // mb: 2,
                      border: "1px solid #000",
                      mb: 0,
                    }}
                  >
                    සුසාන භුමියේ කටයුතු
                  </Typography>
                  <StickyHeadTable
                    columnsArray={columnsArray}
                    dataArray={formatDataForTable(
                      cemeteryAssignments,
                      "cemetery"
                    )}
                    headingAlignment="center"
                    dataAlignment="left"
                    firstPage={15}
                    totalRow={false}
                    hidePagination={true}
                    borders={true}
                  />
                </Box>
                <Box sx={{ width: "50%", border: "1px solid #000" }}>
                  <Typography
                    sx={{
                      textAlign: "center",
                      // mb: 2,
                      border: "1px solid #000",
                      mb: 0,
                    }}
                  >
                    දේහය ගෙනයාම
                  </Typography>

                  <StickyHeadTable
                    columnsArray={columnsArray}
                    dataArray={formatDataForTable(funeralAssignments, "parade")}
                    headingAlignment="center"
                    dataAlignment="left"
                    firstPage={15}
                    totalRow={false}
                    hidePagination={true}
                    borders={true}
                  />
                </Box>
              </Box>
              {/* released members */}
              <Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography>විශේෂයෙන් නිදහස් කල සාමාජිකයන් :- </Typography>
                  <Box sx={{ display: "flex" }}>
                    {removedMembers.map((val, key) => {
                      return (
                        <Typography key={key}>{val.member_id}, </Typography>
                      )
                    })}
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography>
                    සුසාන භුමි වැඩ වලින් නිදහස් සාමාජිකයන් : -{" "}
                  </Typography>
                  <Box sx={{ display: "flex" }}>
                    {releasedMembers.map((val, key) => {
                      return (
                        <Typography key={key}>{val.member_id}, </Typography>
                      )
                    })}
                  </Box>
                </Box>
              </Box>
            </Box>
            {/* actions */}
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <BasicDatePicker
                  heading="Select Date"
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                />
                <Button onClick={saveAsPDF} variant="contained">
                  Download PDF
                </Button>
                <Button onClick={saveDuties} variant="contained">
                  Save Funeral Duties
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </section>
    </Layout>
  )
}
