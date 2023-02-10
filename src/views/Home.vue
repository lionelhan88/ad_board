<script lang="ts" setup>
import {
  DocumentAdd,
  Search,
  SwitchButton,
  User
} from '@element-plus/icons-vue'
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router"
import { storage } from '../utils/storage'

const router = useRouter();

const logOut = () => {
  router.push({name: "login"});
}

const useName = ref();
const unitName = ref("");

onMounted( ()=>{
  useName.value = storage.get("accountName")
  unitName.value = storage.get("detectionUnitName");
})


</script>


<template>
  <div class="common-layout">
    <el-container>
      <!--头部区域-->
      <el-header class="header">
        <span class="title">户外广告和招牌设施安全检测管理系统</span>

        <el-dropdown trigger="click" class="dropdownMenu"> 

          <el-button type="info" >
            <el-icon class="userInfo"><User /></el-icon>
            {{useName}}
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item > 
                <div class="unitNamemm" v-if="unitName.length>10"> {{unitName.slice(0,10)}}<br>{{unitName.slice(11)}} </div>
                <div class="unitNamemm" v-else> {{unitName}}</div>  
              </el-dropdown-item>
              <el-dropdown-item>设置</el-dropdown-item>
              <el-dropdown-item @click="logOut()">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>    
      </el-header>
      
      
      
      <el-container> 

        <el-aside width="200px">
          <!--侧边栏菜单-->
              <el-menu
                class="el-menu"
                default-active="1"
                background-color="#2F4F4F"
                text-color = "#FFFFFF"
                :router="true"
              >
                <el-menu-item index="1" :route="{path:'/home/createTrust'}">
                    <el-icon><document-add /></el-icon>
                    <span>创建委托信息</span>
                </el-menu-item>
              
                <el-menu-item index="2" :route="{path:'/home/searchTrust'}">
                  <el-icon><search /></el-icon>
                  <span>查询委托信息</span>
                </el-menu-item>
              </el-menu>
        </el-aside>
        
        
        <!--主页区域-->

        <el-main>
          <div>
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" :key="$route.name" v-if="$route.meta.keepAlive"/>
            </keep-alive>
            <component :is="Component" :key="$route.name"  v-if="!$route.meta.keepAlive"/>
          </router-view>
          <!-- <router-view></router-view> -->
          </div>    

        </el-main>
      </el-container>
    </el-container>

  </div>
</template>

<style >
  .common-layout{
    background-color: rgb(240 248 255);
  }
  
  .el-aside{
    background-color: rgb(47 79 79);
    
  }

  .el-menu{
      border-right: none;
      height:94vh;
      font-size: 40px;
    }


.el-menu-item.is-active {
      background-color: #5F9EA0 !important;
      color: #FFFFFF;
      span {
        color: #FFFFFF !important;
      }
}

  
  .el-main{
    margin:8px;
    background-color: rgb(255 255 240);
    height: 92vh;
  }
  
  .header{
    background-color: rgb(47 79 79);
    
  }
  
  .title{
    position: absolute;
    justify-content: center;
    display: flex;
    left: 40%; 
    font-size: 32px;
    margin-top: 5px;
    color: rgb(255 255 240);
    
  }

  .exitBtn{
    display: flex;
    position: relative;
    left: 94%;
    margin-top: 12px;
  }
  
  .dropdownMenu{
    display: flex;
    position: absolute;
    left: 95%;
    transform: translate(-100%);
    margin-top: 12px;
  }

  .userInfo{
    margin-right: 5px;
  }


  .unitNamemm{
    width: 140px;
    display: inline-block;
    word-break:normal; 
    white-space:inherit ;
  }
</style>

