import { post } from '../api/baseApi';
import { Endpoint } from '../enums/apiEnum';

export const createNewStory = async (
  story,
  context,
) => {
  const url = `/api/Parametrizacao/CreateNewStory`;
  return await post(url, story, context, Endpoint.Bff);
};