import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()], // 启用 React 插件
  root: ".", // 当前文件夹作为根目录
  build: {
    outDir: "dist", // 构建输出目录
    emptyOutDir: true,
  }, // 构建前清空输出目录},
  server: {
    port: 3000, // 开发服务器端口
    open: true, // 自动打开浏览器
  },
  base: "/", // 相对路径，支持本地测试
});
