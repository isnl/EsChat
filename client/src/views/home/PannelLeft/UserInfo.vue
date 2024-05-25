<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { service } from '@/service'
import { ElMessage } from 'element-plus'
import { AVATARS } from './constant'

const userStore = useUserStore()

const { getUserInfo } = useUserStore()
const { userInfo } = storeToRefs(userStore)

const nameVisible = ref(false)
const inputName = ref('')
const nameInputRef = ref()
const confirmLoading = ref(false)

const avatarVisible = ref(false)
const avatarSelected = ref('')

onBeforeMount(() => {
  getUserInfo()
})

const percentage = computed(() => {
  return (userInfo.value.current / userInfo.value.daily_limit) * 100
})
const colors = [
  { color: '#e6a23c', percentage: 20 },
  { color: '#5cb87a', percentage: 40 },
  { color: '#1989fa', percentage: 60 },
  { color: '#6f7ad3', percentage: 80 },
  { color: '#f56c6c', percentage: 100 }
]

const openNameDialog = () => {
  inputName.value = userInfo.value.name
  nameVisible.value = true
}
const onNameDialogOpened = () => {
  nameInputRef.value.focus()
}
const onNameDialogClosed = () => {
  inputName.value = ''
}
const onOpenAvatarDialog = () => {
  avatarSelected.value = userInfo.value.avatar
  avatarVisible.value = true
}
const onAvatarClick = (avatar: string) => {
  avatarSelected.value = avatar
}
const onNameSubmit = () => {
  updateUserInfo({
    name: inputName.value
  })
}
const onAvatarSubmit = () => {
  updateUserInfo({
    avatar: avatarSelected.value
  })
}
const updateUserInfo = async (params: { name?: string; avatar?: string }) => {
  confirmLoading.value = true
  await service.put('/user', params)
  confirmLoading.value = false
  nameVisible.value = false
  avatarVisible.value = false
  ElMessage.success('修改成功')
  getUserInfo()
}
</script>

<template>
  <div class="w-full bbl p-4 min-h-50">
    <el-progress
      type="dashboard"
      :percentage="percentage ? percentage : 0"
      :color="colors"
      :stroke-width="8"
      :width="200"
      class="w-full flex flex-col items-center"
    >
      <template #default>
        <div class="w-full flex flex-col items-center">
          <div
            class="b-rd-[50%] bg-gray-200 flex w-18 h-18 p-2 cursor-pointer relative hover-animate-spin"
            @click="onOpenAvatarDialog"
          >
            <img
              class="w-full h-full b-rd-[50%]"
              :src="`/avatar/${userInfo.avatar}.svg`"
              v-show="userInfo.avatar"
            />
          </div>
          <div class="mt-2 text-sm fc">
            <span>{{ userInfo.name }}</span>
            <el-icon @click="openNameDialog" class="cursor-pointer ml-2"><Edit /></el-icon>
          </div>
        </div>
      </template>
    </el-progress>
    <div class="w-full flex justify-center items-center text-sm text-[#a0a0a0] text-xs">
      <span>当天调用次数：</span>
      <span class="text-green-4">{{ userInfo.current }}</span>
      <span class="m-x-1">/</span>
      <span class="font-500 text-red-5">{{ userInfo.daily_limit }}</span>
    </div>
  </div>
  <!-- 昵称修改 -->
  <el-dialog
    class="w-80"
    align-center
    v-model="nameVisible"
    title="昵称修改"
    @opened="onNameDialogOpened"
    @closed="onNameDialogClosed"
  >
    <el-input
      v-model="inputName"
      :maxlength="15"
      :show-word-limit="true"
      placeholder="请输入昵称"
      ref="nameInputRef"
      @keyup.enter.native="onNameSubmit"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button :maxLength="12" type="primary" :loading="confirmLoading" @click="onNameSubmit"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>

  <!-- 头像修改 -->
  <el-dialog class="w-200" align-center v-model="avatarVisible" title="头像修改">
    <div class="w-full flex flex-wrap">
      <div
        class="w-10 h-10 cursor-pointer b-rd-2 hover:(bg-#ccc)"
        :class="{ 'bg-#ccc': avatarSelected === item }"
        v-for="item in AVATARS"
        @click="onAvatarClick(item)"
        :key="item"
      >
        <img class="w-full h-full b-rd-[50%]" :src="`/avatar/${item}.svg`" />
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button :maxLength="12" type="primary" :loading="confirmLoading" @click="onAvatarSubmit"
          >确定</el-button
        >
      </span>
    </template></el-dialog
  >
</template>
<style>
.el-table .success-row {
  /* --el-table-tr-bg-color: var(--el-color-success-light-9); */
  color: var(--el-color-success);
  font-weight: 900;
}
.el-table .success-row .el-table__cell .cell {
  font-weight: bold;
}
</style>
