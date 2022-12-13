<template>
  <div>
    
    <h3>查询面板</h3>  
    
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
          <el-form-item label="委托单位 :" prop="client">
            <el-input
              v-model="ruleForm.client"
              placeholder="请输入委托单位名称"
              class="jw"
            />
          </el-form-item>
        
        </el-col>

      </el-row>
      

      <!--搜索按钮-->
      <el-button
        class="submitBtn"
        type="primary"
        @click="submitForm(ruleFormRef)"
        >搜索</el-button
      >
      <!--重置按钮-->
      <el-button class="resetBtn" @click="resetForm(ruleFormRef)"
        >重置</el-button
      >
    </el-form>
    
  </div>
 

 <div>
    <el-divider/>
    <h3 class="header1">查询列表</h3>
  
    <el-table :data="content" :header-cell-style="{background:'#606266',color:'#eee'}" border  #default="props">
      
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

       <el-table-column label="审核状态" align="center" #default="props" >
        {{projectStatus[props.row.status]}}
      </el-table-column>

      

      <el-table-column label="委托详情和检测结果" align="center" #default="props">
        <el-button class="testRsltBtn" @click="testResult(props)">检测结果</el-button>
        <el-button  @click="approval(props)">详情</el-button>
      </el-table-column>

      <el-table-column label="操作" align="center" #default="props">

        <el-checkbox-button class="testRsltBtn"  label="审核" 
        @change="handleChange($event, props)"
        :checked= props.row.status 
        :true-label= props.row.status
        :false-label= props.row.status
        > </el-checkbox-button>
        
        <el-button class="approvalBtn" @click="approval(props)">批准</el-button>
      </el-table-column>

    </el-table>
  

    <div class="example-pagination-block">
      <el-pagination v-model:currentPage="thisPage" :page-size="10" background 
        hide-on-single-page
        layout="prev, pager, next, total" :total="total" @current-change="handlePageChange"  />
    </div>

    

    <!-- 无法审核弹窗 -->
    <el-dialog
      v-model="dialogVisible_cannotFinish"
      title="无法审核"
      width="30%"
    >
      <span>委托详情未提交检测结果，不能进行审核</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleClick()"
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
      <span>该委托完成审核</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogVisible_success = false"
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
      <span>该委托已取消审核</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogVisible_cancelSuccess = false"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>


  <!-- 委托已批准,无法修改弹窗-->
  <el-dialog v-model="dialogVisible_alreadyApproved" title="不能批准" width="30%">
    <span>该委托已被批准，无法进行修改！</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="dialogVisible_alreadyApproved= false"
          >确认</el-button>
      </span>
    </template>
  </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, getCurrentInstance, defineComponent, onMounted } from "vue";
import type { FormInstance, FormRules, ElMessageBox } from "element-plus";
import { useRouter, useRoute } from "vue-router"

const formSize = ref("default");
const ruleFormRef = ref<FormInstance>();
const dialogVisible_finish = ref(false);
const dialogVisible_cannotFinish = ref(false);
const dialogVisible_success = ref(false);
const dialogVisible_cancelSuccess = ref(false);
const dialogVisible_alreadyApproved = ref(false);
const router = useRouter();

const route = useRoute();
const token = storage.get('token');
import { storage } from '../utils/storage.ts'

const ruleForm = reactive({
  client: "",
  entrustmentNo: "",
  entrustmentStartDate: "",
  entrustmentEndDate: "",
  detectionType: null,
  queryCriteria: {
    maxRecordReturn: 10,
    startIndex: 1,
  }
});


const rules = reactive<FormRules>({});

// 重新包装请求，添加分页参数
const total = ref(0);
const thisPage = ref(1);

let content = ref([]) ;
let callBack = ref('');

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


const submitForm = async (formEl: FormInstance | undefined) => {

  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      
      if(ruleForm.entrustmentStartDate!="" && ruleForm.entrustmentStartDate!=""){
        console.log("12312312312321 ==== here ")
        ruleForm.entrustmentStartDate = dateFormat(ruleForm.entrustmentStartDate);
        ruleForm.entrustmentEndDate = dateFormat(ruleForm.entrustmentEndDate);
      }
      
      const { client, entrustmentNo, entrustmentStartDate, entrustmentEndDate, 
              detectionType  } = ruleForm;    
      ruleForm.client = ruleForm.client.trim();
      ruleForm.entrustmentNo = ruleForm.entrustmentNo;
      ruleForm.startIndex = (thisPage.value - 1) * 10 ;
      const { startIndex } = ruleForm.queryCriteria;
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


onMounted( () => {
  callBack = listByCondition(ruleForm);
  callBack.then((response) => {
    content.value = response.data.data.records;
    total.value = response.data.data.total;
  })
})

console.log("outside ", callBack)

const handlePageChange = (val: number) => {
  console.log("valllll " , val);
  thisPage.value = val;
  ruleForm.queryCriteria.startIndex = (thisPage.value - 1) * 10;
  callBack = listByCondition(ruleForm);
  callBack.then((response) => {
    content.value = response.data.data.records;
  })
};

const handleChange = (event, props) => {
  if(content.value[props.$index].status== 1){
    
    const request = {id: props.row.id, status: 0} ;
    const data = finishProject(request);

    data.then((response) => {
      
      if(response.data.code == 200){
        console.log("trueeeeee  ", response.data )
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
        console.log("elssssss  ", response.data )
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
  
};

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

const handleClick = () => {
  dialogVisible_cannotFinish.value = false;
  router.go(0);
}

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

const startDate = ref("");
const endDate = ref("");



const detectionType = ["商户委托", "市局委托" , "区局委托", "街道委托", "其他委托"];
const projectStatus = ["未审核", "完成审核"];

const currentInstance = getCurrentInstance();
const { $axios } = currentInstance.appContext.config.globalProperties;
import { finishProject, approvalById, listByCondition } from '../api/apiRequest'


const formatType = (row, column) => {
  // 获取单元格数据
  return detectionType[row.entrustmentInfoVo.detectionType-1]
};

const formatDate = (row, column) => {
  let dt = new Date(row.entrustmentInfoVo.entrustmentDate);
  return dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate() ; 
   
};


</script>

<style scoped lang="scss">
.submitBtn {
  margin-left: 640px;
  margin-top: 32px;

}

.resetBtn {
  margin-left: 160px;
  margin-top: 32px;

}

.approvalBtn{
  margin-left: 12px;
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
  margin-left: 640px;
  margin-top: 16px;
}
</style>

<!-- if(content.value[props.$index].status== 1){
    dialogVisible_finish.value = true;  
    props.row.status = 1;
    
  }else{
    const request = {id: props.row.id } ;

    props.row.status = 1;
    const data = finishProject(request);
    data.then((response) => {
      if(response.data.resultCode == 60015){
        dialogVisible_cannotFinish.value = true;
      }else if(response.data.code == 200){
        dialogVisible_success.value = true;
      }
    })
  } -->