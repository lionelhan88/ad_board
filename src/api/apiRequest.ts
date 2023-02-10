import service from "../utils/request";
import { storage } from '../utils/storage'

// 登录
export const loginAction = (data : object) =>{
    return service.request({
        url: '/api/user/login',
        method: 'post',
        data,
    })
} 


// 创建委托信息
export const createEntrust = (data : object) =>{
    return service.request({
        url: '/api/entrustmentDetail/add',
        method: 'post',
        headers:{
            "Authorization": storage.get('token') ?? '' ,
        },
        data,
    })
} 

// 完工请求
export const finishProject = (data : object) =>{
    return service.request({
        url: '/api/entrustmentDetail/alterStatusById',
        method: 'post',
        headers:{
            "Authorization": storage.get('token') ?? '',
        },
        data,
    })
} 

// 通过id查询委托
export const getRslt = (data : object) =>{
    return service.request({
        url: '/api/entrustmentDetail/getById',
        method: 'post',
        headers:{
            "Authorization": storage.get('token') ?? '',
         //   "Authorization": token,
        },
        data,
    })
} 

// 通过id查询设施
export const getFacilities = (data : number ) =>{
    return service.request({
        url: '/api/facility/getById',
        method: 'post',
        headers: {
            "Authorization": storage.get('token') ?? '',
        },
        data,
    })
} 

// 通过id批准委托详情
export const approvalById = (data : number) =>{
    return service.request({
        url: '/api/entrustmentDetail/approvalById',
        method: 'post',
        headers:{
            "Authorization": storage.get('token') ?? '',
        },
        data,
    })
} 

// 根据条件查询委托详情(分页)
export const listByCondition = (data : object) =>{
    return service.request({
        url: '/api/entrustmentDetail/listByCondition',
        method: 'post',
        headers:{
            "Authorization": storage.get('token') ?? '',
        },
        data,
    })
} 

// 根据id获取检测结果
export const getDetectionResultById = (data : object) =>{
    return service.request({
        url: '/api/entrustmentDetail/getDetectionResultById',
        method: 'post',
        headers:{
            "Authorization": storage.get('token') ?? '',
        },
        data,
    })
} 

// 保存检测结果
export const saveDetectionResultById = (data : object) =>{
    return service.request({
        url: '/api/entrustmentDetail/saveDetectionResultById',
        method: 'post',
        headers:{
            "Authorization": storage.get('token') ?? '',
        },
        data,
    })
} 

// 请求验证码
export const identifyingCode = (data : object) =>{
    return service.request({
        url: '/api/user/identifyingCode',
        method: 'post',
        data,
    })
} 

// 生成pdf报告
export const exportPdf = (data : object) =>{
    return service.request({
        url: '/api/entrustmentDetail/exportPdf',
        method: 'post',
        headers:{
            "Authorization": storage.get('token') ?? '',
            "Content-Type": "application/json",
        },
        responseType: 'blob',
        data,
    })
}


// 根据条件查询店铺
export const selectShop = (data : object) =>{
    return service.request({
        url: '/api/shop/pageByCondition',
        method: 'post',
        headers:{
            "Authorization": storage.get('token') ?? '',
        },
        data,
    })
}


// 根据条件查询设施
export const selectFacility = (data : object) =>{
    return service.request({
        url: '/api/facility/pageByCondition',
        method: 'post',
        headers:{
            "Authorization": storage.get('token') ?? '',
        },
        data,
    })
}

// 获取检测方法
export const getAllMethods = () =>{
    return service.request({
        url: '/api/testMethod/getAll',
        method: 'post',
        headers:{
            "Authorization": storage.get('token') ?? '',
        },
       
    })
}


// 修改委托详情
export const detailUpdate = (data : object) =>{

    return service.request({
        url: '/api/entrustmentDetail/update',
        method: 'post',
        headers:{
            "Authorization": storage.get('token') ?? '',
        },
        data,
    })
}

// 通过id修改检测详情
export const getDetectionDetail = (data : object) =>{

    return service.request({
        url: '/api/entrustmentDetail/getDetectionDetailById',
        method: 'post',
        headers:{
            "Authorization": storage.get('token') ?? '',
        },
        data,
    })
}

// 保存检测详情
export const saveDetectionDetails = (data : object) =>{

    return service.request({
        url: '/api/entrustmentDetail/saveDetectionDetails',
        method: 'post',
        headers:{
            "Authorization": storage.get('token') ?? '',
        },
        data,
    })
}

// 获取文件下载地址
export const getUploadPathUrl = (data : object) =>{

    return service.request({
        url: '/api/file/getUploadPathUrl',
        method: 'post',
        headers:{
            "Authorization": storage.get('token') ?? '',
        },
        data,
    })
}

// 保存文件全路径
export const saveFileFullPath = (data : object) =>{

    return service.request({
        url: '/api/file/saveFileFullPath',
        method: 'post',
        headers:{
            "Authorization": storage.get('token') ?? '',
        },
        data,
    })
}

// 删除上传的图片
export const delFile = (data : object) =>{

    return service.request({
        url: '/api/file/delFile',
        method: 'post',
        headers:{
            "Authorization": storage.get('token') ?? '',
        },
        data,
    })
}


// 获取图片下载链接
export const getAccessUrl = (data : object) =>{

    return service.request({
        url: '/api/file/getAccessUrl',
        method: 'post',
        headers:{
            "Authorization": storage.get('token') ?? '',
        },
        data,
    })
}


// 上传报告
export const upReport = (data : object) =>{

    return service.request({
        url: '/api/entrustmentDetail/uploadFile',
        method: 'post',
        headers:{
            "Authorization": storage.get('token') ?? '',
            "Content-Type": "multipart/form-data",
        },
        data,
    })
}


