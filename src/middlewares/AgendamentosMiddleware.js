import { get } from '../api/baseApi';
import { Endpoint } from '../enums/apiEnum';

export const getAgendamentos = async (
  context,
) => {
  const url = `/api/Agendamento/RetornaAgendamentos`;
  return await get(url, context, Endpoint.Bff);
};