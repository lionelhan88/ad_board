<script setup lang="ts">
import { reactive, ref, getCurrentInstance, computed } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import Security from "../components/security.vue";
import { Comment, User, InfoFilled } from "@element-plus/icons-vue";

const router = useRouter();
const route = useRoute();

const formSize = ref("default");
const dialogVisible = ref(false);
const dialogVisible1 = ref(false);
const message = ref();

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  userName: "",
  pwd: "",
  code: "",
  codeKey: "",
});

//================================= 表单校验规则 ====================================
const rules = reactive<FormRules>({
  userName: [{ required: true, message: "请输入登录账号", trigger: "blur" }],
  pwd: [{ required: true, message: "请输入登录密码", trigger: "blur" }],
  code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
});

//================================= axios请求 ====================================
const currentInstance = getCurrentInstance();
const { $axios } = currentInstance.appContext.config.globalProperties;
import { loginAction } from "../api/apiRequest";
import { storage } from "../utils/storage";

const securityRefs = ref<InstanceType<typeof Children>>();
const msg = ref(0);

const falseToken =
  "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhdWQuZGVtbyIsInN1YiI6InN1Yi5kZW1vIiwidXNlci1rZXkiOiJ0OTk5MDAwMSIsInVzZXItcm9sZSI6IltcInNpZ25ib2FyZC10ZXN0XCIsXCJzaWduYm9hcmQtZW50cnVzdG1lbnQtcGVyc29uYWxcIixcInNpZ25ib2FyZC1lbnRydXN0bWVudC11bml0XCIsXCJzaWduYm9hcmQtcmVwb3J0LWFwcHJvdmVcIixcInNpZ25ib2FyZC1icm93c2VcIl0iLCJpc3MiOiJpc3MuZGVtbyIsInNob3BzaWduLWF1dGgiOiJmZGtleSBleUpoYkdjaU9pSklVelV4TWlKOS5leUpqYjJSbElqb3dMQ0poZFhSb0lqcGJleUpoZFhSb2IzSnBkSGtpT2lKamFHRnVibVZzWDJGd2FTSjlMSHNpWVhWMGFHOXlhWFI1SWpvaWMyVmpjbVYwWDJacGJIUmxjbWx1WnlKOVhTd2ljbTlzWlVOdlpHVWlPaUpqYUdGdWJtVnNJaXdpYVdRaU9pSm1PR1psTVdJeVpXTXhNek0wTUdFellURTJOMlF4TUdVNU1tSm1ZelV6T1NJc0ltSmhjMlZVZVhCbElqb2lNRFVpTENKemRXSWlPaUpxWTNob01TSXNJbVY0Y0NJNk1UWTJPVGt3TURJMU1YMC5acTNxRjhJX3RSZm8xQW9hdnV6RVZYUEJnb0t3VTkwV3p4WWdRZ2RhMVY3Y29RV0NGMmpFTXMwQjNEQTJOQ1pjMWhGNlZlT0ZqS0pnSmxId2p0dkJRUSIsInVuaXQta2V5IjoiMDAwMCIsImV4cCI6MTY2OTkwMDM0NCwiaWF0IjoxNjY5ODU3MTQ0fQ.Wz_if6ehtKmguRMvY8pokr57bUR6TGeA0atSzO79K40";

//================================= 登录及重置按钮 ====================================
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      ruleForm.codeKey = storage.get("codeKey");
      const { userName, pwd, code } = ruleForm;
      const data = loginAction(ruleForm);
      data.then((response) => {
        const returnData = response.data;
        if (returnData.resultCode == 60014 || returnData.resultCode == 60013) {
          dialogVisible1.value = true;
          msg.value += 1;
          formEl.resetFields();
        } else if (returnData.code == 200) {
          const token = "Bearer " + returnData.data.token;
          //const token = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhdWQuZGVtbyIsInN1YiI6InN1Yi5kZW1vIiwidXNlci1rZXkiOiJ0OTk5MDAwMSIsInVzZXItcm9sZSI6IltcInNpZ25ib2FyZC10ZXN0XCIsXCJzaWduYm9hcmQtZW50cnVzdG1lbnQtcGVyc29uYWxcIixcInNpZ25ib2FyZC1lbnRydXN0bWVudC11bml0XCIsXCJzaWduYm9hcmQtcmVwb3J0LWFwcHJvdmVcIixcInNpZ25ib2FyZC1icm93c2VcIl0iLCJpc3MiOiJpc3MuZGVtbyIsInNob3BzaWduLWF1dGgiOiJmZGtleSBleUpoYkdjaU9pSklVelV4TWlKOS5leUpqYjJSbElqb3dMQ0poZFhSb0lqcGJleUpoZFhSb2IzSnBkSGtpT2lKamFHRnVibVZzWDJGd2FTSjlMSHNpWVhWMGFHOXlhWFI1SWpvaWMyVmpjbVYwWDJacGJIUmxjbWx1WnlKOVhTd2lZMmhsWTJ0VmJtbDBTV1FpT2lJeE9UYzVZekF5WkdRM05qUTBaVEU0WWpRNE1UazJOR1JrWXpWaU1tRXpNaUlzSW5KdmJHVkRiMlJsSWpvaVkyaGhibTVsYkNJc0ltbGtJam9pWmpobVpURmlNbVZqTVRNek5EQmhNMkV4Tmpka01UQmxPVEppWm1NMU16a2lMQ0ppWVhObFZIbHdaU0k2SWpBMUlpd2ljM1ZpSWpvaWFtTjRhREVpTENKbGVIQWlPakUyTnpNeU9UTXlOak45LkczUk9MblRJSEdkT24yUWZ1eWxNcjVvMjhMbVJZd3Z2Vy1sOXVmNExCOEhWaFVjZHBTX080NE8waFBwLUR2QUUtYXpIWVhBNUlvTTlQSDRVYVlpY2V3IiwidW5pdC1rZXkiOiIwMDAwIiwiZXhwIjoxNjczMjkzMzk3LCJpYXQiOjE2NzMyNTAxOTd9.44ozX1NYRQ4OtywCpATsb-nEwCTX-r94qX4m9vMA7LU"
          storage.set("token", token);
          storage.set("detectionUnitName", returnData.data.detectionUnitName);
          storage.set("accountName", returnData.data.username);
          router.push({
            name: "home",
          });
        } else {
          dialogVisible.value = true;
          message.value = returnData.resultMessage.slice(18);
        }
      });
    } else {
      console.log("error submit!", fields);
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const handleClick = () => {
  dialogVisible1.value = false;
  dialogVisible.value = false;
  router.go(0);
};
</script>

<template>
  <div class="login_container">
    <div class="login_header">上 海 市 建 设 工 程 检 测 信 息 管 理 系 统</div>
    <div class="header_en">
      Shanghai Construction Engineering Test Information management system
      <br />
      <br />
    </div>
    <img src="../assets/bg.png" class="inputImg" />

    <div class="login_box">
      <img src="../assets/scetia.png" class="avatar_box" />
      <!-- 登录表单区域 -->
      <el-form
        class="loginForm"
        ref="ruleFormRef"
        :rules="rules"
        :model="ruleForm"
        size="formSize"
      >
        <!-- 输入用户名-->
        <el-form-item label="账号" prop="userName">
          <el-input
            label="inputname"
            v-model="ruleForm.userName"
            placeholder="请输入登录账号"
            class="loginBox"
          >
          </el-input>
        </el-form-item>

        <!-- 输入密码-->
        <el-form-item label="密码" prop="pwd">
          <el-input
            v-model="ruleForm.pwd"
            type="password"
            placeholder="请输入登录账号"
            class="pwdBox"
          />
        </el-form-item>

        <el-form-item label="验证码" prop="code">
          <div class="captcha-text">
            <el-input
              placeholder="请输入验证码"
              v-model="ruleForm.code"
              class="veriCode"
            ></el-input>
          </div>
          <div class="captcha-code">
            <Security ref="securityRefs" :msg="msg"></Security>
          </div>
        </el-form-item>

        <!-- 登录按钮-->
        <el-button
          type="success"
          class="btnLogin"
          @click="submitForm(ruleFormRef)"
          >登录</el-button
        >
        <el-button type="info" class="btnLogin" @click="resetForm(ruleFormRef)"
          >重置</el-button
        >
      </el-form>
    </div>

    <!-- 登录失败弹窗 -->
    <el-dialog v-model="dialogVisible" title="登录失败" width="30%">
      <span class="font">{{message}}</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleClick()">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 验证码错误弹窗 -->
    <el-dialog v-model="dialogVisible1" title="验证码错误" width="30%">
      <span class="font">请输入正确的验证码</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleClick()">确认</el-button>
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

.login_header {
  font-size: 40px;
  font-weight: bold;
  background: rgb(240 255 240);
}

.header_en {
  font-size: 20px;
  background: rgb(240 255 240);
}

.login_box {
  width: 550px;
  height: 400px;
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

.loginBox {
  margin-left: 13px;
}

.pwdBox {
  margin-left: 13px;
}

.btn {
  text-align: center;
}

.inputImg {
  display: absolute;
  width: 81%;
  height: 900px;

}

.btnLogin {
  margin-top: 20px;
}

.veriCode {
  display: inline;
  width: 10 px;
}

.captcha-code {
  display: inline;
  width: 10px;
}

.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px;
  border-radius: 20%;
  padding: 10px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  img {
    width: 100%;
    height: 100%;
  }
}

.font{
  font-size:16px;
  font-weight: bold;
}
</style>
