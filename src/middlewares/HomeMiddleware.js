import { get } from '../api/baseApi';
import { Endpoint } from '../enums/apiEnum';

export const getMessages = async (
  email,
  context,
) => {
  const url = `/api/HistoricoConversa/GetMessages?email=${email}`;
  return await get(url, context, Endpoint.Bff);
};

export const getAllMessages = async (
  email,
  context,
) => {
  const url = `/api/HistoricoConversa/GetAllMessages`;
  return await get(url, context, Endpoint.Bff);
};