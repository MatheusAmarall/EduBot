import React, { useState, useContext, useEffect } from 'react'
import {
    TextField,
    FormControl,
    Grid,
    Button,
    Typography,
    InputAdornment,
    IconButton,
    InputLabel,
    OutlinedInput,
    Switch,
    FormControlLabel
  } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../middlewares/AuthMiddleware';
import AppContext from '../../context/context';
import { Message } from '../../enums/messageEnum';

const Register = () => {
    const [isCoordenador, setIsCoordenador] = useState(false);
    const [email, setEmail] = useState("");
    const [matricula, setMatricula] = useState("");
    const [senha, setSenha] = useState("")
    const [confirmaSenha, setConfirmaSenha] = useState("")
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const globalContext = useContext(AppContext);

    const navigate = useNavigate();

    const handleRegister = () => {
        const dadosRegister = {
            isAdmin: isCoordenador,
            matricula: matricula,
            email: email,
            password: senha,
            confirmPassword: confirmaSenha,
        };
      
        registerUser(dadosRegister, globalContext)
        .then((resultado) => {
            globalContext.showMessage(Message.Success, resultado.data);
            handleNavigate("/")
        })
        .catch(() => {});
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleNavigate = (url) => {
        navigate(url)
    }

    useEffect(() => {
        sessionStorage.clear();
    }, [])

  return (
    <Grid container style={{ height: "100vh" }}>
        <Grid item xs={12} style={{ backgroundColor: "#5B71EE", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Grid item xs={6} backgroundColor="white" padding={10} borderRadius={5}>
                <Grid container direction="column" spacing={2} textAlign="center">
                    <Grid item xs={12}>
                        <Typography fontWeight="bold" fontSize={28} style={{ userSelect: "none" }}>
                            Crie sua conta
                        </Typography>
                    </Grid>
                    <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
                        <FormControl>
                            <Typography fontSize={19} style={{ userSelect: "none", marginRight: "20px" }}>
                                Membro Da Coordenação
                            </Typography>
                        </FormControl>
                        <FormControlLabel style={{ userSelect: "none"}}control={<Switch
                            checked={isCoordenador} 
                            onChange={(e) => {
                                setIsCoordenador(e.target.checked);
                            }}
                        />}/>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <TextField
                                label="Email"
                                variant="outlined"
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                                value={email}
                                required={true}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <TextField
                                label="Matrícula"
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
                                type={showPassword ? "text" : "password"}
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
                                type={showConfirmPassword ? "text" : "password"}
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
                        <Typography color="#98A2B3" fontSize={16} style={{ userSelect: "none" }}>
                            Já possui uma conta? <Button onClick={() => handleNavigate("/")} variant="text">Entrar</Button>
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </Grid>
  )
}

export default Register