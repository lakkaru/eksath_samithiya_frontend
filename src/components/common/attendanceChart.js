import React, { useState, useEffect } from "react"
import { Box, Typography, Button, Checkbox, Paper, Grid2, Alert } from "@mui/material"

import dayjs from "dayjs"
import Axios from "axios"

import { navigate } from "gatsby"
import api from "../../utils/api"
import loadable from "@loadable/component"
import BasicDatePicker from "./basicDatePicker"

const AuthComponent = loadable(() =>
  import("../../components/common/AuthComponent")
)

// const Axios = require("axios")
const baseUrl = process.env.GATSBY_API_BASE_URL

export default function AttendanceChart({ chartName, saveAttendance }) {
  const chunkSize = 300 // Define 300 cells per group
  const [memberIds, setMemberIds] = useState([])
  const [attendance, setAttendance] = useState([])
  const [selectedDate, setSelectedDate] = useState(dayjs()) // Initialize with today's date
  const [memberIdMap, setMemberIdMap] = useState({}) // Map for quick lookup
  const [existingMeeting, setExistingMeeting] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  // Fetch member IDs for meeting attendance
  useEffect(() => {
    api
      .get(`${baseUrl}/member/getMembersForMeetingAttendance`)
      .then(response => {
        const ids = response.data.memberIds || []
        setMemberIds(ids)
        const idMap = {}
        ids.forEach(id => {
          idMap[id] = true // Mark valid member IDs
        })
        setMemberIdMap(idMap)
        setAttendance(ids.map(() => false)) // Initialize attendance only for valid IDs
      })
      .catch(error => {
        console.error("Error fetching member IDs:", error)
        setMessage({ type: 'error', text: 'Failed to load member data' })
      })
  }, [])

  // Fetch existing meeting data when date changes
  useEffect(() => {
    if (selectedDate && memberIds.length > 0) {
      fetchMeetingByDate(selectedDate.format("YYYY-MM-DD"))
    }
  }, [selectedDate, memberIds])

  const fetchMeetingByDate = async (date) => {
    setIsLoading(true)
    setMessage({ type: '', text: '' })
    
    try {
      const response = await api.get(`${baseUrl}/meeting/attendance/date?date=${date}`)
      const meetingData = response.data.meeting
      
      if (meetingData) {
        setExistingMeeting(meetingData)
        // Update attendance based on existing absent data
        const updatedAttendance = memberIds.map(memberId => 
          !meetingData.absents.includes(memberId)
        )
        setAttendance(updatedAttendance)
        setMessage({ 
          type: 'info', 
          text: `Loaded existing meeting data for ${dayjs(meetingData.date).format('YYYY-MM-DD')}` 
        })
      } else {
        setExistingMeeting(null)
        // Reset attendance for new date
        setAttendance(memberIds.map(() => false))
        setMessage({ type: 'info', text: 'No existing meeting found for this date' })
      }
    } catch (error) {
      console.error("Error fetching meeting by date:", error)
      setExistingMeeting(null)
      setAttendance(memberIds.map(() => false))
      setMessage({ type: 'error', text: 'Failed to load meeting data' })
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate total attendance (checked cells)
  const totalAttendance = attendance.filter(value => value).length

  // Toggle individual checkbox
  const handleToggle = index => {
    const updatedAttendance = [...attendance]
    updatedAttendance[index] = !updatedAttendance[index]
    setAttendance(updatedAttendance)
    setMessage({ type: '', text: '' }) // Clear messages when user interacts
  }

  // Check all checkboxes (only for enabled cells)
  const handleCheckAll = () => {
    setAttendance(attendance.map((_, index) => memberIdMap[memberIds[index]]))
    setMessage({ type: '', text: '' })
  }

  // Uncheck all checkboxes
  const handleUncheckAll = () => {
    setAttendance(attendance.map(() => false)) // Uncheck all cells
    setMessage({ type: '', text: '' })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setMessage({ type: '', text: '' })

    try {
      // Filter and map attendance to get only absent member IDs
      const absentMemberIds = attendance
        .map((checked, index) => (!checked ? memberIds[index] : null))
        .filter(id => id !== null)

      // Pass only the absent member IDs and date to saveAttendance
      await saveAttendance({ absentMemberIds, selectedDate })
      
      const actionText = existingMeeting ? 'updated' : 'saved'
      setMessage({ 
        type: 'success', 
        text: `Meeting attendance ${actionText} successfully!` 
      })
      
      // Refresh the meeting data to show updated state
      await fetchMeetingByDate(selectedDate.format("YYYY-MM-DD"))
      
    } catch (error) {
      console.error("Error saving attendance:", error)
      setMessage({ type: 'error', text: 'Failed to save attendance' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate)
    setMessage({ type: '', text: '' })
  }

  // Generate cells based on maximum member ID, disabling invalid memberIds
  const totalCells = Math.ceil(Math.max(...memberIds) / chunkSize) * chunkSize
  const cells = Array.from({ length: totalCells }, (_, i) => ({
    id: i + 1,
    isEnabled: memberIdMap[i + 1] || false,
    isChecked: memberIdMap[i + 1]
      ? attendance[memberIds.indexOf(i + 1)]
      : false,
  }))

  const chunks = Array.from(
    { length: Math.ceil(cells.length / chunkSize) },
    (_, i) => cells.slice(i * chunkSize, (i + 1) * chunkSize)
  )

  return (
    <Box sx={{ padding: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "end",
          justifyContent: "center",
          gap: 4,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          {chartName}
        </Typography>
        <BasicDatePicker
          selectedDate={selectedDate}
          setSelectedDate={handleDateChange}
        />
      </Box>

      {/* Status Messages */}
      {message.text && (
        <Box sx={{ marginBottom: 2 }}>
          <Alert severity={message.type} onClose={() => setMessage({ type: '', text: '' })}>
            {message.text}
          </Alert>
        </Box>
      )}

      {/* Meeting Status */}
      {existingMeeting && (
        <Box sx={{ marginBottom: 2, textAlign: 'center' }}>
          <Typography variant="body1" color="primary">
            Editing existing meeting from {dayjs(existingMeeting.date).format('YYYY-MM-DD')}
          </Typography>
        </Box>
      )}

      {/* Total Attendance */}
      <Typography variant="h6" align="center" gutterBottom>
        Total Attendance: {totalAttendance} / {memberIds.length}
      </Typography>

      {/* Buttons to check/uncheck all */}
      <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}>
        <Button
          onClick={handleCheckAll}
          variant="contained"
          color="primary"
          sx={{ marginRight: 2 }}
          disabled={isLoading}
        >
          Check All
        </Button>
        <Button 
          onClick={handleUncheckAll} 
          variant="outlined" 
          color="secondary"
          disabled={isLoading}
        >
          Uncheck All
        </Button>
      </Box>

      {/* Render groups */}
      {chunks.map((chunk, chunkIndex) => (
        <Paper key={chunkIndex} sx={{ padding: 2, marginBottom: 2 }}>
          <Grid2 container spacing={1} justifyContent="center">
            {chunk.map(cell => (
              <Grid2 key={cell.id}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    border: "2px solid #ddd",
                    padding: 1,
                    width: 50,
                    height: 50,
                    justifyContent: "center",
                    borderRadius: "4px",
                    backgroundColor: cell.isEnabled
                      ? cell.isChecked
                        ? "#e0fffa" // Checked color (present)
                        : "#c93330" // Unchecked color (absent)
                      : "#e0e0e0", // Disabled color
                    opacity: isLoading ? 0.6 : 1,
                  }}
                >
                  <Typography variant="body2" sx={{ marginBottom: 0.5 }}>
                    {cell.id} {/* Cell number */}
                  </Typography>
                  <Checkbox
                    checked={cell.isChecked}
                    disabled={!cell.isEnabled || isLoading}
                    onChange={() => handleToggle(memberIds.indexOf(cell.id))}
                    size="small"
                    color="primary"
                  />
                </Box>
              </Grid2>
            ))}
          </Grid2>
        </Paper>
      ))}

      {/* Submit Button */}
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="success"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : existingMeeting ? 'Update Attendance' : 'Submit Attendance'}
        </Button>
      </Box>
    </Box>
  )
}
