import React from 'react'
import { Grid, IconButton, FormControl, InputLabel, OutlinedInput, InputAdornment, CircularProgress  } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';

const InputMessage = ({mensagemDigitada, setMensagemDigitada, handleSendMessage, loading }) => {
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
            disabled={loading}
            endAdornment={<InputAdornment position="end">
            <IconButton
                aria-label="toggle password visibility"
                onClick={handleSendMessage}
                edge="end"
            >
                {loading ? <CircularProgress size={24} /> : <SendIcon />}
            </IconButton>
            </InputAdornment>}
            label="Digite sua mensagem"
        />
        </FormControl>
    </Grid>
  )
}

export default InputMessage