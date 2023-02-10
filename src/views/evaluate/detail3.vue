<script lang="ts" setup>
import { ref, onMounted, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from 'element-plus'
import { getDetectionDetail, saveDetectionDetails, getUploadPathUrl, saveFileFullPath, delFile, getAccessUrl } from "../../api/apiRequest";

const router = useRouter();
const route = useRoute();
const single = ref([]);
const multi = ref([]);
const flag = ref(true);
const saveResult = reactive([]);

const dialogVisible_success = ref(false);
const dialogVisible_photo = ref(false);
const dialogVisible_photoDelete = ref(false);
const dialogVisiblePic = ref(false);
const dialogVisible_already = ref(false);
const dialogVisible_cannotPreview = ref(false);
const dialogImageUrl = ref('');

const isUpload = ref([false, false, false, false, false])
const fileList = ref([]);
const fileSize = ref([]);
const fileSizeSingle = ref([]);
let imgwidth= ref();
let boxWidth= ref();

let detailName = ref();
let testName = ref();

const op = ["不符合", "符合"]

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
        const content = response.data.data[0];
        content.children.forEach(element =>{
            let temp = (element.children.length == 0 ? true : false);
            if(temp ){
                fileSizeSingle.value.push(element.pics.length);
                single.value.push(element);
                testName = element.testItemsName;
            }else{
                fileSize.value.push(element.pics.length);
                multi.value.push(element)         
            }
        })   
    });    
});

//======================================== 按钮操作 ================================================
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

const saveDetail = () => {
    if(single.value.length != 0){
        const data = {isFit:  single.value[0].isFit>=0 ? single.value[0].isFit : single.value[0].detectionDetails.isFit, 
            detectionResult: single.value[0].detectionResult ? single.value[0].detectionResult : single.value[0].detectionDetails.detectionResult, 
            entrustmentDetailId: single.value[0].entrustmentDetailId,
            testItemsId: single.value[0].testItemsId,}
        saveResult.push(data);
    }

    multi.value.forEach(element => {
        element.children.forEach(ele =>{
            const data = {isFit: ele.isFit>=0 ? ele.isFit : ele.detectionDetails.isFit , 
               detectionResult: ele.detectionResult ? ele.detectionResult: ele.detectionDetails.detectionResult, 
               entrustmentDetailId: ele.entrustmentDetailId, testItemsId: ele.testItemsId,}
            saveResult.push(data);
        })
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

const aasd = ref([false, false, false])

const handleClick = () => {
    dialogVisible_success.value = false;
    dialogVisible_photo.value = false;
    dialogVisible_photoDelete.value = false;
    dialogVisible_already.value = false;
    router.go(0);
}

const uploadClick = (param, num) => {
    switch(num) {
        case 0:
            isUpload.value[num] = true;
            getURLdata.entrustmentDetailId = param[num].entrustmentDetailId;
            getURLdata.testItemsId = param[num].testItemsId;  
            uploadPhotoDetail.entrustmentDetailId = param[num].entrustmentDetailId;
            uploadPhotoDetail.testItemsId = param[num].testItemsId;  
            break;
        case 1:
            isUpload.value[num] = true;
            getURLdata.entrustmentDetailId = param[num].entrustmentDetailId;
            getURLdata.testItemsId = param[num].testItemsId;  
            uploadPhotoDetail.entrustmentDetailId = param[num].entrustmentDetailId;
            uploadPhotoDetail.testItemsId = param[num].testItemsId;  
            break;
        case 2:
            isUpload.value[num] = true;
            getURLdata.entrustmentDetailId = param[num].entrustmentDetailId;
            getURLdata.testItemsId = param[num].testItemsId;  
            uploadPhotoDetail.entrustmentDetailId = param[num].entrustmentDetailId;
            uploadPhotoDetail.testItemsId = param[num].testItemsId;  
            break; 
        case 3:
            getURLdata.entrustmentDetailId = param[num].entrustmentDetailId;
            getURLdata.testItemsId = param[num].testItemsId;  
            uploadPhotoDetail.entrustmentDetailId = param[num].entrustmentDetailId;
            uploadPhotoDetail.testItemsId = param[num].testItemsId; 
            isUpload.value[num] = true;
            break;  
        case 4:
            getURLdata.entrustmentDetailId = param[0].entrustmentDetailId;
            getURLdata.testItemsId = param[0].testItemsId;  
            uploadPhotoDetail.entrustmentDetailId = param[0].entrustmentDetailId;
            uploadPhotoDetail.testItemsId = param[0].testItemsId; 
            isUpload.value[num] = true;
            break; 
    }
} 


//======================================== 图片上传 ================================================
const uploadFile = (param, num, data) => {
    let types = ['image/jpeg', 'image/jpg', 'image/png'];
    let size = param.size / 1024 / 1024;
    const isImage = types.includes(param.type)
    let name = "";
    if(param.type == "image/jpeg"){
      name = param.name.substring(0,(param.name.length-5)) + param.uid +
        param.name.substring((param.name.length-5))
    }else{
      name = param.name.substring(0,(param.name.length-4)) + param.uid +
        param.name.substring((param.name.length-4))
    }
    if(!isImage){
        ElMessage({
        message: '上传的图片只能是 JPG，JPEG，PNG 格式',
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
            if(getURLdata.entrustmentDetailId=="" && getURLdata.testItemsId=="" && num == 4){
                getURLdata.entrustmentDetailId = data[0].entrustmentDetailId;
                getURLdata.testItemsId = data[0].testItemsId
                uploadPhotoDetail.entrustmentDetailId = data[0].entrustmentDetailId;
                uploadPhotoDetail.testItemsId = data[0].testItemsId  
            }else if(getURLdata.entrustmentDetailId=="" && getURLdata.testItemsId==""){
                getURLdata.entrustmentDetailId = data[num].entrustmentDetailId;
                getURLdata.testItemsId = data[num].testItemsId
                uploadPhotoDetail.entrustmentDetailId = data[num].entrustmentDetailId;
                uploadPhotoDetail.testItemsId = data[num].testItemsId  
            }
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

            <div class="titleSize3">现场图片:
                <el-button type="primary" @click="uploadClick(single, 4)" v-if="!isUpload[4] && fileSizeSingle==0" class="addPhoto">上传现场图片</el-button>
                <el-button type="primary" @click="uploadPhoto()" v-if="isUpload[4]   || fileSizeSingle>0" class="addPhoto">保存现场照片</el-button>
            </div>

            <el-upload
                multiple
                drag
                class="dragBox"
                accept=".jpg,.jpeg,.png"
                :show-file-list="true"
                :file-list="single[0].pics"
                :before-upload="(param) => uploadFile(param, 4, single)"
                :data="uploadData"
                :action="uploadData.url"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                v-if="isUpload[4] || fileSizeSingle > 0"
                >
                <div class="el-upload__text">
                    拖拽文件至此 或 <em>点击上传</em>
                </div> 
            </el-upload>

        </div>
        <el-divider v-if="single.length!=0"/>

        <div class= "titleSize2" v-for="(item, index) in multi">
            <span>
                {{ item.testItemsName }}: 
            </span>
        
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

            <div class="titleSize3">现场图片:
                <el-button type="primary" @click="uploadClick(multi, index)" 
                    v-if="!isUpload[index] && fileSize[index] == 0" class="addPhoto">上传现场图片
                </el-button>

                <el-button type="primary" @click="uploadPhoto()" 
                    v-if="isUpload[index] || fileSize[index] > 0"  class="addPhoto">保存现场照片
                </el-button>
            </div>

            <el-upload
      
                multiple
                drag
                class="dragBox"
                accept=".jpg,.jpeg,.png"
                :show-file-list="true"
                :file-list=multi[index].pics
                :before-upload="(param) => uploadFile(param, index, multi)"
                :data="uploadData"
                :action="uploadData.url"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                v-if="isUpload[index] || fileSize[index] > 0"
                >
                <div class="el-upload__text">
                    拖拽文件至此 或 <em>点击上传</em>
                </div> 
            </el-upload>

            

            <el-divider />
            
        </div>

        <el-button  @click="editDetail()" class="editBtn" v-if="flag"> 编辑 </el-button>

        <el-button  @click="cancelBtn()" class="editBtn" v-if="!flag"> 取消 </el-button>

        
        <el-button v-if="!flag" @click="saveDetail()" class="goBackBtn"> 保存 </el-button>

        <el-button v-if="flag" type="info" @click="goBackPage()" class="goBackBtn"> 返回 </el-button>

        

        <!-- 上传照片预览  -->
        <el-dialog v-model="dialogVisiblePic" :width="imgwidth" >
            <img w-full :src="dialogImageUrl"  @load="onLoadImg" :width="boxWidth"/>
        </el-dialog>


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

    </div>

    
</template>



<style scoped> 

.titleSize {
  font-size: 18px;
  margin-top: 25px;
}

.titleSize2 {
  font-size: 17px;
  margin-bottom: 20px;
}

.titleSize3{
    margin-top: 32px;
}

.dataTable{
    font-size: 15px;
    width: 100%;
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

</style>