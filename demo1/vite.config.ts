// vite.config.ts —— Vite 的配置文件
//
// Vite 是一个「前端开发服务器 + 构建工具」，它做了两件事：
//   1. dev 时：起一个本地服务器，浏览器访问就能看到游戏，改代码自动热更新（HMR）
//   2. build 时：把 TypeScript 编译成 JavaScript，并打包压缩成可部署的文件
//
// 你几乎不需要改这个文件，它只需要告诉 Vite「项目根目录在哪」即可。
import { defineConfig } from "vite";

export default defineConfig({
  // 开发服务器监听地址。localhost 即可，仅本机访问。
  server: {
    host: "localhost",
    port: 5173,
  },
});
