import { defineStore } from 'pinia'
import service from '@/service'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    userInfo: {
      avatar: '',
      name: '',
      daily_limit: 0,
      current: 0,
      _id: ''
    } as UserInfo
  }),
  actions: {
    async getUserInfo() {
      const res = await service.get('user')
      this.userInfo = res.data
    },
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
    }
  }
})
export interface UserInfo {
  avatar: string
  name: string
  daily_limit: number
  current: number
  max_length?: number
  _id: string
  openId: string
}
