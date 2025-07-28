
import axiosInstance from '../api/axiosInstance';

const fetchDataFromServer = async (endpoint, method, body = null) => {
  try {
    const response = await axiosInstance({
      url: endpoint,
      method,
      data: body,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching data', error);
  }
};

export default fetchDataFromServer;