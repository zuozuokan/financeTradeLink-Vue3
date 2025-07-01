import axios from 'axios';

const adminRequest = axios.create({
  baseURL: '/project-admin/api/admin',
  timeout: 5000,
});

// 获取所有知识内容
export const getAllKnowledgeAPI = () => adminRequest.get('/find-all-knowlodge');

// 新增知识内容
export const addKnowledgeAPI = (knowledge) =>
  adminRequest.post('/add-knowlodge', knowledge);

// 更新知识内容
export const updateKnowledgeAPI = (knowledge) =>
  adminRequest.post('/update-knowlodge', knowledge);

// 删除知识内容
export const deleteKnowledgeAPI = (knowledgeUuid) =>
  adminRequest.post('/delete-knowlodge', new URLSearchParams({ knowledgeUuid }));