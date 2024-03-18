import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
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
import {
    Visibility,
    VisibilityOff
} from '@mui/icons-material';

const Login = () => {
    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleLogin = () => {
        console.log("login", login, senha)
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show);
        
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleNavigate = (url) => {
        navigate(url)
    }
    
  return (
    <Grid container style={{ height: '100vh' }}>
        <Grid item xs={6} style={{ backgroundColor: '#5B71EE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
            <Grid item xs={10}>
                <Typography fontSize={48} fontStyle="italic">Seja bem vindo ao EDU website, onde você acompanha a vida escolar do seu filho(a).</Typography>
            </Grid>
        </Grid>
        <Grid item xs={6} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Grid item xs={8} style={{ textAlign: 'center' }}>
                <Grid container direction="column" spacing={2}>
                    <Grid item xs={12}>
                        <Typography fontWeight="bold" fontSize={24} align="left">
                            Entre em sua conta
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <TextField
                                label="Insira sua matrícula"
                                variant="outlined"
                                onChange={(e) => {
                                    setLogin(e.target.value);
                                }}
                                value={login}
                                required={true}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="senha">Insira sua senha *</InputLabel>
                            <OutlinedInput
                                id="senha"
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                    >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                                }
                                label="Insira sua senha *"
                                onChange={(e) => {
                                    setSenha(e.target.value);
                                }}  
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            onClick={handleLogin}
                            variant="contained"
                            size="large"
                            fullWidth
                        >
                            Entrar
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography color="#98A2B3" fontSize={16}>
                            Não possui uma conta? <Button onClick={() => handleNavigate("/register")} variant="text">Crie sua conta</Button>
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Button onClick={() => handleNavigate("/")} variant="text">Continuar como visitante</Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </Grid>
  )
}

export default Login