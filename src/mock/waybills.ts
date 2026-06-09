import type { Waybill } from '@/types'

const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安', '南京', '重庆']

const surnames = ['张', '李', '王', '刘', '陈', '杨', '黄', '赵', '周', '吴', '徐', '孙', '马', '朱', '胡']

const names = ['伟', '芳', '娜', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '娟', '涛']

const streets = ['中山路', '人民路', '解放路', '建设路', '文化路', '科技路', '和平路', '幸福路', '青年路', '长江路']

const statusTexts = {
  pickup: ['快件已揽收', '快递员已取件', '包裹已收寄'],
  transit: ['快件正在运输中', '快件正在派送中', '快件已到达', '快件已发出'],
  arrive: ['已到达', '抵达'],
  signed: ['快件已签收', '已签收', '签收成功'],
  exception: ['地址不详', '联系不上收件人', '收件人拒收', '包裹破损', '天气原因延误']
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

function generateId(): string {
  const prefix = 'SF'
  const num = Math.random().toString().slice(2, 14)
  return prefix + num
}

function generateReceiver(): string {
  return randomItem(surnames) + randomItem(names)
}

function generateAddress(): string {
  const city = randomItem(cities)
  const street = randomItem(streets)
  const num = randomInt(1, 999)
  return `${city}市${street}${num}号`
}

function generateTimeline(status: Waybill['status']): { timeline: Waybill['timeline']; currentNode: string; updateTime: string } {
  const now = new Date()
  const nodes: Waybill['timeline'] = []
  
  const baseTime = new Date(now.getTime() - randomInt(2, 5) * 24 * 60 * 60 * 1000)
  
  nodes.push({
    location: `${randomItem(cities)}市快递网点`,
    time: formatDate(baseTime),
    status: randomItem(statusTexts.pickup)
  })
  
  const transitCount = randomInt(2, 3)
  let lastTime = baseTime
  for (let i = 0; i < transitCount; i++) {
    lastTime = new Date(lastTime.getTime() + randomInt(4, 12) * 60 * 60 * 1000)
    const city = randomItem(cities)
    nodes.push({
      location: `${city}市分拣中心`,
      time: formatDate(lastTime),
      status: `${randomItem(statusTexts.arrive)}${city}分拣中心`
    })
  }
  
  if (status === 'signed') {
    lastTime = new Date(lastTime.getTime() + randomInt(2, 8) * 60 * 1000)
    nodes.push({
      location: `${randomItem(cities)}市派送网点`,
      time: formatDate(lastTime),
      status: randomItem(statusTexts.signed)
    })
  } else if (status === 'exception') {
    lastTime = new Date(lastTime.getTime() + randomInt(1, 6) * 60 * 60 * 1000)
    nodes.push({
      location: `${randomItem(cities)}市派送网点`,
      time: formatDate(lastTime),
      status: randomItem(statusTexts.exception)
    })
  } else {
    lastTime = new Date(lastTime.getTime() + randomInt(1, 12) * 60 * 60 * 1000)
    const city = randomItem(cities)
    nodes.push({
      location: `${city}市分拣中心`,
      time: formatDate(lastTime),
      status: `${randomItem(statusTexts.arrive)}${city}分拣中心`
    })
  }
  
  const timeline = nodes.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
  
  const lastNode = timeline[timeline.length - 1]
  
  return {
    timeline,
    currentNode: lastNode.status,
    updateTime: lastNode.time
  }
}

function generateWaybill(): Waybill {
  const statuses: Waybill['status'][] = ['in_transit', 'in_transit', 'in_transit', 'signed', 'signed', 'signed', 'exception']
  const status = randomItem(statuses)
  const { timeline, currentNode, updateTime } = generateTimeline(status)
  
  return {
    id: generateId(),
    receiver: generateReceiver(),
    address: generateAddress(),
    status,
    currentNode,
    updateTime,
    timeline
  }
}

const mockWaybills: Waybill[] = Array.from({ length: 30 }, () => generateWaybill())

export function fetchWaybills(): Promise<Waybill[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockWaybills)
    }, 800)
  })
}
