import { Grid, Avatar, List, ListItem, ListItemAvatar, ListItemText, IconButton, FormControl, InputLabel, OutlinedInput, InputAdornment } from '@mui/material'
import React, { useState, useEffect } from 'react'
import MenuDrawer from '../../components/LayoutComponents/MenuDrawer';
import SendIcon from '@mui/icons-material/Send';

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [mensagemDigitada, setMensagemDigitada] = useState("");

  const getMessages = () => {
    const mensagens = [
      {
        "id": 1,
        "nomeUsuario": "Matheus Amaral da silva",
        "descricao": "Um texto de testezinho"
      },
      {
        "id": 2,
        "nomeUsuario": "Matheus Amaral",
        "descricao": "Um texto de testezinho"
      },
      {
        "id": 3,
        "nomeUsuario": "Matheus Amaral",
        "descricao": "Um texto de testezinho"
      },
      {
        "id": 4,
        "nomeUsuario": "Matheus Amaral",
        "descricao": "Um texto de testezinho"
      },
      {
        "id": 5,
        "nomeUsuario": "Matheus Amaral",
        "descricao": "Um texto de testezinho"
      },
      {
        "id": 6,
        "nomeUsuario": "Matheus Amaral",
        "descricao": "Um texto de testezinho"
      },
      {
        "id": 7,
        "nomeUsuario": "Matheus Amaral",
        "descricao": "Um texto de testezinho"
      },
      {
        "id": 8,
        "nomeUsuario": "Matheus Amaral",
        "descricao": "Um texto de testezinho"
      },
      {
        "id": 9,
        "nomeUsuario": "Matheus Amaral",
        "descricao": "Um texto de testezinho"
      },
      {
        "id": 9,
        "nomeUsuario": "Matheus Amaral",
        "descricao": "Um texto de testezinho"
      },
      {
        "id": 9,
        "nomeUsuario": "Matheus Amaral",
        "descricao": "Um texto de testezinho"
      },
    ]
    setMessages(mensagens)
  }

  const isSentByCurrentUser = (user) => {
    return user === "Matheus Amaral"
  }

  const handleSendMessage = () =>{
    console.log(mensagemDigitada);
    setMensagemDigitada("")
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  useEffect(() => {
    getMessages();
  }, [])
  return (
    <MenuDrawer>
      <Grid container>
        <Grid item xs={12} style={{ flexGrow: 1, overflow: "auto", height: "80vh" }}>
          <List style={{ display: 'flex', flexDirection: 'column' }}>
            {messages.map((message, index) => (
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
                  secondary={message.descricao}
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