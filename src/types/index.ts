export type WaybillStatus = 'in_transit' | 'signed' | 'exception'

export interface LogisticsNode {
  location: string
  time: string
  status: string
}

export interface Waybill {
  id: string
  receiver: string
  address: string
  status: WaybillStatus
  currentNode: string
  updateTime: string
  timeline: LogisticsNode[]
}

export type FilterType = 'all' | WaybillStatus
