# Phaser + TypeScript 学习项目（demo1）

一个**教学导向**的起步项目，用一个能玩的「收集星星」小游戏，带你学习
TypeScript 和 Phaser 的基本语法与使用技巧。

**重点：所有源码都写了详细的中文注释，建议从 `src/main.ts` 开始读。**

## 游戏内容

用键盘方向键控制蓝色小人移动、跳跃，收集金色的星星，集满 10 颗即获胜。

## 环境要求

- Node.js 18 或更高版本（推荐 20+）

## 快速开始

```bash
# 1. 安装依赖（第一次运行才需要，会生成 node_modules）
npm install

# 2. 启动开发服务器
npm run dev
```

启动后，终端会显示一个本地地址（通常是 `http://localhost:5173`），
用浏览器打开它就能玩到游戏。改代码保存后，浏览器会自动刷新。

## 项目结构（按阅读顺序）

```
demo1/
├── index.html            # 入口 HTML，提供游戏画布的挂载点
├── package.json          # 项目描述 + 依赖 + 脚本命令
├── tsconfig.json         # TypeScript 编译配置
├── vite.config.ts        # Vite 构建工具配置
└── src/
    ├── main.ts           # ① 游戏入口：配置并启动 Phaser
    └── scenes/
        ├── BootScene.ts  # ② 加载场景：演示场景切换
        ├── MenuScene.ts  # ③ 主菜单：演示文字交互与输入
        └── GameScene.ts  # ④ 游戏主场景：核心，覆盖游戏循环/物理/碰撞
```

## 你会学到的知识点

| 文件 | 知识点 |
|------|--------|
| `main.ts` | import 导入、类型标注、Phaser 游戏配置 |
| `BootScene.ts` | class 继承、生命周期方法（preload/create）、场景切换 |
| `MenuScene.ts` | 变量声明、setOrigin、键盘/鼠标输入、方法封装 |
| `GameScene.ts` | 游戏循环（update）、精灵、物理体、速度、碰撞检测、补间动画、状态 |

## 常用命令

```bash
npm run dev        # 启动开发服务器（日常开发用）
npm run build      # 类型检查 + 打包成可部署文件
npm run typecheck  # 只做类型检查，不打包（快速验证 TS 是否写对）
npm run preview    # 预览打包后的产物
```

## 给新手的建议

1. **先跑起来，再读代码**：先 `npm run dev` 玩一玩，再回头逐文件读注释。
2. **动手改一改**：试着改重力数值、玩家移动速度、星星数量，观察变化，
   这是最快的理解方式。
3. **理解「游戏循环」**：`GameScene` 的 `update` 每帧都跑，这是游戏开发
   和普通 Web 开发最本质的区别，一定要吃透。
