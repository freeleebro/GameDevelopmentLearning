// world.ts —— 世界状态。**由你写。**
//
// 这里只描述「游戏里有什么、每个逻辑步怎么变化」，不碰 canvas（不 import 任何绘制 API）。
// 这就是后面所有架构讨论的起点：状态与表现分离。

export interface World {
  /** 方块中心点 x（像素） */
  x: number;
  /** 方块中心点 y（像素） */
  y: number;
  /** 方块边长（像素） */
  size: number;
  /** 水平速度（像素/秒） */
  speed: number;
}

export function createWorld(): World {
  return { x: 100, y: 300, size: 40, speed: 200 };
}

/**
 * 推进一个逻辑步。
 * @param dt 这一步的时长，单位**秒**（不是毫秒）
 */
export function updateWorld(world: World, dt: number): void {
  // TODO(T1)：让方块动起来。
  //   T1 只要求「在动」，先别管帧率无关——直接 x += 固定值也能跑，T2 再来修它。
  //   但请在心里留一个问号：如果 x += 2，144Hz 和 60Hz 下速度一样吗？
}
