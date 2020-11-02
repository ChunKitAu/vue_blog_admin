import axios from 'axios';
import QS from 'qs';
import Vue from "../main";


//认证失败
let token_confrim_fail = 520;
let success =200;
let blogUrl = 'http://120.25.237.83:8086/blog';
let searchUrl = 'http://120.25.237.83:8087';
// let blogUrl = 'http://localhost:8086/blog';
// let searchUrl = 'http://localhost:8087';

class HttpRequest {
    constructor() {
        this.instance = axios.create();
        this.interceptor();
    }

    // 单例模式
    static getInstance() {
        if (!this.httpRequest) {
            this.httpRequest = new HttpRequest();
        }
        return this.httpRequest;
    }

    // 拦截器
    interceptor() {
        // 请求拦截器
        this.instance.interceptors.request.use(config => {
            if(config.url === HttpRequest.SEARCH )
                config.baseURL = searchUrl;
            else config.baseURL = blogUrl;

            if (config.url !== HttpRequest.LOGIN && config.url !== HttpRequest.REGISTER) {
                const token = Vue.$store.getters.token;
                if (token) {
                    config.headers['Authorization'] = token;
                } else {
                    alert("请先进行登录");
                    Vue.$router.push({
                        name: "login"
                    })
                }
            }
            return config;
        }, error => {
            // do something
            return Promise.reject(error);
        })

        // 响应拦截器
        this.instance.interceptors.response.use(response => {

            if(response.data.code === token_confrim_fail){
                alert("请登录");
                Vue.$router.push({name: "login"}).catch(()=>{});
            }
            return response;
        }, error => {
            // do something
            return Promise.reject(error);
        })
    }

    // 通用的GET
    get(url, data) {
        return this.instance({
            url: url,
            method: 'get',
            baseURL: this.baseURL,
            // data: QS.stringify(data),
            params: data,
            headers: {
                'Content-Type': "application/json",
            }
        })
    }

    // 通用的POST
    post(url, data) {
        return this.instance({
            url: url,
            method: 'post',
            // data: QS.stringify(data),
            data: data,
            baseURL: this.baseURL,
            headers: {
                'Content-Type': "application/json;charset=UTF-8",
            }
        })
    }

    postFile(url, data) {
        return this.instance({
            url: url,
            method: 'post',
            data: data,
            baseURL: this.baseURL,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }


    put(url, data) {
        return this.instance({
            url: url,
            method: 'put',
            baseURL: this.baseURL,
            data: data,
            headers: {
                'Content-Type': "application/json;charset=UTF-8",
            }
        })

    }

    del(url,data) {
        return this.instance({
            url: url,
            method: 'delete',
            baseURL: this.baseURL,
            data: data,
            headers: {
                'Content-Type': "application/json;charset=UTF-8",
            }
        })

    }

}

HttpRequest.LOGIN = "/user/login";
HttpRequest.REGISTER = "/user/save";
HttpRequest.SEARCH = "/search";

export default HttpRequest;
