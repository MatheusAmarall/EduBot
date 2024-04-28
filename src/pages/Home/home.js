import { Grid, Avatar, Typography, List, ListItem, ListItemAvatar, ListItemText, Button, IconButton, FormControl, InputLabel, OutlinedInput, InputAdornment } from '@mui/material'
import React, { useState, useContext, useEffect, useRef } from 'react'
import MenuDrawer from '../../components/LayoutComponents/MenuDrawer';
import SendIcon from '@mui/icons-material/Send';
import AppContext from '../../context/context';
import { sendMessage, getMessages } from '../../middlewares/HomeMiddleware';
import pdfMaternal from '../../assets/files/maternal.pdf';
import pdfPreEscola from '../../assets/files/preescola.pdf';

const Home = () => {
  const [mensagens, setMensagens] = useState([]);
  const [historicoMensagens, setHistoricoMensagens] = useState(null);
  const [mensagemDigitada, setMensagemDigitada] = useState("");
  const [opcaoMensagemSelecionada, setOpcaoMensagemSelecionada] = useState("");

  const globalContext = useContext(AppContext);
  const userInfo = globalContext.returnUserInfo();

  const listRef = useRef(null);

  const isSentByCurrentUser = (user) => {
    return user === userInfo.email || (user && user.toLowerCase() === "visitante")
  }

  const isSentByUser = (event) => {
    return event === "user"
  }

  const handleSendMessage = () =>{
    const mensagem = {
      sender: userInfo.email !== "" ? userInfo.email : "Visitante",
      message: opcaoMensagemSelecionada !== "" ? opcaoMensagemSelecionada : mensagemDigitada
    };

    const mensagemUsuario = {
      nomeUsuario: mensagem.sender,
      texto: mensagem.message
    }

    setMensagens(prevState => [...prevState, mensagemUsuario]);
    setMensagemDigitada("")
    setOpcaoMensagemSelecionada("")

    sendMessage(mensagem, globalContext)
      .then((resultado) => {
        console.log("resultado", resultado)
        resultado.data.forEach((mensagem) => {
          const mensagemBot = {
            nomeUsuario: "EduBot",
            texto: mensagem.text,
            buttons: mensagem.buttons
          }
          setMensagens(prevState => [...prevState, mensagemBot]);
          if(mensagem.text.toLowerCase().includes("cardápio da pré-escola")) {
            downloadCardapio("pre-escola")
          }
          else if(mensagem.text.toLowerCase().includes("cardápio do maternal")) {
            downloadCardapio("maternal")
          }
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

  const handleSelecionarOpcao = (opcao, index) => {
    setOpcaoMensagemSelecionada(opcao)

    setMensagens(prevMensagens => prevMensagens.map((mensagem, i) => {
      if (i === index) {
        return { ...mensagem, buttons: [] };
      }
      return mensagem;
    }));
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

  const downloadCardapio = (tipoCardapio) => {
    const link = document.createElement('a');
    link.href = tipoCardapio === "maternal" ? pdfMaternal : pdfPreEscola;
    link.download = tipoCardapio === "maternal" ? 'maternal.pdf' : 'pre-escola.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if(userInfo.role && userInfo.role.toLowerCase() !== "visitante") {
      recuperarHistoricoMensagens();
    }
  }, [])

  useEffect(() => {
    scrollToBottom();
  }, [historicoMensagens, mensagens]);

  useEffect(() => {
    if(opcaoMensagemSelecionada !== "") {
      handleSendMessage()
    }
  }, [opcaoMensagemSelecionada])

  return (
    <MenuDrawer>
      <Grid container>
        <Grid ref={listRef} item xs={12} style={{ flexGrow: 1, overflow: "auto", height: "80vh" }}>
          {!historicoMensagens && mensagens.length === 0 && (
            <Grid item xs={12} mt={5} style={{ display: 'flex', alignItems: 'center',justifyContent: 'center', color: '#5B71EE' }}>
              <Grid item xs={8}>
                <Typography fontSize={20} fontStyle="italic" style={{ textAlign: 'center', userSelect: 'none' }}>Seja bem-vindo ao EduBot. Para mais informações, acesse o botão de ajuda, localizado no canto superior direito.</Typography>
              </Grid>
            </Grid>
          )}
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
                  secondary={renderMessageText(message.text)}
                  style={{ textAlign: isSentByUser(message.event) ? 'right' : 'left' }}
                />
              </ListItem>
              )
              :
              <React.Fragment key={index}></React.Fragment>
            ))}
            {mensagens.map((message, index) => (
              <React.Fragment key={index}>
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
                  secondary={renderMessageText(message.texto)}
                  style={{ textAlign: isSentByCurrentUser(message.nomeUsuario) ? 'right' : 'left' }}
                />
              </ListItem>
              {message.buttons && message.buttons.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  {message.buttons.map((button, buttonIndex) => (
                    <Button key={buttonIndex} variant="text" onClick={() => handleSelecionarOpcao(button.payload, index)}>
                      {button.title}
                    </Button>
                  ))}
                </div>
              )}
              </React.Fragment>
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