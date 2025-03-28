import React, { useState, useEffect } from "react"
import { Box, Typography, Button, Checkbox, Paper, Grid2 } from "@mui/material"
// import Grid2 from "@mui/material/Unstable_Grid2";
// import BasicDatePicker from "./basicDatePicker"

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
  const chunkSize = 300 // Define 100 cells per group
  const [memberIds, setMemberIds] = useState([])
  const [attendance, setAttendance] = useState([])
  const [selectedDate, setSelectedDate] = useState(dayjs()) // Initialize with today's date
  const [memberIdMap, setMemberIdMap] = useState({}) // Map for quick lookup

  useEffect(() => {
    api
      .get(`${baseUrl}/member/getMembersForMeetingAttendance`)
      .then(response => {
        const ids = response.data.memberIds || []
        // console.log(ids)
        setMemberIds(ids)
        const idMap = {}
        ids.forEach(id => {
          idMap[id] = true // Mark valid member IDs
        })
        // console.log("idMap: ", idMap)
        setMemberIdMap(idMap)
        setAttendance(ids.map(() => false)) // Initialize attendance only for valid IDs
      })
  }, [])
  // console.log(memberIdMap)
  // Calculate total attendance (checked cells)
  const totalAttendance = attendance.filter(value => value).length

  // Toggle individual checkbox
  const handleToggle = index => {
    const updatedAttendance = [...attendance]
    updatedAttendance[index] = !updatedAttendance[index]
    setAttendance(updatedAttendance)
  }

  // Check all checkboxes (only for enabled cells)
  const handleCheckAll = () => {
    setAttendance(attendance.map((_, index) => memberIdMap[memberIds[index]]))
  }

  // Uncheck all checkboxes
  const handleUncheckAll = () => {
    setAttendance(attendance.map(() => false)) // Uncheck all cells
  }

  const handleSubmit = () => {
    // const date = selectedDate.format("YYYY-MM-DD")

    // Filter and map attendance to get only absent member IDs
    const absentMemberIds = attendance
      .map((checked, index) => (!checked ? memberIds[index] : null))
      .filter(id => id !== null)
    // console.log("absentMemberIds: ", absentMemberIds)
    // Pass only the absent member IDs and date to saveAttendance
    saveAttendance({ absentMemberIds, selectedDate })
    handleUncheckAll()
  }

  // Generate 100 cells per group, disabling invalid memberIds
  const totalCells = Math.ceil(Math.max(...memberIds) / chunkSize) * chunkSize
  // console.log('totalCells :', totalCells)
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
  // console.log('chunk: ', chunks)
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
          setSelectedDate={setSelectedDate}
        />
      </Box>

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
        >
          Check All
        </Button>
        <Button onClick={handleUncheckAll} variant="outlined" color="secondary">
          Uncheck All
        </Button>
      </Box>

      {/* Render groups */}
      {chunks.map((chunk, chunkIndex) => (
        <Paper key={chunkIndex} sx={{ padding: 2, marginBottom: 2 }}>
          {/* <Typography variant="h6" align="center" gutterBottom>
            Group {chunkIndex + 1} (Cells {chunkIndex * chunkSize + 1} to{" "}
            {(chunkIndex + 1) * chunkSize})
          </Typography> */}
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
                        ? "#e0fffa" // Checked color
                        : "#c93330" // Unchecked color
                      : "#e0e0e0", // Disabled color
                    // fontWeight: "bold",
                    // fontSize: "1.8rem",
                  }}
                >
                  <Typography variant="body2" sx={{ marginBottom: 0.5 }}>
                    {cell.id} {/* Cell number */}
                  </Typography>
                  <Checkbox
                    checked={cell.isChecked}
                    disabled={!cell.isEnabled}
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
        <Button onClick={handleSubmit} variant="contained" color="success">
          Submit Attendance
        </Button>
      </Box>
    </Box>
  )
}
