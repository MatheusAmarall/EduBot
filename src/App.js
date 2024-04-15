import { ThemeProvider } from '@mui/material';
import './App.css';
import Home from './pages/Home/home';
import Login from './pages/Login/login';
import Register from './pages/Register/register';
import { Routes, Route } from 'react-router-dom';
import { theme } from './theme/theme';
import AppContext from './context/context';
import { useSnackbar } from 'notistack';
import PrivateRoute from './helpers/PrivateRoute';

function App() {
  const { enqueueSnackbar } = useSnackbar();

  const showMessage = (variant, message) => {
    enqueueSnackbar(message, { variant });
  };

  const returnUserInfo = () => {
    const email = sessionStorage.getItem("email");
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");

    const userInfo = {
      email,
      token,
      role
    };
    return userInfo;
  }

  const contextStateVariables = {
    showMessage,
    returnUserInfo
  };
  return (
    <>
      <AppContext.Provider value={contextStateVariables}>
        <ThemeProvider theme={theme}>
          <Routes>
            <Route path="/" element={<Login />}/> 
            <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>}/>
            <Route path="/register" element={<Register />}/>
          </Routes>
        </ThemeProvider>
      </AppContext.Provider>
    </>
  );
}

export default App;
