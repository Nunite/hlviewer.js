export interface ReplayState {
  cameraPos: [number, number, number]
  cameraRot: [number, number, number]
  entities: any[]
  prevCameraPos?: [number, number, number]  // 上一帧的位置
  prevTime: number                          // 上一帧的时间
  time: number                              // 当前时间
  velocity?: [number, number, number]       // 速度向量
  speed?: number                            // 速度标量
}

export class ReplayState {
  cameraPos: [number, number, number]
  cameraRot: [number, number, number]
  entities: any[]
  prevCameraPos?: [number, number, number]  // 上一帧的位置
  prevTime: number                          // 上一帧的时间
  time: number                              // 当前时间
  velocity?: [number, number, number]       // 速度向量
  speed?: number                            // 速度标量

  constructor(obj: any | null = null) {
    if (obj) {
      this.cameraPos = obj.cameraPos ? JSON.parse(JSON.stringify(obj.cameraPos)) : [0, 0, 0]
      this.cameraRot = obj.cameraRot ? JSON.parse(JSON.stringify(obj.cameraRot)) : [0, 0, 0]
      this.entities = obj.entities ? JSON.parse(JSON.stringify(obj.entities)) : []
      this.prevCameraPos = obj.prevCameraPos ? JSON.parse(JSON.stringify(obj.prevCameraPos)) : undefined
      this.prevTime = obj.prevTime || 0
      this.time = obj.time || 0
      this.velocity = obj.velocity ? JSON.parse(JSON.stringify(obj.velocity)) : undefined
      this.speed = obj.speed || 0
    } else {
      this.cameraPos = [0, 0, 0]
      this.cameraRot = [0, 0, 0]
      this.entities = []
      this.prevTime = 0
      this.time = 0
    }
  }

  feedFrame(frame: any) {
    switch (frame.type) {
      case 0:
      case 1: {
        this.cameraPos[0] = frame.camera.position[0]
        this.cameraPos[1] = frame.camera.position[1]
        this.cameraPos[2] = frame.camera.position[2]
        
        this.cameraRot[0] = frame.camera.orientation[0]
        this.cameraRot[1] = frame.camera.orientation[1]
        this.cameraRot[2] = frame.camera.orientation[2]

        this.time = frame.time

        break;
      }
    }
  }

  clone() {
    return new ReplayState(this)
  }
}
