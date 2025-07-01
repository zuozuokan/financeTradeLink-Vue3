// import request from "../util/productRequest";


// api/order.js
import request from '../util/userRequest';

/**
 * 根据用户 UUID 获取订单列表
 * @param {string} userUuid 
 */
// export const getOrderListByUserUuidAPI = (userUuid) => {
//   return request.get("/api/order/my", {
//     params: {
     
//     }
//   });
// };

export const getOrderListByUserUuidAPI = (userUuid) => orderRequest.get("/my", {
    params: {
        userUuid: userUuid
    },
  });

  export const getOrderDetailAPI = (orderUuid) => {
    return orderRequest.get(`/${orderUuid}`);
  };
  // 根据用户的uuid获取农产品列表


  