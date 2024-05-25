<script lang="ts" setup>
import { ref } from 'vue'
import PannelLeft from '../PannelLeft/index.vue'

const showPannel = ref(false)
const onTogglePannel = () => {
  showPannel.value = !showPannel.value
}
</script>
<template>
  <div class="flex items-center px-4 sm:hidden w-full h-12 bbl">
    <el-icon @click="onTogglePannel" class="text-6 color-[#24292f]"><Menu /></el-icon>

    <el-drawer v-model="showPannel" size="80%" :with-header="false"> <PannelLeft /></el-drawer>
  </div>
</template>
