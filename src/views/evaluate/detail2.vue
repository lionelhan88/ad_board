<script lang="ts" setup>

import { ref, onMounted, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getDetectionDetail, saveDetectionDetails, getUploadPathUrl, saveFileFullPath, delFile, getAccessUrl } from "../../api/apiRequest";
const router = useRouter();
const route = useRoute();

const requirement = ref();
const flag = ref(true);
const isUpload = ref(false);
const isUpload2 = ref(false);

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

const op = ["不符合", "符合"]

const single = ref([]);
const multi = ref([]);
let detailName = ref();
let testName = ref();
let testName2 = ref();

const uploadData = reactive({
  policy: "",
  signature: "",
  key: "",
  OSSAccessKeyId: "",
  url:"",
});

const uploadPhotoDetail = reactive({
  entrustmentDetailId: "",
  testItemsId:"",
  names:[],
});

const getURLdata = {
    entrustmentDetailId: "",
    testItemsId: "",
}

onMounted(() => {
    const callBack = getDetectionDetail(route.query);
    callBack.then((response) => {
        
        detailName.value = response.data.data[0].testItemsName;
        const content  = response.data.data[0];
        content.children.forEach(element => {
            if(element.children.length == 0){
                single.value.push(element);
                testName = element.testItemsName;
                fileSizeSingle.value = element.pics.length;
            }else{
                multi.value.push(element);
                testName2 = element.testItemsName;
                fileSizeMulti.value = element.pics.length;
            }  
        })
    });    
});

const saveResult = reactive([]);
const dialogVisible_success = ref(false);
const dialogVisible_photo = ref(false);
const dialogVisible_photoDelete = ref(false);
const dialogVisible_cannotPreview = ref(false)
const dialogVisiblePic = ref(false);
const dialogVisible_already = ref(false);
const dialogImageUrl = ref('');

const editDetail = () => {
  flag.value = false;
};

const cancelBtn = () => {
    flag.value = true;
    router.go(0);
}

const goBackPage = () => {
  router.go(-1);
};


const content = ref();

const saveDetail = () => {
    if(single.value.length != 0){
        const data = {isFit:  single.value[0].isFit >= 0 ? single.value[0].isFit : single.value[0].detectionDetails.isFit, 
                detectionResult: single.value[0].detectionResult ? single.value[0].detectionResult : single.value[0].detectionDetails.detectionResult, 
                entrustmentDetailId: single.value[0].entrustmentDetailId,
                testItemsId: single.value[0].testItemsId,}
        saveResult.push(data);
    }

    multi.value[0].children.forEach(element => {
      const data = {isFit: element.isFit >= 0  ? element.isFit : element.detectionDetails.isFit, 
        detectionResult: element.detectionResult ? element.detectionResult : element.detectionDetails.detectionResult, 
        entrustmentDetailId: element.entrustmentDetailId,
        testItemsId: element.testItemsId,}
      saveResult.push(data);
    })

    const response = saveDetectionDetails(saveResult);

    response.then((r) => {
        if(r.data.code == 200){
            dialogVisible_success.value = true;
        }else if(r.data.resultCode == 60003){
            dialogVisible_already.value = true;
        }
    }) 
    
};

const uploadClick = (param, num) => {
  if(num == 1){
    isUpload.value = true;
    getURLdata.entrustmentDetailId = param[0].entrustmentDetailId;
    getURLdata.testItemsId = param[0].testItemsId;  
    uploadPhotoDetail.entrustmentDetailId = param[0].entrustmentDetailId;
    uploadPhotoDetail.testItemsId = param[0].testItemsId;  
  }else{
    isUpload2.value = true;
    getURLdata.entrustmentDetailId = param[0].entrustmentDetailId;
    getURLdata.testItemsId = param[0].testItemsId;
    uploadPhotoDetail.entrustmentDetailId = param[0].entrustmentDetailId;
    uploadPhotoDetail.testItemsId = param[0].testItemsId;  
  }
}

const handleClick = () => {
  dialogVisible_success.value = false;
  dialogVisible_photo.value = false;
  dialogVisible_photoDelete.value = false;
  dialogVisible_already.value = false;
  router.go(0);
}


const fileList = ref([]);
const fileSizeSingle = ref(0);
const fileSizeMulti = ref(0);

const uploadFile = (param) => {
    let types = ['image/jpeg', 'image/jpg', 'image/png'];
    let size = param.size / 1024 / 1024;
    let name = "";
    if(param.type == "image/jpeg"){
      name = param.name.substring(0,(param.name.length-5)) + param.uid +
        param.name.substring((param.name.length-5))
    }else{
      name = param.name.substring(0,(param.name.length-4))   + param.uid +
        param.name.substring((param.name.length-4))
    }
    const isImage = types.includes(param.type)
    if(!isImage){
      ElMessage({
      message: '上传的图片只能是JPG，JPEG，PNG格式',
      type: "warning"
      })
      return false;
    }else if(size > 0.5){
      ElMessage({
        message: '上传的图片大小不能超过 500 kb',
        type: "error"
      })
      return false;
    }else{
      return new Promise((resolve, reject) => {
      const getURL = getUploadPathUrl(getURLdata);
      getURL.then((response) => {
        uploadData.policy = response.data.data.policy;
        uploadData.signature = response.data.data.signature;
        uploadData.key = response.data.data.path + "/" + name;
        uploadData.OSSAccessKeyId = response.data.data.accessKey;
        uploadData.url = response.data.data.url;
        fileList.value.push(name)
        resolve(true);
        });
      });
    }
}

const uploadPhoto = () => {  
  uploadPhotoDetail.names = fileList.value;

  if(uploadPhotoDetail.names.length > 0){
    const data = saveFileFullPath(uploadPhotoDetail);
    data.then((r) =>{
      if(r.data.code == 200){
        dialogVisible_photo.value = true;
      }
    })
  }
}


const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  
    let file = reactive({id:""});
    file.id = uploadFile.id;
    let data = delFile(file);
    data.then( (r) => {
      if(r.data.code == 200){
          dialogVisible_photoDelete.value = true;
      }
    })
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  
    let p = reactive({path:[]});
    p.path.push(uploadFile.path) ;
    if(p.path[0] == null){
      dialogVisible_cannotPreview.value = true;
    }else{
      let data = getAccessUrl(p);
      data.then((r) => {
          dialogImageUrl.value = r.data.data[0].url
          dialogVisiblePic.value = true
      })
    } 
}

let imgwidth= ref();
let boxWidth= ref();
const onLoadImg = (e) => {
  const img = e.target
  if (img.fileSize > 0 || (img.width > 1 && img.height > 1)) {
    imgwidth.value = img.width + 32
    boxWidth.value = img.width
  }
}
</script>

<template>
    <div>
    <h2>检测详情 : </h2>
    <h3 class="titleSize"> {{detailName}} </h3>
    <el-divider />

    <div class="titleSize" v-if="single.length!=0">{{ testName }}: 
    
        <el-table :data="single" border class="dataTable">
            <el-table-column prop="testItemsName" label="检测参数" align="center"></el-table-column>

            <el-table-column prop="detectionResult" label="检测结果" v-if="flag" align="center">
                <template #default="scope">
                    {{ scope.row.detectionDetails ? scope.row.detectionDetails.detectionResult : "--" }}
                </template>
            </el-table-column>

            <el-table-column prop="detectionResult" label="检测结果" v-if="!flag" align="center">
                <template #default="scope">
                        
                  <el-input v-model="scope.row.detectionDetails.detectionResult"
                    v-if="scope.row.detectionDetails != null"
                    clearable />  
                    
                  <el-input v-model="scope.row.detectionResult" v-else placeholder="请输入检测结果"/>
                </template>
            </el-table-column>

            <el-table-column prop="detectionResult" label="是否符合要求" v-if="flag" align="center">
                <template #default="scope">
                    {{ scope.row.detectionDetails ? op[scope.row.detectionDetails.isFit] : "--"  }}
                </template>
            </el-table-column>

            <el-table-column prop="isFit" label="是否符合要求" align="center" v-if="!flag">
                <template #default="scope">
                  <el-select v-if="scope.row.detectionDetails != null" v-model="scope.row.detectionDetails.isFit">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>

                  <el-select v-else v-model="scope.row.isFit" placeholder="--请选择--">
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
    </div>

    <div class="titleSize2">现场图片:
        <el-button type="primary" @click="uploadClick(single, 1)" v-if="!isUpload && fileSizeSingle==0" class="addPhoto">上传现场图片</el-button>
        <el-button type="primary" @click="uploadPhoto()" v-if="isUpload || fileSizeSingle>0" class="addPhoto">保存现场照片</el-button>
    </div>

    <el-upload
        multiple
        drag
        class="dragBox"
        accept=".jpg,.jpeg,.png"
        :show-file-list="true"
        :file-list="single[0].pics"
        :before-upload="uploadFile"
        :data="uploadData"
        :action="uploadData.url"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        v-if="isUpload || fileSizeSingle > 0"
        >
        <div class="el-upload__text">
            拖拽文件至此 或 <em>点击上传</em>
        </div> 
    </el-upload>

    
  <el-divider />
    
    <div class="titleSize2" v-for="(item, index) in multi">
        <div class="titleSize" > {{ testName2 }}: </div>
        <el-table :data="item.children" border class="dataTable">
            <el-table-column prop="testItemsName" label="检测参数" align="center"></el-table-column>

            <el-table-column prop="detectionResult" label="检测结果" v-if="flag" align="center">
                <template #default="scope">
                    {{ scope.row.detectionDetails ? scope.row.detectionDetails.detectionResult : "--" }}
                </template>
            </el-table-column>

            <el-table-column prop="detectionResult" label="检测结果" v-if="!flag" align="center">
                <template #default="scope">
                    <el-input v-model="scope.row.detectionDetails.detectionResult"
                      v-if="scope.row.detectionDetails != null"
                      clearable />  
                      
                    <el-input v-model="scope.row.detectionResult" v-else placeholder="请输入检测结果"/>
                </template>
            </el-table-column>

            <el-table-column prop="detectionResult" label="是否符合要求" v-if="flag" align="center">
                <template #default="scope">
                    {{ scope.row.detectionDetails ? op[scope.row.detectionDetails.isFit] : "--"  }}
                </template>
            </el-table-column>

            <el-table-column prop="isFit" label="是否符合要求" align="center" v-if="!flag">
                <template #default="scope">
                  <el-select v-if="scope.row.detectionDetails != null" v-model="scope.row.detectionDetails.isFit">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>

                  <el-select v-else v-model="scope.row.isFit" placeholder="--请选择--">
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
    </div>

    <div class="titleSize2">现场图片:
        <el-button type="primary" @click="uploadClick(multi, 2)" v-if="!isUpload2 && fileSizeMulti==0" class="addPhoto">上传现场图片</el-button>
        <el-button type="primary" @click="uploadPhoto()" v-if="isUpload2 || fileSizeMulti>0" class="addPhoto">保存现场照片</el-button>
    </div>

    <el-upload
        multiple
        drag
        class="dragBox"
        accept=".jpg,.jpeg,.png"
        :show-file-list="true"
        :file-list="multi[0].pics"
        :before-upload="uploadFile"
        :data="uploadData"
        :action="uploadData.url"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        v-if="isUpload2 || fileSizeMulti> 0"
        >
        <div class="el-upload__text">
            拖拽文件至此 或 <em>点击上传</em>
        </div> 
    </el-upload>

    <el-button  @click="editDetail()" class="editBtn" v-if="flag"> 编辑 </el-button>

    <el-button  @click="cancelBtn()" class="editBtn" v-if="!flag"> 取消 </el-button>

    <el-button v-if="!flag"  @click="saveDetail()" class="goBackBtn"> 保存 </el-button>

    <el-button v-if="flag" type="info" @click="goBackPage()" class="goBackBtn"> 返回 </el-button>
  
  </div>

  <!-- 检测详情保存成功-->
  <el-dialog v-model="dialogVisible_success" title="保存成功" width="30%">
    <span>该分项检测详情保存成功！</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleClick()"
          >确认</el-button>
      </span>
    </template>
  </el-dialog>

    <!-- 上传照片预览  -->
  <el-dialog v-model="dialogVisiblePic" :width="imgwidth" >
    <img w-full :src="dialogImageUrl"  @load="onLoadImg" :width="boxWidth"/>
  </el-dialog>

    <!-- 现场照片保存成功-->
  <el-dialog v-model="dialogVisible_photo" title="保存成功" width="30%">
    <span>现场照片保存成功！</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleClick()">确认</el-button>
      </span>
    </template>
  </el-dialog>

   <!-- 现场照片删除成功-->
  <el-dialog v-model="dialogVisible_photoDelete" title="删除成功" width="30%">
    <span>现场照片成功删除！</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleClick()">确认</el-button>
      </span>
    </template>
  </el-dialog>

    <!-- 无法预览照片 -->
    <el-dialog v-model="dialogVisible_cannotPreview" title="无法预览" width="30%">
        <span>预览前请先保存现场照片！</span>
        <template #footer>
        <span class="dialog-footer">
            <el-button type="primary" @click="dialogVisible_cannotPreview=false">确认</el-button>
        </span>
        </template>
    </el-dialog>

    <!-- 委托已批准,无法编辑弹窗-->
    <el-dialog v-model="dialogVisible_already" title="无法编辑" width="30%">
        <span>该委托已被批准，无法进行编辑操作！</span>
        <template #footer>
        <span class="dialog-footer">
            <el-button type="primary" @click="handleClick()"
            >确认</el-button>
        </span>
        </template>
    </el-dialog>

</template>


<style scoped>

.dataTable {
    font-size: 15px;
    width: 100%;
    margin-top: 40px;
}

.dataTable2{
    font-size: 15px;
    width: 100%;
    margin-top: 32px;
}

.titleSize{
    margin-top: 32px;
}

.titleSize2{
    margin-top: 32px;
}


.editBtn {
  margin-top: 80px;
  margin-left: 39%;
}

.goBackBtn {
  margin-top: 80px;
  margin-left: 300px;
}

.dragBox{
    margin-top: 24px;
    width: 400px;
}

.addPhoto {
  margin-left: 24px;
  margin-top: -1px;
}

.titleSize {
  font-size: 18px;
  margin-top: 25px;
}

</style>
