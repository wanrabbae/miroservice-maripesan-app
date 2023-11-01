import axios from "axios";
import { GoogleAuth } from "google-auth-library";
const auth = new GoogleAuth();

const restaurantUrl = process.env.RESTAURANT_SERVICE_URL;

const getRestaurantById = async (idRestaurant) => {
  try {
    const url = `${restaurantUrl}/v1/restaurants/${idRestaurant}`;
    const client = await auth.getIdTokenClient(restaurantUrl);
    const response = await client.request({
      url: url,
    });

    // const response = await axios.get(url);

    return response.data.data;
  } catch (e) {
    throw e;
  }
};

export { getRestaurantById };
