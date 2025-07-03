import request from "../util/knowledgeRequest";

// 发布知识
export const addKnowledge = (knowledge) => request.post("/", knowledge);
// 获取知识列表
export const getKnowledgeList = (page, size, category = "", keyword = "") => {
  // page是页码
  // size是单页显示的个数，另外两个字段可以为空
  return request.get("/list", null, {
    params: { page, size, category, keyword },
  });
};

// 通过知识的uuid获取知识
export const getKnowledgeByUuid = (uuid) => {
  return request.get(`/find/${uuid}`, {
    params: {
      uuid,
    },
  });
};

// 通过知识的uuid删除知识
export const delKnowledgeByUuid = (uuid) => {
  return request.post(`/del/${uuid}`, {
    params: {
      uuid,
    },
  });
};

// 点赞知识
export const likeKnowledgeByUuid = (uuid) => {
  return request.post(`/like/${uuid}`, {
    params: {
      uuid,
    },
  });
};

// 更新知识
export const updateKnowledge = (uuid, updatedData) => {
  return request.post(`/update/${uuid}`, updatedData);
};




  
