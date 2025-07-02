import request from '../util/orderRequest';

export const purchaseProductAPI = (productUuid,amounts,userUuid) =>
  request.post("/create", null, {
    params: {
      productUuid: productUuid,
        amounts: amounts,
      userUuid: userUuid,
    },
  });


export const getOrderListByUserUuidAPI = (userUuid) => request.get("/my", {
    params: {
        userUuid: userUuid
    },
  });

  export const getOrderDetailAPI = (orderUuid) => {
    return request.get(`/${orderUuid}`);
  };
  // 根据用户的uuid获取农产品列表


  