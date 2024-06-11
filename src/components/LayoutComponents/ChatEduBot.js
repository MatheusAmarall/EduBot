import { Grid, Avatar, Divider, Typography, List, ListItem, ListItemAvatar, ListItemText, Button } from '@mui/material'
import React, { useState, useContext, useEffect, useRef } from 'react'
import AppContext from '../../context/context';
import { getMessages } from '../../middlewares/HomeMiddleware';
import pdfMaternal from '../../assets/files/maternal.pdf';
import pdfPreEscola from '../../assets/files/preescola.pdf';
import logoEduBot from '../../assets/img/logo.png';
import InputMessage from './InputMessage';
import { Message } from '../../enums/messageEnum';

const ChatEduBot = ({mensagemDigitada, setMensagemDigitada, scrollToBottom, listRef}) => {
  const globalContext = useContext(AppContext);

  const userInfo = globalContext.returnUserInfo();
  const [historicoMensagens, setHistoricoMensagens] = useState({
    nomeUsuario: userInfo.email,
    mensagens: []
  });
  const [opcaoMensagemSelecionada, setOpcaoMensagemSelecionada] = useState("");
  const [loading, setLoading] = useState(false);

  const globalContextRef = useRef(globalContext);

  useEffect(() => {
    globalContextRef.current = globalContext;
  }, [globalContext]);

  const adicionarMensagem = (mensagensUsuario) => {
    setHistoricoMensagens((prevState) => ({
      ...prevState,
      mensagens: [...(prevState.mensagens || []), ...mensagensUsuario]
    }));
  };

  const handleSendMessage = async () => {
    if(globalContext.hubConnection) {
      if(mensagemDigitada === "" && opcaoMensagemSelecionada === "") {
        globalContext.showMessage(Message.Error, "Digite uma mensagem");
        return;
      }
      setLoading(true);

      const mensagem = {
        nomeUsuario: globalContext.conversaUsuario !== "" 
                    ? globalContext.conversaUsuario 
                    : userInfo.email !== "" ? userInfo.email : "Visitante",
        body: opcaoMensagemSelecionada !== "" ? opcaoMensagemSelecionada : mensagemDigitada,
        role: userInfo.role,
        sender: userInfo.email !== "" ? userInfo.email : "Visitante"
      };
  
      setMensagemDigitada("")
      setOpcaoMensagemSelecionada("")
      try {
        await globalContext.hubConnection.invoke("SendMessage", mensagem);
      } catch (error) {
        globalContext.showMessage(Message.Error, "Erro ao enviar a mensagem");
      } finally {
        setLoading(false);
      }
    }
    else {
      globalContext.showMessage(Message.Error, "Falha ao fazer conexão com o servidor, entre em contato com o suporte");
    }
  }

  const recuperarHistoricoMensagens = (email) => {
    getMessages(email, globalContext)
      .then((resultado) => {
        if(resultado) {
          setHistoricoMensagens(resultado)
        }
      })
      .catch(() => {});
  }

  const handleSelecionarOpcao = (opcao, index) => {
    setOpcaoMensagemSelecionada(opcao)

    setHistoricoMensagens(prevHistorico => ({
      ...prevHistorico,
      mensagens: prevHistorico.mensagens.map((mensagem, i) => {
        if (i === index) {
          return { ...mensagem, buttons: [] };
        }
        return mensagem;
      })
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

  const configureHubConnection = async (globalContextRef) => {
    if(globalContext.hubConnection !== null) {
      globalContext.hubConnection.on('ReceivedMessage', (messages) => {
        if(globalContext.isSentByCurrentUser(messages[0].nomeUsuario)
          || globalContextRef.current.conversaUsuario === messages[0].nomeUsuario) 
        {
          adicionarMensagem(messages)
          messages.forEach((responseMessage) => {
            if(responseMessage.sender === "EduBot") {
              if(responseMessage.mensagem.toLowerCase().includes("cardápio da pré-escola")) {
                downloadCardapio("pre-escola")
              }
              else if(responseMessage.mensagem.toLowerCase().includes("cardápio do maternal")) {
                downloadCardapio("maternal")
              }
            }
          })
        }
      });

      globalContext.hubConnection.on('StartService', (nomeUsuario) => {
        if(globalContext.isSentByCurrentUser(nomeUsuario)) {
          adicionarMensagem(["Coordenador entrou"])
        }
      })

      globalContext.hubConnection.on('EndService', (nomeUsuario) => {
        if(globalContext.isSentByCurrentUser(nomeUsuario)) {
          adicionarMensagem(["Coordenador saiu"])
        }
      })
    }
  };

  useEffect(() => {
    if(globalContext.hubConnection !== null) {
      configureHubConnection(globalContextRef);
    }
  }, [globalContext.hubConnection])

  useEffect(() => {
    if(userInfo.role && userInfo.role.toLowerCase() !== "visitante") {
      if(globalContext.conversaUsuario !== "") {
        recuperarHistoricoMensagens(globalContext.conversaUsuario)
      }
      else {
        recuperarHistoricoMensagens(userInfo.email)
      }
    }
  }, [globalContext.conversaUsuario])

  useEffect(() => {
    if(opcaoMensagemSelecionada !== "") {
      handleSendMessage()
    }
  }, [opcaoMensagemSelecionada])

  useEffect(() => {
    scrollToBottom();
  }, [historicoMensagens])

  return (
    <>
        <Grid ref={listRef} item xs={12} style={{ flexGrow: 1, overflow: "auto", height: "80vh" }}>
            {historicoMensagens.mensagens.length === 0 && (
                <Grid item xs={12} mt={5} style={{ display: 'flex', alignItems: 'center',justifyContent: 'center', color: '#5B71EE' }}>
                    <Grid item xs={8}>
                    <Typography fontSize={20} fontStyle="italic" style={{ textAlign: 'center', userSelect: 'none' }}>Seja bem-vindo ao EduBot. Para mais informações, acesse o botão de ajuda, localizado no canto superior direito.</Typography>
                    </Grid>
                </Grid>
            )}
            <List style={{ display: 'flex', flexDirection: 'column' }}>
                {historicoMensagens && historicoMensagens.mensagens.map((message, index) => (
                    typeof message === 'string' ? (
                      <React.Fragment key={index}>
                        <Divider>{message}</Divider>
                      </React.Fragment>
                    ) : (
                    <React.Fragment key={index}>
                      <ListItem
                      key={index}
                      style={{
                        textAlign: globalContext.onRightSide(message.sender) ? 'right' : 'left',
                        flexDirection: globalContext.onRightSide(message.sender) ? 'row-reverse' : 'row'
                      }}
                      >
                        <ListItemAvatar style={{
                            display: 'flex',
                            justifyContent: globalContext.onRightSide(message.sender) ? 'flex-end' : 'flex-start'
                        }}>
                            {message.sender === "EduBot"
                            ? <img src={logoEduBot} alt="EDU.BOT" style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 10 }} />
                            : <Avatar alt="Profile Picture" /> }
                        </ListItemAvatar>
                        <ListItemText
                            primary={globalContext.onRightSide(message.sender) ? message.sender.split("@")[0] : message.sender}
                            secondary={globalContext.renderMessageText(message.body)}
                            style={{ 
                              textAlign: globalContext.onRightSide(message.sender) ? 'right' : 'left',
                              maxWidth: 400,
                              wordBreak: 'break-word'
                            }}
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
                    )
                ))}
            </List>
        </Grid>
        <InputMessage
          mensagemDigitada={mensagemDigitada}
          setMensagemDigitada={setMensagemDigitada}
          handleSendMessage={handleSendMessage}
          loading={loading}
        />
    </>
  )
}

export default ChatEduBot