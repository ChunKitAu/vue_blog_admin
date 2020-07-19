import HttpRequest from "./http";
import { urls } from "./urls";
import da from "element-ui/src/locale/lang/da";
const http = HttpRequest.getInstance();

export const login = (data) => {
    return http.post(urls.login, data);
}

export const register = (data) => {
    return http.post(urls.register, data);
}

//文章
export const getAticles = (data) => {
    return http.get(urls.getArticles, data);
}
export const getArticleById = (id) => {
    return http.get(urls.getArticleById + id);
}
export const postBlog = (data) => {
    return http.post(urls.postBlog, data);
}
export const putBlog = (data) => {
    return http.put(urls.putBlog, data);
}
export const delBlog = (id) => {
    return http.del(urls.delBlog + id);
}

//标签
export const getTags = (data) => {
    return http.get(urls.getTags, data);
}
export const addTag = (data) => {
    return http.post(urls.addTag, data);
}
export const delTag = (data) => {
    return http.del(urls.delTag + data);
}


//分类
export const getTypes = (data) => {
    return http.get(urls.getTypes, data);
}
export const addType = (data) => {
    return http.post(urls.addType, data);
}
export const delType = (data) => {
    return http.del(urls.delType + data);
}


export const postImg = (data) => {
    return http.postFile(urls.postImg ,data);
}


//仪表盘获取访问量
export const getDashboardViews = (data) => {
    return http.get(urls.get_dashboard_views, data);
}
//仪表盘获取文章访问详情
export const getDashboardArticles = (data) => {
    return http.get(urls.get_dashboard_article, data);
}

