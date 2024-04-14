import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../context/context';

const PrivateRoute = ({ children }) => {
  const globalContext = useContext(AppContext);

  const navigate = useNavigate();

  const verificaPermissoes = () => {
    const userInfo = globalContext.returnUserInfo();
    if(!userInfo.email && !userInfo.token && !userInfo.role) {
        navigate('/');
    }
  }

  useEffect(() => {
    verificaPermissoes();
  }, []);

  return children;
};

export default PrivateRoute;