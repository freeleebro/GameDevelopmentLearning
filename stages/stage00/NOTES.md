# 笔记

1.const config: Phaser.Types.Core.GameConfig = {【游戏配置对象】用一个对象来描述「这个游戏长什么样」。TypeScript 里冒号后面是类型标注（Phaser.Types.Core.GameConfig），告诉编译器这个对象的结构。

2.parent: "game-container"
用于把游戏自动创建的<canvas>挂载到<div>内部

3.debug: false  设为 true 可以看到碰撞盒的轮廓，调试时很有用。

4.scene: [BootScene, MenuScene, GameScene]  注册游戏中的所有场景

}

5.constructor() {
	super("BootScene");
}【constructor 构造函数】类被创建时最先执行的方法。super() 是调用父类（Scene）的构造函数，这一步必须做，否则父类的初始化没完成，后面会报错。

6.【preload 生命周期方法】Phaser 会在场景启动时，先调用 preload，再调用 create。preload 的职责是「加载资源」：图片、音频、字体等。

7.【create 生命周期方法】资源加载完成后调用。在这里做场景的「初始化」。

8.游戏启动时，Phaser 会根据场景配置初始化场景，并默认启动第一个场景。它通常是因为在 Phaser 配置的 `scene` 数组中排在第一位，例如BootScene。

9.感叹号 ! 是 TS 的「明确赋值断言」，表示「这个变量我现在不赋值，但保证在用到它之前一定赋值了」。因为 Phaser 的精灵通常要在 create()里创建，所以这里先声明类型、后面再赋值，用 ! 消除编译报错。

10.场景切换：this.scene.start("场景key") 会停止当前场景，启动目标场景。

链路图：

![demo1链路图](D:\GameProject\learning\stages\stage00\demo1链路图.png)



入口文件是main文件，然后默认调用场景BootScene，再根据两个函数this.scene.start("MenuScene")、this.scene.start("GameScene")，先后调用MenuScene、GameScene


疑问暂无，你可以来提问我。

