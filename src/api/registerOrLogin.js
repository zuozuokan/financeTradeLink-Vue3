import request from "../util/loginOrRegisterRequest";

export const registerAPI = (user) => request.post("/register", user);

export const loginAPI = (username, password) => {
  const params = new URLSearchParams();
  params.append("username", username);
  params.append("password", password);
  params.append("role", "USER");
  return request.post("/login", params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  });
};