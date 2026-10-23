// GameScene.ts —— 游戏主场景：一个可以左右移动、跳跃、收集星星的小人。
//
// 这是整个项目最重要的教学文件。它覆盖了游戏开发最核心的概念：
//   1. 游戏循环（update 每帧执行）
//   2. 精灵（sprite）的创建与移动
//   3. 物理系统（重力、碰撞、速度）
//   4. 碰撞检测（玩家碰到星星）
//   5. 输入处理（方向键）
//   6. 游戏状态（分数）
//
// 建议你从上到下慢慢读，每一段注释都对应一个知识点。

import Phaser from "phaser";

export class GameScene extends Phaser.Scene {
  // ============================================================
  // 【类的属性（字段）】
  // ============================================================
  // 在 class 内部、方法外部声明的变量，叫「属性」。
  // 它们属于「这个场景的实例」，在整个场景生命周期内都能被访问。
  //
  // 注意类型标注：
  //   player: Phaser.Physics.Arcade.Sprite —— 一个「带物理的精灵」
  //   cursors: Phaser.Types.Input.Keyboard.CursorKeys —— 方向键对象
  //   score: number —— 数字（分数）
  //   scoreText: Phaser.GameObjects.Text —— 显示分数的文字对象
  //
  // 感叹号 ! 是 TS 的「明确赋值断言」，表示「这个变量我现在不赋值，
  // 但保证在用到它之前一定赋值了」。因为 Phaser 的精灵通常要在 create()
  // 里创建，所以这里先声明类型、后面再赋值，用 ! 消除编译报错。
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private stars!: Phaser.Physics.Arcade.Group;
  private score = 0; // 这里直接给了初始值 0，所以不需要 ! 也不用手写类型（会自动推断为 number）
  private scoreText!: Phaser.GameObjects.Text;
  private frameCount = 0;
  private lastReport = performance.now();

  constructor() {
    super("GameScene");
  }

  // ============================================================
  // 【create 生命周期】—— 场景启动时调用一次，用来「搭建舞台」
  // ============================================================
  create(): void {
    // ---------- 1. 创建平台（地面） ----------
    // add.rectangle 创建一个矩形。参数：x, y, 宽, 高, 颜色。
    // 我们把它做成「静态物理体」（static），表示它不动，但能和其他物体碰撞。
    // 矩形位置：x=400（水平居中），y=568（接近底部），宽 800 高 30。
    const platform = this.add.rectangle(400, 568, 800, 30, 0x2d5f3a);
    // 告诉物理系统「这是一个静态的、有碰撞体积的物体」。
    this.physics.add.existing(platform, true); // 第二个参数 true = 静态

    // ---------- 2. 创建玩家（一个小人） ----------
    // add.sprite 创建一个精灵（sprite）。精灵是 Phaser 里最核心的游戏对象，
    // 可以理解成「屏幕上会动的图片」。这里没加载图片，所以显示成一个矩形色块。
    // 参数：x, y, 纹理key。传 undefined 纹理，会得到一个默认的矩形，再手动上色。
    this.player = this.physics.add.sprite(100, 450, "") as Phaser.Physics.Arcade.Sprite;
    this.player.setDisplaySize(20, 20); // 设置显示尺寸（宽高）
    this.player.setTint(0x4aa8ff); // setTint 给精灵染色（这里染成蓝色）
    this.player.setBounce(0.2); // 弹性：落地时轻微反弹
    this.player.setCollideWorldBounds(true); // 不允许玩家跑出画布边界

    // ---------- 3. 创建星星（可收集物） ----------
    // this.physics.add.group() 创建一个「物理组」，用于管理一批同类物体。
    this.stars = this.physics.add.group({
      collideWorldBounds: true, // 星星也不能跑出画布
      bounceY: 0,
    });

    // 用循环创建 10 个星星，均匀分布在画布上方。
    // 这是很常见的 JS 语法：for 循环 + 数组/计数器。
    for (let i = 0; i < 20; i++) {
      // 计算每个星星的 x 坐标：从 80 到 720，均匀间隔。
      const x = 80 + i * 30;
      const y = 100 + (i % 3) * 80; // (i % 3) 取余数，让星星错落有致地排成 3 层

      // create(x, y, 纹理key) 在组里创建一个新精灵。
      const star = this.stars.create(x, y, undefined);
      // 组里创建的对象默认可能没有物理体，手动加一个并设为「静态」。
      // 这里我们需要它作为碰撞目标，但不希望它受重力下落，所以设静态。
      star.setDisplaySize(30, 30);
      star.setTint(0xffd166); // 染成金黄色
      // 让星星缓慢旋转，制造一点动感。
      // this.tweens.add 是 Phaser 的「补间动画」系统，能自动改变对象属性。
      this.tweens.add({
        targets: star, // 作用对象
        angle: 360, // 旋转到 360 度
        duration: 2000, // 用时 2000 毫秒（2 秒）
        repeat: -1, // -1 表示无限循环
        ease: "Linear", // 匀速
      });
    }

    // ---------- 4. 创建分数显示 ----------
    this.scoreText = this.add.text(16, 16, "分数: 0", {
      fontSize: "28px",
      color: "#ffffff",
    });

    // ---------- 5. 注册方向键输入 ----------
    // createCursorKeys() 一键创建「上下左右」四个方向键的快捷方式。
    // 之后可以用 cursors.left.isDown 判断「左键是否被按住」。
    this.cursors = this.input.keyboard!.createCursorKeys();

    // ---------- 6. 设置碰撞规则 ----------
    // collider 是物理碰撞检测的核心 API：
    // 它让两个物体「互相碰撞但不穿透」，可以传第三个参数作为碰撞发生时的回调。
    //
    // 规则1：玩家 与 平台 碰撞（玩家会站在平台上，不会掉下去）。
    this.physics.add.collider(this.player, platform);
    this.physics.add.collider(this.stars, platform);
    // 规则2：玩家 与 星星组 碰撞，撞到就调用 collectStar 收集星星。
    // 注意第三个参数是一个「回调函数」，Phaser 会在碰撞发生时调用它。
    // 这里用箭头函数包一层，是因为 collectStar 需要额外传一个 star 参数。
    this.physics.add.collider(this.player, this.stars, (_player, star) => {
      // star 的类型标注：因为组里元素类型不明确，这里用 as 断言成精灵类型。
      this.collectStar(star as Phaser.Physics.Arcade.Sprite);
    });
  }

  // ============================================================
  // 【update 生命周期】—— 每一帧都会被调用，是「游戏循环」的核心
  // ============================================================
  // 这是游戏开发最不同于普通编程的地方：
  // 没有「函数执行完就结束」，而是「每一帧都跑一遍 update」。
  // 默认每秒跑 60 帧，所以 update 每秒会被调用约 60 次。
  // 玩家的移动、动画、逻辑判断，都写在这里面。
  update(): void {
    this.frameCount++;
    const now = performance.now();
    if (now - this.lastReport >= 1000) {
      console.log("过去 1 秒游戏运行了", this.frameCount, "帧");
      this.frameCount = 0;
      this.lastReport = now;
    }
    // 默认让玩家速度为 0（每帧都先重置，再根据输入设置，避免「惯性滑动」）。
    // setVelocityX(0) 设置水平速度为 0。
    this.player.setVelocityX(0);

    // 【读取输入并改变速度】
    // cursors.left.isDown 返回 true/false，表示「左方向键当前是否被按住」。
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-300); // 向左移动，速度为 -300 像素/秒
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(300); // 向右移动
    }

    // 【跳跃】
    // 只有当玩家「站在地面上」时才允许跳（否则可以无限连跳、空中二段跳）。
    // this.player.body!.blocked.down 表示「玩家身体的下方是否被地面挡住」，
    // 也就是「是否踩在地上」。body 是物理体，! 是非空断言。
    // 用 &&（逻辑与）把两个条件串起来：按了上键 且 踩在地上。
    if (this.cursors.up.isDown && this.player.body!.blocked.down) {
      this.player.setVelocityY(-400); // 向上速度 -400（负的 y 方向 = 向上）
    }
  }

  // ============================================================
  // 【自定义方法】—— 收集星星
  // ============================================================
  // private 表示这个方法是「私有的」，只能在类内部调用，外部访问不到。
  // 这是一种封装：告诉读代码的人「这个方法不是对外接口」。
  private collectStar(star: Phaser.Physics.Arcade.Sprite): void {
    // star.destroy() 销毁这个星星（从画布和物理系统里移除）。
    star.destroy();

    // 分数 +10。
    this.score += 10;
    // 更新分数文字。
    this.scoreText.setText(`分数: ${this.score}`);
    // 上面这行用了「模板字符串」：用反引号 ` 包裹，${} 里可以嵌入变量。

    // 如果收集满 10 个星星，提示胜利。
    // this.stars.countActive(true) 返回「仍然存在（未被销毁）的星星数量」。
    if (this.stars.countActive(true) === 0) {
      this.add.text(400, 300, "你赢了！", {
        fontSize: "64px",
        color: "#ffd166",
        fontStyle: "bold",
      }).setOrigin(0.5, 0.5);
      this.time.delayedCall(800, () => {
      // 场景切换：this.scene.start("场景key") 会停止当前场景，启动目标场景。
      this.scene.start("BootScene");
    });
    }
  }
}
