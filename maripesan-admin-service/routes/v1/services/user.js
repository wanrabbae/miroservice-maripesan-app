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

export { getUserRole };
