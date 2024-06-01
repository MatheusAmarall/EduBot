import { get } from '../api/baseApi';
import { Endpoint } from '../enums/apiEnum';

export const getFuncionalidadesUtilizadas = async (
  email,
  context,
) => {
  const url = `/api/Bot/GetFuncionalidadesUtilizadas?email=${email}`;
  return await get(url, context, Endpoint.Bff);
};