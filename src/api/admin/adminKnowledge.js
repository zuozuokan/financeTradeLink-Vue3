import request from "../../util/knowledgeRequest";

// 获取所有知识内容
export const getAllKnowledgeAPI = () => request.get('/list');
// 新增知识内容
export const addKnowledgeAPI = (knowledge) =>
  request.post('/add', knowledge);

// 通过知识的uuid删除知识
export const deleteKnowledgeAPI = (uuid) => {
  return request.post(`/del/${uuid}`, {
    params: {
      uuid,
    },
  });
};

// 更新知识
export const updateKnowledgeAPI = (uuid, updatedData) => {
  return request.post(`/update/${uuid}`, updatedData, {
    params: { uuid },
  });
};
