import request from "../util/userRequest";

export const userGetCurrentInfoAPI = (uuid) =>
  request.post("/get-current-user-info", null, {
    params: {
      uuid: uuid,
      test: "test",
    },
  });

export const userUpdatePasswordAPI = (uuid, newPassword) =>
  request.post("/update-password", null, {
    params: {
      uuid: uuid,
      newPassword: newPassword,
    },
  });

export const userUpdateNameAPI = (uuid, nickname) =>
  request.post("/update-name", null, {
    params: {
      uuid: uuid,
      nickname: nickname,
    },
  });

export const userUpdatePhoneAPI = (uuid, phone) =>
  request.post("/update-phone", null, {
    params: {
      uuid: uuid,
      phone: phone,
    },
  });

export const userAddAddressAPI = (uuid, address) =>
  request.post("/add-address", address, {
    params: {
      uuid: uuid,
    },
  });

export const userUpdateAddressAPI = (addressUuid, address) =>
  request.post("/update-address", address, {
    params: {
      addressUuid: addressUuid,
    },
  });
