import React, { useState, useEffect } from 'react'
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
import { HubConnectionBuilder } from '@microsoft/signalr';
import { Endpoint } from './enums/apiEnum';
import { Message } from './enums/messageEnum';
import Report from './pages/Report/report';

function App() {
  const [conversaUsuario, setConversaUsuario] = useState("");
  const [hubConnection, setHubConnection] = useState(null);
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

  const selecionaConversaUsuario = (nomeUsuario) => {
    setConversaUsuario(nomeUsuario)
  }

  const createHubConnection = async () => {
    try {
      const hubConnection = new HubConnectionBuilder()
        .withUrl(`${Endpoint.Bff}/Hub`)
        .build();

      return hubConnection;
    } catch (e) {
      showMessage(Message.Error, 'Erro de conexão');
    }
  };

  const startHubConnection = async () => {
    createHubConnection()
    .then(async (conn) => {
      if (conn) {
        await conn.start();

        setHubConnection(conn);
      }
    })
    .catch(() => {});
  }

  const isSentByCurrentUser = (user) => {
    return returnUserInfo().email !== "" 
    ? user === returnUserInfo().email 
    : user === returnUserInfo().role
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

  useEffect(() => {
    startHubConnection();

    return () => {
      if (hubConnection) {
        hubConnection.stop();
        setHubConnection(null);
      }
    };
  }, [])

  const contextStateVariables = {
    showMessage,
    returnUserInfo,
    createHubConnection,
    isSentByCurrentUser,
    renderMessageText,
    selecionaConversaUsuario,
    conversaUsuario,
    hubConnection
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
