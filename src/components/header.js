import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import { navigate } from "gatsby";
const { jwtDecode } = require("jwt-decode");

const Header = ({ siteTitle }) => {
  const [roles, setRoles] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [memberName, setMemberName] = useState(""); // State to store member's name

  // Menu states
  const [memberAnchorEl, setMemberAnchorEl] = useState(null);

  const memberMenuOpen = Boolean(memberAnchorEl);

  // Handlers for menus
  const handleMemberMenuOpen = (event) => setMemberAnchorEl(event.currentTarget);
  const handleMemberMenuClose = () => setMemberAnchorEl(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        // console.log('decodedToken: ', decodedToken)
        setRoles(decodedToken.roles || []);
        setMemberName(decodedToken.name || ""); // Extract and set the member's name
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error decoding token:", error);
        setIsAuthenticated(false);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setRoles([]);
    setIsAuthenticated(false);
    navigate("/login/UserLogin");
  };

  const routeLabels = {
    "/": "Home",
    "/member/ProfileEdit": "Profile Edit",
    "/login/UserLogin": "User Login",
  };

  const pathname = window.location.pathname;
  const displayName =
    routeLabels[pathname] || pathname.split("/").filter(Boolean).pop() || "Home";

  return (
    <header>
      <Box
        sx={{
          flexGrow: 1,
          maxWidth: "1024px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography
              variant="h6"
              sx={{ flexGrow: 1, cursor: "pointer" }}
              onClick={() => navigate("/")}
            >
              {siteTitle}
            </Typography>

            {isAuthenticated ? (
              <>
                {/* Member Menus */}
                <Button
                  color="inherit"
                  onClick={() => navigate("/payments")}
                  sx={{ textTransform: "none" }}
                >
                  Payments
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate("/membership")}
                  sx={{ textTransform: "none" }}
                >
                  Membership
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate("/fines")}
                  sx={{ textTransform: "none" }}
                >
                  Fines
                </Button>

                {/* Profile Menu */}
                <Button
                  color="inherit"
                  onClick={handleMemberMenuOpen}
                  sx={{ textTransform: "none" }}
                >
                  My Profile
                </Button>
                <Menu
                  anchorEl={memberAnchorEl}
                  open={memberMenuOpen}
                  onClose={handleMemberMenuClose}
                >
                  <MenuItem
                    onClick={() => {
                      navigate("/member/ProfileEdit");
                      handleMemberMenuClose();
                    }}
                  >
                    Edit Profile
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleLogout();
                      handleMemberMenuClose();
                    }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                color="inherit"
                onClick={() => navigate("/login/UserLogin")}
                sx={{ textTransform: "none" }}
              >
                Login
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>

      {/* Current Route Display with Member Name */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "1024px",
          margin: "0 auto",
          textAlign: "left",
          padding: "8px",
          background: "#f5f5f5",
          borderTop: "1px solid #ddd",
          display: "flex",
          justifyContent: "space-between", // Aligns name to the right
          alignItems: "center",
        }}
      >
        <Typography variant="body2" color="textSecondary">
          Samithiya/ {displayName}
        </Typography>
        {isAuthenticated && (
          <Typography variant="body2" color="textSecondary">
            ආයුබෝවන්, {memberName}
          </Typography>
        )}
      </Box>
    </header>
  );
};

export default Header;
