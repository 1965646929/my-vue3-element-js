const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
function getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY) || "";
}
function setAccessToken(token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
}
function getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY) || "";
}
function setRefreshToken(token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
}
function clearToken() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export { getAccessToken, setAccessToken, getRefreshToken, setRefreshToken, clearToken };
