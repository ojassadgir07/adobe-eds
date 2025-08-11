import { fetchPlaceholders, getMetadata } from "./aem.js";


export const placeholders = await fetchPlaceholders('default'); 

const { domain, geoLocationApi, stateCityApi, prodcutApi, sendOtpApi, bookARideApi, dealerApi } = placeholders;

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

export async function fetchbikeVarients() {
  const url = prodcutApi
    .replace("{stateCode}", stateCode)
    .replace("{cityCode}", cityCode);
  const data = await fetchAPI("GET", url);
  return data;
}
