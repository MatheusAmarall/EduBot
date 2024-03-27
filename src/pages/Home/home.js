import { Grid, Avatar, Typography } from '@mui/material'
import React from 'react'
import { deepOrange } from '@mui/material/colors';

const Home = () => {
  return (
    <Grid container style={{ height: '100vh', width: '100%' }}>
      <Grid item xs={2.5} style={{ backgroundColor: '#02040f', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
        Lado

      </Grid>
      <Grid item xs={9.5} style={{ backgroundColor: '#f8f8ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
        <Grid container style={{ height: "100%" }}>
          <Grid item xs={12} style={{ backgroundColor: "#02040f", display: 'flex', height: "12%" }}>
            <Grid>
              <Avatar sx={{ bgcolor: deepOrange[500] }} variant="square">
                A
              </Avatar>
              <Typography color="white" fontSize={24}>
                EDU.BOT
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} style={{ backgroundColor: "#fff", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            baixo

          </Grid>
        </Grid>

      </Grid>

    </Grid>
  )
}

export default Home