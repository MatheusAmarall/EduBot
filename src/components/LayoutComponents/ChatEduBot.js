import { Grid, Avatar, Typography, List, ListItem, ListItemAvatar, ListItemText, Button } from '@mui/material'
import React, { useState, useContext, useEffect } from 'react'
import AppContext from '../../context/context';
import { sendMessage, getMessages } from '../../middlewares/HomeMiddleware';
import pdfMaternal from '../../assets/files/maternal.pdf';
import pdfPreEscola from '../../assets/files/preescola.pdf';
import logoEduBot from '../../assets/img/logo.png';
import InputMessage from './InputMessage';

const ChatEduBot = ({mensagemDigitada, setMensagemDigitada, scrollToBottom, listRef}) => {
  const [mensagens, setMensagens] = useState([]);
  const [historicoMensagens, setHistoricoMensagens] = useState(null);
  const [opcaoMensagemSelecionada, setOpcaoMensagemSelecionada] = useState("");

  const globalContext = useContext(AppContext);
  const userInfo = globalContext.returnUserInfo();

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
                {historicoMensagens && historicoMensagens.events.map((message, index) => (
                    message.event === "user" || message.event === "bot" ? (
                    <ListItem
                    key={index}
                    style={{
                        textAlign: globalContext.isSentByUser(message.event) ? 'right' : 'left',
                        flexDirection: globalContext.isSentByUser(message.event) ? 'row-reverse' : 'row'
                    }}
                    >
                    <ListItemAvatar style={{
                        display: 'flex',
                        justifyContent: globalContext.isSentByUser(message.event) ? 'flex-end' : 'flex-start'
                    }}>
                        {globalContext.isSentByUser(message.event)
                        ? <Avatar alt="Profile Picture" /> 
                        : <img src={logoEduBot} alt="EDU.BOT" style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 10 }} />}
                    </ListItemAvatar>
                    <ListItemText
                        primary={globalContext.isSentByUser(message.event) ? historicoMensagens.senderId.split("@")[0] : "EduBot"}
                        secondary={globalContext.renderMessageText(message.text)}
                        style={{ textAlign: globalContext.isSentByUser(message.event) ? 'right' : 'left' }}
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
                        textAlign: globalContext.isSentByCurrentUser(message.nomeUsuario) ? 'right' : 'left',
                        flexDirection: globalContext.isSentByCurrentUser(message.nomeUsuario) ? 'row-reverse' : 'row'
                    }}
                    >
                    <ListItemAvatar style={{
                        display: 'flex',
                        justifyContent: globalContext.isSentByCurrentUser(message.nomeUsuario) ? 'flex-end' : 'flex-start'
                    }}>
                        
                        {globalContext.isSentByCurrentUser(message.nomeUsuario)
                        ? <Avatar alt="Profile Picture" /> 
                        : <img src={logoEduBot} alt="EDU.BOT" style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 10 }} />}
                    </ListItemAvatar>
                    <ListItemText
                        primary={message.nomeUsuario.includes("@") ? message.nomeUsuario.split("@")[0] : message.nomeUsuario}
                        secondary={globalContext.renderMessageText(message.texto)}
                        style={{ textAlign: globalContext.isSentByCurrentUser(message.nomeUsuario) ? 'right' : 'left' }}
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