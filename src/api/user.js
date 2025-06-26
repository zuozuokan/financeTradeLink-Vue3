import request from "../util/userRequest";

export const userGetCurrentInfoAPI = (uuid) => request.post("/get-current-user-info",
    {
        uuid: uuid
    }
);







