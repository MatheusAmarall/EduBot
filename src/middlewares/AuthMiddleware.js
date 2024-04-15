import { post } from '../api/baseApi';
import { Endpoint } from '../enums/apiEnum';

export const loginUser = async (
  dadosLogin,
  context,
) => {
  const url = `/api/Auth/LoginUser`;
  return await post(url, dadosLogin, context, Endpoint.Bff);
};

export const visitorUser = async (
  context,
) => {
  const url = `/api/Auth/VisitorUser`;
  return await post(url, {}, context, Endpoint.Bff);
};

export const registerUser = async (
  dadosRegister,
  context,
) => {
  const url = `/api/Auth/CreateUser`;
  return await post(url, dadosRegister, context, Endpoint.Bff);
};

export const logoutUser = async (
  dadosLogout,
  context,
) => {
  const url = `/api/Auth/LogoutUser`;
  return await post(url, dadosLogout, context, Endpoint.Bff);
};