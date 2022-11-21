import { Box } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import logo from "../../assets/images/logo-ngcash-branco.svg";

export function MainApp() {
  const navigate = useNavigate();
  const { token, signOut } = useAuth();
  if (!token) {
    return <Navigate to={"/login" } />;
  }

  function handleSignOut() {
    navigate("/login");
    signOut();
  }

  return (
    <Box
      sx={{
        display: "flex",
        overflowY: 'scroll',
        width:'100%',
        position: 'fixed',
        top: 0,
        bottom: 0,
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          height: "50px",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 25px",
        }}
      >
        <img src={logo} alt="ng.cash logo" style={{width:'50px'}}/>
        <LogoutIcon style={{ cursor: "pointer", color:'#fff' }} onClick={handleSignOut} />
      </Box>
      <Outlet />
    </Box>
  );
}
