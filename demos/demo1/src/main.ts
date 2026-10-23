// main.ts —— 整个游戏的「入口文件」，浏览器加载后最先执行的就是它。
//
// ============================================================
// 这是你读这个项目的第一个文件。我会把每一段的作用讲清楚。
// ============================================================

// 【import 导入】
// 这是 ES Module 的导入语法。TypeScript 里，我们要用某个库提供的功能，
// 需要先 import。下面这行从 "phaser" 这个包里导入了一个叫 Phaser 的对象。
// Phaser 是全局命名空间，里面装了所有类：Scene、Game、Physics 等等。
import Phaser from "phaser";

// 从我们自己写的文件里导入三个「场景」类。
// 注意：路径以 ./ 开头表示「当前文件所在目录下的文件」。
// 不带扩展名是模块解析的惯例，TypeScript/Vite 会自动找到 .ts 文件。
import { BootScene } from "./scenes/BootScene";
import { MenuScene } from "./scenes/MenuScene";
import { GameScene } from "./scenes/GameScene";

// 【游戏配置对象】
// 用一个对象来描述「这个游戏长什么样」。TypeScript 里，
// 冒号后面是类型标注（Phaser.Types.Core.GameConfig），告诉编译器这个对象的结构。
// 这是 TS 相比 JS 最大的价值：类型写错了，编辑器会当场报红。
const config: Phaser.Types.Core.GameConfig = {
  // type: 渲染方式。Phaser.AUTO 会自动选择 WebGL（快）还是 Canvas（兼容）。
  type: Phaser.AUTO,

  // 游戏画布的尺寸（单位：像素）。这里是 800x600 的逻辑分辨率。
  width: 800,
  height: 600,

  // parent: 把游戏的 <canvas> 挂到 index.html 里 id 为 game-container 的 div 下。
  parent: "game-container",

  // backgroundColor: 画布背景色，十六进制颜色值。
  backgroundColor: "#1a1a2e",

  // physics: 启用物理引擎。Arcade 是 Phaser 内置的轻量 2D 物理，
  // 能处理重力、碰撞、速度等，对平台跳跃游戏足够用。
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 400 }, // 重力加速度，y 方向向下 400（x 方向 0）。没有它角色会飘在空中。
      debug: false, // 设为 true 可以看到碰撞盒的轮廓，调试时很有用。
    },
  },

  // scale: 缩放策略。FIT 表示等比缩放游戏画面，让它尽量填满窗口但不变形。
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH, // 画布在窗口中居中。
  },

  // scene: 注册所有场景。游戏启动后，第一个场景（BootScene）会先运行。
  // 场景是 Phaser 的核心概念，相当于「游戏的一个独立画面/关卡」。
  // 一个游戏通常有多个场景：加载画面、主菜单、游戏关卡、结算画面等。
  scene: [BootScene, MenuScene, GameScene],
};

// 【创建游戏实例】
// new Phaser.Game(config) 是整个程序最关键的一行：
// 它根据上面的配置，初始化渲染器、物理引擎、输入系统，
// 然后启动第一个场景。之后的一切游戏逻辑都在「场景」里发生。
const game = new Phaser.Game(config);

// 把 game 实例导出，方便以后在浏览器控制台里调试。
// 在浏览器按 F12，输入 game，就能看到这个对象，可以实时检查游戏状态。
export default game;
