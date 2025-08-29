import React, { useState } from "react"
import { navigate } from "gatsby"
import {
  Button,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material"
import {
  Groups as GroupsIcon,
  MonetizationOn as MonetizationOnIcon,
  Person as PersonIcon,
} from "@mui/icons-material"

const ViceSecretaryMenu = ({ isViceSecretary }) => {
  const [attendanceAnchorEl, setAttendanceAnchorEl] = useState(null)
  const [membershipAnchorEl, setMemberShipAnchorEl] = useState(null)
  const [membershipViceSecAnchorEl, setMembershipViceSecAnchorEl] = useState(null)

  const handleAttendanceMenuOpen = event => setAttendanceAnchorEl(event.currentTarget)
  const handleAttendanceMenuClose = () => setAttendanceAnchorEl(null)
  const handleMembershipMenuOpen = event => setMemberShipAnchorEl(event.currentTarget)
  const handleMembershipMenuClose = () => setMemberShipAnchorEl(null)
  const handleMembershipViceSecMenuOpen = event => setMembershipViceSecAnchorEl(event.currentTarget)
  const handleMembershipViceSecMenuClose = () => setMembershipViceSecAnchorEl(null)

  if (!isViceSecretary) return null

  return (
    <>
      <Button
        variant="outlined"
        color="inherit"
        onClick={handleAttendanceMenuOpen}
        startIcon={<GroupsIcon />}
        sx={{
          textTransform: "none",
          borderColor: "rgba(255,255,255,0.3)",
          backgroundColor: "rgba(255,255,255,0.1)",
          "&:hover": {
            borderColor: "rgba(255,255,255,0.5)",
            backgroundColor: "rgba(255,255,255,0.2)",
          },
        }}
      >
        පැමිණීම
      </Button>
      <Menu
        anchorEl={attendanceAnchorEl}
        open={Boolean(attendanceAnchorEl)}
        onClose={handleAttendanceMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 2,
            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
            "& .MuiMenuItem-root": {
              py: 1.5,
              px: 2,
              borderRadius: 1,
              mx: 1,
              my: 0.5,
              "&:hover": {
                backgroundColor: "rgba(102, 126, 234, 0.1)",
              },
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            navigate("/funeral/funeralAttendance")
            handleAttendanceMenuClose()
          }}
        >
          අවමංගල්‍ය උත්සවය
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate("/funeral/funeralWorkAttendance")
            handleAttendanceMenuClose()
          }}
        >
          සුසන භුමි කටයුතු
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate("/meeting/Attendance")
            handleAttendanceMenuClose()
          }}
        >
          මහා සභාව
        </MenuItem>
        <hr/>
        <MenuItem
          onClick={() => {
            navigate("/forms/MeetingSheet")
            handleAttendanceMenuClose()
          }}
        >
          📋 මහා සභාව ලේඛණය
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate("/reports/meetingAttendance")
            handleAttendanceMenuClose()
          }}
        >
          📊 මහා සභාව පැමිණීම
        </MenuItem>
      </Menu>

      <Button
        color="inherit"
        variant="outlined"
        onClick={handleMembershipMenuOpen}
        startIcon={<MonetizationOnIcon />}
        sx={{
          textTransform: "none",
          borderColor: "rgba(255,255,255,0.3)",
          backgroundColor: "rgba(255,255,255,0.1)",
          "&:hover": {
            borderColor: "rgba(255,255,255,0.5)",
            backgroundColor: "rgba(255,255,255,0.2)",
          },
        }}
      >
        අවමංගල්‍ය
      </Button>
      <Menu
        anchorEl={membershipAnchorEl}
        open={Boolean(membershipAnchorEl)}
        onClose={handleMembershipMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 2,
            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
            "& .MuiMenuItem-root": {
              py: 1.5,
              px: 2,
              borderRadius: 1,
              mx: 1,
              my: 0.5,
              "&:hover": {
                backgroundColor: "rgba(102, 126, 234, 0.1)",
              },
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            navigate("/member/deathById")
            handleMembershipMenuClose()
          }}
        >
          ඇතුලත් කිරීම
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate("/funeral/assignment")
            handleMembershipMenuClose()
          }}
        >
          අවමංගල්‍ය පැවරීම
        </MenuItem>
        <hr/>
        <MenuItem
          onClick={() => {
            navigate("/funeral/collectionList")
            handleMembershipMenuClose()
          }}
        >
          අතිරේක ආධාර එකතු කිරීමේ ලැයිස්තුව
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate("/funeral/collectionMarking")
            handleMembershipMenuClose()
          }}
        >
          අතිරේක ආධාර සලකුණු කිරීමේ ලැයිස්තුව
        </MenuItem>
        {/* <MenuItem
          onClick={() => {
            navigate("/funeral/extraDue")
            handleMembershipMenuClose()
          }}
        >
          ද්‍රව්‍ය ආධාර හිඟ
        </MenuItem> */}
      </Menu>

      <Button
        color="inherit"
        variant="outlined"
        onClick={() => navigate("/member/fullDetails")}
        startIcon={<PersonIcon />}
        sx={{
          textTransform: "none",
          borderColor: "rgba(255,255,255,0.3)",
          backgroundColor: "rgba(255,255,255,0.1)",
          "&:hover": {
            borderColor: "rgba(255,255,255,0.5)",
            backgroundColor: "rgba(255,255,255,0.2)",
          },
        }}
      >
        සාමාජික තොරතුරු
      </Button>

      <Button
        color="inherit"
        variant="outlined"
        onClick={handleMembershipViceSecMenuOpen}
        startIcon={<GroupsIcon />}
        sx={{
          textTransform: "none",
          borderColor: "rgba(255,255,255,0.3)",
          backgroundColor: "rgba(255,255,255,0.1)",
          "&:hover": {
            borderColor: "rgba(255,255,255,0.5)",
            backgroundColor: "rgba(255,255,255,0.2)",
          },
        }}
      >
        සාමාජිකත්වය
      </Button>
      <Menu
        anchorEl={membershipViceSecAnchorEl}
        open={Boolean(membershipViceSecAnchorEl)}
        onClose={handleMembershipViceSecMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 2,
            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
            "& .MuiMenuItem-root": {
              py: 1.5,
              px: 2,
              borderRadius: 1,
              mx: 1,
              my: 0.5,
              "&:hover": {
                backgroundColor: "rgba(102, 126, 234, 0.1)",
              },
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            navigate("/member/add-member")
            handleMembershipViceSecMenuClose()
          }}
        >
          සාමාජිකයෙකු ඇතුලත් කිරීම
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate("/member/update-member")
            handleMembershipViceSecMenuClose()
          }}
        >
          සාමාජික තොරතුරු යාවත්කාලීන කිරීම
        </MenuItem>
        <hr/>
        <MenuItem
          onClick={() => {
            navigate("/member/search-by-area")
            handleMembershipViceSecMenuClose()
          }}
        >
        
          ප්‍රදේශය අනුව සෙවීම
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate("/member/search-by-name")
            handleMembershipViceSecMenuClose()
          }}
        >
          නම අනුව සෙවීම
        </MenuItem>
      </Menu>

      <Divider
        orientation="vertical"
        flexItem
        sx={{
          bgcolor: "rgba(255,255,255,0.3)",
          mx: 2,
          height: 32,
          alignSelf: "center",
        }}
      />
    </>
  )
}

export default ViceSecretaryMenu
