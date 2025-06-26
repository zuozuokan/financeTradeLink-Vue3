import request from "../util/loginOrRegisterRequest";

export const registerAPI = (user) => request.post("/register", user);

export const loginAPI = (username, password,role) => request.post("/login", null,{
        params: {
            username,
            password,
            role
        }
});




