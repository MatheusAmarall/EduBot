import React, { useState, useContext } from 'react'
import {
    Grid,
    Typography,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Button
  } from '@mui/material';
import MenuDrawer from '../../components/LayoutComponents/MenuDrawer';
import AppContext from '../../context/context';
import { getFuncionalidadesUtilizadas } from '../../middlewares/ReportMiddleware';

const Report = () => {
    const [tipoRelatorio, setTipoRelatorio] = useState("");
    const [pdf, setPdf] = useState("");

    const globalContext = useContext(AppContext);
    const userInfo = globalContext.returnUserInfo();

    const imprimirRelatorio = () => {
        getFuncionalidadesUtilizadas(userInfo.email, globalContext)
        .then((resultado) => {
          console.log("resultado", resultado)
        })
        .catch(() => {});
    }
  return (
    <MenuDrawer>
        <Grid item xs={12} mt={2}>
            <Typography variant="h5">Central de relatórios</Typography>
        </Grid>
        <Grid container mt={2} spacing={2} alignItems="center">
            <Grid item xs={10}>
                <FormControl fullWidth>
                    <InputLabel id="select-label">Tipo de relatório</InputLabel>
                    <Select
                        labelId="select-label"
                        id="simple-select"
                        value={tipoRelatorio}
                        label="Tipo de relatório"
                        onChange={(e) => setTipoRelatorio(e.target.value)}
                    >
                        <MenuItem value={"maisUtilizados"}>Funcionalidades mais utilizadas</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={2}>
                <FormControl fullWidth>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={() => {
                            imprimirRelatorio();
                        }}
                    >
                        Imprimir
                    </Button>
                </FormControl>
            </Grid>
        </Grid>
        {pdf !== '' && (
            <Grid height="800px" width="100%">
                <embed src={pdf} type="application/pdf" width="100%" height="100%" />
            </Grid>
        )}
    </MenuDrawer>
    
  )
}

export default Report