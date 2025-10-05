const fs = require("fs");
const path = require("path");

const imagesDir = "images";
const jsonFile = "images-list.json";
const publicDir = "public"; // Vite public 目录（可选）
const backupDir = path.join(imagesDir, "backup");

// Step 1: 检查并创建目录
if (!fs.existsSync(imagesDir)) {
  console.error(`错误: 目录 ${imagesDir} 不存在！请先创建并放入图片。`);
  process.exit(1);
}
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// 支持的图片扩展名
const imageExts = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];

// Step 2: 读取并排序文件（按原文件名排序，确保顺序稳定）
let files;
try {
  files = fs.readdirSync(imagesDir).sort(); // 排序避免乱序
} catch (error) {
  console.error(`读取目录出错: ${error.message}`);
  process.exit(1);
}

const imageFiles = files.filter((file) => {
  const ext = path.extname(file).toLowerCase();
  return imageExts.includes(ext) && !file.startsWith("."); // 忽略隐藏文件
});

if (imageFiles.length === 0) {
  console.log("没有找到图片文件！");
  process.exit(0);
}

const imageList = [];
const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-"); // YYYY-MM-DDTHH-mm-ss

imageFiles.forEach((oldFile, index) => {
  try {
    const ext = path.extname(oldFile);
    const newFilename = `image${String(index + 1).padStart(2, "0")}${ext}`; // image01.jpg 等，补零更美观
    const oldPath = path.join(imagesDir, oldFile);
    const newPath = path.join(imagesDir, newFilename);

    // 备份原文件（加时间戳避免覆盖）
    const backupFilename = `${timestamp}_${oldFile}`;
    const backupPath = path.join(backupDir, backupFilename);
    fs.copyFileSync(oldPath, backupPath);

    // 重命名
    fs.renameSync(oldPath, newPath);

    // 添加到列表（用绝对路径，便于 Vite public）
    const publicPath = `/images/${newFilename}`; // 绝对路径 /images/image01.jpg
    imageList.push({
      filename: newFilename,
      path: publicPath, // 改成绝对路径，直接在 React src 用
    });

    console.log(
      `重命名: ${oldFile} -> ${newFilename} (备份: ${backupFilename})`
    );
  } catch (error) {
    console.error(`处理文件 ${oldFile} 出错: ${error.message}`);
    // 继续下一个，不中断
  }
});

// Step 3: 写入 JSON（根目录）
try {
  fs.writeFileSync(jsonFile, JSON.stringify(imageList, null, 2));
  console.log(`生成 JSON: ${jsonFile}，共 ${imageList.length} 张图片。`);

  // 可选：复制到 public/（Vite 用）
  if (fs.existsSync(publicDir)) {
    const publicJsonPath = path.join(publicDir, jsonFile);
    fs.copyFileSync(jsonFile, publicJsonPath);
    console.log(`已复制 JSON 到: ${publicJsonPath}`);
  }
} catch (error) {
  console.error(`写入 JSON 出错: ${error.message}`);
}

console.log(`原始图片已备份到: ${backupDir}`);
console.log("脚本执行完成！");
