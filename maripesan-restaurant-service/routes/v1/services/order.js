import axios from "axios";
import { GoogleAuth } from "google-auth-library";
const auth = new GoogleAuth();

const ordersUrl = process.env.ORDER_SERVICE_URL;

const getAmountSoldMenu = async (rawMenus) => {
  try {
    let queries = "?menu_ids[]=";
    let url = `${ordersUrl}/v1/order-details/amount-sold`;

    rawMenus.forEach((menu) => {
      queries += menu.id + "&menu_ids[]=";
    });

    const client = await auth.getIdTokenClient(ordersUrl);
    const response = await client.request({
      url: url + queries,
    });
    // const response = await axios.get(url + queries);
    return response.data.data;
  } catch (e) {
    throw e;
  }
};

export { getAmountSoldMenu };
