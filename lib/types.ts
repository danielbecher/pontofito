export type User = {
  id: string
  email: string
  name?: string
  active: boolean
  role: 'employee' | 'admin'
}

export type Punch = {
  id: string
  userId: string
  timestamp: number
  dateKey: string
  type: 'in' | 'out'
  manual: boolean
  ip: string
}
