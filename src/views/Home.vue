<template>
  <div class="common-layout">
    <el-container>
      <!--头部区域-->
      <el-header class="header">
        <span class="title">户外广告和招牌设施安全检测管理系统</span>

        <el-button class="exitBtn" @click="logOut()" :icon="SwitchButton" round type="info">退出</el-button> 
        
      </el-header>
      
      
      
      <el-container> 

        <el-aside width="200px">
          <!--侧边栏菜单-->
              <el-menu
                class="el-menu"
                default-active="1"
                background-color="#2F4F4F"
                text-color = "#FFFFF0"
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
            <router-view></router-view>
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
  


</style>

<script lang="ts" setup>
import {
  DocumentAdd,
  Search,
  SwitchButton
} from '@element-plus/icons-vue'

import { useRouter } from "vue-router"

const router = useRouter();

const logOut = () => {

  router.push({name: "login"});

}


</script>


<!-- <router-view v-slot="{ Component }">
              <keep-alive >
                <component :is="Componnet" :key="$route.name"></component>
              </keep-alive>
            </router-view>  -->