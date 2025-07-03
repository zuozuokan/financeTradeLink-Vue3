import request from "../../util/productRequest";

// 获取所有商品
export const getProducts = () =>
  request.get("/list");

// 修改商品状态（用 productUuid 和 status，query 传参）
export const updateProductStatus = (productUuid, status) =>
  request.post("/update-status", null, {
    params: {
      productUuid,
      status,
    },
  });

// 更新商品信息
export const updateProduct = (product) =>
  request.post("/update", product);
