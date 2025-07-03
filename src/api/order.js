import request from '../util/orderRequest';

export const purchaseProductAPI = (productUuid,amounts,userUuid) =>
  request.post("/create", null, {
    params: {
      productUuid: productUuid,
        amounts: amounts,
      userUuid: userUuid,
    },
  });


export const getOrderListByUserUuidAPI = () => request.get('/my');

export const getOrderDetailAPI = (orderUuid) => {
  return request.get(`/${orderUuid}`);
};

// 更新订单状态
export const updateOrderStatusAPI = (orderUuid, order) =>
  request.put('/update/orderUuid', order, {
    params: { Uuid: orderUuid }
  });


  