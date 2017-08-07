export const truncateLongString = function(str, len) {
  if (len > str.length) {
    return str;
  } else {
    return str.substring(0, len) + "...";
  }
};

export const BACKEND_ROOT_URL =
  process.env.REACT_APP_BACKEND_ROOT_URL || "http://localhost:8080";
