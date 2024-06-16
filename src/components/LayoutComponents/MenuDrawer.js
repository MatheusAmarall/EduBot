import React, { useContext, useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import {
  Grid,
  Avatar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Box,
  Drawer,
  CssBaseline,
  Toolbar,
  Divider,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Tooltip 
} from '@mui/material'
import MuiAppBar from '@mui/material/AppBar';
import CloseIcon from '@mui/icons-material/Close';
import AppContext from '../../context/context';
import { Message } from '../../enums/messageEnum';
import Parametrizacao from './Parametrizacao';
import logoEduBot from '../../assets/img/logo.png';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { getAllMessages } from '../../middlewares/HomeMiddleware';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DoneIcon from '@mui/icons-material/Done';
import { getFuncionalidadesParametrizadas } from '../../middlewares/ParametrizacaoMiddleware';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventNoteIcon from '@mui/icons-material/EventNote';

const drawerWidth = 300;

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const Root = styled('div')(({ theme }) => ({
  width: '100%',
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  '& > :not(style) ~ :not(style)': {
    marginTop: theme.spacing(2),
  },
}));

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: '#02040f',
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function MenuDrawer({ children }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [userInfo, setUserInfo] = useState("");
  const [openAjuda, setOpenAjuda] = useState(false);
  const [openParametrizacao, setOpenParametrizacao] = useState(false);
  const [historicoConversas, setHistoricoConversas] = useState([]);
  const [hubConnection, setHubConnection] = useState(null);
  const [funcionalidadesParametrizadas, setFuncionalidadesParametrizadas] = useState([])

  const globalContext = useContext(AppContext);

  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleOpenAjuda = () => {
    getFuncionalidadesParametrizadas(globalContext)
    .then((res) => {
      setFuncionalidadesParametrizadas(res)
      setOpenAjuda(true);
    })
    .catch(() => {})
  };
  
  const handleCloseAjuda = () => {
    setOpenAjuda(false);
  };

  const handleOpenParametrizacao = () => {
    setOpenParametrizacao(true);
  };

  const stopHubConnection = () => {
    if (hubConnection) {
      hubConnection.stop();
      setHubConnection(null);
    }
  }

  const handleLogout = () => {
    stopHubConnection();
    globalContext.handleLogoutUser();
  }

  const handleLogin = () => {
    stopHubConnection();
    navigate("/")
  }

  const loggedUser = () => {
    return userInfo.email;
  }

  const handleSelecionaConversaUsuario = async (nomeUsuario) => {
    if(hubConnection !== null) {
      if(nomeUsuario !== "") {
        try {
          await hubConnection.invoke("DisableBot", nomeUsuario);
        } catch (error) {
          globalContext.showMessage(Message.Error, "Erro na conexão com o servidor, verifique com o suporte");
        }
      }
    }
    globalContext.selecionaConversaUsuario(nomeUsuario)
    navigate("/home")
  }

  const handleConcluirAtendimento = async () => {
    if(hubConnection !== null) {
      try {
        await hubConnection.invoke("ActivateBot", globalContext.conversaUsuario);
      } catch (error) {
        globalContext.showMessage(Message.Error, "Erro na conexão com o servidor, verifique com o suporte");
      }
    }
    globalContext.selecionaConversaUsuario("")
  }

  const handleGetAllMessages = () => {
    getAllMessages(globalContext)
    .then((res) => {
      setHistoricoConversas(res)
    })
    .catch(() => {});
  }

  const recuperarHistoricoMensagensUsuarios = async () => {
    if(!hubConnection) {
        await globalContext
        .createHubConnection()
        .then(async (conn) => {
            if (conn) {
              await conn.start();

              conn.on('MessageHistory', (history) => {
                setHistoricoConversas(history)
              });

              setHubConnection(conn);
            }
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    const userInfo = globalContext.returnUserInfo();
    setUserInfo(userInfo)
  }, [setUserInfo, globalContext])

  useEffect(() => {
    if(userInfo !== "" && userInfo.role === "Admin") {
      handleGetAllMessages();
      recuperarHistoricoMensagensUsuarios();
    }

    return () => {
      stopHubConnection();
    }
  }, [userInfo])

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item display="flex" style={{placeItems: "center"}}>
              <img src={logoEduBot} alt="EDU.BOT" style={{ width: 40, height: 40, marginRight: 10 }} />
              <Typography color="white" fontSize={24} style={{ marginLeft: 10 }}>EDU.BOT</Typography>
            </Grid>
            
            <Grid item>
              {
                globalContext.conversaUsuario !== "" ? (
                  <Button variant="text" color="primary" onClick={handleConcluirAtendimento} 
                    startIcon={<DoneIcon />}>
                    Concluir atendimento
                  </Button>
                ) :
                (
                  <>
                    {
                      userInfo.role === 'Admin' && (
                        <Button variant="text" color="primary" onClick={handleOpenParametrizacao} 
                          startIcon={<AddIcon />} sx={{ marginRight: 2 }}>
                          Parametrização
                        </Button>
                      )
                    }
                    <Button variant="text" color="primary" onClick={handleOpenAjuda} 
                      startIcon={<InfoOutlinedIcon />}>
                      Ajuda
                    </Button>
                  </>
                )
              }
              
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <ListItem>
            <ListItemAvatar>
              <Avatar alt="Profile Picture" />
            </ListItemAvatar>
            <ListItemText primary={userInfo.email ? userInfo.email.split("@")[0] : "Visitante"} />
          </ListItem>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Grid container direction="column" height="100%">
          <Grid item style={{ flexGrow: 1 }}>
            {userInfo.role === "Admin" && (
              <ListItem component={Link} to={'/agendamentos'}>
                <ListItemButton color="primary" style={{ borderRadius: '5px', color: "#000000DE" }}
                  onClick={handleConcluirAtendimento}>
                  <ListItemIcon>
                    <EventNoteIcon />
                  </ListItemIcon>
                  <ListItemText primary="Agendamentos" />
                </ListItemButton>
              </ListItem>
            )}
            <ListItem component={Link} to={'/home'}>
              <ListItemButton color="primary" style={{ borderRadius: '5px', color: "#000000DE" }}
                onClick={handleConcluirAtendimento}>
                <ListItemIcon>
                  <SmartToyIcon />
                </ListItemIcon>
                <ListItemText primary="Chat EduBot" />
              </ListItemButton>
            </ListItem>
            {userInfo.role === "Admin" && (
              <>
                <ListItem component={Link} to={'/relatorios'}>
                  <ListItemButton color="primary" style={{ borderRadius: '5px', color: "#000000DE" }}>
                    <ListItemIcon>
                      <AssessmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Relatórios" />
                  </ListItemButton>
                </ListItem>
                <Root>
                  <Divider>Histórico de atendimentos</Divider>
                </Root>
                <List>
                  {historicoConversas.map((conversa, index) => {
                    const isDisabled = globalContext.conversaUsuario === conversa.nomeUsuario;
                    return (
                      <ListItem key={index}>
                        <ListItemButton>
                          <ListItemIcon>
                            <Avatar alt="Profile Picture" />
                          </ListItemIcon>
                          <Tooltip title={conversa.mensagens[conversa.mensagens.length - 1].body} arrow>
                            <ListItemText 
                              primary={conversa.nomeUsuario.split("@")[0]}
                              secondary={
                                conversa.mensagens[conversa.mensagens.length - 1].body.length > 10 
                                  ? `${conversa.mensagens[conversa.mensagens.length - 1].body.slice(0, 10)}...`
                                  : conversa.mensagens[conversa.mensagens.length - 1].body
                              } 
                            />
                          </Tooltip>
                          <Tooltip title="Iniciar atendimento" arrow>
                            <IconButton
                              edge="end"
                              onClick={() => handleSelecionaConversaUsuario(conversa.nomeUsuario)}
                              disabled={isDisabled}
                            >
                              <PlayArrowIcon style={{ color: isDisabled ? 'grey' : 'green' }} />
                            </IconButton>
                          </Tooltip>
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
              </>
            )}
          </Grid>
          <Grid item style={{ marginTop: 'auto' }}>
            <ListItem>
              <ListItemButton style={{ textAlign: 'center' }} onClick={loggedUser() ? handleLogout : handleLogin}> 
                <ListItemIcon>
                  {loggedUser()
                    ? 
                      <LogoutIcon /> 
                    :
                      <LoginIcon />
                  }
                </ListItemIcon>
                <ListItemText primary={loggedUser() ? "Sair" : "Entrar/Registrar"} />
              </ListItemButton>
            </ListItem>
          </Grid>
        </Grid>
      </Drawer>
      <Main open={open}>
        <Grid container marginTop={5}>
          {children}
          <BootstrapDialog
            onClose={handleCloseAjuda}
            aria-labelledby="customized-dialog-title"
            open={openAjuda}
          >
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
              Ajuda
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleCloseAjuda}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
            <DialogContent dividers>
              <Typography gutterBottom>
                Funcionalidades disponíveis no EduBot.
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Tooltip title="Disponível" arrow>
                      <DoneIcon style={{ color: 'green' }} />
                    </Tooltip>
                  </ListItemIcon>
                  <ListItemText primary="Lista de materiais" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Tooltip title="Disponível" arrow>
                      <DoneIcon style={{ color: 'green' }} />
                    </Tooltip>
                  </ListItemIcon>
                  <ListItemText primary="Lista de matrícula" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Tooltip title="Disponível" arrow>
                      <DoneIcon style={{ color: 'green' }} />
                    </Tooltip>
                  </ListItemIcon>
                  <ListItemText primary="Merenda" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Tooltip title="Disponível" arrow>
                      <DoneIcon style={{ color: 'green' }} />
                    </Tooltip>
                  </ListItemIcon>
                  <ListItemText primary="Lista de espera" />
                </ListItem>
                {funcionalidadesParametrizadas.map((funcionalidade) => (
                  <ListItem>
                    <ListItemIcon>
                      {funcionalidade.disponivel 
                      ?  <Tooltip title="Disponível" arrow><DoneIcon style={{ color: 'green' }} /></Tooltip> 
                      :  <Tooltip title="Pendente" arrow><AccessTimeIcon style={{ color: 'yellow' }} /></Tooltip> } 
                    </ListItemIcon>
                    <ListItemText primary={funcionalidade.nomeFuncionalidade} />
                  </ListItem>
                ))}
              </List>
            </DialogContent>
          </BootstrapDialog>

          <Parametrizacao openDialog={openParametrizacao} setOpenDialog={setOpenParametrizacao} />
        </Grid>
      </Main>
    </Box>
  );
}