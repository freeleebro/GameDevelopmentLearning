// render.ts —— 绘制。**由你写。**
//
// 只负责「把世界画出来」，不修改世界状态，也不管时间。
// 一个纯函数：同样的 world 进去，同样的画面出来。

import type { World } from "./world";

export function render(ctx: CanvasRenderingContext2D, world: World): void {
  // TODO(T1)：清屏 + 画方块。
  //   思路：先 ctx.clearRect(0, 0, 800, 600) 把上一帧擦掉，再 ctx.fillRect(...) 画新的。
  //   颜色随你（建议 #4aa8ff，和 demo1 的玩家一致，方便对照）。
  //   想一想：为什么是「先清再画」，而不是「先画再清」？
}
