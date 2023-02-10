<script lang="ts" setup>

import { reactive, ref, onMounted , getCurrentInstance } from "vue";
import { useRouter, useRoute } from "vue-router"
import { toRaw } from '@vue/reactivity'
import { ElMessage, ElLoading } from 'element-plus'

const route = useRoute();
const router = useRouter();
const data = route.query;
const info = ref([]);
const entrustmentInfo = ref([]);
const finished = ["未审核", "已审核"];
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
import { getRslt, exportPdf, approvalById, getAllMethods, detailUpdate, finishProject, upReport } from '../api/apiRequest';
import { storage } from '../utils/storage'

const approval = ref();
const status = ref();

const flag = ref(true);
const isEditing = ref();
const uploadReport = ref(false);

const dialogVisible_finish = ref(false);
const dialogVisible_approval = ref(false);
const dialogVisible_approved = ref(false);
const dialogVisible_already = ref(false);
const dialogVisible_editSuccess = ref(false);
const dialogVisible_alreadyApproved = ref(false);
const dialogVisible_audit = ref(false);
const dialogVisible_cannotFinish = ref(false);
const dialogVisible_status = ref(false);

const callBack = ref("");
const content = ref();
const initOption = ref([]);
const docList = ref([]);

let newEntrustId = {id: ""} ;

const uploadData = reactive({
  policy: "",
  signature: "",
  key: "",
  OSSAccessKeyId: "",
  url:"",
});

//================================ 加载页面前获取数据并赋值 ==================================
onMounted( () => {
    if(data.ticket != null){
      newEntrustId.id = data.ticket
      const detail = getRslt(newEntrustId);
      detail.then( (response) => {
        info.value = response.data.data;
        info.value.constructionCopmany = data.constructionUnitName;
        info.value.areaName = data.areaName;
        info.value.facilityNo = data.id;
        info.value.detailedAddress = data.address;
        info.value.shopName = data.name;
        info.value.facilityName = data.signName;
        info.value.facilityPics = data.facilityPics;
        info.value.facilityPosition = data.facilityPosition;
        info.value.facilityStructureType = data.facilityStructureType;
        approval.value = response.data.data.approval;
        status.value = response.data.data.status;
        entrustmentInfo.value = response.data.data.entrustmentInfoVo;
        if(approval.value == 1 && status.value == 1){
          uploadReport.value = true;
        }
        if(data.editing == 1){
          
          flag.value = false;
          //isEditing.value = false;
          
          data.editing = 0;
        }

        
      });

    }else{
      const detail =  getRslt(data);
      
      detail.then( (response) => {
        info.value = response.data.data;
        approval.value = response.data.data.approval;
        status.value = response.data.data.status;
        entrustmentInfo.value = response.data.data.entrustmentInfoVo;
        if(approval.value == 1 && status.value == 1){
          uploadReport.value = true;
        }
      });
    }
})


//====================================== 路由跳转 ===========================================
const reportPage = () => {
  if(status.value == 1 && approval.value == 1){
    const outputData = exportPdf(data);
    const pdfData = ref('');
    const loading = ElLoading.service({
      lock: true,
      text: '报告加载中，请稍后',
      background: 'rgba(0,0,0,0.7)',
    })

    outputData.then((response) =>{
      pdfData.value = response.data;
      const binaryData = [];
      binaryData.push(pdfData.value);   
      let blob = new Blob(binaryData, { type: 'application/pdf;' });
      const url = window.URL.createObjectURL( 
          blob
      );
      window.open(url)
    })
    setTimeout(()=>{
      loading.close()}, 2000
    );
  }else if(status.value == 1 && approval.value == 0){
    dialogVisible_approval.value = true;
  }else{
    dialogVisible_finish.value = true;
  }  
}

//====================================== 点击事件 ===========================================
const approve = () => {
  if(approval.value == 1){
    const request = {id: info.value.id, status: 0} ;
    callBack.value = approvalById(request);
    callBack.value.then((response) =>{
      content.value = response.data;
      if(content.value.code == 200){
        dialogVisible_alreadyApproved.value = true;
      }
    })
  }else{
    const request = {id: info.value.id, status: 1}
    callBack.value = approvalById(request);
    callBack.value.then((response) =>{
      content.value = response.data;
      if(content.value.code == 200){
        dialogVisible_approved.value = true;
      }else if(content.value.resultCode == 60006){
        dialogVisible_finish.value = true;
      }
    })
  }  
}

const cancelEdit = () => {
  if(flag.value == false){
    flag.value = !flag.value;
    router.go(0);
  } 
}

const audit = () => {
  const data = reactive({id:info.value.id, status:"",}); 
  if(info.value.status == 1){
    data.status = 0;
  }else{
    data.status = 1;
  }
  const rslt = finishProject(data);
  rslt.then( (response) =>{
    if(response.data.resultCode == 60003){
      dialogVisible_already.value = true;
    }else if(response.data.code == 200){
      dialogVisible_audit.value = true;
    }else if(response.data.resultCode == 60015){
      dialogVisible_cannotFinish.value = true;
    }
  })
  
}

const startEdit = () => {
  if(info.value.approval == 1){
    dialogVisible_already.value = true;
  }else if(info.value.status == 1){
    dialogVisible_status.value = true;
  }else{
    flag.value = false;
    isEditing.value = true;
    callBack.value = getAllMethods();
    callBack.value.then((response) => {
      initOption.value = response.data.data;
    });
  }
}

const result = ref();
const returnPage = () => {
  router.push({
    name: "searchTrust",
  });
}

const saveEdit = () => {
 
  info.value.detectionStartTime = dateFormat(info.value.detectionStartTime);
  info.value.detectionEndTime = dateFormat(info.value.detectionEndTime);
  result.value = detailUpdate(info.value);
  result.value.then((response) => {
    if(response.data.code == 200){
      dialogVisible_editSuccess.value = true;   
    }
  })
}

const handleClick = () => {
  dialogVisible_approved.value = false;
  dialogVisible_alreadyApproved.value = false;
  dialogVisible_audit.value = false;
  dialogVisible_cannotFinish.value = false;
  router.go(0);
}

const handleApproval = () => {
  dialogVisible_editSuccess.value = false;
  flag.value = true;
  router.push({
    name: "approval",
    query: {
      id: newEntrustId.id,
    }
    
  })
}

const searchFacility = () => {
  if(route.query.ticket == null ){
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

//======================================== 文件上传 ================================================
const uploadFile = (param) => {
  
  const fileExt = param.name.substring(param.name.lastIndexOf(".")+1);
  let types = ["pdf", "doc", "docx"]
  const isImage = types.includes(fileExt)
  //if(!isImage){
  //  ElMessage({
  //    message: '上传的文件只能是PDF，DOC，DOCX格式',
  //    type: "error"
  //  })
  //  return false;
  //}
  return true; 
  
};



const fileee = ref({});
const uploadInfo = ref({});

const httpRequestLogo = (uploadFile) =>{

  uploadInfo.value["file"] = uploadFile.file;
  uploadInfo.value["id"] = info.value.id;
  const rslt = upReport(uploadInfo.value);
  rslt.then((response) => {
    if(response.data.code == 200){
      ElMessage({
        message: '文件上传成功',
        type: "success"
      })
    }
  })
}


const handleChange = (file,fileList) => {
  if(fileList.length > 0){
    docList.value = [fileList[fileList.length-1]]
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

<!-- if(!isImage){
    ElMessage({
      message: '上传的图片只能是PDF，DOC，DOCX格式',
      type: "error"
    })
    return false;
  } -->


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
              style="width:220px"
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
              style="width:220px"
            />  
      </el-descriptions-item>

      <el-descriptions-item align="center">
        <template #label>
          <div class="cell-item">施工单位</div>
        </template>
        {{info.constructionCopmany ? info.constructionCopmany : "暂无结果" }}
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
              style="width:220px"
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
          {{info.detectionStartTime ? info.detectionStartTime.slice(0,10) : "暂无结果"}}
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
          {{info.detectionEndTime ? info.detectionEndTime.slice(0,10) : "暂无结果"}}
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

      <el-descriptions-item align="center" >
        <template #label>
          <div >检测面积(㎡)</div>
        </template>
        <span v-if="flag">
          {{info.area ? info.area : "暂无结果" }}
        </span>
        <el-input
              v-model="info.area"
              v-if="!flag"
              style="width:220px"
            />
      </el-descriptions-item>

      <el-descriptions-item align="center" >
        <template #label>
          <div >牌面底标高(m)</div>
        </template>
        <span v-if="flag">
          {{info.height ? info.height : "暂无结果" }}
        </span>
        <el-input
              v-model="info.height"
              v-if="!flag"
              style="width:220px"
            />
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
          <div >修改用户</div>
        </template>
        {{info.modifier ? info.modifier : "暂无结果"}}
      </el-descriptions-item>

      <el-descriptions-item/>

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

      <el-descriptions-item align="center" v-if="uploadReport">
        <template #label>
          <div>上传报告</div>
        </template>

        <el-upload
          :file-list="docList"
          class="upload-demo"
          action="#"
          :multiple="false"
          :auto-upload="true"
          :before-upload="uploadFile"
          :on-change="handleChange"
          :httpRequest="httpRequestLogo"
        >
          <el-button class="uploadBtn" >选择文件</el-button>
          
         
        </el-upload>
      
      </el-descriptions-item>

      <el-descriptions-item v-if="!uploadReport"/>

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
              class="tree"
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
    <!-- 
    <el-button class="auditBtn" @click="audit()" v-if="flag">审核 / 取消审核</el-button>
    <el-button class="approveBtn"  @click="approve()">批准</el-button> -->
    <el-button class="reportBtn" @click="reportPage()" v-if="flag">报告</el-button>
    <el-button class="cancelBtn" @click="cancelEdit()" v-if="!flag">取消</el-button>
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
        <el-button type="primary" @click="handleApproval()"
          >确认</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 委托审核状态修改成功-->
  <el-dialog v-model="dialogVisible_audit" title="修改成功" width="30%">
    <span>委托审核状态修改成功！</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleClick()"
          >确认</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 无法审核弹窗 -->
    <el-dialog
      v-model="dialogVisible_cannotFinish"
      title="无法审核"
      width="30%"
    >
      <span>委托详情未提交检测结果，不能进行审核！</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleClick()"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>  

  </div>
  
</template>





<style scoped lang="scss">
.editBtn {
  margin-top: 80px;
  position: relative;
  left: 30%;
}

.saveBtn {
  margin-top: 80px;
  position: relative;
  left: 32%;
}

.cancelBtn {
  margin-top: 80px;
  position: relative;
  left: 42%;
}

.auditBtn {
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
  left: 42%;
}

.returnBtn {
  margin-top: 80px;
  position: relative;
  left: 54%;
}

.cell-item{
  width: 100px;
  label-align: center;
  left: 50px;
}

.header1 {
  display: flex;
  margin-left: 720px;
  margin-bottom: 48px;
  align-items: center;
  font-size: 24px;
}

.searchFacility{
  display: inline;
  margin-left: 640px;
  margin-top: 5px;
}

.uploadBtn{
  display:flex;
}

.upload-demo{
  display:flex;
  mragin-right: 16px;
  width: 200px;
}

.tree{
 // height: 280px;
 width: 2.7rem;
}
</style>
