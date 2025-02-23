import React, { useState, useEffect } from "react"
import { Box, Typography, Button, Checkbox, Paper, Grid2 } from "@mui/material"
// import Grid2 from "@mui/material/Unstable_Grid2";
import BasicDatePicker from "./basicDatePicker"

import dayjs from "dayjs"
// import Axios from "axios"

export default function AttendanceChart({ chartName, saveAttendance, memberIds, memberIdMap, setAttendance, attendance}) {
  const chunkSize = 100 // Define 100 cells per group
//   const [memberIds, setMemberIds] = useState(memberIds)
  
  const [selectedDate, setSelectedDate] = useState(dayjs()) // Initialize with today's date
//   const [memberIdMap, setMemberIdMap] = useState(memberIdMap) // Map for quick lookup

  useEffect(() => {
    setAttendance(memberIds.map(() => false))
  }, [])

  // Calculate total attendance (checked cells)
  const totalAttendance = attendance.filter(value => value).length

  // Toggle individual checkbox
  const handleToggle = index => {
    const updatedAttendance = [...attendance]
    updatedAttendance[index] = !updatedAttendance[index]
    setAttendance(updatedAttendance)
    console.log(updatedAttendance)
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
    const date = selectedDate.format("YYYY-MM-DD")

    // Filter and map attendance to get only absent member IDs
    const absentMemberIds = attendance
      .map((checked, index) => (!checked ? memberIds[index] : null))
      .filter(id => id !== null)

    // Pass only the absent member IDs and date to saveAttendance
    saveAttendance({ absentMemberIds, date })
    handleUncheckAll()
  }

  // Generate 100 cells per group, disabling invalid memberIds
  const totalCells = Math.ceil(memberIds.length / chunkSize) * chunkSize
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
          <Typography variant="h6" align="center" gutterBottom>
            Group {chunkIndex + 1} (Cells {chunkIndex * chunkSize + 1} to{" "}
            {(chunkIndex + 1) * chunkSize})
          </Typography>
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
