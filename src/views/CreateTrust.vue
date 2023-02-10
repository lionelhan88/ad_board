<template>
  <div>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
    >
      <el-row>
        <el-col :span="18">
          <el-form-item label="委托编号 :" style="width: 3.88rem">
            <el-input
              v-model="entrustNum"
              placeholder="完成表单后，系统自动生成"
              disabled
            />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-button
            type="primary"
            @click="searchFacility()"
            style="margin-left: 1.25rem"
            >选择设施</el-button
          >
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="设施编号:" prop="facilityId" style="width: 3.88rem">
            <el-input
              v-model="ruleForm.facilityId"
              disabled
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="设施名称:" prop="facilityName" style="width: 3.88rem">
            <el-input
              v-model="ruleForm.facilityName"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="行政区域:" prop="areaName" style="width: 3.88rem">
            <el-input
              v-model="ruleForm.areaName"
              disabled
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="店铺名称:" prop="shopName" style="width: 3.88rem">
            <el-input
              v-model="ruleForm.shopName"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="设施地点:" prop="detailedAddress" style="width: 3.88rem">
            <el-input
              v-model="ruleForm.detailedAddress"
              disabled
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="施工单位 :" prop="constructionCopmany" style="width: 3.88rem">
            <el-input
              v-model="ruleForm.constructionCopmany"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item
            label="委托日期 :"
            prop="entrustmentInfoVo.entrustmentDate"
            style="width: 3.88rem"
          >
            <el-config-provider :locale="locale" >
              <el-date-picker
                v-model="ruleForm.entrustmentInfoVo.entrustmentDate"
                type="date"
                placeholder="点击图标选择日期"
                clearable="true"
                :disabledDate="disabledDate"
                style="width: 625px"
              >
              </el-date-picker>
            </el-config-provider>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="检测日期 :" style="width: 3.88rem" prop="dateValue">
            <el-date-picker
              v-model="ruleForm.dateValue"
              type="daterange"
              range-separator="至"
              start-placeholder="检测开始日期"
              end-placeholder="检测结束日期"
              value-format="YYYY-MM-DD"
              :disabled-Date="disabledDate"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item
            label="检测类型 :"
            prop="entrustmentInfoVo.detectionType"
            style="width: 3.88rem"
          >
            <el-select
              v-model="ruleForm.entrustmentInfoVo.detectionType"
              clearable
              placeholder="--请选择--"
              style="width: 625px"
            >
              <el-option
                v-for="item in detectionType_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="设施类型 :" prop="facilityType" style="width: 3.88rem">
            <el-select
              v-model="ruleForm.facilityType"
              clearable="true"
              placeholder="--请选择--"
              style="width: 625px"
            >
              <el-option
                v-for="item in eqp_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="检测面积(㎡) :" prop="area" style="width: 3.88rem">
            <el-input
              v-model.number="ruleForm.area"
              placeholder="请输入检测面积"
              @input="valueChange(ruleForm.area)" 
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="牌面底标高(m):" prop="height" style="width: 3.88rem">
            <el-input
              v-model.number="ruleForm.height"
              placeholder="请输入牌面高度"
              @input="valueChange(ruleForm.height)"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="委托单位 :" prop="entrustmentInfoVo.client" style="width: 3.88rem">
            <el-input
              v-model="ruleForm.entrustmentInfoVo.client"
              placeholder="请输入委托单位名称"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="监理单位 :" prop="supervisionCompany" style="width: 3.88rem">
            <el-input
              v-model="ruleForm.supervisionCompany"
              placeholder="请输入监理单位名称"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="设计单位 :" prop="designCompany" style="width: 3.88rem">
            <el-input
              v-model="ruleForm.designCompany"
              placeholder="请输入设计单位名称"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="检测方法 :" prop="testMethodsId" >
            <el-tree
              ref="treeRef"
              :data="initOption"
              show-checkbox
              default-expand-all
              node-key="name"
              highlight-current
              check-on-click-node
              class="tree"
              :props="defaultProps"
           
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!--提交按钮-->
      <el-button
        class="submitBtn"
        type="primary"
        @click="submitForm(ruleFormRef)"
        >创建委托</el-button
      >
      <!--页面重置按钮-->
      <el-button class="resetBtn" @click="resetForm(ruleFormRef)"
        >重置页面</el-button
      >

      <el-button class="selectAll" round v-if="flag" @click="chooseAll()">全选</el-button>
      <el-button class="selectAll" round v-if="!flag" @click="cancelAll()">取消</el-button>
    </el-form>
  </div>

  <!-- 创建成功弹窗-->
  <el-dialog v-model="dialogVisible" title="创建成功" width="30%">
    <span>委托创建成功，您的委托编号为：{{ entrustNum }}</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleConfirm(ruleFormRef)"
          >确认</el-button
        >
        <el-button @click="dialogVisible = false">取消</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 检测方法不能为空弹窗-->
  <el-dialog v-model="dialogVisible_testMethodId" title="无法创建" width="30%">
    <span>无法创建委托，检测方法不能为空</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="dialogVisible_testMethodId=false"
          >确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, getCurrentInstance, onMounted } from "vue";
import type {
  FormInstance,
  FormRules,
  ElTree,
  ElMessageBox,
} from "element-plus";
import type Node from "element-plus/es/components/tree/src/model/node";
import { useRouter, useRoute } from "vue-router";
import { storage } from "../utils/storage";
import { getFacilities, createEntrust, getAllMethods } from "../api/apiRequest";

const router = useRouter();
const route = useRoute();

const formSize = ref("default");
const ruleFormRef = ref<FormInstance>();
const dialogVisible = ref(false);
const dialogVisible_testMethodId = ref(false);
const detectionType = ref();
const facilityType = ref("");
const testMethodsId = ref([]);
const flag = ref(true);

const startDate = ref("");
const endDate = ref("");
let isIndeterminate = "false";

let entrustNum = ref();
let entrustCallBack = ref();

interface Tree {
  id: number;
  label: string;
}
const treeRef = ref<InstanceType<typeof ElTree>>();

const defaultProps = {
  id: "id",
  label: "name",
};

const ruleForm = reactive({
  detectionStartTime: "",
  detectionEndTime: "",
  areaName: "",
  facilityType: "",
  designCompany: "",
  supervisionCompany: "",
  height: "",
  area: "",
  dateValue:"",
  testMethodsId: [],
  facilityNo: "",
  facilityName: "",
  facilityCategory: "",
  facilityId: "",
  constructionCopmany: "",
  detailedAddress: "",
  shopName: "",
  shopId: "",
  address: "",
  entrustmentInfoVo: {
    client: "",
    detectionType: "",
    entrustmentNo: "",
    entrustmentDate: "",
  },
  facilityStructureType: "",
  facilityPosition: "",
  facilityPics: "",
});

const initOption = ref([]);
const callBack = ref("");
const tree = ref([]);
let defaultTree = [];

onMounted(() => {
  if (route.query != null) {
    ruleForm.shopId = route.query.shopId;
    ruleForm.facilityId = route.query.id;
    ruleForm.facilityNo = route.query.id;
    ruleForm.areaName = route.query.areaName;
    ruleForm.detailedAddress = route.query.address;
    ruleForm.constructionCopmany = route.query.constructionUnitName;
    ruleForm.facilityName = route.query.signName;
    ruleForm.shopName = route.query.name;
    ruleForm.facilityStructureType = route.query.facilityStructureType;
    ruleForm.facilityPosition = route.query.facilityPosition;
    ruleForm.facilityPics = route.query.facilityPics;
  }
  callBack.value = getAllMethods();
  callBack.value.then((response) => {
    initOption.value = response.data.data;
    tree.value = response.data.data;
    
    initOption.value.forEach(element => {
      defaultTree.push(element.id);
    })
  });
});

//======================================== 网络请求 ================================================
const currentInstance = getCurrentInstance();
const { $axios } = currentInstance.appContext.config.globalProperties;

const searchFacility = () => {
  router.push({
    name: "selectShop",
    query: {
      from: "CreateTrust",
    },
  });
};

const getCheckedNodes = () => {
  const nodes = treeRef.value!.getCheckedNodes(false, false);
  const aList = [];
  nodes.forEach((element) => {
    aList.push(element.id);
  });
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      const methods = treeRef.value!.getCheckedNodes(false, false);
      methods.forEach((element) => {
        ruleForm.testMethodsId.push(element.id);
      });

      
      if(ruleForm.dateValue != ""){
        ruleForm.detectionStartTime = dateFormat(ruleForm.dateValue[0]);
        ruleForm.detectionEndTime = dateFormat(ruleForm.dateValue[1]);
      }

      ruleForm.entrustmentInfoVo.entrustmentDate = 
        dateFormat(ruleForm.entrustmentInfoVo.entrustmentDate);
      if(ruleForm.testMethodsId.length == 0){
        dialogVisible_testMethodId.value = true;
      }else{
        const data = createEntrust(ruleForm); 
      
        data.then((response) => {
          if(response.data.code == 200){
            entrustNum.value = response.data.data.entrustmentInfoVo.entrustmentNo;
            dialogVisible.value = true;
            ruleForm.entrustmentInfoVo.entrustmentNo = response.data.data.entrustmentInfoVo.entrustmentNo;
          }
        })
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};


//======================================== 点击事件 ================================================

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  treeRef.value!.setCheckedKeys([], false)
  router.push({ name: "home" });
};

const handleConfirm = (formEl: FormInstance | undefined) => {
  dialogVisible.value = false;
  formEl.resetFields();
  ruleForm.shopId = "";
  ruleForm.facilityId = "";
  ruleForm.facilityNo = "";
  ruleForm.areaName = "";
  ruleForm.detailedAddress = "";
  ruleForm.constructionCopmany = "";
  ruleForm.facilityName = "";
  ruleForm.shopName = "";
  entrustNum.value = "";
  ruleForm.testMethodsId = "";
  router.push({ name: "home" });
};

const chooseAll = () => {
  flag.value = false;
  treeRef.value!.setCheckedNodes(initOption.value as Node[], true)
}

const cancelAll = () => {
  flag.value = true;
  treeRef.value!.setCheckedKeys([], false)
}

//======================================== 日期规则 ================================================


const disabledDate = (time: Date) => {
  return time.getTime() + 3600 * 1000 * 24 < Date.now();
};

const dateFormat = (time : Date) => {
  var data = new Date(time);

  var y = data.getFullYear();

  var m = data.getMonth()+1;

  var d = data.getDate();

  var hours = data.getHours() < 10 ? '0' + data.getHours() : data.getHours();

  if(hours == 8){
    hours = hours - 8;
  }

  var min = data.getMinutes() < 10 ? '0' + data.getMinutes() : data.getMinutes();

  var sec = data.getSeconds() < 10 ? '0' + data.getSeconds() : data.getSeconds();

  return `${y}-${m}-${d} ${hours}:${min}:${sec}`
}

const valueChange = (value) =>{
  return value
        .replace(/[^\d.]/g, "")
        .replace(/\.{2,}/g, ".")
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".")
        .replace(/^\./g, "");
}

//======================================== 表单规则 ================================================

const rules = reactive<FormRules>({
  detectionStartTime: [
    {
      required: true,
      message: "请选择检测开始日期",
      trigger: "blur",
    },
  ],
  detectionEndTime: [
    {
      required: true,
      message: "请选择检测结束日期",
      trigger: "blur",
    },
  ],
  orgnization: [
    {
      required: true,
      message: "请选择检测类型",
      trigger: "blur",
    },
  ],
  facilityType: [
    {
      required: true,
      message: "请选择设施类型",
      trigger: "blur",
    },
  ],

  designCompany: [
    {
      required: true,
      message: "请输入正确的设计单位名称",
      trigger: "blur",
    },
  ],
  supervisionCompany: [
    {
      required: true,
      message: "请输入正确的监理单位名称",
      trigger: "blur",
    },
  ],
  height: [
    {
      required: true,
      type: "number",
      message: "请输入正确的牌面底高度",
      trigger: "blur",
    },
  ],
  area: [
    {
      required: true,
      type: "number",
      message: "请输入正确的检测面积",
      trigger: "blur",
    },
  ],

  disabledItem: [
    {
      required: false,
      message: "请选择设施",
      trigger: "blur",
    },
  ],

  entrustmentInfoVo: {
    client: [
      { required: true, message: "请输入正确的委托单位", trigger: "blur" },
    ],

    detectionType: [
      { required: true, message: "请选择检测类型", trigger: "blur" },
    ],

    entrustmentDate: [
      { required: true, message: "请选择委托日期", trigger: "blur" },
    ],
  },

  dateValue:{
    required: true,
    message: "请选择检测开始和结束日期",
    trigger: "blur",
  }
});

//======================================== 各类选项 ================================================

const detectionType_options = [
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
    value: 5,
    label: "其他委托",
  },
];

const eqp_options = [
  {
    value: 1,
    label: "户外招牌",
  },
  {
    value: 2,
    label: "户外广告",
  },
];
</script>

<style scoped lang="scss">
.tree {
  overflow-y: scroll;
  overflow-x: hidden;
  width: 1rem;
  height: 280px;
}

.el-tree {
  min-width: 95%;
  display: inline-block !important;
}

.submitBtn {
  position: absolute;
  left: 40%;
  align-items: center;
  justify-content: center;
  margin-top: 32px;
}

.resetBtn {
  position: absolute;
  left: 64%;
  align-items: center;
  justify-content: center;
  margin-top: 32px;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}

.selectAll{
  position: relative;
  margin-top: -520px;
  margin-left: 45px;
  height: 25px;
}
</style>

