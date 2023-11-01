import axios from "axios";
import { GoogleAuth } from "google-auth-library";
const auth = new GoogleAuth();

const restaurantUrl = process.env.RESTAURANT_SERVICE_URL;

const getRestaurants = async () => {
  try {
    let url = `${restaurantUrl}/v1/restaurants`;
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

const getRestaurant = async (id) => {
  try {
    let url = `${restaurantUrl}/v1/restaurants/${id}`;
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

const updateStokMenu = async (menuId, data) => {
  try {
    const url = `${restaurantUrl}/v1/restaurants/menu/${menuId}`;
    const client = await auth.getIdTokenClient(restaurantUrl);
    const response = await client.request({
      url: url,
      method: "PUT",
      data: data,
    });
    // const response = await axios.put(url, data);
    return response.data.data;
  } catch (e) {
    throw e;
  }
};

const getMenuCategories = async (restaurant_id) => {
  try {
    const url = `${restaurantUrl}/v1/restaurants/${restaurant_id}/menu-categories`;
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

export {
  getRestaurants,
  getMenus,
  updateStokMenu,
  getMenuCategories,
  getRestaurant,
};
