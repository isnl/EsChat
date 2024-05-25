<script setup lang="ts">
import { onBeforeMount, onMounted } from 'vue'
import { useCopyCode } from '@/hooks/useCopyCode'
import usePageActive from '@/hooks/usePageActive'
import { MessageList, PromptStore } from './Sections'
import { LoginModal, MobileHeader } from './components'
import { PannelLeft } from './PannelLeft'

import { useLoginStore } from '@/stores/login'
import { useChatStore } from '@/stores/chat'

useCopyCode()
usePageActive()

const loginStore = useLoginStore()
const chatStore = useChatStore()

onBeforeMount(() => {
  chatStore.init()
})
onMounted(() => {})
</script>

<template>
  <LoginModal />
  <main class="w-full h-full sm-p-8 p-0 box-border bg-[#fff] dark:bg-dark" id="wrapper">
    <div
      class="wrapper w-full flex h-full sm-flex sm-b-rd-2 shadow-[0_0_10px_rgba(0,0,0,0.2)] dark:shadow-[0_0_10px_rgba(255,255,255,0.2)]"
    >
      <div
        v-if="loginStore.isLogin"
        class="brl b-rd-lt-2 b-rd-lb-2 w-80 lg-block hidden overflow-hidden"
      >
        <PannelLeft />
      </div>
      <div class="w-full sm:w-auto flex-1 flex flex-col">
        <MobileHeader />
        <div class="flex-1 flex overflow-hidden">
          <PromptStore />
          <MessageList />
        </div>
      </div>
    </div>
  </main>
  <NoticeModal />
</template>
