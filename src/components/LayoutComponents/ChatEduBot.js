import { Grid, Avatar, Typography, List, ListItem, ListItemAvatar, ListItemText, Button } from '@mui/material'
import React, { useState, useContext, useEffect } from 'react'
import AppContext from '../../context/context';
import { sendMessage, getMessages } from '../../middlewares/HomeMiddleware';
import pdfMaternal from '../../assets/files/maternal.pdf';
import pdfPreEscola from '../../assets/files/preescola.pdf';
import logoEduBot from '../../assets/img/logo.png';
import InputMessage from './InputMessage';

const ChatEduBot = ({mensagemDigitada, setMensagemDigitada, scrollToBottom, listRef}) => {
  const globalContext = useContext(AppContext);

  const userInfo = globalContext.returnUserInfo();
  const [mensagens, setMensagens] = useState([]);
  const [historicoMensagens, setHistoricoMensagens] = useState({
    nomeUsuario: userInfo.email,
    mensagens: []
  });
  const [opcaoMensagemSelecionada, setOpcaoMensagemSelecionada] = useState("");
  const [hubConnection, setHubConnection] = useState(null);

  const adicionarMensagem = (mensagemUsuario) => {
    setHistoricoMensagens((prevState) => ({
      ...prevState,
      mensagens: [...(prevState.mensagens || []), mensagemUsuario]
    }));
  };

  const handleSendMessage = () => {
    if(hubConnection) {
      const mensagem = {
        nomeUsuario: globalContext.conversaUsuario !== "" 
                    ? globalContext.conversaUsuario 
                    : userInfo.email !== "" ? userInfo.email : "Visitante",
        body: opcaoMensagemSelecionada !== "" ? opcaoMensagemSelecionada : mensagemDigitada,
        role: userInfo.role,
        sender: userInfo.email !== "" ? userInfo.email : "Visitante",
        toBot: true
      };
  
      const mensagemUsuario = {
        body: mensagem.body,
        role: mensagem.role,
        sender: mensagem.sender
      }
  
      adicionarMensagem(mensagemUsuario)
      setMensagemDigitada("")
      setOpcaoMensagemSelecionada("")
      hubConnection.invoke("SendMessage", mensagem)
    }
  }

  const recuperarHistoricoMensagens = (email) => {
    getMessages(email, globalContext)
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

  const downloadCardapio = (tipoCardapio) => {
    const link = document.createElement('a');
    link.href = tipoCardapio === "maternal" ? pdfMaternal : pdfPreEscola;
    link.download = tipoCardapio === "maternal" ? 'maternal.pdf' : 'pre-escola.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const createHubConnection = async () => {
    if(!hubConnection) {
        await globalContext
        .createHubConnection()
        .then(async (conn) => {
            if (conn) {
              await conn.start();

              conn.on('ReceivedMessage', (messages) => {
                messages.forEach((responseMessage) => {
                  adicionarMensagem(responseMessage)

                  if(responseMessage.sender === "EduBot") {
                    if(responseMessage.mensagem.toLowerCase().includes("cardápio da pré-escola")) {
                      downloadCardapio("pre-escola")
                    }
                    else if(responseMessage.mensagem.toLowerCase().includes("cardápio do maternal")) {
                      downloadCardapio("maternal")
                    }
                  }
                })
              });

              setHubConnection(conn);
            }
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    if(userInfo.role && userInfo.role.toLowerCase() !== "visitante") {
      createHubConnection();
    }

    return () => {
      if (hubConnection) {
          hubConnection.stop();
          setHubConnection(null);
      }
    };
  }, [])

  useEffect(() => {
    if(globalContext.conversaUsuario !== "") {
      recuperarHistoricoMensagens(globalContext.conversaUsuario)
    }
    else {
      recuperarHistoricoMensagens(userInfo.email)
    }
  }, [globalContext.conversaUsuario])

  useEffect(() => {
    if(opcaoMensagemSelecionada !== "") {
      handleSendMessage()
    }
  }, [opcaoMensagemSelecionada])

  useEffect(() => {
    scrollToBottom();
  }, [historicoMensagens, mensagens])

  return (
    <>
        <Grid ref={listRef} item xs={12} style={{ flexGrow: 1, overflow: "auto", height: "80vh" }}>
            {!historicoMensagens && mensagens.length === 0 && (
                <Grid item xs={12} mt={5} style={{ display: 'flex', alignItems: 'center',justifyContent: 'center', color: '#5B71EE' }}>
                    <Grid item xs={8}>
                    <Typography fontSize={20} fontStyle="italic" style={{ textAlign: 'center', userSelect: 'none' }}>Seja bem-vindo ao EduBot. Para mais informações, acesse o botão de ajuda, localizado no canto superior direito.</Typography>
                    </Grid>
                </Grid>
            )}
            <List style={{ display: 'flex', flexDirection: 'column' }}>
                {historicoMensagens && historicoMensagens.mensagens.map((message, index) => (
                    <React.Fragment key={index}>
                    <ListItem
                    key={index}
                    style={{
                      textAlign: globalContext.isSentByCurrentUser(message.sender) ? 'right' : 'left',
                      flexDirection: globalContext.isSentByCurrentUser(message.sender) ? 'row-reverse' : 'row'
                    }}
                    >
                      <ListItemAvatar style={{
                          display: 'flex',
                          justifyContent: globalContext.isSentByCurrentUser(message.sender) ? 'flex-end' : 'flex-start'
                      }}>
                          {globalContext.isSentByCurrentUser(message.sender)
                          ? <Avatar alt="Profile Picture" /> 
                          : <img src={logoEduBot} alt="EDU.BOT" style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 10 }} />}
                      </ListItemAvatar>
                      <ListItemText
                          primary={globalContext.isSentByCurrentUser(message.sender) ? message.sender.split("@")[0] : message.sender}
                          secondary={globalContext.renderMessageText(message.body)}
                          style={{ textAlign: globalContext.isSentByCurrentUser(message.sender) ? 'right' : 'left' }}
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
        <InputMessage
          mensagemDigitada={mensagemDigitada}
          setMensagemDigitada={setMensagemDigitada}
          handleSendMessage={handleSendMessage}
        />
    </>
  )
}

export default ChatEduBot