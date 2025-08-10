import React, { useState } from "react"
import { navigate } from "gatsby"
import { Box, Button, Divider } from "@mui/material"
import { Person as PersonIcon } from "@mui/icons-material"

// Import role-specific menu components
import ViceSecretaryMenu from "./desktopMenus/ViceSecretaryMenu"
import TreasurerMenu from "./desktopMenus/TreasurerMenu"
import UserAccountMenu from "./desktopMenus/UserAccountMenu"
import LoanMenu from "./desktopMenus/LoanMenu"
import ChairmanMenu from "./desktopMenus/ChairmanMenu"

export default function DesktopButtons({
  isAuthenticated,
  roles,
  memberName,
  memberId,
  hasLoan,
  handleLogout
}) {
  const isViceSecretary = roles.includes("vice-secretary")
  const isLoanTreasurer = roles.includes("loan-treasurer")
  const isTreasurer = roles.includes("treasurer")
  const isChairman = roles.includes("chairman")
  const hasLoanAccess = isLoanTreasurer || isTreasurer

  return (
    <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 1 }}>
      {isAuthenticated && (
        <>
          {/* Vice Secretary Menu */}
          <ViceSecretaryMenu isViceSecretary={isViceSecretary} />

          {/* Loan Access Menu */}
          <LoanMenu 
            hasLoanAccess={hasLoanAccess} 
            isLoanTreasurer={isLoanTreasurer}
            isTreasurer={isTreasurer}
          />

          {/* Chairman Menu */}
          <ChairmanMenu isChairman={isChairman} />

          {/* Treasurer Menu */}
          <TreasurerMenu isTreasurer={isTreasurer} />

          {/* User Account Menu */}
          <UserAccountMenu 
            memberName={memberName}
            hasLoan={hasLoan}
            handleLogout={handleLogout}
          />
        </>
      )}
      {!isAuthenticated && (
        <Button
          color="inherit"
          onClick={() => navigate("/login/user-login")}
          startIcon={<PersonIcon />}
          sx={{
            textTransform: "none",
            backgroundColor: "rgba(255,255,255,0.1)",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.2)",
            },
            borderRadius: 3,
            px: 3,
          }}
        >
          ප්‍රවේශය
        </Button>
      )}
    </Box>
  )
}
