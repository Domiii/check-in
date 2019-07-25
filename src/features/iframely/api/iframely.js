// womam@alltempmail.com
const api_key = 'bcd51a58fdba9316d613d4';

// @see https://stackoverflow.com/a/35416293
function objToQueryString(obj) {
  return Object.keys(obj).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`).join('&');
}

function objToFormData(obj) {
  // convert object to FormData
  const body = new FormData();
  Object.keys(obj).forEach(k => body.append(k, obj[k]));
  return body;
}

export async function queryUrlData(url, format='oembed') {
  const queryData = {
    api_key,
    url
  };

  const query = objToQueryString(queryData);

  const options = {
    method: 'GET',
    //body
  };
  const res = await fetch(`https://iframe.ly/api/${format}?${query}`, options);

  const text = await res.text();
  let data;

  try {
    data = JSON.parse(text);
  }
  catch (err) {
    const msg = "could not understand result - " + text;
    console.error(msg);
    console.error(err.stack);
    return { error: msg };
  }

  return data;
}