import { spawnSync } from "node:child_process";

const usePnpm = /pnpm/i.test(process.env.npm_config_user_agent ?? "");
const result = usePnpm
  ? spawnSync("pnpm", ["--filter", "@workspace/poke-haven", "run", "dev"], {
      stdio: "inherit",
      shell: true,
    })
  : spawnSync("npm", ["run", "dev", "-w", "@workspace/poke-haven"], {
      stdio: "inherit",
      shell: true,
    });

process.exit(result.status ?? 1);
