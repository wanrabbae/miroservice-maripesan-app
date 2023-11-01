import axios from "axios";
import { GoogleAuth } from "google-auth-library";
const auth = new GoogleAuth();

const usersUrl = process.env.USER_SERVICE_URL;

const getUsers = async (rawResto) => {
  try {
    let queries = "?user_ids[]=";
    let url = `${usersUrl}/v1/users`;

    rawResto.forEach((resto) => {
      queries += resto.userId + "&user_ids[]=";
    });

    const client = await auth.getIdTokenClient(usersUrl);
    const response = await client.request({
      url: url + queries,
    });

    return response.data.data;
  } catch (error) {
    throw error;
  }
};

const getUserRole = async (idUser) => {
  try {
    let url = `${usersUrl}/v1/users/${idUser}/role`;
    const client = await auth.getIdTokenClient(usersUrl);
    const response = await client.request({
      url: url,
    });
    // const response = await axios.get(url);
    return response.data.data.role;
  } catch (e) {
    throw e;
  }
};

const getUserById = async (idUser) => {
  try {
    let url = `${usersUrl}/v1/users?user_ids[]=${idUser}`;
    // const client = await auth.getIdTokenClient(usersUrl);
    // const response = await client.request({
    //   url: url,
    // });
    // axios.interceptors.request.use(async (config) => {
    //   const token = await auth.getIdTokenClient(usersUrl);
    //   config.headers.Authorization = `Bearer ${token}`;
    //   return config;
    // });
    // const response = await axios.get(url);
    return response.data.data;
  } catch (e) {
    throw e;
  }
};

export { getUserRole, getUserById, getUsers };
