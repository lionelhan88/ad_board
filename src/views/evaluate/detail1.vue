<template>
  <div>
    <h2>检测详情</h2>
    <el-divider />

    <div class="titleSize">{{ content.testItemsName }}: </div>
    

    <el-table :data="content.children" border class="dataTable">
      <el-table-column prop="testItemsName" label="检测参数" align="center"></el-table-column>

      <el-table-column prop="detectionResult" label="检测结果" v-if="flag" align="center">
        <template #default="scope">
          {{ scope.row.detectionDetails ? scope.row.detectionDetails.detectionResult : "zanwu" }}
        </template>
      </el-table-column>

      <el-table-column prop="detectionResult" label="检测结果" v-if="!flag" align="center">
        <template #default="scope">
          <el-input v-model="scope.row.detectionResult"> </el-input>
        </template>
      </el-table-column>

      <el-table-column prop="detectionResult" label="是否符合要求" v-if="flag" align="center">
        <template #default="scope">
          {{ scope.row.detectionDetails ? options[scope.row.detectionDetails.isFit].label : "sanwu"  }}
        </template>
      </el-table-column>

      <el-table-column prop="isFit" label="是否符合要求" align="center" v-if="!flag">
        <template #default="scope">
          <el-select v-model="scope.row.isFit" placeholder="--请选择--">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </el-table-column>
    </el-table>

    <el-divider />

    <div class="titleSize2">现场图片:
    
        <el-button @click="isUpload=true" class="addPhoto">添加</el-button>
    </div>

    <el-upload
      
        class="dragBox"
        :before-upload="uploadFile"
        :data="uploadData"
        :action="uploadData.url"
        multiple
        drag
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        v-if="isUpload"
        >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
            拖拽文件至此 或 <em>点击上传</em>
        </div> 
    </el-upload>

    <div v-if="isUpload">
        <el-button type="primary" @click="uploadPhoto()"  > 保存 </el-button>
        <el-button  @click="editDetail()"  > 取消 </el-button>
        <el-divider />
    </div>

   
    <el-button type="primary" @click="editDetail()" class="editBtn" v-if="flag"> 编辑 </el-button>

    <el-button type="primary" @click="cancelBtn()" class="editBtn" v-if="!flag"> 取消 </el-button>

    <el-button @click="saveDetail()" class="saveBtn"> 保存 </el-button>

    <el-button type="info" @click="goBackPage()" class="goBackBtn"> 返回 </el-button>
  
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, onChange } from "vue";
import { useRouter, useRoute } from "vue-router";
import { UploadFilled } from '@element-plus/icons-vue'
import { getDetectionDetail, saveDetectionDetails, getUploadPathUrl, uploadPic } from "../../api/apiRequest";
const router = useRouter();
const route = useRoute();

const requirement = ref();
const flag = ref(true);
const isUpload = ref(false);

const options = [
  {
    value: 0,
    label: "不符合",
  },
  {
    value: 1,
    label: "符合",
  },
];

const data = {
  id: route.query.id,
  rootTestItemsId: route.query.rootTestItemsId,
};

const getURLdata = {
    entrustmentDetailId: route.query.rootTestItemsId,
    testItemsId: route.query.id,
}

const goBackPage = () => {
  router.go(-1);
};

const saveResult = reactive([
  {
    calculationResult: "",
    detectionResult: "",
    entrustmentDetailId: 0,
    id: 0,
    isFit: "",
    specificationLimit: "",
    testItemsId: 0,
    unit: "",
  },
]);

const content = ref([]);
const uploadData = reactive({
  policy: "",
  signature: "",
  key: "",
  OSSAccessKeyId: "",
  url: ""
});

const onChange = (uploadFile, uploadFiles) => {
    console.log("afdasffile <========> ", uploadFile);
}

const uploadFile = param => {

    const getURL = getUploadPathUrl(getURLdata);
    getURL.then((response) => {
        uploadData.policy = response.data.data.policy;
        uploadData.signature = response.data.data.signature;
        uploadData.key = response.data.data.path + "/" +  param.name.split(".")[0];
        uploadData.OSSAccessKeyId = response.data.data.accessKey;
        uploadData.url = response.data.data.url;

        console.log("URLRLRLRLR ", param.name.split(".")[0]);
    })

}

onMounted(() => {
  const callBack = getDetectionDetail(data);
  callBack.then((response) => {
    console.log("something in onMounted", response.data.data[0]);
    content.value = response.data.data[0];
  });

 
  
});

const saveDetail = () => {
  console.log("1212312", fileList.value);
 
};

const editDetail = () => {
  flag.value = false;
  console.log("hjhiahfaihf ", flag.value);
};

const cancelBtn = () => {
    flag.value = true;
}

const uploadPhoto = () => {
    
    console.log("fdadfafsdasdfdasf " , data)
    const r = uploadPic(uploadData)
}

const fileList = ref<UploadUserFile[]>();

const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
  console.log(uploadFile)
}

const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  console.log(file, uploadFiles)
}
</script>

<style scoped>
.titleSize {
  font-size: 18px;
  margin-top: 25px;
}

.titleSize2{
    font-size: 18px;
    margin-top: 50px;
}

.addPhoto{
    margin-left: 24px;
}

.dragBox{
    margin-top: 24px;
}

.editBtn {
  margin-top: 240px;
  margin-left: 24%;
}

.goBackBtn {
  margin-top: 240px;
  margin-left: 320px;
}

.saveBtn {
  margin-top: 240px;
  margin-left: 320px;
}

.dataTable {
    font-size: 15px;
  width: 100%;
  margin-top: 64px;
}
</style>

<!-- 
 const rslt = saveDetectionDetails(content.value.children);
    
    
    <el-table-column prop="testItemsName" label="检测参数" width="480" align="center"/>
        <el-table-column prop="detectionResult" label="检测结果" width="480" align="center">
            <el-input v-model="detectionResult" align="center">
                
            </el-input>
        </el-table-column>
        <el-table-column prop="isFit" label="是否符合要求" align="center">
            <el-select v-model="saveResult.isFit" placeholder="--请选择--">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                />
            </el-select>
        </el-table-column>
    
    
    <el-descriptions
      :column="1"
      border
    >
      <el-descriptions-item label-align="center" class="buttons">
        <template #label>
          <div class="titleSize">
        
            基础或被依附体情况:
          </div>
        </template>

        <span class="editBtn">
            <el-button type="primary" @click="EvaDetail(index)" > 编辑 </el-button>
        </span>
        

        <span>
            <el-button  @click="EvaDetail(index)"> 保存 </el-button>
        </span>
        

        <span class="goBackBtn">
            <el-button type="info" @click="EvaDetail(index)" > 返回 </el-button>
        </span>
        
        
      </el-descriptions-item>

     

      


     
    </el-descriptions> -->
