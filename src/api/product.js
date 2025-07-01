import request from "../util/productRequest";
import { orderRequest } from "../util/userRequest";

// export const getProductListAPI = async () => {
//     return request.get("/list");
// };

//     try {
//         const response = await axios.get("/api/product/list");
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching product list:", error);
//         throw error;
//     }


// export const loginAPI = (username, password, role) =>
//   request.post("/login", null, {
//     params: {
//       username,
//       password,
//       role,
//     },
//   });

// import request from "../util/productRequest.js";

// 发布农产品样式图（带自定义名称）
// export const addProductPictureAPI = (file, customName) => {
//   const formData = new FormData();
//   formData.append("file", file); // 必须与后端@RequestParam("file")对应
//   formData.append("customName", customName); // 新增自定义名称参数
   
// console.log('📦 准备上传到后端,file:', file, 'customName:', customName);
//   return request.post("/upload/imagename", formData, {
//     // 注意路径改为后端实际路径
//     headers: {
//       "Content-Type": "multipart/form-data", // 保持表单格式
//     },
//   });
// };
// 发布农产品样式图（带自定义名称）
export const addProductPictureAPI = (file, customName) => {
  const formData = new FormData();
  formData.append("file", file); // 必须与后端@RequestParam("file")对应
  formData.append("customName", customName); // 新增自定义名称参数

  return request.post("/upload/imagename", formData, {
    // 注意路径改为后端实际路径
    headers: {
      "Content-Type": "multipart/form-data", // 保持表单格式
    },
  });
};


// 发布农产品
export const addProductAPI = (userUuid, product) =>
  request.post("/addProduct", product, {
    params: {
      userUuid: userUuid,
    },
  });

// 获取商品详情
export const getProductDetailAPI = (productUuid) =>
  request.get(`/${productUuid}`);

// 获取农产品列表
export const getProductListAPI = () => request.get("/list");


// 根据用户的uuid获取农产品列表
export const getProductListByuuidAPI = (uuid) => request.get("/listby-uuid",{
  params: {
    userUuid: uuid,
  },
});

export const purchaseProductAPI = (productUuid,amounts,userUuid) =>
  orderRequest.post("/create", null, {
    params: {
      productUuid: productUuid,
        amounts: amounts,
      userUuid: userUuid,
    },
  });


// 根据种类获取商品
export const getProductByUuidAndCategoryAPI = (uuid,category) =>
  request.get("/uuid-category", {
    params: {
      uuid: uuid,
      category: category,
    },
  });



// 根据种类获取商品
export const getProductBycategoryAPI = (category) =>
  request.get("/category", {
    params: {
      category: category,
    },
  });

//编辑商品信息
export const updateProductAPI = (product) => request.post("/update", product);

// 删除商品
export const deleteProductAPI = (productUuid) =>
  request.post("/delete", null, {
    params: {
      productUuid: productUuid,
    },
  });
