import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
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
  ListItemIcon
} from '@mui/material'
import MuiAppBar from '@mui/material/AppBar';
import { deepOrange } from '@mui/material/colors';
import AppContext from '../../context/context';
import { logoutUser } from '../../middlewares/AuthMiddleware';
import { Message } from '../../enums/messageEnum';

const drawerWidth = 300;

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

  const globalContext = useContext(AppContext);

  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
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
          <Grid container>
            <Avatar sx={{ bgcolor: deepOrange[500] }} variant="square">A</Avatar>
            <Typography color="white" fontSize={24} style={{ marginLeft: 10 }}>EDU.BOT</Typography>
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
                <ListItemButton style={{ border: '1px solid black', borderRadius: '5px', textAlign: 'center' }}>
                  <ListItemText primary="Criar nova conversa" />
                </ListItemButton>
              </ListItem>
              <Root>
                <Divider>Histórico de atendimentos</Divider>
              </Root>
              <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                  <ListItem key={index}>
                    <ListItemButton>
                      <ListItemText primary="Matheus Amaral" secondary="Informações sobre matrícula" />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
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
        </Grid>
      </Main>
    </Box>
  );
}