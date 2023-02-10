<template>
  <div>
    <h3 class="header1">查找门店</h3>
    
    <el-divider />

    <el-form ref="formRef" :model="nameValidateForm" class="inputBox">

      <el-row>
        <el-col :span="12">
          <el-form-item label="店铺查询" prop="name" class="input1">
            <el-input
              placeholder="请输入您要查找的店铺名"
              v-model="nameValidateForm.name"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="店铺地址" prop="address" class="input2">
            <el-input
              placeholder="请输入您要查找的店铺地址"
              v-model="nameValidateForm.address"
            />
          </el-form-item>
        </el-col>
      </el-row>
        
      <el-button type="primary" @click="submitForm(formRef)" class="submitBtn"
          >搜索</el-button>
      <el-button @click="resetForm(formRef)" class="resetBtn">重置</el-button>
      <el-button @click="returnPage()" class="returnBtn">返回</el-button>
 
    </el-form>

    <el-divider />
    <h4 class="header1">门店列表</h4>

    <el-table
      :data="content"
      :header-cell-style="{background:'#606266',color:'#eee'}"
      border
      :width= 1 rem
      #default="props"
    >
      <el-table-column
        prop="entName"
        label="企业名称"
        header-align="center"
        align="center"
      />
      <el-table-column
        prop="name"
        label="店铺名称"
        header-align="center"
        align="center"
      />
      <el-table-column
        prop="address"
        label="详细地址"
        header-align="center"
        align="center"
      />
      <el-table-column label="操作" align="center" #default="props">
        <el-button @click="chooseShop(props)">
          选择设施
        </el-button>
      </el-table-column>
    </el-table>
  </div>

  <div class="example-pagination-block">
    <el-pagination
      v-model:currentPage="thisPage"
      :page-size="12"
      background
      hide-on-single-page
      layout="prev, pager, next, total"
      :total="total"
      @current-change="handlePageChange"
    />
  </div>

</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import type { FormInstance } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import { storage } from "../utils/storage.ts";
import { selectShop } from "../api/apiRequest";
import { useRouter, useRoute } from "vue-router"

const formRef = ref<FormInstance>();
const router = useRouter();
const route = useRoute();

const nameValidateForm = reactive({
  name: "",
  address: "",
  page: 1,
  pageSize: 9,
});

let callBack = ref("");
let content = ref([]);
const searchDetail = ref();

let thisPage = ref(1);
let total = ref(0);

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      const { name, address } = nameValidateForm;

      searchDetail.value = nameValidateForm;
      callBack = selectShop(nameValidateForm);
      callBack.then( (response) => {
        content.value = response.data.data.datalist;
        total.value = response.data.data.totalSize;
      });
    } else {
      console.log("error submit!");
      return false;
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  router.go(0);
};

const handlePageChange = (val: number) => {
  
  thisPage.value = val;
  nameValidateForm.page = val;
  callBack = selectShop(nameValidateForm);
  callBack.then((response) => {
    content.value = response.data.data.datalist;
  })
};

onMounted( () => {
  callBack = selectShop(nameValidateForm);
    callBack.then( (response) => {
      content.value = response.data.data.datalist;
      total.value = response.data.data.totalSize;
    });
})

const chooseShop = (props) => {  
  const info = ref();
  if(route.query.form != null){
    info.value = route.query.form;
  }else{
    info.value = JSON.stringify(nameValidateForm);
  }
  router.push({ 
    name: "selectFacility",
    query: {
      id: props.row.id, 
      name: props.row.name,
      areaName: props.row.areaName,
      from: route.query.from,
      ticket: route.query.ticket,
      form: info.value,
    }
  });
}

const returnPage = () => {
  
  if(route.query.from == "CreateTrust"){
    router.push({ 
      name: "home",
    });
  }else{
    router.push({ 
      name: "approval",
      query:{
        ticket: route.query.ticket
      }
    });
  }
  
}
</script>

 

<style scoped>
.example-pagination-block  {
  margin-left: 480px;
  margin-top: 32px;
}

.header1{
  font-size: 18px;
}

.input1{
  width: 600px;
  display: flex;
}

.input2{
  display: flex;
  width: 600px;
}

.submitBtn{
  margin-left: 32%;
  margin-top: 40px;
}

.resetBtn{
  margin-left: 8%;
  margin-top: 40px;
}

.returnBtn{
  margin-left: 8%;
  margin-top: 40px;
}

</style>
