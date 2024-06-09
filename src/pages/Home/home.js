import { Grid } from '@mui/material'
import React, { useState, useRef } from 'react'
import MenuDrawer from '../../components/LayoutComponents/MenuDrawer';
import ChatEduBot from '../../components/LayoutComponents/ChatEduBot';

const Home = () => {
  const [mensagemDigitada, setMensagemDigitada] = useState("");

  const listRef = useRef(null);
  
  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  };

  return (
    <MenuDrawer>
      <Grid container>
        <ChatEduBot 
          mensagemDigitada={mensagemDigitada} 
          setMensagemDigitada={setMensagemDigitada} 
          scrollToBottom={scrollToBottom} 
          listRef={listRef} />
      </Grid>
    </MenuDrawer>
  )
}

export default Home