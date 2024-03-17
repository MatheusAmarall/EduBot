import { ThemeProvider } from '@mui/material';
import './App.css';
import Home from './pages/Home/home';
import Login from './pages/Login/login';
import Register from './pages/Register/register';
import { Routes, Route } from 'react-router-dom';
import { theme } from './theme/theme';

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/" element={<Home />}/> 
          <Route path="/login" element={<Login />}/> 
          <Route path="/register" element={<Register />}/> 
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
