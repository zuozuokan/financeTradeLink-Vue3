import request from "../util/knowledgeRequest";

// 发布知识
export const addKnowledge = (knowledge) => request.post("/add", knowledge);
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
// 通过userUuid获取自己发布的知识
export const getKnowledgeListAPI = (userUuid) => {
  return request.post(`/getKnowledgeByUserUuid`, null,{
    params: {
      userUuid:userUuid,
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
  return request.post(`/like`, null,{
    params: {
      knowledgeUuid:uuid,
    },
  });
};
// 点赞知识
export const viewKnowledgeByUuid = (uuid) => {
  return request.post(`/view`,null, {
    params: {
      knowledgeUuid:uuid,
    },
  });
};

// 更新知识
export const updateKnowledge = (uuid, updatedData) => {
  return request.post(`/update/${uuid}`, updatedData);
};




  
