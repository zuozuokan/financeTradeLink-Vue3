import knowledgeRequest from '../util/knowledgeRequest'

// 获取所有知识内容
export const getAllKnowledgeAPI = () => knowledgeRequest.get('/knowledge/all')

// 按关键词和分类查询知识内容
export const searchKnowledgeAPI = (params) => knowledgeRequest.get('/knowledge/search', { params })

// 获取热度榜单（前5）
export const getHotKnowledgeAPI = () => knowledgeRequest.get('/knowledge/hot')

// 获取知识库分页列表
export const getKnowledgeListAPI = (params) =>
    knowledgeRequest.get('/list', { params })
