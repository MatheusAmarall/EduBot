import { Grid, Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import React, { useState, useContext, useEffect } from 'react'
import AppContext from '../../context/context';
import logoEduBot from '../../assets/img/logo.png';
import InputMessage from './InputMessage';

const ChatCoordenador = ({mensagemDigitada, setMensagemDigitada, scrollToBottom, listRef}) => {
  const [historicoMensagens, setHistoricoMensagens] = useState([]);
  const [hubConnection, setHubConnection] = useState(null);

  const globalContext = useContext(AppContext);
  const userInfo = globalContext.returnUserInfo();

  const handleSendMessage = () =>{
    const mensagem = {
      nomeUsuario: userInfo.email,
      mensagem: mensagemDigitada
    };

    setMensagemDigitada("")

    hubConnection.invoke("SendMessage", mensagem)
  }

  const recuperarHistoricoMensagens = async () => {
    if(!hubConnection) {
        await globalContext
        .createHubConnection()
        .then(async (conn) => {
            if (conn) {
            await conn.start();

            conn.on('ReceivedMessage', (msg) => {
                console.log("entrou aqui")
                setHistoricoMensagens(prevState => [...prevState, msg]);
            });

            setHubConnection(conn);
            }
        });
    }
  };

  useEffect(() => {
    console.log("entrou aqui para registar")
    recuperarHistoricoMensagens();

    return () => {
        if (hubConnection) {
            hubConnection.stop();
            setHubConnection(null);
        }
    };
  }, []); 

  useEffect(() => {
    scrollToBottom();
  }, [historicoMensagens])

  return (
    <>
        <Grid ref={listRef} item xs={12} style={{ flexGrow: 1, overflow: "auto", height: "80vh" }}>
            <List style={{ display: 'flex', flexDirection: 'column' }}>
                {historicoMensagens.map((message, index) => (
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
                        primary={message.nomeUsuario}
                        secondary={globalContext.renderMessageText(message.mensagem)}
                        style={{ textAlign: globalContext.isSentByCurrentUser(message.nomeUsuario) ? 'right' : 'left' }}
                    />
                    </ListItem>
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

export default ChatCoordenador