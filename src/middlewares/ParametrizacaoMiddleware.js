import { post, get } from '../api/baseApi';
import { Endpoint } from '../enums/apiEnum';

export const createNewStory = async (
  story,
  context,
) => {
  const url = `/api/Parametrizacao/CreateNewStory`;
  return await post(url, story, context, Endpoint.Bff);
};

export const getFuncionalidadesParametrizadas = async (
  context,
) => {
  const url = `/api/Parametrizacao/FuncionalidadesParametrizadas`;
  return await get(url, context, Endpoint.Bff);
};