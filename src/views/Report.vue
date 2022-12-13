<template>
    <div>
        this is report page...

        <iframe class="prism-player" :src="pdfUrl" width="100%" height="800px"></iframe>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, getCurrentInstance } from "vue";
import { useRoute } from "vue-router"
const route = useRoute();
const test = {"id" : 100}
const data = route.query;
console.log("reportttttttttt ", test);

const currentInstance = getCurrentInstance();
const { $axios } = currentInstance.appContext.config.globalProperties;
import { exportPdf } from '../api/apiRequest';
const outputData = exportPdf(test)
const pdfData = ref('');

outputData.then(response =>{
    pdfData.value = response.data;


    const binaryData = [];
    
    binaryData.push(pdfData.value);
    console.log("binaryyyyyyyyyyyyyyyy ", binaryData);
    let blob = new Blob(binaryData, { type: 'application/pdf;chartset=UTF-8' });
    const url = URL.createObjectURL( 
        blob
    );

    window.open(url)
    const uurl = URL.revokeObjectURL(blob)

    let pdfUrl = '/pdf/web/viewer.html?file=' + encodeURIComponent(url)
    
    //let pdfUrl = url
})

window.open('/pdf/web/viewer.html?file=' + encodeURIComponent(pdfData.value));
    
</script>

<style>

</style>