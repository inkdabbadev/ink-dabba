import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = fileURLToPath(new URL("../", import.meta.url));
const app = path.join(root, "hugsyy");
const npm = process.env.npm_execpath;
if (!npm) throw new Error("Run this build with npm run build:hugsyy.");
function run(args, env = process.env) {
  const result = spawnSync(process.execPath, [npm, ...args], {
    cwd: root,
    stdio: "inherit",
    env,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}

run(["ci", "--prefix", app, "--no-audit", "--no-fund"]);
run(["run", "build", "--prefix", app], {
  ...process.env,
  HUGSYY_BASE_PATH: "/hugsyy/experience",
});
const exported = path.join(app, "out");
if (!fs.existsSync(path.join(exported, "index.html"))) {
  throw new Error("The birthday app did not export an index.html.");
}
const destination = path.join(root, "public", "hugsyy", "experience");
fs.mkdirSync(destination, { recursive: true });
fs.cpSync(exported, destination, { recursive: true });
console.log("Birthday app ready at /hugsyy (assets: /hugsyy/experience).");
