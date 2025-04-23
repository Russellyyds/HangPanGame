import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputBase,
  Box,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Fullscreen,
  FullscreenExit,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";
import useSearch from "../hooks/useSearch";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();
  const [logoutDialog, setLogoutDialog] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Check if current path is a game play route
  const isGamePlayRoute = location.pathname.includes("/play/game");
  
  // Check if current path is dashboard
  const isDashboard = location.pathname === "/dashboard";

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, []);

  // Clear search when navigating away from dashboard
  useEffect(() => {
    if (!isDashboard) {
      setSearchQuery('');
    }
  }, [isDashboard, setSearchQuery]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      // Enter fullscreen
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    setLogoutDialog(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => navigate("/dashboard")}
          >
            BigBrain
          </Typography>

          {/* Add search box only on dashboard */}
          {isDashboard && isAuthenticated && (
            <Box
              sx={{
                position: "relative",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.25)" },
                borderRadius: 1,
                marginRight: 2,
                width: "auto",
                display: "flex",
                alignItems: "center",
              }}
            >
              <IconButton sx={{ p: 1 }} aria-label="search">
                <SearchIcon />
              </IconButton>
              <InputBase
                sx={{
                  color: "inherit",
                  width: "100%",
                  "& .MuiInputBase-input": {
                    padding: "8px 8px 8px 0",
                    width: "100%",
                    minWidth: "200px",
                  },
                }}
                placeholder="Search games..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </Box>
          )}

          {/* Conditionally render fullscreen button or logout button */}
          {isGamePlayRoute ? (
            <IconButton
              color="inherit"
              onClick={toggleFullscreen}
              aria-label={
                isFullscreen ? "Exit fullscreen mode" : "Enter fullscreen mode"
              }
            >
              {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
            </IconButton>
          ) : (
            isAuthenticated && (
              <Button color="inherit" onClick={() => setLogoutDialog(true)}>
                Logout
              </Button>
            )
          )}
        </Toolbar>
      </AppBar>

      <Dialog open={logoutDialog} onClose={() => setLogoutDialog(false)}>
        <DialogTitle>Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialog(false)}>Cancel</Button>
          <Button onClick={handleLogout} autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;