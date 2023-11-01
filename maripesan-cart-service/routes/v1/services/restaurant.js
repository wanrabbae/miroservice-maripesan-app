import axios from "axios";
import { GoogleAuth } from "google-auth-library";
const auth = new GoogleAuth();

const restaurantUrl = process.env.RESTAURANT_SERVICE_URL;

const getRestaurant = async (rawCarts) => {
  try {
    let queries = "?restaurant_ids[]=";
    const url = `${restaurantUrl}/v1/restaurants`;

    rawCarts.forEach((r) => {
      queries += r.restaurantId + "&restaurant_ids[]=";
    });

    const client = await auth.getIdTokenClient(restaurantUrl);
    const response = await client.request({
      url: url + queries,
    });
    // const response = await axios.get(url + queries);
    const restaurants = response.data.data;

    return restaurants;
  } catch (e) {
    throw e;
  }
};

const getMenus = async () => {
  try {
    const url = `${restaurantUrl}/v1/restaurants/all-menus`;
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

export { getMenus, getRestaurant };
