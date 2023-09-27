import jwt_decode from "jwt-decode";

export function isTokenExpired(token) {
  if (!token) return true;
  const decodedToken = jwt_decode(token);
  const currentTime = Date.now() / 1000;
  return decodedToken.exp < currentTime;
}
