<script setup lang="ts">
import IconExpand from '@/components/icons/IconExpand.vue'
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import moment from 'moment'
import { uuid } from '@/utils'
import { useChatStore } from '@/stores/chat'
import { useUserStore } from '@/stores/user'
import { useClipboard } from '@vueuse/core'
import useIsMobile from '@/hooks/useIsMobile'

const chatStore = useChatStore()
const { isMobile } = useIsMobile()

const { cleanMessage, addMessage, generateAssistantMsg } = chatStore
const { prompt, currentMessage, generateLoading } = storeToRefs(chatStore)

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const keyword = ref('')
const keywordRef = ref<HTMLInputElement>()
const expandKeywordRef = ref<HTMLInputElement>()

const screenshotLoading = ref(false)
const screenshotUrl = ref('')
const screenshotModal = ref(false)
const expandInputDialogVisible = ref(false)

/**
 * 发送消息
 */
const handleSendMsg = () => {
  if (!keyword.value || generateLoading.value) return
  addMessage({
    id: uuid(),
    content: keyword.value,
    role: 'user',
    time: moment().format('YYYY-MM-DD HH:mm:ss')
  })
  generateAssistantMsg(keyword.value)
  keyword.value = ''
}
const onKeyDown = (event: KeyboardEvent, expand?: boolean) => {
  if (event.shiftKey && event.key === 'Enter') {
  } else {
    if (event.key === 'Enter') {
      if (expand) {
        expandInputDialogVisible.value = false
        keywordRef.value?.focus()
      }
      handleSendMsg()
      event.preventDefault() // 阻止浏览器默认的换行操作
      return false
    }
  }
}

watch(
  () => chatStore.prompt,
  () => {
    keyword.value = prompt.value
    keywordRef.value?.focus()
  }
)

/**
 * 截屏
 */
const onScreenshot = () => {
  screenshotLoading.value = true
  const el: any = document.getElementById('msgList')
  const width = el.clientWidth
  const height = el.clientHeight
  const filter = function (node: HTMLElement) {
    return !(node && node.classList && Array.from(node.classList).includes('d2image-ignore'))
  }
  // @ts-ignore
  domtoimage
    .toJpeg(el, {
      width,
      height,
      quality: 1,
      filter
    })
    .then(function (dataUrl: string) {
      screenshotUrl.value = dataUrl
      screenshotModal.value = true
      screenshotLoading.value = false
    })
    .catch((err) => {
      screenshotLoading.value = false
    })
}
const btnSize = computed(() => {
  return isMobile.value ? 'small' : 'large'
})
const onExpandIconClick = () => {
  expandInputDialogVisible.value = true
}
const onExpandInputDialogOpened = () => {
  expandKeywordRef.value?.focus()
}
const onExpandInputDialogClose = () => {
  keywordRef.value?.focus()
}
</script>

<template>
  <footer class="sm-p4 p-2 p-b-6 btl b-t-gray-100" :class="isMobile ? 'mobileFooter' : 'pcFooter'">
    <div class="w-full h-full max-w-screen-xl m-auto flex items-center">
      <el-button
        class="mr-2 sm:mr-4"
        :size="btnSize"
        type="danger"
        circle
        :disabled="generateLoading || !currentMessage?.history.length"
        @click="cleanMessage"
      >
        <el-icon><Delete /></el-icon>
      </el-button>
      <div class="flex-1 relative footerInput">
        <el-input
          ref="keywordRef"
          v-model="keyword"
          :placeholder="`说点什么吧......${
            isMobile ? '' : '( 1.Enter = 发送   2.Shift + Enter = 换行 )'
          }`"
          type="textarea"
          :autosize="{
            minRows: isMobile ? 1 : 1.7,
            maxRows: isMobile ? 1 : 1.7
          }"
          resize="none"
          :autofocus="true"
          :show-word-limit="isMobile ? false : true"
          :maxlength="userInfo.max_length || 1000"
          @keydown="onKeyDown"
        >
        </el-input>
        <el-tooltip content="展开" placement="top" v-if="!isMobile">
          <el-icon
            class="text-#777 absolute right-34 top-2 text-4 cursor-pointer"
            @click="onExpandIconClick"
          >
            <IconExpand />
          </el-icon>
        </el-tooltip>
        <el-button
          class="absolute right-1 sm:top-50% top-1 sm:mt--1.25rem sm-w-30 w-12 sm-ml-4 ml-2"
          :size="btnSize"
          type="primary"
          :disabled="!keyword || generateLoading"
          @click="handleSendMsg"
        >
          <el-icon class="text-3 sm:text-5"><Promotion /></el-icon>
        </el-button>
      </div>
      <el-button
        class="sm-w-10 w-2 ml-2 sm:ml-4"
        type="danger"
        :size="btnSize"
        @click="onScreenshot"
        :loading="screenshotLoading"
        :disabled="generateLoading || !currentMessage?.history.length"
      >
        <el-icon class="text-3 sm:text-5" v-if="!screenshotLoading"><CameraFilled /></el-icon>
      </el-button>
    </div>

    <el-dialog
      v-model="expandInputDialogVisible"
      @close="onExpandInputDialogClose"
      @opened="onExpandInputDialogOpened"
      title="展开编辑"
      width="40%"
      align-center
    >
      <el-input
        ref="expandKeywordRef"
        v-model="keyword"
        :placeholder="`说点什么吧......${
          isMobile ? '' : '( 1.Enter = 发送   2.Shift + Enter = 换行 )'
        }`"
        :rows="10"
        type="textarea"
        resize="none"
        :autofocus="true"
        :show-word-limit="true"
        :maxlength="userInfo.max_length || 1000"
        @keydown="(e) => onKeyDown(e, true)"
      >
      </el-input>
    </el-dialog>

    <el-dialog
      :title="isMobile ? '长按保存图片' : '右键复制或保存图片'"
      class="w-90% sm:w-80%"
      align-center
      v-model="screenshotModal"
    >
      <el-scrollbar class="w-full fc h-120">
        <img :src="screenshotUrl" class="w-full h-auto" />
      </el-scrollbar>
    </el-dialog>
  </footer>
</template>
<style lang="less">
.pcFooter {
  .footerInput {
    .el-textarea__inner {
      padding-right: 12rem;
    }
    .el-textarea .el-input__count {
      right: 8rem;
    }
    .el-textarea__inner {
      padding-right: 12rem;
      // 隐藏滚动条
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
}
.mobileFooter {
  .el-textarea__inner {
    padding-right: 3.2rem;
  }
}
</style>
