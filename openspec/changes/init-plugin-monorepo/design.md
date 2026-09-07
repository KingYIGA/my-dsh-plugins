## Context

当前状态：仓库根平铺 `dsh-hello/`（已具备完整 bundle 插件骨架，测试全绿），根无 git/package.json/workspace/LICENSE。约束见 proposal.md 与 config context：纯 ESM 无构建、插件相互独立、DSH 从仓库根自动加载 AGENTS.md、上游 DSH 即 pnpm monorepo。`bin/pnpm` 为本机 DSH Desktop 沙箱胶水（依赖 `/tmp` 路径），保留但需文档化边界。

## Goals / Non-Goals

**Goals:**
- 最小、可逆的一次性迁移：`dsh-hello` 从根迁入 `packages/`，逻辑与测试零改动。
- 根级 `pnpm -r test` 一键跑全部插件测试；单个插件仍可 `cd packages/<p> && npm test`。
- 开源地基（git/LICENSE/.gitignore/README 索引）一次到位，首次提交即为干净基线。

**Non-Goals:**
- 不引入 Turborepo、changesets 或其他构建/发布编排（发布管线留待有多个可发布插件后再设计）。
- 不改 `dsh-hello` 插件代码、测试断言与 cordis patch 内容。
- 不在本 change 内推送 GitHub 远端（目标仓库名 `my-dsh-plugins` 已知，推送动作待用户在远端就绪后执行）。

## Decisions

### D1: pnpm workspace，`packages/*` 收拢布局
- 选择 pnpm：本机 `dsh plugin` 工具链与 DSH 生态均围绕 pnpm；与上游 monorepo 一致。
- `packages/*` 而非根平铺：给后续 client 插件（可能有自己的前端构建）留独立空间，根目录只保留 workspace/文档文件。
- 备选：根平铺（`dsh-hello/`、`dsh-foo/`…）——零搬迁，但根目录随插件增多变乱，且 workspace `packages` 通配与根 package.json 语义不清；否决。

### D2: 根 package.json 只做编排，不含运行时代码
- 根包 `private: true`，无 `main`/`exports`；脚本仅 `"test": "pnpm -r test"`。插件是独立的发布单元，根包永不发布。
- 备选：根包聚合导出各插件 —— 破坏"每插件独立发布/独立被 DSH `add`"的消费模型；否决。

### D3: `bin/pnpm` 保留在仓库根并文档化，不进 workspace
- 它是本机 DSH Desktop 环境胶水（指向 `/tmp/pnpm-home`），clone 到别的机器无意义。保留文件（其 README 已被 AGENTS.md 引用），在根 README 与 AGENTS.md 中说明"仅本机 DSH Desktop 使用，通用环境用系统 pnpm"。
- `.gitignore` 决策：仓库根不需要为它建 ignore 例外——它本身就该入库作文档；但任何运行时生成的 `node_modules`、日志、`/tmp` 相关缓存路径不入库。

### D4: LICENSE 采用 MIT，版权年份取当前年份
- `dsh-hello/package.json` 已声明 MIT；仓库根 LICENSE 保持一致（个人作者名待用户提供，任务中留占位并在实施时填入或默认 `wangyinggang` 之外使用通用占位需用户确认）。

### D5: 迁移顺序：先搬目录、再补根文件、最后统一验证
- 搬迁用 `git mv` 等价物（当前无 git，故为文件移动）；移动后先 `cd packages/dsh-hello && node --test` 验证，再写根 workspace/README/AGENTS 文档，最后 `git init` + 首次提交，避免把"半迁移"状态提交进历史。

## Risks / Trade-offs

- [本机 profile 若已 `link:` 旧路径 `dsh-hello`] → 迁移后该 link 失效；任务含"检查 `dsh plugin list`/package.json 依赖，必要时 remove 并按 packages 路径重新 add"的验证步骤。
- [根 README/AGENTS.md 与目录不同步] → 迁移与文档更新在同一 change 的 tasks 中成对执行，并以"根测试通过 + 目录结构核对"作为完成标准。
- [LICENSE 作者信息不确定] → 提交前向用户确认一次（任务中显式列出确认点）。
- [`bin/pnpm` 对开源贡献者造成困惑] → README/AGENTS.md 明确标注"本机专用、可忽略"，避免误当通用工具使用。

## Migration Plan

1. `mkdir -p packages`，移动 `dsh-hello/` → `packages/dsh-hello/`（内容不动）。
2. 新增根 `package.json`（private）、`pnpm-workspace.yaml`。
3. 验证：`cd packages/dsh-hello && node --test`；根 `pnpm -r test`（若 pnpm 可用；不可用则 `npm -r`? 见 Open Questions——实际 fallback 是逐包跑测试）。
4. 新增 `.gitignore`、`LICENSE`；改写根 `README.md` 为索引、更新 `AGENTS.md` 布局段、更新 `packages/dsh-hello/README.md` 安装路径。
5. `git init` + 首次提交（提交前确认 LICENSE 作者）。
6. 若用户已将 GitHub 远端就绪：`git remote add origin git@github.com:<user>/my-dsh-plugins.git` + `git push`（作为后续手动步骤，不在自动化任务内强制）。

## Open Questions

- ~~LICENSE 的版权归属署名~~ → **已解决（用户确认）**：GitHub 用户名 `KingYIGA`，LICENSE 版权行写 `Copyright (c) 2026 KingYIGA`（年份以实施时当年为准）。
- ~~根级 `pnpm -r test` 依赖本机可用的 pnpm~~ → **已解决（用户确认）**：验证命令统一使用 pnpm（根级 `pnpm test` → `pnpm -r test`；本机环境需要时经 `bin/pnpm` 包装执行）。
