import axios from "axios";
import router from "../router";
import store from '../store/index'

const service = axios.create({
    baseURL: 'http://project.signboard.jzdianzi.cn/',
    //  baseURL: 'http://192.168.0.202:9000/',
    timeout: 5000
})



// 添加请求拦截器
service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    console.log("request successsss ========>>>> ", config);
    if(store.state.Authorization != null && store.state.Authorization != ""){
      if(config && config.headers){
        config.headers.Authorization = store.state.Authorization;
        console.log('token get');
      } 
    }else{
      console.log('no token');
    }
    return config;
  }, function (error) {
    // 对请求错误做些什么

    console.log("request errrrr ========>>>> ", error);
    return Promise.reject(error);
  });

// 添加响应拦截器
service.interceptors.response.use(function (response) {

  console.log("sohe hin n hd =========>>>>>>>>>>> ", response.data);
    // 对响应数据做点什么
    return response;
  },  function (error) {
    // 对响应错误做点什么
    
    // if(error.code == "ERR_NETWORK"){
    //   console.log("sohe hin n hd =========>>>>>>>>>>> errrr213  ", error);
    //   router.replace({path:'/login'});

    // }
    return Promise.reject(error);
  });

  export default service;

 