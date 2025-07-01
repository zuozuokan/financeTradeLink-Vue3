import request from "../util/userRequest";

// 获取所有商品
export const getProducts = () =>
  request.get("/admin/products");

// 修改商品状态
export const updateProductStatus = (id, status) =>
  request.post("/admin/product/update-status", null, {
    params: {
      id,
      status,
    },
  });
