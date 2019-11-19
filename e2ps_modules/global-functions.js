exports.getParams = url => {
  const obj = {};
  const params = url.split("?")[1].split("&");
  let pair;
  for (let i = 0; i < params.length; i++) {
    pair = params[i].split("=");
    obj[pair[0]] = decodeURIComponent(pair[1]);
  }
  return obj;
};
