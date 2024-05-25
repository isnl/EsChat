<script lang="ts" setup>
const featuresLeft = [
  '🎆 10s极速登录 - 1.关注公众号，2.发送 "登录" 获取验证码"，3.输入验证码，登录成功！',
  '🎈 是登录！登录！登录！不是登陆！！！',
  `🎁 每日均可获得免费使用机会`,
  '🎉 官方角色列表任意使用',
  '📷 支持对话截图功能',
]
const featuresRight = [
  '📲 完美的PC和移动端兼容，体验Nice',
  '🎊 无需担心数据隐私问题，因为数据只存在本地缓存',
  '🎇 连续的上下文对话支持，可创建多轮对话记录',
  '🎄 整段生成内容的快捷复制、代码复制、代码高亮',
  '🔨 高频次更新，持续优化中......',
]
</script>
<template>
  <div
    class="flex-1 w-full h-full max-w-screen-xl lg:p-x-4 sm:p-x-4 m-auto p-y-4 p-x-3 flex flex-col sm:flex-row"
  >
    <div class="flex-1 h-full px-2 sm:brl sm:b-r-dashed">
      <div
        v-for="item in featuresLeft"
        class="rounded-md p-2 bg-[#d2f9d1] dark:bg-[#2f2f32] mb-4 text-xs text-[#2f2f32] dark-text-[#b4bbc4]"
        :key="item"
        v-html="item"
      ></div>
    </div>
    <div class="flex-1 h-full px-2">
      <div
        v-for="item in featuresRight"
        class="text-right rounded-md p-2 bg-[#d2f9d1] dark:bg-[#2f2f32] mb-4 text-xs text-[#2f2f32] dark-text-[#b4bbc4]"
        :key="item"
        v-html="item"
      ></div>
    </div>
  </div>
</template>
