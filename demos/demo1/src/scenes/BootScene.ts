// BootScene.ts —— 第一个场景：负责「加载资源」，然后跳转到主菜单。
//
// 这个文件重点教三件事：
//   1. 如何定义一个场景（继承 Phaser.Scene）
//   2. 场景的生命周期方法（preload / create）
//   3. 如何切换场景

import Phaser from "phaser";

// 【class 和 extends】
// TypeScript/JavaScript 用 class 定义「类」。这里的 BootScene 是一个类，
// 它「继承」（extends）了 Phaser 内置的 Scene 类。
// 继承意味着：BootScene 自动拥有了 Scene 的所有能力（比如场景切换），
// 我们只需「覆盖」几个特定的方法，来写我们自己的逻辑。
export class BootScene extends Phaser.Scene {
  // 【constructor 构造函数】
  // 类被创建时最先执行的方法。super() 是调用父类（Scene）的构造函数，
  // 这一步必须做，否则父类的初始化没完成，后面会报错。
  // 参数 "BootScene" 是这个场景的唯一标识符（key），
  // 其他地方要用 this.scene.start("BootScene") 之类的方式通过它来找到这个场景。
  constructor() {
    super("BootScene");
  }

  // 【preload 生命周期方法】
  // Phaser 会在场景启动时，先调用 preload，再调用 create。
  // preload 的职责是「加载资源」：图片、音频、字体等。
  // 因为本 demo 不加载外部图片（所有图形都用代码画），所以这里留空。
  // 但保留这个方法，是为了让你知道它的存在和位置。
  preload(): void {
    // void 是返回类型标注，表示「这个方法不返回任何值」。
    // 这里故意放一个注释，实际不需要做任何事。
  }

  // 【create 生命周期方法】
  // 资源加载完成后调用。在这里做场景的「初始化」。
  create(): void {
    // this.add.text() 是 Phaser 常用的 API：在画布上添加一行文字。
    // 参数依次是：x 坐标、y 坐标、文字内容、样式对象。
    // 坐标原点在左上角，(400, 300) 正好是 800x600 画面的正中心。
    this.add.text(400, 300, "加载中...", {
      fontSize: "32px",
      color: "#ffffff",
    });

    // 用一个短延时，模拟「加载需要一点时间」的感觉，
    // 让玩家能看到 "加载中..."，然后切换到主菜单场景。
    // this.time.delayedCall(毫秒, 回调函数) 是 Phaser 的定时器工具。
    this.time.delayedCall(800, () => {
      // 场景切换：this.scene.start("场景key") 会停止当前场景，启动目标场景。
      this.scene.start("MenuScene");
    });
  }
}
