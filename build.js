const fs = require("fs");
const path = require("path");

try {
    const root = __dirname;
    const publicDir = path.join(root, "public");

    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    function copyDir(src, dest) {
        if (!fs.existsSync(src)) return;
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
        for (const item of fs.readdirSync(src)) {
            try {
                const sPath = path.join(src, item);
                const dPath = path.join(dest, item);
                if (fs.statSync(sPath).isDirectory()) {
                    copyDir(sPath, dPath);
                } else {
                    fs.copyFileSync(sPath, dPath);
                }
            } catch (err) {
                console.warn(`Skip ${item}:`, err.message);
            }
        }
    }

    copyDir(path.join(root, "css"), path.join(publicDir, "css"));
    copyDir(path.join(root, "js"), path.join(publicDir, "js"));

    const files = fs.readdirSync(root);
    const assetExts = [".html", ".css", ".js", ".png", ".jpg", ".jpeg", ".svg", ".ico", ".json", ".webp"];
    const ignoredFiles = new Set(["package.json", "package-lock.json", "vercel.json", "build.js", "README.md", "server.js", "index.js"]);

    for (const file of files) {
        try {
            const ext = path.extname(file).toLowerCase();
            if (assetExts.includes(ext) && !ignoredFiles.has(file)) {
                const srcPath = path.join(root, file);
                if (fs.statSync(srcPath).isFile()) {
                    fs.copyFileSync(srcPath, path.join(publicDir, file));
                }
            }
        } catch (err) {
            console.warn(`Skip ${file}:`, err.message);
        }
    }
} catch (e) {
    console.warn("Build warning:", e.message);
}

console.log("✅ Build complete: static files ready in public/");
process.exit(0);
