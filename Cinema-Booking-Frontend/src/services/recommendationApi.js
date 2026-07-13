import api from './api';

export const getRecommendations = async (movieId) => {
  const response = await api.get(`/recommendations/${movieId}`);
  return response.data.recommendations;
};
