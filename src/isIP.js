import * as net from "net";

function isIP(query_ip) {
  if (net.isIP(query_ip) === 4 || net.isIP(query_ip) === 6) {
    return true;
  } else {
    return false;
  }
}

export default isIP;
