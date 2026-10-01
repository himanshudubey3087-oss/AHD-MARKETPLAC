const fs = require("fs");
const path = require("path");

const root = __dirname;
const publicDir = path.join(root, "public");

if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

function copyDir(src, dest) {
    if (!fs.existsSync(src)) return;
    fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
        const sPath = path.join(src, item);
        const dPath = path.join(dest, item);
        if (fs.statSync(sPath).isDirectory()) {
            copyDir(sPath, dPath);
        } else {
            fs.copyFileSync(sPath, dPath);
        }
    }
}

// 1. Copy css and js folders
copyDir(path.join(root, "css"), path.join(publicDir, "css"));
copyDir(path.join(root, "js"), path.join(publicDir, "js"));

// 2. Copy all root assets and html files
const files = fs.readdirSync(root);
const assetExts = [".html", ".css", ".js", ".png", ".jpg", ".jpeg", ".svg", ".ico", ".json", ".webp"];
const ignoredFiles = new Set(["package.json", "package-lock.json", "vercel.json", "build.js", "README.md"]);

for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (assetExts.includes(ext) && !ignoredFiles.has(file)) {
        const srcPath = path.join(root, file);
        if (fs.statSync(srcPath).isFile()) {
            fs.copyFileSync(srcPath, path.join(publicDir, file));
        }
    }
}

console.log("✅ Build finished: All static frontend files synced into public/");
