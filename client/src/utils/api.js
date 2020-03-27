import axios from "axios";

function getBaseURL() {
  if (process.env.REACT_APP_API_PROD_HOST) {
    console.log(process.env.REACT_APP_API_PROD_HOST);
    return process.env.REACT_APP_API_PROD_HOST;
  }
  console.log("DEV" + process.env.REACT_APP_API_DEV_HOST);
  return process.env.REACT_APP_API_DEV_HOST;
}

//Sets default header for the requests to the API with the token
export const get = async (path, params) => {
  // Result promise
  const result = await axios({
    method: "get",
    url: getBaseURL() + path,
    responseType: "application/json",
    params: params
    // Can possibly add our user secret here for all API calls?
  });

  return result;
};

export const put = async (path, data) => {
  // Result promise
  const result = await axios({
    method: "put",
    url: getBaseURL() + path,
    responseType: "application/json",
    data: data
  });
  // Can possibly add our user secret here for all API calls?
  return result;
};

export const post = async (path, data) => {
  console.log("calling " + path);

  // Result promise
  const result = await axios({
    method: "post",
    url: getBaseURL() + path,
    responseType: "application/json",
    data: data
  });
  // Can possibly add our user secret here for all API calls?
  return result;
};
