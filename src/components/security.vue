<template>
  <div class="format" @click="refreshCode">
    <img :src="arr" />
  </div>
</template>


<script setup lang="ts">
import {
  watch,
  ref,
  onMounted,
  getCurrentInstance,
  toRefs,
  defineExpose,
  defineProps,
} from "vue";

const currentInstance = getCurrentInstance();
const { $axios } = currentInstance.appContext.config.globalProperties;
import { identifyingCode } from "../api/apiRequest";

let arr = ref("");
let codeKey = ref("err in son");

const props = defineProps({
  msg: {
    type: Number,
    default: -1,
  },
});

onMounted(() => {
  // 验证码请求
  const request = identifyingCode();
  request.then((response) => {
    arr.value = response.data.data.image;
    codeKey.value = response.data.data.codeKey;
  });
});

watch(
  () => props.msg,
  (val, preVal) => {
    if (val != preVal) {
      const request = identifyingCode();
      request.then((response) => {
        arr.value = response.data.data.image;
        codeKey.value = response.data.data.codeKey;
      });
    }
  },
  {
    deep: true,
  }
);

/**
 * 点击刷新
 */
const refreshCode = async (params) => {
  //verificationUrl.value = Service.parse('queryCaptcha')

  const request = identifyingCode();
  request.then((response) => {
    arr.value = response.data.data.image;
    codeKey.value = response.data.data.codeKey;
    console.log("sonnnnn2222222222222222 ", codeKey.value);
  });
};

const getData = () => {
  const request = identifyingCode();
  request.then((response) => {
    arr.value = response.data.data.image;
    codeKey.value = response.data.data.codeKey;
    console.log("infunctionnnnnnn ", codeKey.value);
  });
};

defineExpose({ codeKey });
</script>

<style lang="scss" scoped>
.verification-code {
  vertical-align: middle;
  cursor: pointer;
}

.format {
  height: 30px;
  width: 180px;
  display: flex;
  margin-left: 22px;
}
</style>

<!-- let canvas = document.getElementById("mycanvas");//创建canvas
let context = canvas.getContext("2d"); //创建画布 img.setAttribute("crossOrigin", "anonymous"); //解决图片跨域问题,也要放到赋值前，否ze大部分浏览器会报错
let img = new Image(); //因为拿不到图片静态资源，所以创建图片标签
//加载图片
img.onload = () => {
  canvas.setAttribute("width",img.width)
  canvas.setAttribute("height",img.height)
  //绘制图片
  context.drawImage(img,0,0,img.width,img.height);
  //字体大小
  context.font = "90px Arial";
  //字体文字，显示位置  图片上需要n个文字就写n个context.fillText(文字,上下,左右);
  context.fillText("hjels", 420, 1150);
  context.fillText("ds", 2700, 1020);
  //合成图片
  this.image = canvas.toDataURL("image/jpg", 1.0);
} -->