<script setup lang="ts">
import UserInfo from './UserInfo.vue'
import SessionRecord from './SessionRecord.vue'
import { ElMessage, ElScrollbar } from 'element-plus'
import { useDark, useClipboard } from '@vueuse/core'
import IconMoon from '@/components/icons/IconMoon.vue'
import { ref } from 'vue'
import api from '@/service'
const iconCommonClass =
  'w-8 h-8 flex justify-center items-center text-5 dark:hover:bg-light hover:bg-dark cursor-pointer z-1 absolute left-0 top-0 text-[#2f2f32] dark-text-[#b4bbc4] hover:text-[#b4bbc4] dark:hover:text-[#2f2f32]'

const isDark = useDark()
const { copy } = useClipboard()

const shareList = ref([])
const shareTotal = ref(0)

const toggleDark = () => {
  isDark.value = !isDark.value
}
const getShareList = async () => {
  const res: any = await api.get('user/share')
  shareList.value = res.data.list
  shareTotal.value = res.data.total
}
</script>

<template>
  <el-scrollbar height="100%" ref="scrollbarRef" view-class="h-full">
    <div :class="iconCommonClass" @click="toggleDark">
      <el-icon v-if="!isDark"><Sunny /></el-icon>
      <el-icon v-else><IconMoon /></el-icon>
    </div>
    <div class="w-full h-full flex flex-col py-4 sm:p-4">
      <UserInfo />
      <SessionRecord />
    </div>
  </el-scrollbar>
</template>
