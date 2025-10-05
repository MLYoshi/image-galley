const fs = require("fs");
const path = require("path");

const imagesDir = "images";
const jsonFile = "images-list.json";
const backupDir = path.join(imagesDir, "backup");

// 创建备份文件夹
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// 支持的图片扩展名
const imageExts = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];

// 读取所有文件
const files = fs.readdirSync(imagesDir);
const imageFiles = files.filter((file) => {
  const ext = path.extname(file).toLowerCase();
  return imageExts.includes(ext);
});

if (imageFiles.length === 0) {
  console.log("没有找到图片文件！");
  process.exit(0);
}

const imageList = [];

imageFiles.forEach((oldFile, index) => {
  const ext = path.extname(oldFile);
  const newFilename = `image${index + 1}${ext}`;
  const oldPath = path.join(imagesDir, oldFile);
  const newPath = path.join(imagesDir, newFilename);

  // 备份原文件
  const backupPath = path.join(backupDir, oldFile);
  fs.copyFileSync(oldPath, backupPath);

  // 重命名
  fs.renameSync(oldPath, newPath);

  // 添加到列表
  imageList.push({
    filename: newFilename,
    path: newPath, // 相对路径，React中可直接用
  });

  console.log(`重命名: ${oldFile} -> ${newFilename}`);
});

// 写入 JSON
fs.writeFileSync(jsonFile, JSON.stringify(imageList, null, 2));
console.log(`生成 JSON: ${jsonFile}，共 ${imageList.length} 张图片。`);
console.log(`原始图片已备份到: ${backupDir}`);
