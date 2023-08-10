//消息类型

export type Messagetype = {
  from: string,
  body: string,
  timestamp: string
}


//redux核心状态

export type CoreState = {
  localID?: string//本地id
  incomingIDs?: string[]//请求连接我的
  currentActiveID?: string//当前链接我的ID
  history?: {[key: string]: Messagetype[]}
}

//消息类型
export enum DataType {
  FILE,
  MESSAGE
}

//消息具体字段
export type DataPayloadType = {
  type: DataType,
  payload: any
}