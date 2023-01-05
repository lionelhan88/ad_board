<script lang="ts" setup>

import { reactive, ref, onMounted , getCurrentInstance } from "vue";
import { useRouter, useRoute } from "vue-router"
import { toRaw } from '@vue/reactivity'

const route = useRoute();
const router = useRouter();
const data = route.query;
const info = ref([]);
const entrustmentInfo = ref([]);
const finished = ["未审核", "完成审核"];
const grade = ["A", "B", "C"];
const approvalStatus = ["未批准", "已批准"];

const facilityType = [{
  value: 1,
  label: "户外招牌", 
}, 
{
  value: 2, 
  label: "户外广告",
},
];
const detectionType_option = [{
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
    value: 5,
    label: "其他委托",
  },];

const currentInstance = getCurrentInstance();
const { $axios } = currentInstance.appContext.config.globalProperties;
import { getRslt, exportPdf, approvalById, getAllMethods, detailUpdate } from '../api/apiRequest';
import { storage } from '../utils/storage'

const approval = ref();
const status = ref();

const flag = ref(true);

const dialogVisible_finish = ref(false);
const dialogVisible_approval = ref(false);
const dialogVisible_approved = ref(false);
const dialogVisible_already = ref(false);
const dialogVisible_editSuccess = ref(false);
const dialogVisible_alreadyApproved = ref(false);
const dialogVisible_status = ref(false);

const callBack = ref("");
const content = ref();
const initOption = ref([]);

let newEntrustId = {id: ""} ;

//================================ 加载页面前获取数据并赋值 ==================================
onMounted( () => {

  
  if(data.ticket != null){
    newEntrustId.id = data.ticket
    console.log("receivedddddddddd123 ", data, newEntrustId)
    
    const detail = getRslt(newEntrustId);
    detail.then( (response) => {
      info.value = response.data.data;
      info.value.constructionUnitName = data.constructionUnitName;
      info.value.areaName = data.areaName;
      info.value.facilityNo = data.id;
      info.value.detailedAddress = data.address;
      info.value.shopName = data.name;
      info.value.facilityName = data.signName;
      approval.value = response.data.data.approval;
      status.value = response.data.data.status;
      entrustmentInfo.value = response.data.data.entrustmentInfoVo;
    });

  }else{
    const detail =  getRslt(data);
    
    detail.then( (response) => {
      console.log("detailssl " , response.data.data)
      info.value = response.data.data;
      approval.value = response.data.data.approval;
      status.value = response.data.data.status;
      entrustmentInfo.value = response.data.data.entrustmentInfoVo;
    });
  }
  

})


//====================================== 路由跳转 ===========================================
const reportPage = () => {

  if(status.value == 1 && approval.value == 1){

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
      window.open(url)
    })
  }else if(status.value == 1 && approval.value == 0){
    dialogVisible_approval.value = true;
  }else{
    dialogVisible_finish.value = true;
  }  
}

//====================================== 点击事件 ===========================================
const approve = () => {
  console.log("hitadsf")
  if(approval.value == 1){
    const request = {id: info.value.id, status: 0} ;
    callBack.value = approvalById(request);
    callBack.value.then((response) =>{
      content.value = response.data;
      console.log(content.value);
      if(content.value.code == 200){
        dialogVisible_alreadyApproved.value = true;
      }
    })

  

    
    
  }else{

    const request = {id: info.value.id, status: 1}
    callBack.value = approvalById(request);
    callBack.value.then((response) =>{
      content.value = response.data;
      console.log(content.value);
      if(content.value.code == 200){
        dialogVisible_approved.value = true;
      }else if(content.value.resultCode == 60006){
        dialogVisible_finish.value = true;
      }
    })


  }
  
}

const cancelEdit = () => {
  console.log("cancel bunt  ")

  if(flag.value == false){
    flag.value = !flag.value;
    router.go(0);
  }
  
}

const startEdit = () => {
  

if(info.value.approval == 1){
  console.log("start edit ", info.value.approval ==1  )
  dialogVisible_already.value = true;
}else if(info.value.status == 1){
  dialogVisible_status.value = true;
}else{
  flag.value = !flag.value;
  callBack.value = getAllMethods();
  callBack.value.then((response) => {
    initOption.value = response.data.data;
  });
}
  
}

const result = ref();
const returnPage = () => {
  router.go(-1);
}

const saveEdit = () => {
  
  flag.value = !flag.value;
  

  console.log("agagagag ",  info.value )
  result.value = detailUpdate(info.value);

  result.value.then((response) => {
    console.log("resultttt ", response.data);
    if(response.data.code == 200){
      dialogVisible_editSuccess.value = true;
    }
  })
}

const handleClick = () => {
  dialogVisible_editSuccess.value = false;
  dialogVisible_approved.value = false;
  dialogVisible_alreadyApproved.value = false;
  router.go(0);
}

const searchFacility = () => {

  if(route.query.ticket == null ){
    console.log("datata in searchhhhhh ", route.query);
    router.push({
      name: "selectShop",  
      query:{
        ticket:route.query.id,
      }
    });
  }else{
    router.push({
      name: "selectShop",
      query:{
        ticket: route.query.ticket,
      }
    })
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

const disabledDate = (time: Date) => {
  return time.getTime() + 3600 * 1000 * 24 <= Date.now();
};

const disabledEndDate = (time: Date) => {
  return time.getTime() + 3600 * 1000 * 24  < Date.now();
};
</script>


<template>
   <div>
   <h3 class="header1">委托详情   
    <el-button
      type="primary"
      @click="searchFacility()"
      class="searchFacility"
      v-if="!flag"
    >选择设施</el-button>
   
   </h3>
    <el-descriptions class="margin-top" :column="4" border >
    
      <el-descriptions-item align="center">
        <template #label>
          <div class="cell-item">委托编号</div>
        </template>
        {{entrustmentInfo.entrustmentNo ? entrustmentInfo.entrustmentNo : "暂无结果" }}
      </el-descriptions-item>

      <el-descriptions-item align="center">
        <template #label>
          <div>报告编号</div>
        </template>
        {{info.reportNo ? info.reportNo : "暂无结果" }}
      </el-descriptions-item>

      <el-descriptions-item align="center">
        <template #label>
          <div>校验码</div>
        </template>
        {{info.checkCode ? info.checkCode : "暂无结果" }}
      </el-descriptions-item>

      <el-descriptions-item align="center">
        <template #label>
          <div>委托日期</div>
        </template>
        {{entrustmentInfo.entrustmentDate ? entrustmentInfo.entrustmentDate.slice(0,10) : "暂无结果" }}
      </el-descriptions-item>

      <el-descriptions-item align="center">
        <template #label>
          <div class="cell-item">检测类型</div>
        </template>
        <span v-if="flag">
          {{entrustmentInfo.detectionType ? detectionType_option[entrustmentInfo.detectionType-1].label : "暂无结果" }}
        </span>
        <el-select
          v-model="entrustmentInfo.detectionType"
          clearable
          placeholder="--请选择--"
          v-if="!flag"

        >
          <el-option
            v-for="item in detectionType_option"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-descriptions-item>

      <el-descriptions-item align="center">
        <template #label>
          <div>委托单位</div>
        </template>
        <span v-if="flag">
          {{entrustmentInfo.client ? entrustmentInfo.client : "暂无结果" }}
        </span>
        <el-input
              v-model="entrustmentInfo.client "
              v-if="!flag"
            />
      </el-descriptions-item>

      <el-descriptions-item align="center">
        <template #label>
          <div>店铺名称</div>
        </template>
        {{info.shopName ? info.shopName : "暂无结果" }}
      </el-descriptions-item>

      <el-descriptions-item align="center">
        <template #label>
          <div>设施名称</div>
        </template>
        {{info.facilityName ? info.facilityName : "暂无结果" }}
      </el-descriptions-item>

      <el-descriptions-item align="center">
        <template #label>
          <div class="cell-item">设施编号</div>
        </template>
        {{info.facilityNo ? info.facilityNo : "暂无结果" }}
      </el-descriptions-item>

      <el-descriptions-item align="center">
        <template #label>
          <div>设施地点</div>
        </template>
        {{info.detailedAddress ? info.detailedAddress : "暂无结果" }}      
      </el-descriptions-item>

      <el-descriptions-item align="center">
        <template #label>
          <div>设施类型</div>
        </template>
         <span v-if="flag">
          {{info.facilityType ? facilityType[info.facilityType-1].label : "暂无结果" }}
        </span>
        <el-select
          v-model="info.facilityType"
          clearable
          placeholder="--请选择--"
          v-if="!flag"
        >
          <el-option
            v-for="item in facilityType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>  
      </el-descriptions-item>


      <el-descriptions-item align="center">
        <template #label>
          <div>设计单位</div>
        </template>
        <span v-if="flag">
          {{info.designCompany ? info.designCompany : "暂无结果" }}
        </span>
        <el-input
              v-model="info.designCompany"
              v-if="!flag"
            />  
      </el-descriptions-item>

      <el-descriptions-item align="center">
        <template #label>
          <div class="cell-item">施工单位</div>
        </template>
   
        {{info.constructionUnitName ? info.constructionUnitName : "暂无结果" }}
  

      </el-descriptions-item>

      <el-descriptions-item align="center">
        <template #label>
          <div>监理单位</div>
        </template>
        <span v-if="flag">
          {{info.supervisionCompany ? info.supervisionCompany : "暂无结果" }}
        </span>
        <el-input
              v-model="info.supervisionCompany"
              v-if="!flag"
            /> 
      </el-descriptions-item>

      <el-descriptions-item align="center">
        <template #label>
          <div>行政区域</div>
        </template>
        {{info.areaName ? info.areaName : "暂无结果" }}
      </el-descriptions-item>

      <el-descriptions-item align="center">
        <template #label>
          <div >创建用户</div>
        </template>
        {{info.creator ? info.creator : "暂无结果"}}
      </el-descriptions-item>

      <el-descriptions-item align="center">
        <template #label>
          <div class="cell-item">检测开始时间</div>
        </template>
        <span v-if="flag">
          {{dateFormat(info.detectionStartTime).slice(0,10)}}
        </span>

        <el-config-provider :locale="locale" v-if="!flag">
          <el-date-picker
            v-model="info.detectionStartTime"
            type="date"
            placeholder="点击图标选择日期"
            clearable="true"
            :disabledDate="disabledDate"
          >
          </el-date-picker>
        </el-config-provider>
        
      </el-descriptions-item>

      <el-descriptions-item align="center">
        <template #label>
          <div>检测结束时间</div>
        </template>
        <span v-if="flag">
          {{dateFormat(info.detectionEndTime).slice(0,10)}}
        </span>

        <el-config-provider :locale="locale" v-if="!flag">
          <el-date-picker
            v-model="info.detectionEndTime"
            type="date"
            placeholder="点击图标选择日期"
            clearable="true"
            :disabledDate="disabledEndDate"
          >
          </el-date-picker>
        </el-config-provider>
        
      </el-descriptions-item>

      <el-descriptions-item align="center">
        <template #label>
          <div >创建时间</div>
        </template>
        {{info.insertTime ? info.insertTime.slice(0,10) : "暂无结果" }}
      </el-descriptions-item>

      <el-descriptions-item align="center">
        <template #label>
          <div >修改时间</div>
        </template>
        {{info.updateTime ? info.updateTime.slice(0,10) : "暂无结果"}}
      </el-descriptions-item>

      <el-descriptions-item align="center" >
        <template #label>
          <div class="cell-item">修改用户</div>
        </template>
        {{info.modifier ? info.modifier : "暂无结果"}}
      </el-descriptions-item>

      <el-descriptions-item align="center">
        <template #label>
          <div >审核状态</div>
        </template>
        {{finished[info.status]}}
      </el-descriptions-item>

      <el-descriptions-item align="center">
        <template #label>
          <div>批准状态</div>
        </template>
        {{approvalStatus[info.approval]}}
      </el-descriptions-item>

      <el-descriptions-item/>

      <el-descriptions-item align="left" span="4">
        <template #label>
          <div class="cell-item" align="center">检测方法</div>
        </template>

        <span v-if="flag">
          <span v-if="info.testMethods == null"> 暂无结果 </span>
          <span v-else :keys="item" v-for="item in info.testMethods" align="center" >
            {{item.name}}; 
          </span>
        </span>

        <el-select
              v-model="info.testMethodsId"
              multiple
              collapse-tags
              collapse-tags-tooltip
              placeholder="请选择"
              v-if="!flag"
            >
              <el-checkbox-group v-model="info.testMethodsId">
                <el-option
                  v-for="item in initOption"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-checkbox-group>
            </el-select>
      </el-descriptions-item>

    

      <el-descriptions-item align="left" label-align="center" span="4">
        <template #label>
          <div class="cell-item">综合等级</div>
        </template>
        {{info.comprehensiveGrade ? grade[info.comprehensiveGrade-1] : "暂无结果"}}
      </el-descriptions-item>

      <el-descriptions-item align="left" span="4">
        <template #label>
          <div class="cell-item" align="center">检测结果</div>
        </template>
        {{info.detectionResult ? info.detectionResult : "暂无结果"}}
      </el-descriptions-item>

      
    </el-descriptions>

    <el-button class="editBtn" @click="startEdit()" v-if="flag">编辑</el-button>
    <el-button class="saveBtn"  @click="saveEdit()" v-if="!flag">保存</el-button>
    <el-button class="cancelBtn" @click="cancelEdit()">取消</el-button>
    <el-button class="approveBtn"  @click="approve()">批准</el-button>
    <el-button class="reportBtn" @click="reportPage()" >报告</el-button>
    <el-button class="returnBtn" @click="returnPage()" >返回</el-button>

    <!-- 委托未批准弹窗 -->
    <el-dialog v-model="dialogVisible_approval" title="委托未批准" width="30%">
      <span>委托未批准，无法生成报告！</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogVisible_approval= false"
            >确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 委托未审核弹窗 -->
    <el-dialog v-model="dialogVisible_finish" title="委托未批准" width="30%">
      <span>委托还未进行审核，无法进行批准！</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogVisible_finish= false"
            >确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 委托批准弹窗 -->
    <el-dialog v-model="dialogVisible_approved" title="委托批准" width="30%">
      <span>委托已批准！</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleClick"
            >确认</el-button>
        </span>
      </template>
    </el-dialog>


  <!-- 委托已批准,无法编辑弹窗-->
  <el-dialog v-model="dialogVisible_already" title="无法编辑" width="30%">
    <span>该委托已被批准，无法进行编辑操作！</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="dialogVisible_already= false"
          >确认</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 委托已审核,无法编辑弹窗-->
  <el-dialog v-model="dialogVisible_status" title="无法编辑" width="30%">
    <span>该委托已被审核，无法进行编辑操作！</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="dialogVisible_status= false"
          >确认</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 委托取消批准弹窗-->
  <el-dialog v-model="dialogVisible_alreadyApproved" title="取消批准成功" width="30%">
    <span>该委托已取消批准！</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleClick()"
          >确认</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 委托详情修改已保存-->
  <el-dialog v-model="dialogVisible_editSuccess" title="保存成功" width="30%">
    <span>委托修改信息已被保存！</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleClick()"
          >确认</el-button>
      </span>
    </template>
  </el-dialog>

  </div>

  
</template>





<style scoped lang="scss">
.editBtn {
  margin-top: 80px;
  position: relative;
  left: 24%;
}

.saveBtn {
  margin-top: 80px;
  position: relative;
  left: 24%;
}

.cancelBtn {
  margin-top: 80px;
  position: relative;
  left: 32%;
}

.approveBtn {
  margin-top: 80px;
  position: relative;
  left: 40%;
}

.reportBtn {
  margin-top: 80px;
  position: relative;
  left: 48%;
}

.returnBtn {
  margin-top: 80px;
  position: relative;
  left: 56%;
}

.cell-item{
  width: 100px;
  label-align: center;
  left: 50px;
}

.header1 {
  display: flex;
  margin-left: 740px;
  margin-bottom: 48px;
  align-items: center;
  font-size: 24px;
}

.searchFacility{
  display: inline;
  margin-left: 640px;
  margin-top: 5px;
}
</style>

<!--   




=============================================================================================

<el-descriptions-item align="left" span="4">
        <template #label>
          <div class="cell-item" align="center">检测项目</div>
        </template>
        <span v-if="info.testItemsVos == null" 
        style="text-align: center;display:block;"
        > 暂无结果 </span>
        <span v-else :keys="item" v-for="item in info.testItemsVos" >
        {{item.name}};
        </span>
    
      </el-descriptions-item>
  
  
 ====================================================================================



import type { FormInstance, FormRules } from "element-plus";

const formSize = ref("default");
const ruleFormRef = ref<FormInstance>();



const tableData = [
  {
    entrustmentNo: "7987465423",
    reportNo: "12345678",
    inspectResult: "1、（A级）可继续使用，并应按规范要求做好维护保养。 2、（B级）某某分项存在一般缺陷，应按规范要求15天内完成整改，并申请复检" +
    "。 3、（C级）某某分项存在严重缺陷，应按规范要求7天内完成整改，并申请复检。某某存在坠落、倾覆危险，应按规范要求24小时内予以拆除。）"

  },
];

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
    } else {
      console.log("error submit!", fields);
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  formEl.dateValue = "";
};         
  </div> -->