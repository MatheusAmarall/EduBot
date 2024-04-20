import { Grid, Avatar, List, ListItem, ListItemAvatar, ListItemText, IconButton, FormControl, InputLabel, OutlinedInput, InputAdornment } from '@mui/material'
import React, { useState, useContext, useEffect, useRef } from 'react'
import MenuDrawer from '../../components/LayoutComponents/MenuDrawer';
import SendIcon from '@mui/icons-material/Send';
import AppContext from '../../context/context';
import { sendMessage, getMessages } from '../../middlewares/HomeMiddleware';

const Home = () => {
  const [mensagens, setMensagens] = useState([]);
  const [historicoMensagens, setHistoricoMensagens] = useState(null);
  const [mensagemDigitada, setMensagemDigitada] = useState("");

  const globalContext = useContext(AppContext);
  const userInfo = globalContext.returnUserInfo();

  const listRef = useRef(null);

  const isSentByCurrentUser = (user) => {
    return user === userInfo.email || user.toLowerCase() === "visitante"
  }

  const isSentByUser = (event) => {
    return event === "user"
  }

  const handleSendMessage = () =>{
    const mensagem = {
      sender: userInfo.email !== "" ? userInfo.email : "Visitante",
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
  
  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  };

  const recuperarHistoricoMensagens = () => {
    getMessages(userInfo.email, globalContext)
      .then((resultado) => {
        setHistoricoMensagens(resultado)
      })
      .catch(() => {});
  }

  useEffect(() => {
    if(userInfo.role.toLowerCase() !== "visitante") {
      recuperarHistoricoMensagens();
    }
  }, [])

  useEffect(() => {
    scrollToBottom();
  }, [historicoMensagens, mensagens]);

  return (
    <MenuDrawer>
      <Grid container>
        <Grid ref={listRef} item xs={12} style={{ flexGrow: 1, overflow: "auto", height: "80vh" }}>
          <List style={{ display: 'flex', flexDirection: 'column' }}>
            {historicoMensagens && historicoMensagens.events.map((message, index) => (
              message.event === "user" || message.event === "bot" ? (
              <ListItem
                key={index}
                style={{
                  textAlign: isSentByUser(message.event) ? 'right' : 'left',
                  flexDirection: isSentByUser(message.event) ? 'row-reverse' : 'row'
                }}
              >
                <ListItemAvatar style={{
                  display: 'flex',
                  justifyContent: isSentByUser(message.event) ? 'flex-end' : 'flex-start'
                }}>
                  <Avatar alt="Profile Picture" />
                </ListItemAvatar>
                <ListItemText
                  primary={isSentByUser(message.event) ? historicoMensagens.senderId.split("@")[0] : "EduBot"}
                  secondary={message.text}
                  style={{ textAlign: isSentByUser(message.event) ? 'right' : 'left' }}
                />
              </ListItem>
              )
              :
              <React.Fragment key={index}></React.Fragment>
            ))}
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
                  primary={message.nomeUsuario.includes("@") ? message.nomeUsuario.split("@")[0] : message.nomeUsuario}
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