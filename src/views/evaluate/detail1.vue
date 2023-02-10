<script lang="ts" setup>
import { ref, onMounted, reactive, onChange } from "vue";
import { useRouter, useRoute } from "vue-router";
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getDetectionDetail, saveDetectionDetails, getUploadPathUrl, saveFileFullPath, delFile, getAccessUrl } from "../../api/apiRequest";
const router = useRouter();

const requirement = ref();
const flag = ref(true);
const isUpload = ref(false);

const dialogVisible_success = ref(false);
const dialogVisible_photo = ref(false);
const dialogVisible_photoDelete = ref(false);
const dialogVisible_cannotPreview = ref(false);
const dialogVisiblePic = ref(false);
const dialogVisible_already = ref(false);
const dialogImageUrl = ref('');

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

const fileList = ref([]);
const fileSize = ref(0);

const getURLdata = {
    entrustmentDetailId: "",
    testItemsId: "",
}

const goBackPage = () => {
  router.go(-1);
};

onMounted(() => {
  console.log("fileelele ", fileList.value)
  const callBack = getDetectionDetail(router.currentRoute.value.query);
  callBack.then((response) => {
    console.log("something in onMounted", response.data.data[0]);
    content.value = response.data.data[0];
    uploadPhotoDetail.testItemsId = content.value.testItemsId;
    uploadPhotoDetail.entrustmentDetailId = content.value.entrustmentDetailId;
    getURLdata.entrustmentDetailId = content.value.entrustmentDetailId;
    getURLdata.testItemsId = content.value.testItemsId;
    fileSize.value = content.value.pics.length;
    
  });  
});

const saveResult = reactive([]);

const content = ref([]);

const uploadData = reactive({
  policy: "",
  signature: "",
  key: "",
  OSSAccessKeyId: "",
  url:"",
});



const uploadFile = (param) => {
  console.log("filelelelele ", param);
  let types = ['image/jpeg', 'image/jpg', 'image/png'];
  const isImage = types.includes(param.type)
  let size = param.size / 1024 / 1024;
  let name = "";
  if(param.type == "image/jpeg"){
    name = param.name.substring(0,(param.name.length-5)) + param.uid +
      param.name.substring((param.name.length-5))
  }else{
    name = param.name.substring(0,(param.name.length-4)) + param.uid +
      param.name.substring((param.name.length-4))
  }
  console.log("sizeeeee ", name);
  if(!isImage){
    ElMessage({
      message: '上传的图片只能是JPG，JPEG，PNG格式',
      type: "error"
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

        if(response.data.resultCode == 60003){
          dialogVisible_already.value = true;
        }else{
          console.log("get111");
          uploadData.policy = response.data.data.policy;
          uploadData.signature = response.data.data.signature;
          uploadData.key = response.data.data.path + "/" + name;
          uploadData.OSSAccessKeyId = response.data.data.accessKey;
          uploadData.url = response.data.data.url;
          fileList.value.push(name)
          resolve(true);
          console.log("上传之前文件信息；", uploadData);
        }
      });
    });
  } 
  
};

const saveDetail = () => {
  content.value.children.forEach(element => {
    console.log("1212312", element);
    const data = {isFit: element.isFit>=0 ? element.isFit : element.detectionDetails.isFit , 
                  detectionResult: element.detectionResult ? element.detectionResult : element.detectionDetails.detectionResult, 
                  entrustmentDetailId: element.entrustmentDetailId,
                  testItemsId: element.testItemsId,}
    saveResult.push(data);
  })

   console.log("saveRt ", saveResult)
  const response = saveDetectionDetails(saveResult);

  response.then((r) => {
    console.log("dasfasfdasdf " , r.data)
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

const editDetail = () => {
  flag.value = false;
  console.log("hjhiahfaihf ", flag.value);
};

const cancelBtn = () => {
    flag.value = true;
    router.go(0);
}

const handleChange = (value, scope) => {
  console.log("handleChanged ", scope.row)
}

const uploadPhotoDetail = reactive({
  entrustmentDetailId: "",
  testItemsId:"",
  names:[],
});

const uploadPhoto = () => {  
    uploadPhotoDetail.names = fileList.value;
    console.log("fdadfafsdasdfdasf " , uploadPhotoDetail.names.length)

    if(uploadPhotoDetail.names.length > 0){
      const data = saveFileFullPath(uploadPhotoDetail);
      data.then((r) =>{
        console.log(r.data);
        if(r.data.code == 200){
          dialogVisible_photo.value = true;
        }
      })
    }
}

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  
  let file = reactive({id:""});
  file.id = uploadFile.id;
  console.log("on-removeeeeee ", uploadFile, file)
  let data = delFile(file);
  data.then( (r) => {
    console.log("resultttt ", r)
    if(r.data.code == 200){
      dialogVisible_photoDelete.value = true;
    }else if(r.data.resultCode == 60003){
      dialogVisible_already.value = true;
    }
  })
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {

  let p = reactive({path:[]});
  p.path.push(uploadFile.path) ;
  console.log("pci revirewew ", p)

  if(p.path[0] == null){
      console.log("dfasdfasdfasdf ")
      dialogVisible_cannotPreview.value = true;
  }else{
      let data = getAccessUrl(p);
      data.then((r) => {
        console.log("RRRRR", r.data.data[0].url)
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
    console.log("onlogadddd ", imgwidth.value)
  }
}
</script>

<!-- -->

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
        prop="detectionResult"
        label="检测结果"
        v-if="flag"
        align="center"
      >
        <template #default="scope">
          {{
            scope.row.detectionDetails
              ? scope.row.detectionDetails.detectionResult
              : "--"
          }}
        </template>
      </el-table-column>

      <el-table-column
        prop="detectionResult"
        label="检测结果"
        v-if="!flag"
        align="center"
      >
     
        <template #default="scope">      
           <el-input v-model="scope.row.detectionDetails.detectionResult"
            v-if="scope.row.detectionDetails != null"
            clearable />  
          <el-input v-model="scope.row.detectionResult" v-else placeholder="请输入检测结果"/>
        </template>

        
      </el-table-column>

      <el-table-column
        prop="detectionResult"
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
          <el-select v-if="scope.row.detectionDetails != null" v-model="scope.row.detectionDetails.isFit" >
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
          <span>{{}}</span>
        </template>
        
      </el-table-column>
    </el-table>

    <div class="titleSize2">
      现场图片:
      <el-button type="primary" @click="isUpload = true" class="addPhoto" v-if="!isUpload && fileSize ==0 ">上传现场照片</el-button>
      <el-button type="primary" @click="uploadPhoto()" v-if="isUpload || fileSize>0" class="addPhoto">保存现场照片</el-button>
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

  </div>

  <!-- 上传照片预览  -->
  <el-dialog v-model="dialogVisiblePic" :width="imgwidth" >
    <img w-full :src="dialogImageUrl"  @load="onLoadImg" :width="boxWidth" />
  </el-dialog>

  <!-- 检测详情保存成功-->
  <el-dialog v-model="dialogVisible_success" title="保存成功" width="30%">
    <span>该分项检测详情保存成功！</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleClick()">确认</el-button>
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

  <!-- 委托已审核,无法编辑弹窗-->
  <el-dialog v-model="dialogVisible_already" title="无法编辑" width="30%">
    <span>该委托已完成审核，无法进行编辑操作！</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleClick()"
          >确认</el-button>
      </span>
    </template>
  </el-dialog>

</template>



<style scoped>
.titleSize {
  font-size: 18px;
  margin-top: 25px;
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

.editBtn {
  margin-top: 80px;
  margin-left: 39%;
}

.goBackBtn {
  margin-top: 80px;
  margin-left: 300px;
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
