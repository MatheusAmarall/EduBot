import React from 'react'
import { Grid, IconButton, FormControl, InputLabel, OutlinedInput, InputAdornment } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';

const InputMessage = ({mensagemDigitada, setMensagemDigitada, handleSendMessage}) => {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
          handleSendMessage();
        }
      };
  return (
    <Grid item xs={12}>
        <FormControl fullWidth variant="outlined">
        <InputLabel htmlFor="txt-message">Digite sua mensagem</InputLabel>
        <OutlinedInput
            id="txt-message"
            value={mensagemDigitada}
            onChange={(e) => {
                setMensagemDigitada(e.target.value)
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
  )
}

export default InputMessage