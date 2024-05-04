import React from 'react'
import Slide from '@mui/material/Slide';
import {
    Typography,
    IconButton,
    Toolbar,
    Dialog,
    Stepper,
    Step,
    StepLabel,
    Button,
    Box,
    InputLabel,
    Grid,
    InputAdornment,
    OutlinedInput,
    FormControl,
    List,
    ListItem,
    ListItemText,
    TextField
  } from '@mui/material'
import MuiAppBar from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import AppContext from '../../context/context';
import { useContext } from 'react'
import { Message } from '../../enums/messageEnum';
import { createNewStory } from '../../middlewares/ParametrizacaoMiddleware';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })(() => ({
    backgroundColor: '#02040f',
}));

const steps = ['Perguntas', 'Respostas'];

const Parametrizacao = ({openDialog, setOpenDialog}) => {
    const [activeStep, setActiveStep] = React.useState(0);
    const [perguntaDigitada, setPerguntaDigitada] = React.useState("");
    const [respostaDigitada, setRespostaDigitada] = React.useState("");
    const [tituloPergunta, setTituloPergunta] = React.useState("");
    const [perguntas, setPerguntas] = React.useState([]);
    const [respostas, setRespostas] = React.useState([]);

    const globalContext = useContext(AppContext);

    const handleCloseDialog = () => {
        setPerguntaDigitada("")
        setRespostaDigitada("")
        setPerguntas([])
        setRespostas([])
        setActiveStep(0)
        setOpenDialog(false)
    }

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSendPergunta = () => {
        setPerguntas(prevState => [...prevState, perguntaDigitada]);
        setPerguntaDigitada("");
    }

    const handleSendResposta = () => {
        setRespostas(prevState => [...prevState, respostaDigitada]);
        setRespostaDigitada("");
    }

    const handleKeyPressPergunta = (e) => {
        if (e.key === 'Enter') {
            handleSendPergunta();
        }
    };

    const handleKeyPressResposta = (e) => {
        if (e.key === 'Enter') {
            handleSendResposta();
        }
    };

    const handleRemovePergunta = (index) => {
        setPerguntas(prevState => prevState.filter((_, i) => i !== index));
    };

    const handleRemoveResposta = (index) => {
        setRespostas(prevState => prevState.filter((_, i) => i !== index));
    };

    const handleSaveParametrizacao = () => {
        if(tituloPergunta === "") {
            globalContext.showMessage(Message.Error, "O título da pergunta é obrigatório");
            return;
        }
        else if(perguntas.length === 0) {
            globalContext.showMessage(Message.Error, "Você deve adicionar ao menos uma pergunta");
            return;
        }
        else if(respostas.length === 0) {
            globalContext.showMessage(Message.Error, "Você deve adicionar ao menos uma resposta");
            return;
        }

        const story = {
            tituloPergunta,
            perguntas,
            respostas
        }
       
        createNewStory(story, globalContext)
        .then(() => {
            globalContext.showMessage(Message.Success, "Nova parametrização criada com sucesso");
            handleCloseDialog();
        })
        .catch(() => {});
    }
  return (
    <Dialog
        fullScreen
        open={openDialog}
        onClose={handleCloseDialog}
        TransitionComponent={Transition}
        >
        <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
            <IconButton
                edge="start"
                color="inherit"
                onClick={handleCloseDialog}
                aria-label="close"
            >
                <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Parametrização
            </Typography>
            </Toolbar>
        </AppBar>
        <Box sx={{ width: '100%', padding: '40px' }}>
            <Stepper activeStep={activeStep}>
                {steps.map((label) => {
                    const stepProps = {};
                    const labelProps = {};
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            <React.Fragment>
                {activeStep === 0 && (
                    <>
                        <Grid container justifyContent="center">
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <TextField
                                        label="Título das perguntas"
                                        variant="outlined"
                                        onChange={(e) => {
                                            setTituloPergunta(e.target.value);
                                        }}
                                        value={tituloPergunta}
                                        required={true}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={7}>
                                <List sx={{
                                    width: '100%',
                                    height: '300px',
                                    bgcolor: '#f5f5f5',
                                    padding: '20px',
                                    maxHeight: '300px',
                                    overflowY: 'auto',
                                    borderRadius: '8px',
                                    marginBottom: '40px',
                                    marginTop: '20px'
                                }}>
                                    {perguntas.map((value, index) => (
                                    <ListItem
                                        key={value}
                                        disableGutters
                                        secondaryAction={
                                        <IconButton aria-label="comment">
                                            <DeleteIcon onClick={() => handleRemovePergunta(index)} />
                                        </IconButton>
                                        }
                                    >
                                        <ListItemText primary={value} />
                                    </ListItem>
                                    ))}
                                </List>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel htmlFor="txt-perguntas">Adicione novas perguntas aqui</InputLabel>
                                <OutlinedInput
                                id="txt-perguntas"
                                value={perguntaDigitada}
                                onChange={(e) => {
                                    setPerguntaDigitada(e.target.value);
                                }}
                                onKeyPress={handleKeyPressPergunta}
                                endAdornment={<InputAdornment position="end">
                                    <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleSendPergunta}
                                    edge="end"
                                    >
                                        <SendIcon />
                                    </IconButton>
                                </InputAdornment>}
                                label="Adicione novas perguntas aqui"
                                />
                            </FormControl>
                        </Grid>
                    </>
                )}
                {activeStep === 1 && (
                    <>
                        <Grid container justifyContent="center">
                            <Grid item xs={7}>
                                <List sx={{
                                    width: '100%',
                                    height: '300px',
                                    bgcolor: '#f5f5f5',
                                    padding: '20px',
                                    maxHeight: '300px',
                                    overflowY: 'auto',
                                    borderRadius: '8px',
                                    marginBottom: '40px',
                                    marginTop: '20px'
                                }}>
                                {respostas.map((value, index) => (
                                    <ListItem
                                        key={value}
                                        disableGutters
                                        secondaryAction={
                                        <IconButton aria-label="comment">
                                            <DeleteIcon onClick={() => handleRemoveResposta(index)}/>
                                        </IconButton>
                                        }
                                    >
                                        <ListItemText primary={`Line item ${value}`} />
                                    </ListItem>
                                    ))}
                                </List>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel htmlFor="txt-respostas">Adicione novas respostas aqui</InputLabel>
                                <OutlinedInput
                                id="txt-respostas"
                                value={respostaDigitada}
                                onChange={(e) => {
                                    setRespostaDigitada(e.target.value);
                                }}
                                onKeyPress={handleKeyPressResposta}
                                endAdornment={<InputAdornment position="end">
                                    <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleSendResposta}
                                    edge="end"
                                    >
                                        <SendIcon />
                                    </IconButton>
                                </InputAdornment>}
                                label="Adicione novas respostas aqui"
                                />
                            </FormControl>
                        </Grid>
                    </>
                )}
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                    >
                    Back
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button onClick={activeStep === steps.length - 1 ? handleSaveParametrizacao : handleNext}>
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                </Box>
            </React.Fragment>
        </Box>
    </Dialog>
  )
}

export default Parametrizacao