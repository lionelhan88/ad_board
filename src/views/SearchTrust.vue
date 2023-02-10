<template>
  <div>
    <h3 class="header1">查询面板</h3>  
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      :size="formSize"
      status-icon
      router
    >     
      <el-row>
        <el-col :span="8"
          ><div class="grid-content ep-bg-purple" />
          <el-form-item label="委托开始日期 :" prop="entrustmentStartDate">
              <el-date-picker
                v-model="ruleForm.entrustmentStartDate"
                type="date"
                placeholder="点击图标选择日期"
                clearable=ture
                :size="size"
              >
              </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="委托结束日期 :" prop="entrustmentEndDate">
              <el-date-picker
                v-model="ruleForm.entrustmentEndDate"
                type="date"
                placeholder="点击图标选择日期"
                clearable=true
                :size="size"
              >
              </el-date-picker>
           
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="检测类型 :" prop="detectionType">
            <el-select v-model="ruleForm.detectionType" clearable=true placeholder="--请选择--">
              <el-option
                v-for="item in og_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="委托编号 :" prop="entrustmentNo">
            <el-input v-model.number.trim="ruleForm.entrustmentNo" class="jw" placeholder="请输入委托编号" />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="委托单位 :" prop="client" :width= 2 rem>
            <el-input
              v-model="ruleForm.client"
              placeholder="请输入委托单位名称"
              class="jw"
            />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="审批状态 :" prop="status">
            <el-select v-model="ruleForm.status" clearable=true placeholder="--请选择--">
              <el-option
                v-for="item in status_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

      </el-row>
      <!--搜索按钮-->
      <el-button
        class="submitBtn"
        @click="submitForm(ruleFormRef)"
        >搜索</el-button
      >
      <!--重置按钮-->
      <el-button class="resetBtn" @click="resetForm(ruleFormRef)"
        >重置</el-button>

    </el-form>
  </div>
 

 <div>
    <el-divider/>
    <h3 class="header1">查询列表  </h3>
  
    <el-table :data="content" :header-cell-style="{background:'#606266',color:'#eee'}" border  
    #default="props">
      
      <el-table-column label="委托编号" prop="entrustmentInfoVo.entrustmentNo" 
        align="center" style="font-weight:bold" :width= 120 rem
      ></el-table-column>

      <el-table-column label="委托单位" prop="entrustmentInfoVo.client" align="center" />

      <el-table-column label="委托日期" prop="entrustmentInfoVo.entrustmentDate" 
        align="center"  :formatter="formatDate" :width= 120 rem
      >
      </el-table-column>
      
      <el-table-column label="检测类型" prop="entrustmentInfoVo.detectionType" align="center" 
      :formatter="formatType" :width= 120 rem>
      </el-table-column>

      <el-table-column label="设施名称" prop="facilityName" align="center" />

       <el-table-column label="审核状态" align="center" #default="props" :width=120 rem>
        {{projectStatus[props.row.status]}}
      </el-table-column>

      <el-table-column label="批准状态" align="center" #default="props" :width=120 rem>
        {{projectApproval[props.row.approval]}}
      </el-table-column>

      <el-table-column label="委托详情和检测结果" align="center" #default="props" :width=185 rem>
        <el-button class="testRsltBtn" @click="testResult(props)">检测结果</el-button>
        <el-button  @click="getDetail(props)">详情</el-button>
      </el-table-column>

      <el-table-column label="操作" align="center" #default="props" :width= 230 px>
        <el-button class="approvalBtn" @click="handleChange(props)"> 审核 </el-button>
        <el-button class="operation" @click="approval(props)">批准  </el-button>
        <el-button class="reportBtn" @click="getReport(props)">报告  </el-button>
      </el-table-column>

    </el-table>

    <div class="example-pagination-block">
      <el-pagination v-model:currentPage="thisPage" :page-size="8" background 
        hide-on-single-page
        layout="prev, pager, next, total" :total="total" @current-change="handlePageChange"  />
    </div>

    <!-- 无法审核弹窗 -->
    <el-dialog
      v-model="dialogVisible_cannotFinish"
      title="无法审核"
      width="30%"
    >
      <span>委托详情未提交检测结果，不能进行审核！</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogVisible_cannotFinish=false"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>  

    <!-- 完成审核成功 -->
    <el-dialog
      v-model="dialogVisible_success"
      title="成功"
      width="30%"
    >
      <span>委托详情完成审核！</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogVisible_success=false"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>

    <!-- 取消审核成功 -->
    <el-dialog
      v-model="dialogVisible_cancelSuccess"
      title="成功"
      width="30%"
    >
      <span>该委托已取消审核！</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogVisible_cancelSuccess=false"
            >确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 委托已批准,无法修改弹窗-->
    <el-dialog v-model="dialogVisible_alreadyApproved" title="不能修改" width="30%">
      <span>该委托已被批准，无法进行修改！</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogVisible_alreadyApproved=false"
            >确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 委托批准状态修改成功-->
    <el-dialog v-model="dialogVisible_approvalChange" title="修改成功" width="30%">
      <span>委托批准状态修改成功！</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogVisible_approvalChange=false"
            >确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 委托未审核,无法修改批准状态-->
    <el-dialog v-model="dialogVisible_notYetAudit" title="不能批准" width="30%">
      <span>委托还未审核,无法修改批准状态！</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogVisible_notYetAudit= false"
            >确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 委托未审核,无法获取-->
    <el-dialog v-model="dialogVisible_noReport" title="无法获取报告" width="30%">
      <span>委托还未审核或批准,无法获取报告！</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogVisible_noReport= false"
            >确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, getCurrentInstance, defineComponent, onActivated } from "vue";
import { FormInstance, FormRules, ElMessageBox, ElLoading } from "element-plus";
import { useRouter, useRoute } from "vue-router"

import { finishProject, approvalById, listByCondition, exportPdf } from '../api/apiRequest'

const startDate = ref("");
const endDate = ref("");

const detectionType = ["商户委托", "市局委托" , "区局委托", "街道委托", "其他委托"];
const projectStatus = ["未审核", "已审核"];
const projectApproval = ["未批准", "已批准"];
const currentInstance = getCurrentInstance();
const { $axios } = currentInstance.appContext.config.globalProperties;

const formSize = ref("default");
const ruleFormRef = ref<FormInstance>();
const dialogVisible_finish = ref(false);
const dialogVisible_cannotFinish = ref(false);
const dialogVisible_success = ref(false);
const dialogVisible_cancelSuccess = ref(false);
const dialogVisible_alreadyApproved = ref(false);
const dialogVisible_notYetAudit = ref(false);
const dialogVisible_noReport = ref(false);
const dialogVisible_approvalChange = ref(false);
const router = useRouter();

let content = ref([]) ;
let callBack = ref('');
const searchDetail = ref();

const route = useRoute();
let stata = ref();

const ognization = ref("");
const og_options = [
  {
    value: 1,
    label: "商户委托",
  },
  {
    value: 2,
    label: "市局委托",
  },
  {
    value: 3,
    label: "区局委托",
  },
  {
    value: 4,
    label: "街道委托",
  },
  {
    value: "5",
    label: "其他委托",
  },
];

const status_options = [
  {
    value: 1,
    label: "未审核",
  },
  {
    value: 2,
    label: "已审核",
  },
  {
    value: 3,
    label: "未批准",
  },
  {
    value: 4,
    label: "已批准",
  },
];

const ruleForm = reactive({
  client: "",
  entrustmentNo: "",
  entrustmentStartDate: "",
  entrustmentEndDate: "",
  detectionType: null,
  queryCriteria: {
    maxRecordReturn: 8,
    startIndex: 1,
  },
  status: null,
});

const rules = reactive<FormRules>({});

// 重新包装请求，添加分页参数
const total = ref(0);
const thisPage = ref(1);

onActivated(() =>{
  callBack = listByCondition(ruleForm);
  callBack.then((response) => {
    content.value = response.data.data.records;
    total.value = response.data.data.total;
    stata.value = response.data.data.records.status == 1 ? false : true;
  })
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      if(ruleForm.entrustmentStartDate!="" && ruleForm.entrustmentStartDate!=""){
        ruleForm.entrustmentStartDate = dateFormat(ruleForm.entrustmentStartDate);
        ruleForm.entrustmentEndDate = dateFormat(ruleForm.entrustmentEndDate);
      }
      const { client, entrustmentNo, entrustmentStartDate, entrustmentEndDate } = ruleForm;    
      ruleForm.client = ruleForm.client.trim();
      ruleForm.entrustmentNo = ruleForm.entrustmentNo;
      ruleForm.startIndex = (thisPage.value - 1) * 10 ;
      const { startIndex } = ruleForm.queryCriteria;
      
      searchDetail.value = ruleForm;
      callBack = listByCondition(ruleForm);
      callBack.then((response) => {
        content.value = response.data.data.records;
        total.value = response.data.data.total;
      })  
    } else {
      console.log("error submit!", fields);
    }
  });
};

const handlePageChange = (val: number) => {
  thisPage.value = val;
  ruleForm.queryCriteria.startIndex = (thisPage.value - 1) * 8;
  callBack = listByCondition(ruleForm);
  callBack.then((response) => {
    content.value = response.data.data.records;
  })
};

const handleChange = (props) => {
  if(content.value[props.$index].status== 1){
    const request = {id: props.row.id, status: 0} ;
    const data = finishProject(request);
    data.then((response) => {
      if(response.data.code == 200){
        props.row.status = 0;
        dialogVisible_cancelSuccess.value = true;
      }else if(response.data.resultCode == 60003){
        dialogVisible_alreadyApproved.value = true;
      }
    })
  }else{
    const request = {id: props.row.id, status: 1 } ;
    const data = finishProject(request);
    data.then((response) => {
      if(response.data.code == 200){
        props.row.status = 1;
        dialogVisible_success.value = true;
      }else if(response.data.resultCode == 60015){
        dialogVisible_cannotFinish.value = true;
      }
    })
  }
}



const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields(); 
  router.go(0);
};

const testResult = ( props ) => {
  const info = ref();
  if(route.query.form != null){
    info.value = route.query.form;
  }else{
    info.value = JSON.stringify(ruleForm);
  }
  router.push({ 
    name: "evaluation",
    query: {
      id: props.row.id,    
      form: info.value,  
    }
  });
};

const approval = ( props ) => {
  const data = {id:props.row.id, status:""};
  if(props.row.approval == 1){
    data.status = 0;
  }else{
    data.status = 1;
  }
  const rslt = approvalById(data);
  rslt.then((response) =>{
    if(response.data.code == 200){
      if(data.status == 1){
        props.row.approval = 1;
      }else{
        props.row.approval = 0;
      }
      dialogVisible_approvalChange.value = true;
    }else if(response.data.resultCode == 60006){
      dialogVisible_notYetAudit.value = true;
    }
  })
}

const getDetail = (props) =>{
    const info = ref();
    if(route.query.form != null){
      info.value = route.query.form;
    }else{
      info.value = JSON.stringify(ruleForm);
    }
    router.push({ 
      name: "approval",
      query: {
        id: props.row.id,   
        form: info.value,   
      } });
}

const getReport = (props) => {

  if(props.row.status == 1 && props.row.approval == 1){
    const data = {id:props.row.id};

    const loading = ElLoading.service({
      lock: true,
      text: '报告加载中，请稍后',
      background: 'rgba(0,0,0,0.7)',
    });
    const outputData = exportPdf(data);
    const pdfData = ref('');
    outputData.then((response) =>{
      pdfData.value = response.data;
      const binaryData = [];
      binaryData.push(pdfData.value);
      let blob = new Blob(binaryData, { type: 'application/pdf;chartset=UTF-8' });
      const url = URL.createObjectURL( 
          blob
      );
      setTimeout(()=>{
        loading.close()}, 2000
      );
      window.open(url)
    })
  }else if(props.row.status == 1 && props.row.approval == 0){
    dialogVisible_noReport.value = true;
  }else{
    dialogVisible_noReport.value = true;
  } 
}




//====================================== 时间格式转换 ===========================================
const dateFormat = (time : Date) => {
  var data = new Date(time);

  var y = data.getFullYear();
  var m = data.getMonth()+1;
  var d = data.getDate();
  var hours = data.getHours() < 10 ? '0' + data.getHours() : data.getHours();
  var min = data.getMinutes() < 10 ? '0' + data.getMinutes() : data.getMinutes();
  var sec = data.getSeconds() < 10 ? '0' + data.getSeconds() : data.getSeconds();

  return `${y}-${m}-${d} ${hours}:${min}:${sec}`
}

const formatType = (row, column) => {
  // 获取单元格数据
  return detectionType[row.entrustmentInfoVo.detectionType-1]
};

const formatDate = (row, column) => {
  let dt = new Date(row.entrustmentInfoVo.entrustmentDate);
  var m = (dt.getMonth()+1) < 10 ? '0' + (dt.getMonth() + 1) : (dt.getMonth()+1)
  var d = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
  return dt.getFullYear() + '-' + m + '-' + d ; 
   
};
</script>


<style scoped lang="scss">
.submitBtn {
  margin-left: 3.3rem;
  margin-top: 16px;
}

.resetBtn {
  margin-left: 160px;
  margin-top: 16px;
}

.approvalBtn{
  margin-left: 8px;
  display: inline;
}

.operation{
  margin-left: 8px;
  display: inline;
}

.reportBtn{
  margin-left: 8px;
  display: inline;
}

.el-form-item{
  margin-top: 10px;
}

.content{
  letter-spacing: 1px;
}

.jw{
  width: 220px;
}

.example-pagination-block  {
  margin-left: 3rem;
  margin-top: 32px;
}

.header1{
  font-size: 20px;
}
</style>

