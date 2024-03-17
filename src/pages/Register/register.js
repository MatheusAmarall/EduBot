import React, { useState } from 'react'
import {
    TextField,
    FormControl,
    Grid,
    Button,
    Typography,
    InputAdornment,
    IconButton,
    InputLabel,
    OutlinedInput
  } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Register = () => {
    const [matricula, setMatricula] = useState("");
    const [senha, setSenha] = useState("")
    const [confirmaSenha, setConfirmaSenha] = useState("")
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleRegister = () => {
        console.log("login", matricula, senha, confirmaSenha)
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

  return (
    <Grid container style={{ height: '100vh' }}>
        <Grid item xs={12} style={{ backgroundColor: '#5B71EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Grid item xs={6} backgroundColor="white" padding={10} borderRadius={5}>
                <Grid container direction="column" spacing={2} textAlign="center">
                    <Grid item xs={12}>
                        <Typography fontWeight="bold" fontSize={24}>
                            Crie sua conta
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <TextField
                                label="Insira sua matrícula"
                                variant="outlined"
                                onChange={(e) => {
                                    setMatricula(e.target.value);
                                }}
                                value={matricula}
                                required={true}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="senha">Crie uma senha *</InputLabel>
                            <OutlinedInput
                                id="senha"
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                    >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                                }
                                label="Crie uma senha *"
                                onChange={(e) => {
                                    setSenha(e.target.value);
                                }}  
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="confirma-senha">Confirme sua senha *</InputLabel>
                            <OutlinedInput
                                id="confirma-senha"
                                type={showConfirmPassword ? 'text' : 'password'}
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleClickShowConfirmPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                                }
                                label="Confirme sua senha *"
                                onChange={(e) => {
                                    setConfirmaSenha(e.target.value);
                                }}  
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            onClick={handleRegister}
                            variant="contained"
                            size="large"
                            fullWidth
                        >
                            Criar conta
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography color="#98A2B3" fontSize={16}>
                            Já possui uma conta? <Button variant="text">Entrar</Button>
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            
        </Grid>
        {/* <Grid item xs={6} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Grid item xs={8} style={{ textAlign: 'center' }}>
                
            </Grid>
        </Grid> */}
    </Grid>
  )
}

export default Register