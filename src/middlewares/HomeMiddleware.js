import { post, get } from '../api/baseApi';
import { Endpoint } from '../enums/apiEnum';

export const sendMessage = async (
  message,
  context,
) => {
  const url = `/api/Bot/SendMessage`;
  return await post(url, message, context, Endpoint.Bff);
};

export const getMessages = async (
  email,
  context,
) => {
  const url = `/api/Bot/GetMessages?email=${email}`;
  return await get(url, context, Endpoint.Bff);
};

export const getAllMessages = async (
  email,
  context,
) => {
  const url = `/api/HistoricoConversa/GetAllMessages`;
  return await get(url, context, Endpoint.Bff);
};