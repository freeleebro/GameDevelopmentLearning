// main.ts —— 入口：把「画布」「世界」「循环」三样东西接起来
//
// 这个文件是**样板代码**，作用只是接线，不含任何需要你思考的逻辑。
// 注意分层：loop.ts 不知道 canvas 是什么，render.ts 不知道时间是什么。

import { createWorld, updateWorld } from "./world";
import { render } from "./render";
import { startLoop } from "./loop";

const canvas = document.querySelector<HTMLCanvasElement>("#game");
if (!canvas) throw new Error("找不到 #game 画布");

const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("这个浏览器不支持 2D canvas");

const world = createWorld();

startLoop(
  // 每个「逻辑步」调用一次：dt 是这一步的时长，单位秒
  (dt) => updateWorld(world, dt),
  // 每个渲染帧调用一次：把当前世界画出来
  () => render(ctx, world),
);
