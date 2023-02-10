<template>
  <div>
    <h2>分项评定</h2>
    <el-descriptions
      class="margin-top"
      :column="2"
      border
      :keys="item"
      v-for="(item, index) in evaluationList"
    >
      <el-descriptions-item align="left" label-align="center">
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <user />
            </el-icon>
            分项名称
          </div>
        </template>

        <div align="center" class="asdfasf">
          {{ item.testItemsName }}
        </div>
      </el-descriptions-item>

      <el-descriptions-item label-align="center">
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <infoFilled />
            </el-icon>
            详情
          </div>
        </template>

        <el-button type="info" @click="EvaDetail(index)"> 检测详情 </el-button>
      </el-descriptions-item>

      <el-descriptions-item align="left" label-align="center" span="2">
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <editPen />
            </el-icon>
            评定等级 
          </div>
        </template>
        <el-radio-group v-model="item.level">
          <el-radio :label="1">a 级</el-radio>
          <el-radio :label="2">b 级</el-radio>
          <el-radio :label="3">c 级</el-radio>
        </el-radio-group>
      </el-descriptions-item>

      <el-descriptions-item align="left" label-align="center">
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <comment />
            </el-icon>
            备注(缺陷部位说明)
          </div>
        </template>
        <el-input
          v-model="item.remarks"
          placeholder="请输入缺陷部位备注"
          type="textarea"
        />
      </el-descriptions-item>
    </el-descriptions>
  </div>

  <h2>综合评定</h2>
  <div>
    <el-descriptions class="margin-top" :column="2" border>
      <el-descriptions-item align="center" span="2" >
        <template #label>
          <div>
            <el-icon :style="iconStyle">
              <editPen />
            </el-icon>
            综合评定等级
          </div>
        </template>
        <el-radio-group v-model="comprehensiveGrade" disabled>
          <el-radio :label="1" border>A</el-radio>
          <el-radio :label="2" border>B</el-radio>
          <el-radio :label="3" border>C</el-radio>
        </el-radio-group>
      </el-descriptions-item>

      <el-descriptions-item align="left" label-align="center">
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <comment />
            </el-icon>
            检测结果
          </div>
        </template>
        <el-input v-model="detectionResult" type="textarea" v-if="defaultDetectionResult==null"></el-input>
        <el-input v-model="defaultDetectionResult" type="textarea" v-else></el-input>
      </el-descriptions-item>
    </el-descriptions>

    <!--保存按钮-->
    <el-button class="saveBtn" type="primary" @click="saveInfo()"
      >保存</el-button
    >

    <!--返回按钮-->
    <el-button class="cancelBtn" @click="returnPage()">返回</el-button>

    <!-- 检测结果已保存-->
    <el-dialog v-model="resultSaveSuccess" title="保存成功" width="30%">
      <span>分项评定结果已保存！</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="resultSaveSuccess = false"
            >确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 检测结果已保存-->
    <el-dialog v-model="resultSaveSuccess" title="保存成功" width="30%">
      <span>分项评定结果已保存！</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="resultSaveSuccess = false"
            >确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 检测结果保存失败-->
    <el-dialog v-model="resultSaveFailed" title="保存失败" width="30%">
      <span>该委托已完工，无法对分项评定结果进行修改！</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="resultSaveFailed = false"
            >确认</el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>


<script lang="ts" setup>
import {
  computed,
  ref,
  reactive,
  watch,
  getCurrentInstance,
  onMounted,
} from "vue";
import { EditPen, Comment, User, InfoFilled } from "@element-plus/icons-vue";
import { useRouter, useRoute } from "vue-router";
const route = useRoute();
const router = useRouter();
const data = {
  id: route.query.id,
};
const comprehensiveGrade = ref('');
const detectionResult = ref("");
const defaultDetectionResult = ref();
const evaluationList = ref([]);
const finalContent = [
  "（A级）可继续使用，并应按规范要求做好维护保养",
  "（B级）某某分项存在一般缺陷，应按规范要求15天内完成整改，并申请复检",
  "（C级）某某分项存在严重缺陷，应按规范要求7天内完成整改，并申请复检。某某存在坠落、倾覆危险，应按规范要求24小时内予以拆除。",
];
let newData = reactive({
  comprehensiveGrade: "",
  detectionResult: "",
  id: 0,
  scoreEvaluationVoList: [
    {
      id: 0,
      level: 0,
      remarks: "",
    },
    {
      id: 0,
      level: 0,
      remarks: "",
    },
    {
      id: 0,
      level: 0,
      remarks: "",
    },
    {
      id: 0,
      level: 0,
      remarks: "",
    },
    {
      id: 0,
      level: 0,
      remarks: "",
    },
    {
      id: 0,
      level: 0,
      remarks: "",
    },
    {
      id: 0,
      level: 0,
      remarks: "",
    },
  ],
});
const currentInstance = getCurrentInstance();
const { $axios } = currentInstance.appContext.config.globalProperties;
import {
  getDetectionResultById,
  saveDetectionResultById,
} from "../../api/apiRequest";
let arr = [];

onMounted(() => {

  const detail = getDetectionResultById(data);
  detail.then((response) => {  
    defaultDetectionResult.value = response.data.data.finalLevel.detectionResult;
    comprehensiveGrade.value = response.data.data.finalLevel.comprehensiveGrade;
    evaluationList.value = response.data.data.scoreEvaluationVoList;

  });
});

const resultSaveSuccess = ref(false);
const resultSaveFailed = ref(false);

watch(
  () => [...evaluationList.value],
  (newVal, oldVal) => {
    if (
      evaluationList.value.every(
        (evaluationList) => evaluationList.level in [1, 2, 3, 4]
      )
    ) {     
        if (
        evaluationList.value.every(
          (evaluationList) => evaluationList.level == 1
        )
      ) {
        comprehensiveGrade.value = 1;
        detectionResult.value = finalContent[0];
      }

      else if (
        evaluationList.value[3].level == 1 &&
        evaluationList.value[5].level == 1 &&
        evaluationList.value[6].level == 1
      ) {
        arr = evaluationList.value.filter(
          (evaluationList) => evaluationList.level == 2
        );

        if (arr.length <= 2) {
          comprehensiveGrade.value = 1;
          detectionResult.value = finalContent[0];

        } else {

          comprehensiveGrade.value = 2;
          detectionResult.value = finalContent[1];
        }
      }
      
      else if( evaluationList.value[3].level == 2 ||
        evaluationList.value[5].level == 2 ||
        evaluationList.value[6].level == 2 || 
        evaluationList.value.every((evaluationList) => evaluationList.level == 2) 
        ){  
        comprehensiveGrade.value = 2;
        detectionResult.value = finalContent[1];
      }if(  evaluationList.value.some(
          (evaluationList) => evaluationList.level == 3
        )
        ){
          comprehensiveGrade.value = 3;
          detectionResult.value = finalContent[2];
        }
    }else if(newVal[0].level != undefined && newVal[1].level != undefined && newVal[2].level != undefined 
      && newVal[3].level != undefined && newVal[4].level != undefined && newVal[5].level != undefined)
    {
      if (
        evaluationList.value[0].level == 1 && evaluationList.value[1].level == 1 &&
        evaluationList.value[2].level == 1 && evaluationList.value[3].level == 1 &&
        evaluationList.value[4].level == 1 && evaluationList.value[5].level == 1 
      ){
        comprehensiveGrade.value = 1;
        detectionResult.value = finalContent[0];
      } else if (
          evaluationList.value[3].level == 1 &&
          evaluationList.value[5].level == 1
      ){
          arr = evaluationList.value.filter(
              (evaluationList) => evaluationList.level == 2
          );
          if (arr.length <= 2) {
            comprehensiveGrade.value = 1;
            detectionResult.value = finalContent[0];
          }else{
            comprehensiveGrade.value = 2;
            detectionResult.value = finalContent[1];
          }
      }else if( evaluationList.value[0].level == 3 || evaluationList.value[1].level == 3 ||
        evaluationList.value[2].level == 3 || evaluationList.value[3].level == 3 ||
        evaluationList.value[4].level == 3 || evaluationList.value[5].level == 3 )
      {
        comprehensiveGrade.value = 3;
        detectionResult.value = finalContent[2];
      }else{
        comprehensiveGrade.value = 2;
        detectionResult.value = finalContent[1];
      }   
    }  else if (newVal[0].level != undefined && newVal[1].level != undefined && newVal[2].level != undefined 
      && newVal[3].level != undefined && newVal[4].level != undefined ){
        if (
          evaluationList.value[0].level == 1 && evaluationList.value[1].level == 1 &&
          evaluationList.value[2].level == 1 && evaluationList.value[3].level == 1 &&
          evaluationList.value[4].level == 1
        ){
          comprehensiveGrade.value = 1;
          detectionResult.value = finalContent[0];
        }else if( evaluationList.value[0].level == 3 || evaluationList.value[1].level == 3 ||
          evaluationList.value[2].level == 3 || evaluationList.value[3].level == 3 ||
          evaluationList.value[4].level == 3 )
        {
          comprehensiveGrade.value = 3;
          detectionResult.value = finalContent[2];
        }else if ( evaluationList.value[3].level == 1 ){
          arr = evaluationList.value.filter(
              (evaluationList) => evaluationList.level == 2
          );
          if (arr.length <= 2) {
            comprehensiveGrade.value = 1;
            detectionResult.value = finalContent[0];
          }else{
            comprehensiveGrade.value = 2;
            detectionResult.value = finalContent[1];
          }
        }else{
          comprehensiveGrade.value = 2;
          detectionResult.value = finalContent[1];
        }   

      }
  },
  { deep: true }
);


const saveInfo = () => {
  for (let i in evaluationList.value) {
    newData.scoreEvaluationVoList[i].id = evaluationList.value[i].id;
    newData.scoreEvaluationVoList[i].level = evaluationList.value[i].level;
    newData.scoreEvaluationVoList[i].remarks = evaluationList.value[i].remarks;
  }
  newData.id = route.query.id;
  newData.comprehensiveGrade = comprehensiveGrade.value;
  if(defaultDetectionResult.value == null){
    newData.detectionResult = detectionResult.value;
  }else{
    newData.detectionResult = defaultDetectionResult.value;
  }
  
  const result = saveDetectionResultById(newData);
  result.then((response) => {
    if(response.data.code == 200){
      resultSaveSuccess.value = true;
    }else{
      resultSaveFailed.value = true;
    }
  }) 

 
};
const returnPage = () => {
  router.push({
    name: "searchTrust",
    query: {
      form: route.query.form,
    }
  });
};

const EvaDetail = (index) => {
  if(index == 0 || index == 3 || index == 4 ){
    router.push({
      name: "detail1",
      query:{
        id: evaluationList.value[index].entrustmentDetailId,
        rootTestItemsId: evaluationList.value[index].id,
      }
    })
  }else if(index == 1 ){
    router.push({
      name: "detail2",
      query:{
        id: evaluationList.value[index].entrustmentDetailId,
        rootTestItemsId: evaluationList.value[index].id,
      }
    })
  }else if(index == 2 || index == 5 ){
    router.push({
      name: "detail3",
      query:{
        id: evaluationList.value[index].entrustmentDetailId,
        rootTestItemsId: evaluationList.value[index].id,
      }
    })
  }else if(index == 6 ){
    router.push({
      name: "detail4",
      query:{
        id: evaluationList.value[index].entrustmentDetailId,
        rootTestItemsId: evaluationList.value[index].id,
      }
    })
  }
  

};
</script>

<!--    -->

<style scoped lang="scss">
.asdfasf {
  width: 170px;
  align: center;
  display: flex;
}
.margin-top {
  margin-top: 20px;
}
.saveBtn {
  margin-top: 48px;
  margin-left: 3.5rem;
}
.cancelBtn {
  margin-top: 48px;
  margin-left: 160px;
}
</style>
