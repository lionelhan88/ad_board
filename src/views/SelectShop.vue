<template>
  <div>
    <h4>查找门店</h4>
    
    <el-divider />

    <el-form ref="formRef" :model="nameValidateForm" class="inputBox">
      <el-form-item label="店铺查询" prop="name">
        <el-input
          style="width: 640px"
          placeholder="请输入您要查找的店铺名"
          v-model="nameValidateForm.name"
        />

        <el-button type="primary" @click="submitForm(formRef)" class="submitBtn"
          >搜索</el-button
        >
        <el-button @click="resetForm(formRef)">重置</el-button>

        <el-button @click="returnPage()" class="returnBtn">返回</el-button>
      </el-form-item>
    </el-form>

    <el-divider />
    <h4>门店列表</h4>

    <el-table
      :data="content"
      :header-cell-style="{background:'#606266',color:'#eee'}"
      border
      style="width: 100%"
      #default="props"
    >
      <el-table-column
        prop="entName"
        label="企业名称"
        width="480"
        header-align="center"
        align="center"
        
      />
      <el-table-column
        prop="name"
        label="店铺名称"
        width="400"
        header-align="center"
        align="center"
      />
      <el-table-column
        prop="address"
        label="详细地址"
        width="480"
        header-align="center"
        align="center"
      />
      <el-table-column label="操作" align="center" #default="props">
        <el-button type="primary" @click="chooseShop(props)">
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
  page: 1,
  pageSize: 12,
});

let callBack = ref("");
let content = ref([]);

let thisPage = ref(1);
let total = ref(0);

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      const { name } = nameValidateForm;
      console.log("submit! " + nameValidateForm);

      callBack = selectShop(nameValidateForm);

      callBack.then( (response) => {
        content.value = response.data.data.datalist;
        total.value = response.data.data.totalSize;
        console.log("total " + total.value);
        
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
};

const handlePageChange = (val: number) => {
  
  thisPage.value = val;
  nameValidateForm.page = val;
  console.log("valllll " , nameValidateForm.page + " name " + nameValidateForm.name);
  callBack = selectShop(nameValidateForm);
  callBack.then((response) => {
    content.value = response.data.data.datalist;
  })
};

onMounted( () => {
  console.log("onMounted in selectionShop ====> " , route.query);
  callBack = selectShop(nameValidateForm);

    callBack.then( (response) => {
      content.value = response.data.data.datalist;
      total.value = response.data.data.totalSize;
      console.log("total " + total.value);
    });
})

const chooseShop = (props) => {  
  router.push({ 
    name: "selectFacility",
    query: {
      id: props.row.id, 
      name: props.row.name,
      areaName: props.row.areaName,
      from: route.query.from,
      ticket: route.query.ticket,
    }
  }); 
}

const returnPage = () => {
  router.go(-1);
}
</script>

<style scoped>
.inputBox {
  display: inline;
}

.submitBtn {
  margin-right: 10px;
  margin-left: 20px;
}

.example-pagination-block  {
  margin-left: 480px;
  margin-top: 16px;
}
</style>
