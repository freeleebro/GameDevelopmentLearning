# stage00 补课 · 调试工具与物理链路

> 这份文件覆盖 S00 全部未通过项，不再是 T2 的专属补课。
> 内容分三块：
> 1. **调试工具**（一～八节）：DevTools 面板、按键、update 频率、条件断点、调用栈
> 2. **物理链路**（九～十一节）：谁把速度变成位置、静态体与动态体、星星为什么停住
> 3. **自测与迁移**（十二～十三节）
>
> 读法：先读九、十、十一（这是你最缺的），再回头补调试工具。

---

# 第一部分 · 调试工具

## 一、先纠正一个致命误解

你在 T2 里做的事是：断点 → `F10` 单步 → 看 `velocity` 变不变。

**这个方法是错的，而且不是操作错误，是原理错误：**

- `update()` **一帧执行一次**。
- `F10`（单步跳过）只在**同一帧内部**往前走一行。
- 重力和位置积分发生在 `update` **之后**、下一帧**之前**。
- 所以你 F10 走完 `update` 的最后一行，这一帧就结束了 —— 停在原地，`velocity` 当然不再变化。

**断点还会顺手毁掉你想测的东西**：程序在断点处停 3 秒，这 3 秒的 `delta` 会是一个巨大的值（或者被钳制），帧率统计彻底失真。
所以：**用断点数帧率 = 用体温计测身高。**

正确分工：

| 你想知道 | 用什么 | 不要用什么 |
| --- | --- | --- |
| 某一瞬间的值长什么样 | 断点 + Scope | — |
| 一段时间内值怎么变 | `console.log` 序列 / 画到屏幕上 | 单步 |
| 每秒跑多少帧 | 计数器 + 计时 | 断点 |
| 哪段代码慢 | Performance 面板录制 | 猜 |

---

## 二、DevTools 面板速查（你只需要 2 个）

按 `F12` 或 `Ctrl + Shift + I` 打开。顶部一排标签：

| 面板 | 你什么时候用 |
| --- | --- |
| **Console** | 看 `console.log`、看报错、临时敲表达式 |
| **Sources** | 打断点、单步、看作用域、看调用栈 ← 本次主力 |
| Performance | 录制一段时间，看每帧耗时（S07 才用） |
| Network | 资源加载、404 排查（S12 才用） |
| Elements | 看 HTML 结构（基本用不到） |

### Sources 面板的四块区域

```
┌────────────┬──────────────────────────┬─────────────┐
│ ① 文件树    │ ② 代码区                 │ ③ 右侧栏    │
│ (左)        │ (中)                     │ (右)        │
│ Page        │  1  create() {           │ Breakpoints │
│  └ src      │  2    ...                │ Scope       │
│     └ scenes│ ▶3    this.player = ...  │ Call Stack  │
│        -Game│  4  }                    │ Watch       │
└────────────┴──────────────────────────┴─────────────┘
                         ④ 底部抽屉（按 Esc 开关）：Console
```

**打开指定文件最快的方法**：在 Sources 面板里按 `Ctrl + P`，输入 `GameScene`，回车。
比在左边文件树里一层层点快得多，也避免点进 `node_modules`。

> ⚠️ Vite 项目里文件树会有两套：`src/xxx.ts`（你的源码，有 sourcemap）和打包后的 `assets/xxx.js`。
> **只在前者打断点**。如果你发现断点"灰了不生效"，八成是打在了打包产物上，或者页面没刷新。

---

## 三、调试按键（记住这 6 个就够）

| 按键 | 名字 | 作用 |
| --- | --- | --- |
| `F8` | 继续 / Resume | 跑到下一个断点。**跨帧观察靠它** |
| `F10` | 单步跳过 / Step over | 执行当前行，不进入函数内部 |
| `F11` | 单步进入 / Step into | 进入当前行调用的函数内部 |
| `Shift + F11` | 单步跳出 / Step out | 跑完当前函数，回到调用它的地方 |
| `Ctrl + F8` | 停用所有断点 | 临时关掉断点，不用一个个删 |
| `Ctrl + P` | 打开文件 | Sources 面板内可用 |

---

## 四、右侧栏三个区怎么用

### Scope（作用域）

停住时，这里显示「当前能访问到的所有变量」。
展开 `this` → 能看到 `player`、`cursors`、`stars`。
再展开 `player` → `body` → `velocity` → `x` / `y`。

这就是你在 T2 里看 velocity 的地方，位置是对的，**只是不该用单步去观察它的变化**。

如果 Scope 里没有 `this`：说明你停在了箭头函数或引擎内部帧里，往上翻一层。

### Watch（监视表达式）

点 `+`，输入 `this.player.body.velocity.y`，它会**一直显示**这个表达式的值。
配合 `F8` 连续按，就能一帧一帧看到它变 —— 这比在 Scope 里翻树快得多，也是断点唯一适合的「跨帧」用法。

### Call Stack（调用栈）

第八节单独讲。

---

## 五、怎么算出 update 每秒被调用几次（三种方法）

### 方法 1：读数法（最简单，先做这个）

在 `GameScene` 里加两行，把帧数画到屏幕上：

```ts
// 类里加两个属性
private frameCount = 0;
private fpsText!: Phaser.GameObjects.Text;

// create() 里
this.fpsText = this.add.text(16, 60, "fps: 0", { fontSize: "20px", color: "#9fe1cb" });

// update() 结尾
this.frameCount++;
```

然后**不用断点**，直接跑 10 秒，肉眼估算。
更准的做法是用引擎已经算好的：`this.game.loop.actualFps`（Phaser 内部有现成的帧率统计），在 `update` 里 `this.fpsText.setText("fps: " + Math.round(this.game.loop.actualFps))`。

### 方法 2：计时法（可写进日志，能对比）

```ts
// update() 里
this.frameCount++;
const now = performance.now();
if (now - this.lastReport > 1000) {
  console.log("过去 1 秒执行了", this.frameCount, "次");
  this.frameCount = 0;
  this.lastReport = now;
}
```

**要求**：跑 10 秒，把 10 行日志抄进笔记。这就是「实测数据」，不是猜的。

### 方法 3：Performance 面板（最专业，但先别用）

录制 3 秒 → 看每帧的耗时条。现在用不上，S07 做性能分析时再学。

### 你会得到什么结论

一般显示器是 60Hz，`requestAnimationFrame` 跟着屏幕走，所以 `update` ≈ **每秒 60 次**，`delta ≈ 16.7ms`。
如果你测出来是 120 或 144，说明你的屏幕刷新率更高 —— **这不是 bug，这正是 S01 要解决的问题**。
把「你机器上的实测值」记下来，S01 会拿它做对照实验。

---

## 六、条件断点的正确姿势

1. 在行号上**右键**（不是左键单击）→ `Add conditional breakpoint…`
2. 输入条件表达式，比如 `this.player.body!.velocity.y > 0`
3. 回车，行号变成橙色（区别于普通断点的蓝色）

它会**每帧都判断**，只在条件为真时停下 —— 所以它不会拖慢程序，是断点里唯一适合「等某个状态出现」的工具。

**注意 `this`**：条件表达式在 `update` 的作用域里求值，`this` 是可用的。如果报 `this is undefined`，说明你打错了位置（打在了类外面的函数里）。

---

## 七、你在 T2 里那个判断错在哪

你写的是：

> 在 `this.player.body.velocity.y > 0` 时，玩家在高处，初步判断为上升到最高处。

**这是半对半错，而且错的那一半很重要：**

- Phaser（和绝大多数 2D 引擎）的 **y 轴向下为正**。
- `velocity.y > 0` 表示**正在向下运动，也就是下落**。
- 所以条件成立的那一帧，玩家已经**过了顶点、开始下落**了，不是「上升到最高处」。

正确表述：**`velocity.y` 由负变正的那一瞬间 = 顶点。** 条件是 `y > 0` 说明你在顶点之后的第一帧停住了，此刻玩家确实在最高处附近，但原因是"刚过顶点"，不是"正在上升"。

顺带一个能自检的疑点：按代码，跳跃那一帧 `setVelocityY(-400)`，`velocity.y` 应该正好是 `-400`。你记到的是 `-33`，对不上。**观测值和代码对不上时，先怀疑观测方法，不要怀疑代码。** 用第五节方法 2 的日志重测一遍，你会看到一条完整的序列：`0 → -400 → -395 → … → 0 → +5 → …`

---

## 八、调用栈怎么读（三步法）

停住时，右侧 `Call Stack` 从上到下是一个列表。**方向是「从里到外」**：

```
update                    ← 最上面：你现在停在这一行
Scene.update              ← 谁调用了 update
Game.step
TimeStep.step
(anonymous)               ← 最下面：程序的入口
```

**三步读法**：

1. **看最上面一行** —— 回答「我停在哪」。
2. **往下扫，找第一个你认识的、你自己写的函数** —— 回答「谁把我叫到这儿来的」。找到就停，不要再往下看了。
3. **中间那一堆引擎内部帧，全部忽略**。它们的存在只是为了证明"这条路是怎么走过来的"，对你调试业务逻辑没用。

几个实践要点：

- 如果显示 `17 more frames`，那是被折叠的中间帧，点一下能展开，但**通常在调试时不需要展开**。
- 如果最上面**不是**你的代码（比如停在 `Phaser.Game.step`），说明你断到了引擎内部，按 `Shift + F11`（跳出）回到自己的代码。
- 调用栈的最大用处：**看到某个方法被意外调用了 N 次时，看是谁调的**。比如 `collectStar` 被调了两次 —— 看栈就知道是不是注册了两个 collider。

**这一次的调用栈本身就是答案的一部分**：最下面出现 `TimeStep.step`，说明 `update` 是被引擎的**时间步进**驱动的；而时间步进是被浏览器 `requestAnimationFrame` 驱动的 —— 所以 `update` 的频率直接绑在**屏幕刷新率**上。这句话如果你能自己讲出来，S01 会轻松很多。

---

# 第二部分 · 物理链路

## 九、谁把速度变成位置？—— 你没有写过的那几行代码

**短答：Arcade 物理系统在每一帧末尾替你算的。**

### 源码证据（不是比喻）

Phaser 源码 `demo1/node_modules/phaser/src/physics/arcade/Body.js`，`update(delta)` 方法的核心三行：

```js
// delta 单位是「秒」
prev.set(pos.x, pos.y);                  // ① 记下这一帧开始时在哪

this.world.updateMotion(this, delta);    // ② 重力改速度

this.newVelocity.set(vel.x * delta, vel.y * delta);
pos.add(this.newVelocity);               // ③ 位置 += 速度 × delta
```

而 `updateMotion` 最终走到 `World.computeVelocity`，里面这一行就是重力：

```js
if (body.allowGravity)
{
    velocityY += (this.gravity.y + body.gravity.y) * delta;   // vy += 300 × dt
}
```

**看出来了吗**：重力是**加速度**，它改的是 `velocity`；改位置的是下一行的 `pos.add(velocity * delta)`。
所以「重力 300」不是「每帧往下 300 像素」，是「每秒钟给向下的速度加 300 像素/秒」。

### 一帧的完整顺序

`World.step(delta)` 里干的事，按顺序：

| 步骤 | 做什么 | 谁改了什么 |
| --- | --- | --- |
| 1 | 对每个 body 调 `body.update(delta)` | 重力 → `velocity`；`velocity × dt` → `position` |
| 2 | 建碰撞树（quadtree） | 只为加速查询，不改数据 |
| 3 | 逐个执行 collider | 检测重叠 → **分离**：把位置推出重叠区、清掉法向速度 |
| 4 | `body.postUpdate()` | 把 `body.position` **写回** GameObject（精灵的 x/y） |

而你的 `update()` 在这一整套**之前**（准确说是 Scene 的 update 先跑，然后才轮到物理世界步进）。

### 所以整条链是

```
你的 update()          读输入 → setVelocity()      【只改意图：速度】
   ↓
物理步进 body.update()  重力改速度 → 速度乘 dt 变成位移  【把意图变成位移】
   ↓
碰撞解算 collider      重叠就把位置推出来、把法向速度清零  【把位移修正成合法位置】
   ↓
postUpdate()           body.position → 精灵的 x/y        【成为你看到的样子】
```

### 你现在应该能回答三个问题

**① 为什么 `update` 里只改速度就够了？**
因为位置不是你负责的。你负责"想让角色往哪走、走多快"，物理负责"这一帧到底移动多少"。

**② 为什么不能直接在 `update` 里写 `this.player.x = 500`？**
因为精灵的 `x` 是"结果"，不是"原因"。你在 update 里改了它，第 4 步 `postUpdate()` 会用 `body.position` 把它**覆盖掉**。物理体自己有独立的位置数据，两者不同步时以物理体为准。
（确实需要瞬移时，用 `body.reset(x, y)`，那是唯一被认可的"我就是要改位置"的说法。）

**③ 一个具体数字**：跳跃第一帧 `velocity.y = -400`，下一帧重力作用后
`-400 + 300 × 0.0167 ≈ -395`，这一帧位移 `-395 × 0.0167 ≈ -6.6` 像素。
所以一次跳跃要几十帧才到顶点 —— 这就是为什么手感调参里"重力"比"跳跃初速度"影响更大。

### 这个认知值多少钱

**这就是 S01 你要手写的东西。** 你自己写一遍 `pos += vel * dt`，就再也不会把"改速度"和"改位置"搞混。
到 Unity 里，第 1～4 步由 `Rigidbody2D` 全自动完成，你依然只写"改速度"那部分。

---

## 十、`add.existing(platform, true)` 的第二个参数是什么

### 答案

第二个参数叫 `isStatic`，决定给它挂**静态体**还是**动态体**。

源码 `src/physics/arcade/Factory.js`：

```js
existing: function (gameObject, isStatic)
{
    var type = (isStatic) ? CONST.STATIC_BODY : CONST.DYNAMIC_BODY;
    this.world.enableBody(gameObject, type);
}
```

一句话：**不传 `true`，平台就变成会掉下去的东西。**

### 静态体 vs 动态体

| | 静态体 `StaticBody`（`true`） | 动态体 `Body`（`false` / 不传） |
| --- | --- | --- |
| 受重力 | `allowGravity = false` | `allowGravity = true` |
| 会被撞动 | `immovable = true` | `immovable = false` |
| 每帧积分 | `moves = false`，直接跳过 | `moves = true`，每帧算 |
| 典型用途 | 地面、墙、平台、关卡碰撞 | 玩家、敌人、子弹、掉落物 |

### 如果不传 `true` 会怎样（推演一遍）

1. 平台变成动态体 → 受重力 300，开始往下掉
2. 掉到世界边界底部（y=600）被拦住，**停在画布最下面**
3. 玩家站在平台上方 553 的位置，此时脚下已经空了 → 跟着掉下去
4. 更糟：动态体之间会互相"挤压"，玩家站在动态平台上会把它压得晃动

整个场景直接废掉。**这就是"地面必须是静态体"的原因。**

### 判断口诀

> **会自己动的用动态体；不动、但需要被别人撞的用静态体。**

平台、墙、地板 → `true`。玩家、星星、子弹 → 动态体（`physics.add.sprite` 创建时默认就是）。

### 顺带两个等价写法

```ts
this.physics.add.existing(rect, true);   // 给一个「已经存在的」GameObject 加物理体
this.physics.add.staticImage(x, y, key); // 直接创建一个带静态体的图片
this.physics.add.staticGroup();          // 一批静态体的组（做关卡最常用）
```

第一个是"给现成的东西装物理"，后两个是"创建时自带物理"。demo1 用的是第一种，因为它先用 `add.rectangle` 画了个矩形再装物理。

---

## 十一、星星为什么停住 —— 你的答案要修一下

你的答案：

> 星星停在地面上是因为给星星加了不让它出界的规则，类似于玩家不会跳出场景。如果不加 collider 星星会直接往下落出屏幕。

**判定：后半句方向对，前半句把功劳给错了人。**

### 两个机制必须分开

| 机制 | 代码 | 作用 | 位置 |
| --- | --- | --- | --- |
| 世界边界 | `collideWorldBounds: true` | 不许离开画布 | 画布四个边（下边在 y=600） |
| 碰撞体 | `this.physics.add.collider(this.stars, platform)` | 和平台互相阻挡 | 平台顶面（y≈553） |

### 用坐标算一遍就清楚了

- 平台：`add.rectangle(400, 568, 800, 30)` → 中心 y=568，高 30 → **顶面在 y ≈ 553**
- 世界边界下沿：画布高 600 → **y = 600**

星星如果不和平台碰撞，会**穿过平台**一路掉到 y≈600 才被世界边界拦住 —— 那时候它已经在平台**下面**、屏幕最底部了。
但你现在看到的星星是**稳稳停在平台上**的，所以干这件事的只能是 `collider`。

**更准确的说法**：
> 不加 collider，星星会穿过平台掉到画布底部，被世界边界挡住；如果连世界边界也去掉，才会真的掉出屏幕。

### 这才是要记住的那句话

> **重力只负责加速，永远不会让东西停下来。**

能让物体停下的只有三种东西：

1. **碰撞体（collider）** —— 撞到别人，位置被修正、法向速度被清零。这是主力。
2. **世界边界** —— 一种特殊的碰撞，撞的是画布边缘。是保险，不是主力。
3. **你手写的约束** —— 比如把 `y` 钳死、或者自己写 `if (y > groundY) y = groundY`。

你在 T1 笔记里读到了 `gravity: { y: 300 }`，但没读到 `collider` 那一行 —— 所以链条断在"为什么它能停住"。
现在补上了：**重力让星星掉，collider 让星星停。**

### 一个可以自己验证的实验（强烈建议做，5 分钟）

1. 注释掉 `this.physics.add.collider(this.stars, platform);`
2. 刷新，看星星：应该穿过平台，停在屏幕最底部
3. 再把 `collideWorldBounds` 改成 `false`
4. 刷新，看星星：应该直接消失（掉出屏幕）
5. 恢复代码，对照结论

顺手注意：`bounceY: 0` 让星星落地不弹；而玩家有 `setBounce(0.2)`，落地会轻弹一下 —— **同一个参数的正反例**，这就是后面 S05 手感调参的起点。

---

# 第三部分 · 自测与迁移

## 十二、自测（答完 S00 才算过）

不查资料，用自己的话答，答完发给智能体判：

**调试部分**
1. `update` 在你机器上每秒被调用多少次？**你是怎么测出来的**（说得出复现步骤）？
2. `Call Stack` 最上面那一行代表什么？为什么要往下找"你自己写的函数"？
3. 为什么用 `F10` 单步时 `velocity` 不再变化？想跨帧观察该按什么？
4. `velocity.y > 0` 代表上升还是下落？"顶点"应该怎么判断？

**物理部分**
5. 谁把 `velocity` 变成 `position`？**说出那行代码在做什么**（`pos += ?`）。
6. 为什么在 `update` 里写 `this.player.x = 500` 会被覆盖？正确的瞬移方式是什么？
7. `add.existing(platform, true)` 的 `true` 是什么？不传会怎样（按顺序说出会发生什么）？
8. 星星停在平台上，靠的是世界边界还是 collider？**用 y 坐标数字证明你的结论**。
9. 如果 `update` 从每秒 60 次变成 120 次，`setVelocityY(-400)` 会让角色跳得更高、更矮，还是不变？为什么？

> 第 9 题答不上来没关系，S01 结束后必须能答。提示：想清楚"速度"和"每帧位移"是不是一回事。

---

## 十三、Unity 映射

| 这次学的 | Unity 里对应 |
| --- | --- |
| 断点调试 | Rider / Visual Studio 附加到 Unity 进程，断点用法基本一样 |
| Call Stack | 同样叫 Call Stack，读法完全一样 |
| Scope / Watch | 同样有 Locals / Watch 窗口 |
| `actualFps` | `Application.targetFrameRate`、vSync、Profiler 的 FPS 模块 |
| 「update 绑在刷新率上」 | Unity 的 `Update()` 也是变步长、跟帧率走；`FixedUpdate()` 才是固定步长 —— 这就是 S01 要手写的东西 |
| **静态体 `StaticBody`** | **只有 `Collider2D`、没有 `Rigidbody2D`** 的物体（Unity 称之为 static collider） |
| **动态体 `Body`** | **`Rigidbody2D` + `Collider2D`** |
| 物理步进（重力 → 位移 → 碰撞解算） | `Rigidbody2D` 全自动完成，一行代码都不用写 |
| 「不能直接改 `x`」 | Unity 里改 `transform.position` 会和物理打架，正确做法是 `rb.velocity` 或 `rb.MovePosition()` |
| 世界边界 | 四周加 `EdgeCollider2D`，或用 `Cinemachine Confiner 2D` 限制摄像机 |
