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
import funcionalidadesUtilizadasReport from '../../reports/funcionalidadesUtilizadasReport';
import { Message } from '../../enums/messageEnum';

const Report = () => {
    const [tipoRelatorio, setTipoRelatorio] = useState("");
    const [pdf, setPdf] = useState("");

    const globalContext = useContext(AppContext);
    const userInfo = globalContext.returnUserInfo();

    const convertReportPdfMakeInUrl = async (pdfDoc) => {
        const blob = await new Promise((resolve, reject) => {
          pdfDoc.getBlob((blob) => {
            resolve(blob);
          });
        });
    
        const dataUrl = URL.createObjectURL(blob);
        setPdf(dataUrl);
    
        return () => {
          URL.revokeObjectURL(dataUrl);
        };
      };

    const imprimirRelatorio = () => {
        if(tipoRelatorio === "") {
            globalContext.showMessage(Message.Error, "O campo Tipo de relatório é obrigatório");
            return;
        }

        if(tipoRelatorio === "maisUtilizados") {
            getFuncionalidadesUtilizadas(userInfo.email, globalContext)
            .then((resultado) => {
                const pdfGerado = funcionalidadesUtilizadasReport(resultado);
                convertReportPdfMakeInUrl(pdfGerado);
            })
            .catch(() => {});
        }
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
            <Grid mt={3} height="500px" width="100%">
                <embed src={pdf} type="application/pdf" width="100%" height="100%" />
            </Grid>
        )}
    </MenuDrawer>
    
  )
}

export default Report