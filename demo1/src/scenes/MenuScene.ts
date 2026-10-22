// MenuScene.ts —— 主菜单场景：显示标题和「开始」提示。
//
// 这个文件重点教：
//   1. 如何创建可交互的文字/按钮
//   2. 键盘/鼠标输入的基本处理

import Phaser from "phaser";

export class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  create(): void {
    // 【变量声明】
    // const 声明一个「不可重新赋值」的变量（常量），是最常用的声明方式。
    // 这里把创建的文字对象存起来，后面才能调用它的方法（比如设置交互）。
    const title = this.add.text(400, 200, "我的第一个游戏", {
      fontSize: "48px",
      color: "#ffffff",
      fontStyle: "bold",
    });

    // setOrigin 设置对象的「锚点/原点」。
    // 默认文字的原点在左上角，setOrigin(0.5, 0.5) 把原点移到中心，
    // 这样 (400, 200) 就是文字的中心点，而不是左上角，方便居中。
    // 0.5 表示 50%，范围 0~1。
    title.setOrigin(0.5, 0.5);

    const prompt = this.add.text(400, 320, "按 空格键 或 点击 开始", {
      fontSize: "24px",
      color: "#aaaaaa",
    });
    prompt.setOrigin(0.5, 0.5);

    // 【键盘输入】
    // this.input.keyboard 是 Phaser 的键盘输入管理器。
    // addKey("SPACE") 注册了对空格键的监听，返回一个「按键对象」。
    // Phaser.Input.Keyboard.KeyCodes.SPACE 是空格键的枚举值。
    const spaceKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    const aKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.A
    );
    // 注意上面的 ! 是 TS 的「非空断言」，告诉编译器 keyboard 一定不是 null。
    // 这是 TS 里常见的写法，避免类型报错。

    // on("down", ...) 监听「按键被按下」的事件。
    // 第一个参数是事件名，第二个是回调函数（这里用箭头函数）。
    spaceKey.on("down", () => {
      this.startGame();
    });

    aKey.on("down", () => {
      this.startGame();
    });

    // 【鼠标/触摸输入】
    // setInteractive() 让文字对象变得「可交互」（能接收点击事件）。
    // 然后 on("pointerdown", ...) 监听「鼠标按下」事件。
    prompt.setInteractive({ useHandCursor: true }); // useHandCursor 让鼠标悬停变成手型
    prompt.on("pointerdown", () => {
      this.startGame();
    });
  }

  // 【自定义方法】
  // 这是我自己定义的方法，用来封装「开始游戏」这个动作。
  // 把重复的逻辑抽成方法，是编程的基本功。
  // 参数列表后的 : void 是返回类型标注。
  private startGame(): void {
    // 切换场景到 GameScene（游戏主场景）。
    this.scene.start("GameScene");
  }
}
