import request from '../util/cartRequest';

// 获取当前用户购物车列表
export const getCartListAPI = (userUuid) =>
  request.get('/user-list', {
    params: { userUuid }
  });

// 添加商品到购物车（支持批量）
export const addToCartAPI = ({ userUuid, cartList }) =>
  request.post('/add', cartList, {
    params: { userUuid }
  });

// 更新购物车中商品数量
export const updateCartItemAPI = ({ cartItemId, quantity }) =>
  request.post('/update', null, {
    params: {
      cartItemId,
      quantity
    }
  });

// 删除购物车中的商品
export const removeCartItemAPI = (cartItemId) =>
  request.post('/delete', [cartItemId]);

// 批量删除购物车商品
export const batchRemoveCartItemsAPI = (cartItemUuids) =>
  request.post('/delete', cartItemUuids);

// 刷新商品缓存
export const refreshCartCacheAPI = (cartList) =>
  request.post('/refresh', cartList); 