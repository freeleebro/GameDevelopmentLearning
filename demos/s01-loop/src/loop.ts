// loop.ts —— 游戏主循环。**这个文件是 S01-T1 的核心，由你写。**
//
// 唯一要求：不许引入任何第三方库（Phaser / 引擎 / 动画库全部禁止）。
//
// 目标是让 main.ts 里的两个回调按正确节奏被调用：
//   onUpdate(dt) —— 推进一次世界状态，dt 单位是「秒」
//   onRender()   —— 把当前状态画到画布上
//
// 提示（先别看答案，卡住再逐级使用）：
//   1. 浏览器自带的驱动是 requestAnimationFrame(callback)
//   2. 回调会收到一个时间戳参数（高精度毫秒），它从页面加载开始计时
//   3. 一帧的先后顺序：算时间 → 更新 → 绘制 → 预约下一帧

export function startLoop(
  onUpdate: (dt: number) => void,
  onRender: () => void,
): void {
  // TODO(T1)：在这里实现循环。
  //   需要你自己决定：上一帧时间戳存在哪、首次调用时 dt 应该是多少、dt 用毫秒还是秒。
  //
  // 验收前先回答三个问题（写进 notes/stage01/ 的笔记）：
  //   a. 如果在绘制之前不调用 ctx.clearRect，屏幕会变成什么样？为什么？
  //   b. 如果把 requestAnimationFrame 换成 for (;;) { ... }，会发生什么？
  //   c. requestAnimationFrame 的回调参数是什么？单位和起点是什么？
}
