import React, { useState, useContext, useEffect } from 'react'
import {
    Grid,
    Typography,
    List, 
    ListItem,
    ListItemText,
    Box
  } from '@mui/material';
import MenuDrawer from '../../components/LayoutComponents/MenuDrawer';
import AppContext from '../../context/context';
import { getAgendamentos } from '../../middlewares/AgendamentosMiddleware';
import EventBusyIcon from '@mui/icons-material/EventBusy';

const Report = () => {
    const [agendamentos, setAgendamentos] = useState([]);

    const globalContext = useContext(AppContext);

    const handleGetAgendamentos = () => {
        getAgendamentos(globalContext)
        .then((resultado) => {
            if(resultado) {
                setAgendamentos(resultado)
            }
        })
        .catch(() => {});
    }

    useEffect(() => {
        handleGetAgendamentos()
    }, [])
  return (
    <MenuDrawer>
        <Grid container item xs={12} mt={2} justifyContent="center">
            <Typography variant="h5">Agendamentos</Typography>
        </Grid>
        <Grid container mt={2} justifyContent="center">
        <Box
          sx={{
            width: '80%',
            maxWidth: '500px',
            height: '400px',
            borderRadius: 2,
            boxShadow: 3,
            padding: 2,
            bgcolor: 'background.paper',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: agendamentos.length === 0 ? 'center' : 'normal',
            justifyContent: agendamentos.length === 0 ? 'center' : 'flex-start'
          }}
        >
          {agendamentos.length === 0 ? (
            <>
              <EventBusyIcon sx={{ fontSize: 40, color: 'grey.500' }} />
              <Typography variant="h6" color="textSecondary">
                Não existem agendamentos cadastrados
              </Typography>
            </>
          ) : (
            <List>
              {agendamentos.map((agendamento, index) => (
                <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <ListItemText 
                    primary={agendamento.nomeUsuario} 
                  />
                  <ListItemText 
                    primary={agendamento.dataAgendamento}
                    primaryTypographyProps={{ fontSize: 14, color: '#00000099', textAlign: 'right' }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Grid>
    </MenuDrawer>
    
  )
}

export default Report