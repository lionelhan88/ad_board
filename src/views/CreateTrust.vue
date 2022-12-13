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
          <el-form-item label="委托编号 :">
            <el-input
              v-model="entrustNum"
              placeholder="完成表单后，系统自动生成"
              disabled
              style="width: 625px"
            />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-button
            type="primary"
            @click="searchFacility()"
            style="margin-left: 250px"
            >选择设施</el-button
          >
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="设施编号:" prop="facilityId">
            <el-input
              v-model="ruleForm.facilityId"
              style="width: 625px"
              disabled
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="设施名称:" prop="facilityName">
            <el-input
              v-model="ruleForm.facilityName"
              style="width: 625px"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="行政区域:" prop="areaName">
            <el-input
              v-model="ruleForm.areaName"
              style="width: 625px"
              disabled
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="店铺名称:" prop="shopName">
            <el-input
              v-model="ruleForm.shopName"
              style="width: 625px"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="设施地点:" prop="detailedAddress">
            <el-input
              v-model="ruleForm.detailedAddress"
              style="width: 625px"
              disabled
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="施工单位 :" prop="constructionCopmany">
            <el-input
              v-model="ruleForm.constructionCopmany"
              disabled
              style="width: 625px"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item
            label="委托日期 :"
            prop="entrustmentInfoVo.entrustmentDate"
          >
            <el-config-provider :locale="locale">
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
          <el-form-item label="检测日期 :" style="width: 750px" prop="dateValue">
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
          <el-form-item label="设施类型 :" prop="facilityType">
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
          <el-form-item label="检测面积(㎡) :" prop="area">
            <el-input
              v-model.number="ruleForm.area"
              placeholder="请输入检测面积"
              style="width: 625px"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="牌面底标高(m):" prop="height">
            <el-input
              v-model.number="ruleForm.height"
              placeholder="请输入牌面高度"
              style="width: 625px"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="委托单位 :" prop="entrustmentInfoVo.client">
            <el-input
              v-model="ruleForm.entrustmentInfoVo.client"
              placeholder="请输入委托单位名称"
              style="width: 625px"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="监理单位 :" prop="supervisionCompany">
            <el-input
              v-model="ruleForm.supervisionCompany"
              placeholder="请输入监理单位名称"
              style="width: 625px"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="设计单位 :" prop="designCompany">
            <el-input
              v-model="ruleForm.designCompany"
              placeholder="请输入设计单位名称"
              style="width: 625px"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="检测方法 :" prop="testMethodsId">
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
});

const initOption = ref([]);
const callBack = ref("");
const tree = ref([]);
let defaultTree = [];

onMounted(() => {
  if (route.query != null) {
    console.log("is emptyyyyyy ");
    ruleForm.shopId = route.query.shopId;
    ruleForm.facilityId = route.query.id;
    ruleForm.facilityNo = route.query.id;
    ruleForm.areaName = route.query.areaName;
    ruleForm.detailedAddress = route.query.address;
    ruleForm.constructionCopmany = route.query.constructionUnitName;
    ruleForm.facilityName = route.query.signName;
    ruleForm.shopName = route.query.name;
  }

  callBack.value = getAllMethods();
  callBack.value.then((response) => {
    initOption.value = response.data.data;
    tree.value = response.data.data;
    
    initOption.value.forEach(element => {
      defaultTree.push(element.id);
    })
  });

console.log("initOptionnnnnn ", defaultTree )

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
  const asd = treeRef.value!.getCheckedNodes(false, false);
  console.log(asd);
  const a = [];
  asd.forEach((element) => {
    console.log("afdfs ", element.id);
    a.push(element.id);
  });
  console.log("aaaaaaa ", a);
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    console.log("validddd ", valid);
    console.log("fieldssss ", fields);
    if (valid) {
      const methods = treeRef.value!.getCheckedNodes(false, false);
      methods.forEach((element) => {
        ruleForm.testMethodsId.push(element.id);
      });

      
      if(ruleForm.dateValue != ""){
        ruleForm.detectionStartTime = dateFormat(ruleForm.dateValue[0]);
        ruleForm.detectionEndTime = dateFormat(ruleForm.dateValue[1]);
      }

      ruleForm.entrustmentInfoVo.entrustmentDate = dateFormat(ruleForm.entrustmentInfoVo.entrustmentDate);

      
      const data = createEntrust(ruleForm); 
      
      data.then((response) => {
        console.log("responsess ", response.data)
        if(response.data.code == 200){
          entrustNum.value = response.data.data.entrustmentInfoVo.entrustmentNo;
          dialogVisible.value = true;
          ruleForm.entrustmentInfoVo.entrustmentNo = response.data.data.entrustmentInfoVo.entrustmentNo;
        }
      })
      
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
  console.log("Choose allll ", initOption.value )
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
  width: 1000px;
  height: 320px;
}

.el-tree {
  min-width: 100%;
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
  margin-top: -600px;
  margin-left: 45px;
  height: 25px;
}
</style>

<!-- 

  


  

  //===================================================================================================

<el-col :span="24">
          <el-form-item label="检测方法 :" prop="testMethodsId">
            <el-select
              v-model="ruleForm.testMethodsId"
              multiple
              collapse-tags
              collapse-tags-tooltip
              placeholder="请选择"
              style="width: 625px"
              :automaticDropdown = "automaticDropdown"
            >
              <el-checkbox-group v-model="ruleForm.testMethodsId">
                <el-option
                  v-for="item in initOption"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-checkbox-group>
            </el-select>
          </el-form-item>
        </el-col>


 
  

  interface Tree {
  id: number;
  label: string;
  children?: Tree[];
}
  const treeRef = ref<InstanceType<typeof ElTree>>();
  const resetChecked = () => {
  treeRef.value!.setCheckedKeys([], false);
};
  
  ruleForm.testItemsId = treeRef.value!.getCheckedKeys(false);
      
      const { entrustStartDate, entrustEndDate,
              orgnization, eqpType,  designCompany, supervisionCompany, height,
              square, testItemsId, testMethodsId, facilityNo , facilityName, facilityCategory,
              districtCode, constructionCopmany, detailedAddress, shopName } = ruleForm;
      
      
      
      const getCheckedKeys = () => {
        console.log(treeRef.value!.getCheckedKeys(false))
      }

      const checkList: Tree[] = [
  {
    id: 1,
    label: "基础或被依附体",
    children: [
      {
        id: 7,
        label: "外观状况",
        children: [],
      },
      {
        id: 8,
        label: "混凝土抗压强度",
        children: [],
      },
    ],
  },
  {
    id: 2,
    label: "结构构件",
    children: [
      {
        id: 9,
        label: "构件几何尺寸",
        children: [],
      },
      {
        id: 10,
        label: "构件变形",
        children: [
          {
            id: 25,
            label: "垂直度",
            children: [],
          },
          {
            id: 26,
            label: "柱身弯曲",
            children: [],
          },
          {
            id: 27,
            label: "挠度",
            children: [],
          },
          {
            id: 28,
            label: "平面侧弯",
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: 3,
    label: "构架连接",
    children: [
      {
        id: 11,
        label: "结构主体与基础或被依附体连接",
        children: [
          {
            id: 29,
            label: "连接状况",
            children: [],
          },
          {
            id: 30,
            label: "后置锚栓抗拉拔",
            children: [],
          },
          {
            id: 31,
            label: "锚固螺栓拧紧扭矩",
            children: [],
          },
        ],
      },
      {
        id: 12,
        label: "结构构件连接",
        children: [
          {
            id: 32,
            label: "连接状况",
            children: [],
          },
          {
            id: 33,
            label: "法兰盘结合面状况",
            children: [],
          },
          {
            id: 34,
            label: "连接螺栓拧紧扭矩",
            children: [],
          },
        ],
      },
      {
        id: 13,
        label: "焊缝",
        children: [
          {
            id: 35,
            label: "焊缝外观",
            children: [],
          },
          {
            id: 36,
            label: "焊缝质量（超声波探伤）",
            children: [],
          },
          {
            id: 37,
            label: "焊缝质量（磁粉探伤）",
            children: [],
          },
          {
            id: 38,
            label: "焊缝质量（渗透探伤）",
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: 4,
    label: "面板及围护",
    children: [
      {
        id: 14,
        label: "面板、围护及其安装质量",
        children: [],
      },
      {
        id: 15,
        label: "灯布、扎绳杆及其固定质量",
        children: [],
      },
      {
        id: 16,
        label: "显示单元及其固定质量",
        children: [],
      },
    ],
  },
  {
    id: 5,
    label: "结构防腐",
    children: [
      {
        id: 17,
        label: "锈蚀状况",
        children: [],
      },
      {
        id: 18,
        label: "防腐涂层厚度",
        children: [],
      },
      {
        id: 19,
        label: "涂层附着力",
        children: [],
      },
    ],
  },
  {
    id: 6,
    label: "电气照明及防雷装置",
    children: [
      {
        id: 20,
        label: "电气供配电及控制装置",
        children: [
          {
            id: 39,
            label: "电气控制箱（柜）供配电容量匹配",
            children: [],
          },
          {
            id: 40,
            label: "箱（柜）内电器设置规范性",
            children: [],
          },
          {
            id: 41,
            label: "供配电及控制箱（柜）接地型式",
            children: [],
          },
          {
            id: 42,
            label: "绝缘电阻",
            children: [],
          },
          {
            id: 43,
            label: "接地电阻",
            children: [],
          },
          {
            id: 44,
            label: "漏电保护装置性能",
            children: [],
          },
        ],
      },
      {
        id: 21,
        label: "线缆",
        children: [
          {
            id: 45,
            label: "供配电线缆设置状况",
            children: [],
          },
        ],
      },
      {
        id: 22,
        label: "灯具",
        children: [
          {
            id: 46,
            label: "安装状况",
            children: [],
          },
          {
            id: 47,
            label: "线缆绝缘保护",
            children: [],
          },
          {
            id: 48,
            label: "不带电金属体接地状况",
            children: [],
          },
        ],
      },
      {
        id: 23,
        label: "接地电阻",
        children: [],
      },
      {
        id: 24,
        label: "防雷装置",
        children: [
          {
            id: 49,
            label: "浪涌保护器",
            children: [],
          },
          {
            id: 50,
            label: "电气连通性",
            children: [],
          },
          {
            id: 51,
            label: "防雷接地电阻",
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: 52,
    label: "结构复核",
    children: [],
  },
];

.resetCheckListBtn{
  position: absolute;
  left: 64%;
  align-items: center;
  justify-content: center;
  margin-top: 240px;
}


      <el-button class="resetCheckListBtn" @click="resetChecked(ruleFormRef)"
        >重置检测项目</el-button
      >





      
      -->
