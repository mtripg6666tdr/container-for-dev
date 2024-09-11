const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const versions = [
  "v14",
  "v16",
  "v18",
  "v20",
];

(async function(){

  await Promise.all(
    versions.map(async version => {
      const dirpath = path.join(__dirname, version);
      if(!fs.existsSync(dirpath)){
        await fs.promises.mkdir(dirpath);
      }

      await fs.promises.writeFile(path.join(__dirname, version, "package.json"), JSON.stringify({
        name: `node-${version}`,
        version: "0.0.0",
        private: true,
        dependencies: {
          node: `${version}-lts`
        }
      }, undefined, "  "));

      const proc = spawn("npm", ["install"], {
        stdio: ["ignore", "pipe", "pipe"],
        shell: true,
        cwd: dirpath,
      });

      proc.stdout.pipe(process.stdout);
      proc.stderr.pipe(process.stderr);

      await new Promise(resolve => proc.once("exit", resolve));
    })
  );

  const symdirpath = path.join(__dirname, "syms");

  if(!fs.existsSync(symdirpath)){
    await fs.promises.mkdir(symdirpath);
  }

  await Promise.all(
    versions.map(async version => {
      const nodepath = path.join(__dirname, version, "node_modules/node/bin", process.platform === "win32" ? "node.cmd" : "node");
      const symfilepath = path.join(symdirpath, process.platform === "win32" ? `node${version.slice(1)}.cmd` : `node${version.slice(1)}`);

      if(fs.existsSync(symfilepath)){
        await fs.promises.unlink(symfilepath);
      }

      await fs.promises.symlink(nodepath, symfilepath);
    }).map(p => p.catch(console.error))
  );
})();
