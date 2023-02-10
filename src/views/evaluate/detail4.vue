<script lang="ts" setup>
import { ref, onMounted, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from 'element-plus'
import { getDetectionDetail, saveDetectionDetails, getUploadPathUrl, saveFileFullPath, delFile, getAccessUrl } from "../../api/apiRequest";

const router = useRouter();
const route = useRoute();
const flag = ref(true);
const saveResult = reactive([]);
const isUpload = ref(false);
const fileSize = ref(0);
const fileList = ref([]);
let imgwidth= ref();
let boxWidth= ref();

const dialogVisible_success = ref(false);
const dialogVisible_photo = ref(false);
const dialogVisible_photoDelete = ref(false);
const dialogVisible_cannotPreview = ref(false);
const dialogVisiblePic = ref(false);
const dialogVisible_already = ref(false);
const dialogImageUrl = ref('');

// 预览detail4 & detail1

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

const content = ref([])

const uploadData = reactive({
  policy: "",
  signature: "",
  key: "",
  OSSAccessKeyId: "",
  url:"",
});

const getURLdata = {
    entrustmentDetailId: "",
    testItemsId: "",
}

const uploadPhotoDetail = reactive({
  entrustmentDetailId: "",
  testItemsId:"",
  names:[],
});


onMounted(() =>{
    const callBack = getDetectionDetail(route.query);
    callBack.then(response =>{
        content.value = response.data.data[0]
        uploadPhotoDetail.entrustmentDetailId = content.value.entrustmentDetailId;
        uploadPhotoDetail.testItemsId = content.value.testItemsId;
        getURLdata.entrustmentDetailId = content.value.entrustmentDetailId;
        getURLdata.testItemsId = content.value.testItemsId;
        fileSize.value = content.value.pics.length;
    })

})


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

    content.value.children.forEach( element => {
        const data = {isFit: element.isFit>=0 ? element.isFit : element.detectionDetails.isFit , 
               calculationResult: element.calculationResult ? element.calculationResult: element.detectionDetails.calculationResult, 
               unit: element.unit ? element.unit : element.detectionDetails.unit,
               specificationLimit: element.specificationLimit ? element.specificationLimit : element.detectionDetails.specificationLimit,
               entrustmentDetailId: element.entrustmentDetailId, testItemsId: element.testItemsId,};
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

const handleClick = () => {
    dialogVisible_success.value = false;
    dialogVisible_photo.value = false;
    dialogVisible_photoDelete.value = false;
    dialogVisible_already.value = false;
    router.go(0);
}


//======================================== 图片上传 ================================================
const uploadFile = (param) => {
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
};

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
        <h2>检测详情</h2>
        <h3 class="titleSize">{{ content.testItemsName }}:</h3>
        <el-divider />


        <el-table :data="content.children" border class="dataTable">
            <el-table-column
                prop="testItemsName"
                label="检测参数"
                align="center"
            ></el-table-column>

            <el-table-column
                prop="calculationResult"
                label="计算结果"
                v-if="flag"
                align="center"
            >
                <template #default="scope">
                {{  
                    scope.row.detectionDetails ? scope.row.detectionDetails.calculationResult 
                    : "--"
                }}
                </template>
            </el-table-column>

            <el-table-column
                prop="calculationResult"
                label="计算结果"
                v-if="!flag"
                align="center"
            >
                <template #default="scope">
                    <el-input v-model="scope.row.detectionDetails.calculationResult"
                        v-if="scope.row.detectionDetails != null"
                        clearable />  
                    <el-input v-model="scope.row.calculationResult" v-else placeholder="请输入计算结果"/>
                
                </template>
            </el-table-column>

            <el-table-column
                prop="unit"
                label="单位"
                v-if="flag"
                align="center"
            >
                <template #default="scope">
                {{
                    scope.row.detectionDetails
                    ? scope.row.detectionDetails.unit
                    : "--"
                }}
                </template>
            </el-table-column>

            <el-table-column
                prop="unit"
                label="单位"
                v-if="!flag"
                align="center"
            >
                <template #default="scope">
                    
                    <el-input v-model="scope.row.detectionDetails.unit"
                        v-if="scope.row.detectionDetails != null"
                        clearable />  
                    <el-input v-model="scope.row.unit" v-else placeholder="请输入单位"/>
                </template>
            </el-table-column>

            <el-table-column
                prop="specificationLimit"
                label="规范限值"
                v-if="flag"
                align="center"
            >
                <template #default="scope">
                {{
                    scope.row.detectionDetails
                    ? scope.row.detectionDetails.specificationLimit
                    : "--"
                }}
                </template>
            </el-table-column>

            <el-table-column
                prop="specificationLimit"
                label="规范限值"
                v-if="!flag"
                align="center"
            >
                <template #default="scope">
                    <el-input v-model="scope.row.detectionDetails.specificationLimit"
                        v-if="scope.row.detectionDetails != null"
                        clearable />  
                    <el-input v-model="scope.row.specificationLimit" v-else placeholder="请输入规范限值"/>
                </template>
            </el-table-column>

            <el-table-column
                prop="isFit"
                label="是否符合要求"
                v-if="flag"
                align="center"
            >
                <template #default="scope">
                {{
                    scope.row.detectionDetails
                    ? op[scope.row.detectionDetails.isFit]
                    : "--"
                }}
                </template>
            </el-table-column>

            <el-table-column
                prop="isFit"
                label="是否符合要求"
                align="center"
                v-if="!flag"
            >
                <template #default="scope">
                    <el-select v-if="scope.row.detectionDetails != null" v-model="scope.row.detectionDetails.isFit" placeholder="--请选择--">
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

        <div class="titleSize2">
            计算模型照片:
            <el-button type="primary" @click="isUpload = true" class="addPhoto" v-if="!isUpload && fileSize ==0 ">选择需要上传的照片</el-button>
            <el-button type="primary" @click="uploadPhoto()" v-if="isUpload || fileSize>0" class="addPhoto">保存上传的照片</el-button>
        </div>

        <el-upload
            multiple
            drag
            accept=".jpg,.jpeg,.png"
            :show-file-list="true"
            :file-list="content.pics"
            class="dragBox"
            :before-upload="uploadFile"
            :data="uploadData"
            :action="uploadData.url"
            :on-remove="handleRemove"
            :on-preview="handlePictureCardPreview"
            v-if="isUpload || fileSize > 0"
            >
            <div class="el-upload__text">拖拽文件至此 或 <em>点击上传</em></div>
        </el-upload>



        <el-button  @click="editDetail()" class="editBtn" v-if="flag">
        编辑
        </el-button>

        <el-button  @click="cancelBtn()" class="editBtn" v-if="!flag">
        取消
        </el-button>

        <el-button v-if="!flag" @click="saveDetail()" class="goBackBtn"> 保存 </el-button>

        <el-button v-if="flag" type="info" @click="goBackPage()" class="goBackBtn">
        返回
        </el-button>

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
        <el-dialog v-model="dialogVisible_photo" title="上传成功" width="30%">
            <span>照片上传成功！</span>
            <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="handleClick()">确认</el-button>
            </span>
            </template>
        </el-dialog>

         <!-- 现场照片删除成功-->
        <el-dialog v-model="dialogVisible_photoDelete" title="删除成功" width="30%">
            <span>照片成功删除！</span>
            <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="handleClick()">确认</el-button>
            </span>
            </template>
        </el-dialog>

        <!-- 无法预览照片 -->
        <el-dialog v-model="dialogVisible_cannotPreview" title="无法预览" width="30%">
            <span>预览前请先保存照片！</span>
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

.editBtn {
  margin-top: 80px;
  margin-left: 39%;
}

.goBackBtn {
  margin-top: 80px;
  margin-left: 300px;
}


.titleSize2 {
  font-size: 18px;
  margin-top: 50px;
}

.addPhoto {
  margin-left: 24px;
}

.dragBox {
  margin-top: 24px;
  width: 400px;
}

</style>