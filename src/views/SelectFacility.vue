<template>
    <div>
    <h4>选择设施 
      <el-button @click="returnPage()" class="returnBtn">
          返回
      </el-button>
    
    </h4>
    <el-divider />


    <el-table
      :data="content"
      :header-cell-style="{background:'#606266',color:'#eee'}"
      border
      style="width: 100%"
      #default="props"
    >
      <el-table-column
        prop="id"
        label="设施ID"
        width="320"
        header-align="center"
        align="center"
      />
      <el-table-column
        prop="signName"
        label="设施名称"
        width="320"
        header-align="center"
        align="center"
      />
      <el-table-column
        prop="constructionUnitName"
        label="施工单位"
        width="400"
        header-align="center"
        align="center"
      />
      <el-table-column
        prop="address"
        label="详细地址"
        width="400"
        header-align="center"
        align="center"
      />
      <el-table-column label="操作" widt="80" header-align="center" #default="props" align="center">
        <el-button type="primary" @click="chooseFacility(props)">
          选择
        </el-button>

        
      </el-table-column>
    </el-table>

  </div>
</template>

<script lang="ts" setup>
    import { ref, onMounted, reactive } from "vue";
    import { useRouter, useRoute } from "vue-router";
    import { selectFacility } from "../api/apiRequest";

    const route = useRoute();
    const router = useRouter();
    const facilityInfo = reactive({
        shopId: "",
        page: 1,
        pageSize: 12,
    });
    facilityInfo.shopId = route.query.id;

    const outData = reactive({
        name: "",
        areaName: "",
        signName: "",
        constructionUnitName: "",
        id: "",
        address: ""

    });
    outData.name = route.query.name;
    outData.areaName = route.query.areaName;

    let callBack = ref('');
    let content = ref([]);

    onMounted( () => {
        console.log("in onMounted ==== > " , route.query);
        callBack = selectFacility(facilityInfo);
        
        callBack.then((response) => {
            content.value = response.data.data.datalist;
    
            
        });
        
    })

    const chooseFacility = (props) =>{

      if(route.query.from == "CreateTrust"){

        router.push({ 
            name: "home",
            query: {
                id: props.row.id, 
                signName: props.row.signName,
                address: props.row.address,
                name: route.query.name,
                areaName: route.query.areaName, 
                constructionUnitName: props.row.constructionUnitName,
                shopId: props.row.shopId,
            }
        });
      }else{
        console.log("elssssss ", route.query)
        router.push({
          name: "approval",
          query:{
            id: props.row.id, 
            signName: props.row.signName,
            address: props.row.address,
            name: route.query.name,
            areaName: route.query.areaName, 
            constructionUnitName: props.row.constructionUnitName,
            shopId: props.row.shopId,
            ticket: route.query.ticket,
          }
        })
      }
         
    }

    const returnPage = () => {
      router.go(-1);
    }
</script>

<style lang="scss">

.returnBtn{
  display:inline;
  margin-left: 88.8%;
}

</style>

设施编号 id/设施名称 signName /设施地点 address/施工单位 constructionUnitName

pass: 店铺名称 name / 行政区域 areaName/

<!-- router.push({
          name: "approval",
          query: {
                id: props.row.id, 
                signName: props.row.signName,
                address: props.row.address,
                name: route.query.name,
                areaName: route.query.areaName, 
                constructionUnitName: props.row.constructionUnitName,
                shopId: props.row.shopId,
          }
        }); -->