import { Grid, Avatar, List, ListItem, ListItemAvatar, ListItemText, IconButton, FormControl, InputLabel, OutlinedInput, InputAdornment } from '@mui/material'
import React, { useState, useContext } from 'react'
import MenuDrawer from '../../components/LayoutComponents/MenuDrawer';
import SendIcon from '@mui/icons-material/Send';
import AppContext from '../../context/context';
import { sendMessage } from '../../middlewares/HomeMiddleware';

const Home = () => {
  const [mensagens, setMensagens] = useState([]);
  const [mensagemDigitada, setMensagemDigitada] = useState("");

  const globalContext = useContext(AppContext);

  const isSentByCurrentUser = (user) => {
    return user === "Matheus Amaral"
  }

  const handleSendMessage = () =>{
    const mensagem = {
      sender: "Matheus Amaral",
      message: mensagemDigitada
    };

    const mensagemUsuario = {
      nomeUsuario: mensagem.sender,
      texto: mensagem.message
    }

    setMensagens(prevState => [...prevState, mensagemUsuario]);
    setMensagemDigitada("")

    sendMessage(mensagem, globalContext)
      .then((resultado) => {
        resultado.data.forEach((mensagem) => {
          const mensagemBot = {
            nomeUsuario: "EduBot",
            texto: mensagem.text
          }
          setMensagens(prevState => [...prevState, mensagemBot]);
        })
      })
      .catch(() => {});
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  return (
    <MenuDrawer>
      <Grid container>
        <Grid item xs={12} style={{ flexGrow: 1, overflow: "auto", height: "80vh" }}>
          <List style={{ display: 'flex', flexDirection: 'column' }}>
            {mensagens.map((message, index) => (
              <ListItem
                key={index}
                style={{
                  textAlign: isSentByCurrentUser(message.nomeUsuario) ? 'right' : 'left',
                  flexDirection: isSentByCurrentUser(message.nomeUsuario) ? 'row-reverse' : 'row'
                }}
              >
                <ListItemAvatar style={{
                  display: 'flex',
                  justifyContent: isSentByCurrentUser(message.nomeUsuario) ? 'flex-end' : 'flex-start'
                }}>
                  <Avatar alt="Profile Picture" />
                </ListItemAvatar>
                <ListItemText
                  primary={message.nomeUsuario}
                  secondary={message.texto}
                  style={{ textAlign: isSentByCurrentUser(message.nomeUsuario) ? 'right' : 'left' }}
                />
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={12}>

          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="txt-message">Digite sua mensagem</InputLabel>
            <OutlinedInput
              id="txt-message"
              value={mensagemDigitada}
              onChange={(e) => {
                setMensagemDigitada(e.target.value);
              }}
              onKeyPress={handleKeyPress}
              endAdornment={<InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleSendMessage}
                  edge="end"
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>}
              label="Digite sua mensagem"
            />
          </FormControl>

        </Grid>
      </Grid>
    </MenuDrawer>
  )
}

export default Home