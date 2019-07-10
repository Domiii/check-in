// womam@alltempmail.com
const api_key = 'bcd51a58fdba9316d613d4';


export async function queryUrlData(url) {
  const options = {
    method: 'POST',
    body: {
      api_key,
      url
    }
  };
  return fetch(`//iframe.ly/api/iframely`, options);
}