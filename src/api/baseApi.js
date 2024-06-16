import axios from 'axios';
import { Endpoint } from '../enums/apiEnum';
import { Message } from '../enums/messageEnum';

let _context;
const timeout = 800000;

const apiBff = axios.create({
  baseURL: Endpoint.Bff,
  timeout,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiBff.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    throw error;
  },
);

apiBff.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    throw error;
  },
);

export const get = async (
  url,
  context,
  endpoint,
) => {
  _context = context;
  const config = await axiosConfig();
  return await getAxiosInstance(endpoint)
    .get(url, config)
    .then((result) => result.data)
    .catch((error) => {
      if (_context) {
        _context.showMessage(Message.Error, getErrorList(error));
      }
      Promise.resolve().catch((error) => {
        throw error;
      });
      throw error;
    });
};

export const post = async (
  url,
  data,
  context,
  endpoint,
) => {
  _context = context;
  const config = await axiosConfig();
  return await getAxiosInstance(endpoint)
    .post(url, data, config)
    .then((result) => result)
    .catch((error) => {
      _context.showMessage(Message.Error, getErrorList(error));
      Promise.resolve().catch((error) => {
        throw error;
      });
      throw error;
    });
};

export const put = async (
  url,
  data,
  context,
  endpoint,
) => {
  _context = context;
  const config = await axiosConfig();
  return await getAxiosInstance(endpoint)
    .put(url, data, config)
    .then((result) => result)
    .catch((error) => {
      _context.showMessage(Message.Error, getErrorList(error));
      Promise.resolve().catch((error) => {
        throw error;
      });
      throw error;
    });
};

export const onDelete = async (
    url,
    context,
    endpoint,
  ) => {
    _context = context;
    const config = await axiosConfig();
    return await getAxiosInstance(endpoint)
      .delete(url, config)
      .then((result) => result)
      .catch((error) => {
        _context.showMessage(Message.Error, getErrorList(error));
        Promise.resolve().catch((error) => {
          throw error;
        });
        throw error;
      });
};

const getErrorList = (error) => {
    if(error.response.status === 401) {
      _context.handleLogoutUser();
      return 'Não autorizado'
    }
    if (error.message === 'Network Error') {
      return 'API não disponível, por favor entre em contato com o suporte';
    }
    else if (error.response.data.errors) {
      return error.response.data.errors[0];
    }
    else {
      return error.message;
    }
};

const getAxiosInstance = (endpoint) => {
  switch (endpoint) {
    case Endpoint.Bff:
      return apiBff;
    default:
      return apiBff;
  }
};

const axiosConfig = async () => {
  const token = sessionStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};