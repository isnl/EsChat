import { useClipboard } from '@vueuse/core'
import { ElMessage } from 'element-plus'
export const copy = (text: string, message?: string) => {
  useClipboard().copy(text)
  ElMessage.success(message || '复制成功')
}
