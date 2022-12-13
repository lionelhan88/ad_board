<template>
  <div>
    <h4 class="header1">查询列表</h4>

    <el-table :data="content" :border="parentBorder"  #default="props">
      
      <el-table-column label="委托编号" prop="entrustmentInfoVo.entrustmentNo" 
        align="center" style="font-weight:bold"
      />

      <el-table-column label="委托单位" prop="entrustmentInfoVo.client" align="center" />

      <el-table-column label="委托日期" prop="entrustmentInfoVo.entrustmentDate" 
        align="center"  :formatter="formatDate"
      >
      </el-table-column>
      
      <el-table-column label="检测类型" prop="entrustmentInfoVo.detectionType" align="center"
      :formatter="formatType">
      </el-table-column>

      <el-table-column label="设施名称" prop="facilityName" align="center" />

       <el-table-column label="完工状态" align="center" #default="props" >
        {{projectStatus[props.row.status]}}
      </el-table-column>

      

      <el-table-column label="委托详情和检测结果" align="center" #default="props">
        <el-button class="testRsltBtn" @click="testResult(props)">检测结果</el-button>
        <el-button class="approvalBtn" @click="approval(props)">详情</el-button>
      </el-table-column>

      <el-table-column label="操作" align="center" #default="props">

        <el-checkbox-button class="testRsltBtn"  label="完工" 
        @change="handleChange($event, props)"
        :checked=props.row.status
        :true-label="1"
        :false-label="0"
        > </el-checkbox-button>
        
        <el-button class="approvalBtn" @click="approval(props)">批准</el-button>
      </el-table-column>

    </el-table>

    <div class="example-pagination-block">
      <el-pagination v-model:currentPage="thisPage" :page-size="10" background 
        hide-on-single-page
        layout="prev, pager, next, total" :total="total" @current-change="handlePageChange"  />
    </div>

    <el-dialog
      v-model="dialogVisible"
      title="提示"
      width="30%"
    >
      <span>委托详情已完工，不能重复完工</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
    
   
    
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, getCurrentInstance } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();


const dialogVisible = ref(false);

const parentBorder = ref(true);
const detectionType = ["商户自主", "市局抽检" , "局局抽检", "街道抽检", "其他"];
const projectStatus = ["未完工", "完工"];

//======================================= 包装axios请求 ==============================================
const currentInstance = getCurrentInstance();
const { $axios } = currentInstance.appContext.config.globalProperties;
import { finishProject, approvalById, listByCondition } from '../api/apiRequest'

const receiveData = route.query;


// 重新包装请求，添加分页参数
const total = ref(0);
const thisPage = ref(1);

const data = {
  client: receiveData.client,
  entrustmentNo: receiveData.entrustmentNo,
  entrustStartDate: receiveData.entrustStartDate,
  entrustEndDate: receiveData.entrustEndDate,
  detectionType: receiveData.detectionType,
  queryCriteria:{
    maxRecordReturn: 10,
    startIndex:(thisPage.value - 1) * 10 ,
  }
}

import { storage } from '../utils/storage'

const handlePageChange = (val: number) => {
  console.log("valllll " , val);
  thisPage.value = val;
  data.queryCriteria.startIndex = (thisPage.value - 1) * 10;
  callBack = listByCondition(data);
  callBack.then((response) => {
    content.value = response.data.data.records;
  })
};

let callBack = listByCondition(data);
let content = ref([]) ;
console.log(callBack);
callBack.then((response) => {
  content.value = response.data.data.records;
  total.value = response.data.data.total;
})

const handleChange = (event, props) => {
  
  if(content.value[props.$index].status== 1){
    dialogVisible.value = true;  
    
  }else{
    const request = {id: props.row.id } ;
    console.log("adsfdadfdasadsfadfasf " , props.row.id, props.row.status);
    props.row.status = 1;
    const data = finishProject(request);
  }
  
}

//======================================= 路由跳转 ===================================================

const testResult = ( props ) => {
  router.push({ 
    name: "evaluation",
    query: {
      id: props.row.id,      
    }
     });
};

const approval = ( props ) => {
  console.log("idddddd "+ props.row.id)
  const request = {id: props.row.id};
  console.log("testsss " + props.row.id);
  router.push({ 
    name: "approval",
    query: {
      id: props.row.id,      
    } });
  
}

//======================================= 测试数据 ===================================================
const formatType = (row, column) => {
  // 获取单元格数据
  return detectionType[row.entrustmentInfoVo.detectionType]
};

const formatDate = (row, column) => {
  let dt = new Date(row.entrustmentInfoVo.entrustmentDate);
  return dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate() ; 
   
}


</script>

<style scoped lang="scss">
.header1 {
  display: flex;
  margin-left: 720px;

  align-items: center;
  font-size: 24px;

}

.header2 {
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-table {
  width: 100%;
  margin-top: 80px;
}
.margin-top {
  margin-top: 20px;
}

.editBtn{
    margin-top: 64px;
    position: relative;
    left: 30%;
}

.cancelBtn{
    margin-top: 64px;
    position: relative;
    left: 40%;
}

.example-pagination-block  {
  margin-left: 640px;
  margin-top: 16px;
  
}

.el-pagination{
  margin-top: 104px;
  margin-left: -5%;
}

.approvalBtn{
  margin-left: 10px;
}
</style>