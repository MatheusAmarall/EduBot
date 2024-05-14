import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material'
import MuiAppBar from '@mui/material/AppBar';
import CloseIcon from '@mui/icons-material/Close';
import { deepOrange } from '@mui/material/colors';
import AppContext from '../../context/context';
import { logoutUser } from '../../middlewares/AuthMiddleware';
import { Message } from '../../enums/messageEnum';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Parametrizacao from './Parametrizacao';

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
  const [openDialog, setOpenDialog] = useState(false);
  const [openParametrizacao, setOpenParametrizacao] = useState(false);

  const globalContext = useContext(AppContext);

  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };
  
  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleOpenParametrizacao = () => {
    setOpenParametrizacao(true);
  };

  const handleLogout = () => {
    const dadosLogout = {
      email: userInfo.email
    };

    logoutUser(dadosLogout, globalContext)
    .then(() => {
      globalContext.showMessage(Message.Success, "Deslogado com sucesso");
      navigate("/")
    })
    .catch(() => {});
    
  }

  const handleLogin = () => {
    navigate("/")
  }

  const loggedUser = () => {
    return userInfo.email;
  }

  useEffect(() => {
    const userInfo = globalContext.returnUserInfo();
    setUserInfo(userInfo)
  }, [setUserInfo, globalContext])

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
            <Grid item display="flex">
              <Avatar sx={{ bgcolor: deepOrange[500] }} variant="square">A</Avatar>
              <Typography color="white" fontSize={24} style={{ marginLeft: 10 }}>EDU.BOT</Typography>
            </Grid>
            
            <Grid item>
              {
                userInfo.role === 'Admin' && (
                  <Button variant="text" onClick={handleOpenParametrizacao}>Parametrização</Button>
                )
              }
              <IconButton color="primary" aria-label="informação" onClick={handleDialogOpen}>
                <InfoOutlinedIcon sx={{ fontSize: 26 }} />
              </IconButton>
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
          {userInfo.role === "Admin" ? (
            <Grid item style={{ flexGrow: 1 }}>
              <ListItem>
                <ListItemButton color="primary" style={{ borderRadius: '5px', textAlign: 'center' }}>
                  <ListItemText primary="Chat EduBot" />
                </ListItemButton>
              </ListItem>
              <Root>
                <Divider>Histórico de atendimentos</Divider>
              </Root>
            </Grid>
          ) : <></>}
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
            onClose={handleDialogClose}
            aria-labelledby="customized-dialog-title"
            open={openDialog}
          >
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
              Ajuda
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleDialogClose}
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
                    <AssignmentIcon />
                  </ListItemIcon>
                  <ListItemText primary="Lista de materiais" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AssignmentIcon />
                  </ListItemIcon>
                  <ListItemText primary="Lista de matrícula" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AssignmentIcon />
                  </ListItemIcon>
                  <ListItemText primary="Merenda" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AssignmentIcon />
                  </ListItemIcon>
                  <ListItemText primary="Lista de espera" />
                </ListItem>
              </List>
            </DialogContent>
          </BootstrapDialog>

          <Parametrizacao openDialog={openParametrizacao} setOpenDialog={setOpenParametrizacao} />
        </Grid>
      </Main>
    </Box>
  );
}