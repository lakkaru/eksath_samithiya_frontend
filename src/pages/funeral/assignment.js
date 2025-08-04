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
  const [areaAdminInfo, setAreaAdminInfo] = useState({})
  const [deceasedOptions, setDeceasedOptions] = useState([])
  const [selectedDeceased, setSelectedDeceased] = useState("")
  const [selectedDeceasedInfo, setSelectedDeceasedInfo] = useState({})
  const [removedMembers, setRemovedMembers] = useState([]) // Track removed members
  const [releasedMembers, setReleasedMembers] = useState([]) // Track members with status 'free' or 'convenient'
  const [selectedDate, setSelectedDate] = useState(dayjs())

  const handleAuthStateChange = ({ isAuthenticated, roles }) => {
    setIsAuthenticated(isAuthenticated)
    setRoles(roles)
    if (!isAuthenticated || !roles.includes("vice-secretary")) {
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
              // console.log('allMembers: ',response.data.data)
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
                // console.log("Admins: ", response.data)
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
              member.status !== "funeral-free" &&
              member.status !== "attendance-free"
          )
          // console.log('activeMembers: ',activeMembers)
          //removing admins
          // console.log('allAdmins: ',allAdmins)
          const filteredMembers = activeMembers.filter(
            member => !allAdmins.includes(member.member_id)
          )
          // console.log("lastRemovedMember_ids", lastRemovedMember_ids)

          // console.log('filteredMembers: ',filteredMembers)
          setAllMembers(filteredMembers)
          setCemeteryAssignments(filteredMembers.slice(0, 15)) // Assign first 15 to cemetery
          setFuneralAssignments(filteredMembers.slice(15, 30)) // Assign next 15 to funeral

          // Separate out 'free' or 'convenient' members
          const releasedMembers = nextMembers.filter(
            member =>
              member.member_id <= filteredMembers[30].member_id &&
              (member.status === "free" ||
                member.status === "funeral-free" ||
                member.status === "attendance-free")
          )
          setReleasedMembers(releasedMembers)
          // console.log('releasedMembers: ', releasedMembers)
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

  const getMemberById = async e => {
    // console.log('search:', memberId)
    try {
      const response = await api.get(`${baseUrl}/member/getMembershipDeathById?member_id=${memberId}`)
      const data = response?.data?.data || {}
      console.log(data.member)
      setMember(data.member || {})
      // setDependents(data.dependents || [])

      // Fetch area admin information
      if (data.member?.area) {
        try {
          const adminResponse = await api.get(`${baseUrl}/member/getAreaAdminByArea?area=${data.member.area}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
          })
          setAreaAdminInfo(adminResponse.data || {})
        } catch (adminError) {
          console.error("Error fetching area admin:", adminError)
          setAreaAdminInfo({})
        }
      }

      // Prepare deceased options
      const deceased = []
      // console.log(data.member?.dateOfDeath)
      if (data.member?.dateOfDeath) {
        deceased.push({
          name: data.member.name,
          id: "member",
          isMember: true,
          relationship: null
        })
      }
      data.dependents.forEach(dependent => {
        if (dependent.dateOfDeath) {
          deceased.push({
            name: dependent.name,
            id: dependent._id,
            isMember: false,
            relationship: dependent.relationship
          })
        }
        // deceased.push({
        //   name: dependent.name,
        //   id: dependent._id,
        //   isMember: false,
        // });
      })
      setDeceasedOptions(deceased)
    } catch (error) {
      console.error("Axios error: ", error)
    }
  }

  const handleSelectChange = event => {
    const selectedId = event.target.value
    setSelectedDeceased(selectedId)
    
    // Find the selected deceased info for PDF generation
    const selectedInfo = deceasedOptions.find(option => option.id === selectedId)
    setSelectedDeceasedInfo(selectedInfo || {})
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
    { id: "attendance", label: "" }, // Blank column for attendance marking
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

  // Columns for PDF (without remove button but with attendance column)
  const pdfColumnsArray = [
    { id: "member_id", label: "සා. අංකය" },
    { id: "name", label: "නම" },
    { id: "attendance", label: "" } // Blank column for attendance marking
  ]

  const formatDataForTable = (dataArray, type) =>
    dataArray.map((member, index) => ({
      member_id: member.member_id,
      name: member.name,
      attendance: "", // Blank field for attendance marking
      remove: (
        <Button
          variant="outlined"
          color="inherit"
          sx={{ height: "30px" }}
          onClick={() => handleRemoveMember(type, index)}
        ></Button>
      ),
    }))

  // Format data for PDF (without remove column but with attendance column)
  const formatDataForPDF = (dataArray) =>
    dataArray.map((member) => ({
      member_id: member.member_id,
      name: member.name,
      attendance: "" // Blank field for attendance marking
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

  const generateHeaderContent = () => {
    if (!member || !selectedDeceasedInfo || !areaAdminInfo) return ""
    
    const deceasedName = selectedDeceasedInfo.isMember 
      ? member.name 
      : selectedDeceasedInfo.name
    
    const relationshipText = selectedDeceasedInfo.isMember 
      ? "" 
      : `${selectedDeceasedInfo.relationship} වන ${selectedDeceasedInfo.name}`
    
    const deathSubject = selectedDeceasedInfo.isMember 
      ? "ගේ අභාවය" 
      : `${relationshipText} ගේ අභාවය`
    
    const formattedDate = selectedDate.format('YYYY/MM/DD')
    
    const adminName = areaAdminInfo.admin?.name || ""
    const helper1Name = areaAdminInfo.helper1?.name || ""
    const helper2Name = areaAdminInfo.helper2?.name || ""
    
    return `විල්බාගෙදර එක්සත් අවමංග්‍යාධාර සමිතිය
විල්බාගෙදර වැව් ඉහල ගංගොඩ පදිංචිව සිටි සාමාජික අංක ${member.member_id} :- ${member.name} ${deathSubject} පිලිබඳ අවසන් කටයුතු කිරීම ${formattedDate} දින ${member.area} කාරක සභික ${adminName} ගේ ප්‍රධානත්වයෙන් ${helper1Name} සහ ${helper2Name} ගේ සහයෝගිත්ව යෙනි.`
  }

  const saveAsPDF = () => {
    // Create a temporary container for the PDF content
    const tempContainer = document.createElement('div')
    tempContainer.style.padding = '36px' // 0.5 inch margins (36px = 0.5 inch at 72 DPI)
    tempContainer.style.fontFamily = 'Arial, sans-serif'
    tempContainer.style.backgroundColor = 'white'
    tempContainer.style.fontSize = '14px' // Increased from 12px
    tempContainer.style.lineHeight = '1.5'
    tempContainer.style.width = '210mm' // A4 width
    tempContainer.style.minHeight = '297mm' // A4 height
    tempContainer.style.boxSizing = 'border-box'
    
    // Add main header - centered and underlined
    const mainHeaderDiv = document.createElement('div')
    mainHeaderDiv.style.textAlign = 'center'
    mainHeaderDiv.style.fontSize = '18px' // Increased from 16px
    mainHeaderDiv.style.fontWeight = 'bold'
    mainHeaderDiv.style.marginBottom = '20px'
    mainHeaderDiv.style.textDecoration = 'underline'
    mainHeaderDiv.innerHTML = 'විල්බාගෙදර එක්සත් අවමංග්‍යාධාර සමිතිය'
    tempContainer.appendChild(mainHeaderDiv)
    
    // Add content header
    const contentHeaderDiv = document.createElement('div')
    contentHeaderDiv.style.marginBottom = '30px'
    contentHeaderDiv.style.lineHeight = '1.6'
    contentHeaderDiv.style.fontSize = '14px' // Increased from 12px
    contentHeaderDiv.style.textAlign = 'justify'
    
    const headerContent = generateHeaderContent()
    const contentWithoutMainTitle = headerContent.replace('විල්බාගෙදර එක්සත් අවමංග්‍යාධාර සමිතිය\n', '')
    contentHeaderDiv.innerHTML = contentWithoutMainTitle
    tempContainer.appendChild(contentHeaderDiv)
    
    // Add a separator line
    const separator = document.createElement('hr')
    separator.style.marginBottom = '20px'
    separator.style.border = '1px solid #000'
    separator.style.width = '100%'
    tempContainer.appendChild(separator)
    
    // Create assignments section manually for PDF (without Remove buttons)
    const assignmentsDiv = document.createElement('div')
    assignmentsDiv.style.display = 'flex'
    assignmentsDiv.style.gap = '20px'
    assignmentsDiv.style.marginBottom = '30px'
    
    // Cemetery assignments table
    const cemeteryDiv = document.createElement('div')
    cemeteryDiv.style.width = '50%'
    cemeteryDiv.style.border = '1px solid #000'
    
    const cemeteryHeader = document.createElement('div')
    cemeteryHeader.style.textAlign = 'center'
    cemeteryHeader.style.border = '1px solid #000'
    cemeteryHeader.style.padding = '8px'
    cemeteryHeader.style.fontWeight = 'bold'
    cemeteryHeader.style.fontSize = '14px'
    cemeteryHeader.innerHTML = 'සුසාන භුමියේ කටයුතු'
    cemeteryDiv.appendChild(cemeteryHeader)
    
    const cemeteryTable = document.createElement('table')
    cemeteryTable.style.width = '100%'
    cemeteryTable.style.borderCollapse = 'collapse'
    cemeteryTable.style.fontSize = '13px'
    
    // Cemetery table header
    const cemeteryTableHeader = document.createElement('tr')
    cemeteryTableHeader.innerHTML = `
      <th style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold;">සා. අංකය</th>
      <th style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold;">නම</th>
      <th style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold; width: 40px;"></th>
    `
    cemeteryTable.appendChild(cemeteryTableHeader)
    
    // Cemetery table rows
    cemeteryAssignments.forEach(member => {
      const row = document.createElement('tr')
      row.innerHTML = `
        <td style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold;">${member.member_id}</td>
        <td style="border: 1px solid #000; padding: 6px; text-align: left;">${member.name}</td>
        <td style="border: 1px solid #000; padding: 6px; text-align: center; width: 40px;"></td>
      `
      cemeteryTable.appendChild(row)
    })
    
    cemeteryDiv.appendChild(cemeteryTable)
    assignmentsDiv.appendChild(cemeteryDiv)
    
    // Funeral assignments table
    const funeralDiv = document.createElement('div')
    funeralDiv.style.width = '50%'
    funeralDiv.style.border = '1px solid #000'
    
    const funeralHeader = document.createElement('div')
    funeralHeader.style.textAlign = 'center'
    funeralHeader.style.border = '1px solid #000'
    funeralHeader.style.padding = '8px'
    funeralHeader.style.fontWeight = 'bold'
    funeralHeader.style.fontSize = '14px'
    funeralHeader.innerHTML = 'දේහය ගෙනයාම'
    funeralDiv.appendChild(funeralHeader)
    
    const funeralTable = document.createElement('table')
    funeralTable.style.width = '100%'
    funeralTable.style.borderCollapse = 'collapse'
    funeralTable.style.fontSize = '13px'
    
    // Funeral table header
    const funeralTableHeader = document.createElement('tr')
    funeralTableHeader.innerHTML = `
      <th style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold;">සා. අංකය</th>
      <th style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold;">නම</th>
      <th style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold; width: 40px;"></th>
    `
    funeralTable.appendChild(funeralTableHeader)
    
    // Funeral table rows
    funeralAssignments.forEach(member => {
      const row = document.createElement('tr')
      row.innerHTML = `
        <td style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold;">${member.member_id}</td>
        <td style="border: 1px solid #000; padding: 6px; text-align: left;">${member.name}</td>
        <td style="border: 1px solid #000; padding: 6px; text-align: center; width: 40px;"></td>
      `
      funeralTable.appendChild(row)
    })
    
    funeralDiv.appendChild(funeralTable)
    assignmentsDiv.appendChild(funeralDiv)
    
    tempContainer.appendChild(assignmentsDiv)
    
    // Add released members section
    const releasedDiv = document.createElement('div')
    releasedDiv.style.marginBottom = '30px'
    releasedDiv.style.fontSize = '13px'
    
    const removedMembersText = removedMembers.map(m => m.member_id).join(', ')
    const releasedMembersText = releasedMembers.map(m => m.member_id).join(', ')
    
    releasedDiv.innerHTML = `
      <div style="margin-bottom: 10px;">විශේෂයෙන් නිදහස් කල සාමාජිකයන් :- ${removedMembersText}</div>
      <div>සුසාන භුමි වැඩ වලින් නිදහස් සාමාජිකයන් :- ${releasedMembersText}</div>
    `
    tempContainer.appendChild(releasedDiv)
    
    // Add footer with signature section
    const footerDiv = document.createElement('div')
    footerDiv.style.marginTop = '60px'
    footerDiv.style.fontSize = '14px' // Increased from 12px
    footerDiv.style.lineHeight = '1.6'
    
    const footerContent = `
      <div style="margin-bottom: 20px;">ස්තුතියි.</div>
      <div style="margin-bottom: 10px;">මෙයට,</div>
      <div style="margin-bottom: 40px;"></div>
      <div>උප ලේකම්.</div>
    `
    footerDiv.innerHTML = footerContent
    tempContainer.appendChild(footerDiv)
    
    // Temporarily add to document
    document.body.appendChild(tempContainer)
    
    html2canvas(tempContainer, { 
      scale: 2,
      useCORS: true,
      allowTaint: true,
      width: tempContainer.scrollWidth,
      height: tempContainer.scrollHeight
    }).then(canvas => {
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")
      
      // Calculate dimensions to fit A4 with proper margins
      const pdfWidth = 210 // A4 width in mm
      const pdfHeight = 297 // A4 height in mm
      const imgWidth = pdfWidth - 25.4 // Subtract 1 inch total margin (0.5 inch each side)
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      // Center the content
      const xOffset = 12.7 // 0.5 inch left margin
      const yOffset = 10
      
      if (imgHeight <= pdfHeight - 20) {
        // Content fits on one page
        pdf.addImage(imgData, "PNG", xOffset, yOffset, imgWidth, imgHeight)
      } else {
        // Content spans multiple pages
        let remainingHeight = imgHeight
        let yPosition = 0
        
        while (remainingHeight > 0) {
          const pageHeight = Math.min(remainingHeight, pdfHeight - 20)
          
          pdf.addImage(
            imgData, 
            "PNG", 
            xOffset, 
            yOffset, 
            imgWidth, 
            pageHeight,
            undefined,
            'FAST',
            0,
            -yPosition
          )
          
          remainingHeight -= pageHeight
          yPosition += pageHeight
          
          if (remainingHeight > 0) {
            pdf.addPage()
          }
        }
      }
      
      pdf.save("funeral-assignments.pdf")
      
      // Remove temporary container
      document.body.removeChild(tempContainer)
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
            {/* PDF Header Preview */}
            <Box sx={{ 
              mb: 3, 
              p: 2, 
              border: '1px solid #ccc', 
              borderRadius: 1, 
              backgroundColor: '#f9f9f9' 
            }}>
              <Typography variant="h6" sx={{ mb: 1, color: '#1976d2' }}>
                PDF හි ඇතුළත් වන තොරතුරු:
              </Typography>
              <Typography variant="body1" sx={{ 
                fontWeight: 'bold', 
                textAlign: 'center', 
                textDecoration: 'underline',
                mb: 2 
              }}>
                විල්බාගෙදර එක්සත් අවමංග්‍යාධාර සමිතිය
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.6, mb: 3 }}>
                {generateHeaderContent().replace('විල්බාගෙදර එක්සත් අවමංග්‍යාධාර සමිතිය\n', '')}
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.6, fontStyle: 'italic' }}>
                <strong>අවසානයේ ඇතුළත් වන අත්සන කොටස:</strong><br/>
                ස්තුතියි.<br/><br/>
                මෙයට,<br/><br/><br/>
                .............................<br/>
                උප ලේකම්.
              </Typography>
            </Box>
            
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
                      border: "1px solid #000",
                      mb: 0,
                      py: 1, // Add consistent vertical padding
                      minHeight: "40px", // Ensure consistent height
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
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
                      border: "1px solid #000",
                      mb: 0,
                      py: 1, // Add consistent vertical padding
                      minHeight: "40px", // Ensure consistent height
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
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
