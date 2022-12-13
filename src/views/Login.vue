<script setup lang="ts">
import { reactive, ref, getCurrentInstance } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter, useRoute } from "vue-router"
import Security from '../components/security.vue'
import {

  Comment,
  User,
  InfoFilled,
} from '@element-plus/icons-vue'

const router = useRouter();
const route = useRoute();

const formSize = ref('default')
const dialogVisible = ref(false)
const dialogVisible1 = ref(false)

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  userName: 't9990001',
  pwd:'1',
  code:"",
  codeKey:"",
})

//================================= 表单校验规则 ====================================
const rules = reactive<FormRules>({
  userName: [
    { required: true, message: '请输入登录账号', trigger: 'blur' },
  ],
  pwd: [
    { required: true, message: '请输入登录密码', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },

  ],
  
})


//================================= axios请求 ====================================
const currentInstance = getCurrentInstance();
const { $axios } = currentInstance.appContext.config.globalProperties;
import { loginAction } from '../api/apiRequest'
import { storage } from '../utils/storage'

const securityRefs = ref<InstanceType<typeof Children>>();
const msg = ref(0);
const falseToken = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhdWQuZGVtbyIsInN1YiI6InN1Yi5kZW1vIiwidXNlci1rZXkiOiJ0OTk5MDAwMSIsInVzZXItcm9sZSI6IltcInNpZ25ib2FyZC10ZXN0XCIsXCJzaWduYm9hcmQtZW50cnVzdG1lbnQtcGVyc29uYWxcIixcInNpZ25ib2FyZC1lbnRydXN0bWVudC11bml0XCIsXCJzaWduYm9hcmQtcmVwb3J0LWFwcHJvdmVcIixcInNpZ25ib2FyZC1icm93c2VcIl0iLCJpc3MiOiJpc3MuZGVtbyIsInNob3BzaWduLWF1dGgiOiJmZGtleSBleUpoYkdjaU9pSklVelV4TWlKOS5leUpqYjJSbElqb3dMQ0poZFhSb0lqcGJleUpoZFhSb2IzSnBkSGtpT2lKamFHRnVibVZzWDJGd2FTSjlMSHNpWVhWMGFHOXlhWFI1SWpvaWMyVmpjbVYwWDJacGJIUmxjbWx1WnlKOVhTd2ljbTlzWlVOdlpHVWlPaUpqYUdGdWJtVnNJaXdpYVdRaU9pSm1PR1psTVdJeVpXTXhNek0wTUdFellURTJOMlF4TUdVNU1tSm1ZelV6T1NJc0ltSmhjMlZVZVhCbElqb2lNRFVpTENKemRXSWlPaUpxWTNob01TSXNJbVY0Y0NJNk1UWTJPVGt3TURJMU1YMC5acTNxRjhJX3RSZm8xQW9hdnV6RVZYUEJnb0t3VTkwV3p4WWdRZ2RhMVY3Y29RV0NGMmpFTXMwQjNEQTJOQ1pjMWhGNlZlT0ZqS0pnSmxId2p0dkJRUSIsInVuaXQta2V5IjoiMDAwMCIsImV4cCI6MTY2OTkwMDM0NCwiaWF0IjoxNjY5ODU3MTQ0fQ.Wz_if6ehtKmguRMvY8pokr57bUR6TGeA0atSzO79K40"
//================================= 登录及重置按钮 ====================================
const submitForm = async (formEl: FormInstance | undefined) => {
  
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      ruleForm.codeKey = securityRefs.value.codeKey;
      const { userName, pwd, code } = ruleForm;
      const data = loginAction(ruleForm);
      
      data.then( (response) => {
        const returnData = response.data;
        
        console.log("return dataaaaa ", returnData);
        if(returnData.resultCode == 60014 || returnData.resultCode == 60013){
          dialogVisible1.value = true;
          msg.value += 1;
          console.log("msggggggggg " + msg.value)
          formEl.resetFields()
        }else if (returnData.code == 200){
          const token = "Bearer " + returnData.data.token;

          
          
          storage.set("token", token);

          const a = storage.get("token");
           console.log("打印Token-----",a);

          router.push({ 
            name: "home",
          }); 
        }else{
          dialogVisible.value = true;
          formEl.resetFields()
        }
        
      });

    } else {
      console.log('error submit!', fields);
    }
  })
  
}


const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
}
</script>

<template>
  
  <div class="login_container">
  
    <div class="login_header">
    上 海 市 建 设 工 程 检 测 信 息 管 理 系 统</div> 
    <div class="header_en">
      Shanghai Construction Engineering Test Information management system <br>
      <br>
    </div>
      <img src="../assets/bg.png" class="inputImg"><img>
      
      <div class="login_box">
      <!-- 登录表单区域 -->
      <el-form class="loginForm"   ref="ruleFormRef" :rules="rules"
      :model="ruleForm" size="formSize">

      <!-- 输入用户名-->
        <el-form-item label="账号" prop="userName" >
          <el-input label="inputname" v-model="ruleForm.userName"
            placeholder="请输入登录账号"  class="loginBox">
            console.log(ruleForm.username)
          </el-input>
        </el-form-item>

      <!-- 输入密码-->
         <el-form-item label="密码" prop="pwd">
          <el-input v-model="ruleForm.pwd" type="password" 
          placeholder="请输入登录账号"  class="pwdBox"/>
        </el-form-item>

        <el-form-item  label="验证码" prop="code">
          <div class="captcha-text">
            <el-input placeholder="请输入验证码" 
            v-model="ruleForm.code"></el-input>
          </div>
          <div class="captcha-code">
              <Security ref="securityRefs" :msg="msg"></Security>
          </div>
        </el-form-item>


        <!-- 登录按钮-->
        <el-button type="success" class="btnLogin" @click="submitForm(ruleFormRef)"
        >登录</el-button>
        <el-button type="info" class="btnLogin" @click="resetForm(ruleFormRef)">重置</el-button>
    
      </el-form>
    </div>

    <!-- 登录失败弹窗 -->
    <el-dialog
        v-model="dialogVisible"
        title="登录错误"
        width="30%"
      >
      <span>请输入正确的用户名和密码</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false"
            >确认</el-button
          >
        </span>
      </template>
    </el-dialog>

    <!-- 验证码错误弹窗 -->
    <el-dialog
        v-model="dialogVisible1"
        title="验证码错误"
        width="30%"
      >
      <span>请输入正确的验证码</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogVisible1 = false"
            >确认</el-button
          >
        </span>
      </template>
    </el-dialog>


  </div>
</template>

<style lang="scss" scoped>
.login_container {
  height: 100%;
  background-color: rgb(240 255 240);
}

.login_header{
  font-size: 40px;
  font-weight: bold;
  background: rgb(240 255 240);
}

.header_en{
  font-size: 20px;
  background: rgb(240 255 240);
}

.login_box {
  width: 550px;
  height: 400px;
  background: rgb(240 248 255);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-10%, -50%);
  border-radius: 5px;
}

.loginForm {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 460px;
}

.loginBox{
  margin-left: 13px;
}

.pwdBox{
  margin-left: 13px;
}

.btn {
  text-align: center;
}
 
.inputImg{
  display: flex;
  width: 81%;
  overflow: true;
  height: 60%;
}

.btnLogin{
  margin-top: 20px;
}
</style>





