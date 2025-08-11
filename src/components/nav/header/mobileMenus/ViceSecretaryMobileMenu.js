import React from "react"
import { Box, Typography, Button, Divider } from "@mui/material"
import { Groups as GroupsIcon, MonetizationOn as MonetizationOnIcon, Person as PersonIcon } from "@mui/icons-material"

export default function ViceSecretaryMobileMenu({ isViceSecretary, onMenuItemClick }) {
  if (!isViceSecretary) return null

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" sx={{ 
        textAlign: "center", 
        color: "#667eea", 
        fontWeight: 'bold',
        mb: 2,
        py: 1,
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        borderRadius: 1
      }}>
        උප ලේකම්
      </Typography>
      <Button
        color="inherit"
        onClick={() => onMenuItemClick("/forms/MeetingSheet")}
        startIcon={<GroupsIcon />}
        sx={{ 
          textTransform: "none", 
          width: "100%",
          mb: 1,
          justifyContent: 'flex-start',
          backgroundColor: 'rgba(102, 126, 234, 0.15)',
          border: '1px solid rgba(102, 126, 234, 0.2)',
          '&:hover': { 
            backgroundColor: 'rgba(102, 126, 234, 0.25)',
            transform: 'translateX(2px)'
          },
          borderRadius: 2,
          py: 1.5,
          color: '#333',
          transition: 'all 0.2s ease'
        }}
      >
        පැමිණීම
      </Button>
      <Button
        color="inherit"
        onClick={() => onMenuItemClick("/member/deathById")}
        startIcon={<MonetizationOnIcon />}
        sx={{ 
          textTransform: "none", 
          width: "100%",
          mb: 1,
          justifyContent: 'flex-start',
          backgroundColor: 'rgba(102, 126, 234, 0.15)',
          border: '1px solid rgba(102, 126, 234, 0.2)',
          '&:hover': { 
            backgroundColor: 'rgba(102, 126, 234, 0.25)',
            transform: 'translateX(2px)'
          },
          borderRadius: 2,
          py: 1.5,
          color: '#333',
          transition: 'all 0.2s ease'
        }}
      >
        අවමංගල්‍ය
      </Button>
      <Button
        color="inherit"
        onClick={() => onMenuItemClick("/member/fullDetails")}
        startIcon={<PersonIcon />}
        sx={{ 
          textTransform: "none", 
          width: "100%",
          mb: 2,
          justifyContent: 'flex-start',
          backgroundColor: 'rgba(102, 126, 234, 0.15)',
          border: '1px solid rgba(102, 126, 234, 0.2)',
          '&:hover': { 
            backgroundColor: 'rgba(102, 126, 234, 0.25)',
            transform: 'translateX(2px)'
          },
          borderRadius: 2,
          py: 1.5,
          color: '#333',
          transition: 'all 0.2s ease'
        }}
      >
        සාමාජික තොරතුරු
      </Button>
      <Typography variant="body2" sx={{ 
        color: "#666", 
        fontSize: "0.875rem", 
        fontWeight: 'bold',
        mb: 1,
        ml: 2
      }}>
        සාමාජිකත්වය
      </Typography>
      <Button
        color="inherit"
        onClick={() => onMenuItemClick("/member/add-member")}
        sx={{ 
          textTransform: "none", 
          width: "100%", 
          paddingLeft: "40px",
          mb: 0.5,
          justifyContent: 'flex-start',
          backgroundColor: 'rgba(102, 126, 234, 0.05)',
          '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.1)' },
          borderRadius: 1,
          py: 1,
          color: '#555'
        }}
      >
        • සාමාජිකයෙකු ඇතුලත් කිරීම
      </Button>
      <Button
        color="inherit"
        onClick={() => onMenuItemClick("/member/update-member")}
        sx={{ 
          textTransform: "none", 
          width: "100%", 
          paddingLeft: "40px",
          mb: 0.5,
          justifyContent: 'flex-start',
          backgroundColor: 'rgba(102, 126, 234, 0.05)',
          '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.1)' },
          borderRadius: 1,
          py: 1,
          color: '#555'
        }}
      >
        • යාවත්කාලීන කිරීම
      </Button>
      <Button
        color="inherit"
        onClick={() => onMenuItemClick("/member/search-by-area")}
        sx={{ 
          textTransform: "none", 
          width: "100%", 
          paddingLeft: "40px",
          mb: 0.5,
          justifyContent: 'flex-start',
          backgroundColor: 'rgba(102, 126, 234, 0.05)',
          '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.1)' },
          borderRadius: 1,
          py: 1,
          color: '#555'
        }}
      >
        • ප්‍රදේශය අනුව සෙවීම
      </Button>
      <Button
        color="inherit"
        onClick={() => onMenuItemClick("/member/search-by-name")}
        sx={{ 
          textTransform: "none", 
          width: "100%", 
          paddingLeft: "40px",
          mb: 2,
          justifyContent: 'flex-start',
          backgroundColor: 'rgba(102, 126, 234, 0.05)',
          '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.1)' },
          borderRadius: 1,
          py: 1,
          color: '#555'
        }}
      >
        • නම අනුව සෙවීම
      </Button>
      <Divider sx={{ my: 2, backgroundColor: 'rgba(102, 126, 234, 0.2)' }} />
    </Box>
  )
}
