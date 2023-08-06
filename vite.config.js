import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";


export default defineConfig({
  plugins: [react()
  ],
  // 打包配置
  build: {
    lib: {
      entry: 'src/create.js', // 设置入口文件
      name: 'leafer-pdf-plugin', // 起个名字，安装、引入用
      fileName: (format) => `leafer-pdf-plugin-lib.${format}.js` // 打包后的文件名
    },
    sourcemap: true, // 输出.map文件
  }
});