import axios from "axios";
import { GoogleAuth } from "google-auth-library";
const auth = new GoogleAuth();

const usersUrl = process.env.USER_SERVICE_URL;

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

const getUsers = async (rawOrders) => {
  try {
    let queries = "?user_ids[]=";
    let url = `${usersUrl}/v1/users`;

    rawOrders.forEach((order) => {
      queries += order.userId + "&user_ids[]=";
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

const getUser = async (id) => {
  try {
    let url = `${usersUrl}/v1/users/${id}`;

    const client = await auth.getIdTokenClient(usersUrl);
    const response = await client.request({
      url: url,
    });

    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export { getUserRole, getUsers, getUser };
