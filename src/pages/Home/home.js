import { Grid } from '@mui/material'
import React, { useState, useRef, useContext } from 'react'
import MenuDrawer from '../../components/LayoutComponents/MenuDrawer';

import ChatEduBot from '../../components/LayoutComponents/ChatEduBot';
import ChatCoordenador from '../../components/LayoutComponents/ChatCoordenador';
import AppContext from '../../context/context';

const Home = () => {
  const [mensagemDigitada, setMensagemDigitada] = useState("");

  const globalContext = useContext(AppContext);

  const listRef = useRef(null);
  
  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  };

  return (
    <MenuDrawer>
      <Grid container>
        {globalContext.chatAtivo === "edubot" ? (
          <ChatEduBot 
            mensagemDigitada={mensagemDigitada} 
            setMensagemDigitada={setMensagemDigitada} 
            scrollToBottom={scrollToBottom} 
            listRef={listRef} />
        ) : (
          <ChatCoordenador
            mensagemDigitada={mensagemDigitada} 
            setMensagemDigitada={setMensagemDigitada} 
            scrollToBottom={scrollToBottom} 
            listRef={listRef} />
        )}
      </Grid>
    </MenuDrawer>
  )
}

export default Home