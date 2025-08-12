import { fetchPlaceholders, getMetadata } from "./aem.js";


export const placeholders = await fetchPlaceholders('default'); 

const { domain, geoLocationApi, stateCityApi, prodcutApi, sendOtpApi, bookARideApi, dealerApi } = placeholders;
const apiProxy = {};
export async function fetchAPI(
  method,
  url,
  payload = { headerJSON: {}, requestJSON: {} }
) {
  return new Promise(async function (resolve, reject) {
    const key = url + method;

    if (apiProxy[key] && method === "GET") {
      resolve(apiProxy[key]);
      return apiProxy[key];
    }

    const { headerJSON, requestJSON } = payload;

    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    if (headerJSON) {
      Object.keys(headerJSON).forEach(function (key) {
        headers.append(key, headerJSON[key]);
      });
    }

    const body = JSON.stringify(requestJSON);

    const request = {
      method,
      headers,
      body,
    };

    try {
      let resp;

      if (method === "GET") {
        resp = await fetch(url);
      } else if (method === "POST") {
        resp = await fetch(url, request);
      }

      if (resp.ok) {
        try {
          const data = await resp.json();
          apiProxy[key] = data;
          resolve(data);
        } catch (error) {
          console.warn(error);
          resolve(resp);
        }
      } else {
        const errorText = await resp.text();
        resolve({ error: errorText });
      }
    } catch (error) {
      resolve({ error: error.message || "Network error" });
    }
  });
}

export async function fetchbikeVarients(stateCode, cityCode) {
  const url = prodcutApi
    .replace("{stateCode}", stateCode)
    .replace("{cityCode}", cityCode);
  const data = await fetchAPI("GET", url);
   sessionStorage.setItem("dataMapping", JSON.stringify(data));
  return data;
}

async function getDataMapping() {
  let data = sessionStorage.getItem("dataMapping");
  if (!data) {
    let cityMaster = await fetchStateCityMaster();
    processDataMapping(cityMaster);
    let { city, state } = await fetchStateCity();
    // debugger;
    if (city.toUpperCase() === 'NEW DELHI') {
      city = 'DELHI';
      state = 'DELHI';
    }
    const code =
      dataMapping.state_city_master[state.toUpperCase()][city.toUpperCase()] || {
        "cityCode": "DELHI",
        "label": "DELHI",
        "stateCode": "DEL"
      };
    // console.log(code);
    dataMapping.current_location = {
      stateCode: code?.stateCode, cityCode: code?.code, city, state
    }
    const { data: { products: { items: [productInfo] } } } = await fetchAPI(
      "GET",
      prodcutApi
        .replace("{stateCode}", code.stateCode)
        .replace("{cityCode}", code.code)
    );
    const { variant_to_colors: variantsData, variants: allVariantsDetails } = productInfo;
    // console.log(data);
    dataMapping.sku = variantsData[0].colors[0].sku;
    sessionStorage.setItem("dataMapping", JSON.stringify(dataMapping));
    data = sessionStorage.getItem("dataMapping");
    // setSkuAndStateCity();
  }
  data = JSON.parse(data);
  return data;
}


export async function useDataMapping() {
  const data = await getDataMapping();
  function setDataMapping(newData) {
    sessionStorage.setItem("dataMapping", JSON.stringify(newData));
  }
  return [data, setDataMapping]

}