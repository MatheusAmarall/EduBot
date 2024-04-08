import { post } from '../api/baseApi';
import { Endpoint } from '../enums/apiEnum';

export const sendMessage = async (
  message,
  context,
) => {
  const url = `/api/Bot/SendMessage`;
  return await post(url, message, context, Endpoint.Bff);
};