const truncateLongString = function(str, len) {
  if (len > str.length) {
    return str;
  } else {
    return str.substring(0, len) + "...";
  }
};

export default truncateLongString;
