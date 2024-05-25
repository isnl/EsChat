import { defineStore } from 'pinia'
import moment from 'moment'
import { randomString, uuid } from '@/utils'
import { useTokenStore } from '@/stores/token'
import { useUserStore } from '@/stores/user'
import { BASE_URL } from '@/service/axios'

export const useChatStore = defineStore('chatStore', {
  state: () => ({
    version: 0,
    chatInfo: {
      messages: [],
      record: [],
      active: null
    } as ChatInfo,
    generateLoading: false,
    abortController: null as AbortController | null,
    prompt: ''
  }),
  actions: {
    /**
     * 初始化
     */
    init() {
      if (!this.chatInfo.active) {
        this.addRecord()
      }
    },
    setActive(id: string) {
      this.chatInfo.active = id
    },
    addRecord(name?: string) {
      const id = uuid()
      this.chatInfo.active = id
      const str = randomString(6)
      this.chatInfo.record.push({
        id,
        name: name ? name : str + '-新对话'
      })
      this.chatInfo.messages.push({
        id,
        history: []
      })
    },
    deleteRecord(id: string) {
      const recordIndex = this.chatInfo.record.findIndex((item) => item.id === id)
      this.chatInfo.record.splice(recordIndex, 1)
      const messageIndex = this.chatInfo.messages.findIndex((item) => item.id === id)
      this.chatInfo.messages.splice(messageIndex, 1)
      this.chatInfo.active = this.chatInfo.record[0]?.id || null
    },
    updateRecord(id: string, name: string) {
      const index = this.chatInfo.record.findIndex((item) => item.id === id)
      this.chatInfo.record[index].name = name
    },
    getCurrentMessage() {
      const { active, messages } = this.chatInfo
      return messages.find((item) => item.id === active)
    },
    addMessage(message: MessageHistory) {
      const currentMessage = this.getCurrentMessage()
      if (currentMessage) {
        // 默认以第一条用户消息命名record
        if (!currentMessage.history.length) {
          this.currentRecord!.name = message.content
        }
        currentMessage.history.push(message)
      }
    },
    updateMessage(params: UpdateItem) {
      const { id, word, parentMessageId, role, time } = params
      const currentMessage = this.getCurrentMessage()
      let msgInfo = currentMessage?.history.find((item) => item.id === id)
      if (msgInfo) {
        msgInfo.content += word
        msgInfo.role = role || msgInfo.role
        msgInfo.time = time || msgInfo.time
        if (parentMessageId) {
          msgInfo.parentMessageId = parentMessageId
        }
      }
    },
    getParentMessageId() {
      const currentMessage = this.getCurrentMessage()
      const msg = JSON.parse(JSON.stringify(currentMessage?.history))
        .reverse()
        .find((item: MessageHistory) => item.role === 'assistant')
      if (msg) {
        return { parentMessageId: msg.parentMessageId }
      } else {
        return {}
      }
    },
    cleanMessage() {
      const currentMessage = this.getCurrentMessage()
      currentMessage!.history = []
    },
    setGenerateLoading(value: boolean) {
      this.generateLoading = value
    },
    async generateAssistantMsg(keyword: string) {
      const tokenStore = useTokenStore()
      const userStore = useUserStore()
      const id = uuid()
      const parentMessageInfo = this.getParentMessageId()

      try {
        this.abortController = new AbortController()
        this.setGenerateLoading(true)
        this.addMessage({
          id,
          keyword,
          content: '',
          role: 'assistant',
          time: moment().format('YYYY-MM-DD HH:mm:ss')
        })
        const response = await fetch(`${BASE_URL}chat`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenStore.token}`
          },
          method: 'POST',
          body: JSON.stringify({
            message: keyword,
            ...parentMessageInfo
          }),
          signal: this.abortController.signal
        })
        if (!response.ok) {
          const res = await response.json()
          if (res.code === 10002) {
            const str = `今日服务调用次数已达上限`
            throw new Error(str)
          } else {
            throw new Error(res.message || 'Error')
          }
        }
        const data = response.body
        if (!data) throw new Error('No data')

        const reader = data.getReader()
        const decoder = new TextDecoder('utf-8')
        let done = false

        while (!done) {
          const { value, done: readerDone } = await reader.read()
          if (value) {
            const char = await decoder.decode(value)
            try {
              const list = char.split('\n').filter((item) => item)
              list.forEach((item) => {
                const obj = JSON.parse(item)
                this.updateMessage({
                  id,
                  word: obj.delta,
                  parentMessageId: obj.id
                })
              })
            } catch (error: any) {
              console.log('error:', error.message)
            }
          }
          done = readerDone
        }
        userStore.getUserInfo()
        this.setGenerateLoading(false)
      } catch (error: any) {
        if (error['name'] === 'AbortError') return
        this.updateMessage({
          id,
          word: error.message,
          role: 'error',
          time: moment().format('YYYY-MM-DD HH:mm:ss')
        })
        userStore.getUserInfo()
        this.setGenerateLoading(false)
      }
    },
    getPrevKeyword() {
      const currentMessage = this.getCurrentMessage()
      const msg = JSON.parse(JSON.stringify(currentMessage?.history))
        .reverse()
        .find((item: MessageHistory) => item.role === 'user')
      if (msg) {
        return msg.content
      } else {
        return ''
      }
    },
    /**
     * 重新生成
     * @param item
     * @param index
     */
    reGenerateAssistantMsg(item: MessageHistory, index: number) {
      const currentMessage = this.getCurrentMessage()
      if (item.role === 'user') {
        currentMessage!.history = currentMessage!.history.slice(0, index + 1)
        this.generateAssistantMsg(item.content)
      } else {
        currentMessage!.history = currentMessage!.history.slice(0, index)
        const { keyword } = item
        if (keyword) {
          this.generateAssistantMsg(keyword)
        } else {
          this.generateAssistantMsg(this.getPrevKeyword())
        }
      }
    },
    /**
     * 删除message
     * 如果有systemRole，只删除当前index对应的数据
     * @param index
     */
    deleteMessage(index: number) {
      const currentMessage = this.getCurrentMessage()
      if (this.currentRecord?.systemRole) {
        currentMessage!.history.splice(index, 1)
      } else {
        currentMessage!.history = currentMessage!.history.slice(0, index)
      }
    },
    // 停止响应
    abort() {
      this.abortController?.abort()
      this.setGenerateLoading(false)
      this.abortController = null
      const userStore = useUserStore()
      userStore.getUserInfo()
    },
    setPrompt(value: string) {
      this.prompt = value
    }
  },
  getters: {
    currentMessage: (state) => {
      return state.chatInfo.messages.find((item) => item.id === state.chatInfo.active)
    },
    currentRecord: (state) => {
      return state.chatInfo.record.find((item) => item.id === state.chatInfo.active)
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        paths: ['chatInfo'],
        storage: localStorage
      }
    ]
  }
})
export interface SystemRole {
  _id: number
  title: string
  content: string
  usageCount?: number
}

export interface MessageItem {
  id: string
  history: MessageHistory[]
}

export interface MessageHistory {
  id: string
  parentMessageId?: string
  keyword?: string
  role: 'user' | 'assistant' | 'error'
  time: string
  content: string
}

export interface RecordItem {
  id: string
  name: string
  systemRole?: SystemRole
}

export interface UpdateItem {
  id: string
  parentMessageId?: string
  keyword?: string
  word: string
  role?: 'user' | 'assistant' | 'error'
  time?: string
}

export interface ChatInfo {
  messages: MessageItem[]
  record: RecordItem[]
  active: string | null
}
