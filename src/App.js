import React, { useState, useEffect } from 'react'
import { ThemeProvider } from '@mui/material';
import './App.css';
import Home from './pages/Home/home';
import Login from './pages/Login/login';
import Register from './pages/Register/register';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { theme } from './theme/theme';
import AppContext from './context/context';
import { useSnackbar } from 'notistack';
import PrivateRoute from './helpers/PrivateRoute';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { Endpoint } from './enums/apiEnum';
import { Message } from './enums/messageEnum';
import Report from './pages/Report/report';
import { logoutUser } from './middlewares/AuthMiddleware';

function App() {
  const [conversaUsuario, setConversaUsuario] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

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

  const selecionaConversaUsuario = (nomeUsuario) => {
    setConversaUsuario(nomeUsuario)
  }

  const createHubConnection = async () => {
    try {
      const hubConnection = new HubConnectionBuilder()
        .withUrl(`${Endpoint.Bff}/Hub`)
        .withAutomaticReconnect()
        .build();

      return hubConnection;
    } catch (e) {
      showMessage(Message.Error, 'Erro de conexão');
    }
  };

  const isSentByCurrentUser = (user) => {
    return returnUserInfo().email !== "" 
      ? user === returnUserInfo().email 
      : user === returnUserInfo().role
  }

  const onRightSide = (user) => {
    if(conversaUsuario !== "") {
      return !(conversaUsuario === user)
    }
    return user === returnUserInfo().email || (user && user.toLowerCase() === "visitante")
  }

  const renderMessageText = (texto) => {
    const regex = /(https?:\/\/[^\s]+)/g;
    const parts = texto.split(regex);

    return parts.map((part, index) => {
      if (part.match(regex)) {
        return (
          <a key={index} href={part} target="_blank" rel="noopener noreferrer">
            {part}
          </a>
        );
      } else {
        return <React.Fragment key={index}>{part}</React.Fragment>;
      }
    });
  };

  const handleLogoutUser = () => {
    const dadosLogout = {
      email: returnUserInfo().email
    };

    logoutUser(dadosLogout, contextStateVariables)
    .then(() => {
      showMessage(Message.Success, "Deslogado com sucesso");
      navigate("/")
    })
    .catch(() => {});
  }

  const contextStateVariables = {
    showMessage,
    returnUserInfo,
    createHubConnection,
    isSentByCurrentUser,
    renderMessageText,
    selecionaConversaUsuario,
    conversaUsuario,
    onRightSide,
    handleLogoutUser
  };

  return (
    <>
      <AppContext.Provider value={contextStateVariables}>
        <ThemeProvider theme={theme}>
          <Routes>
            <Route path="/" element={<Login />}/> 
            <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>}/>
            <Route path="/relatorios" element={<PrivateRoute><Report /></PrivateRoute>}/>
            <Route path="/register" element={<Register />}/>
          </Routes>
        </ThemeProvider>
      </AppContext.Provider>
    </>
  );
}

export default App;
