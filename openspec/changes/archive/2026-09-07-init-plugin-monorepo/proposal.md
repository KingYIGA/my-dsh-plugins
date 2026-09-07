## Why

当前仓库只有一个插件 `dsh-hello` 平铺在根目录，无 git 版本管理、无 LICENSE、无 workspace 结构。用户计划在同一仓库开发、发布多个 DSH 插件并开源到 GitHub（仓库名 `my-dsh-plugins`），需要一个能长期承载多插件、可直接对外开源的仓库形态。上游 DSH 自身即 pnpm monorepo，本仓库应沿用同一组织方式，降低后续维护与贡献者的理解成本。

## What Changes

- 将仓库初始化成 pnpm workspace monorepo：
  - 新增根 `package.json`（`private: true`），提供递归脚本（`test` 等）；
  - 新增 `pnpm-workspace.yaml`，声明 `packages/*`；
  - 把现有 `dsh-hello/` 迁入 `packages/dsh-hello/`，保持其包结构不变。
- 补齐开源地基：
  - `git init` + `.gitignore`（排除 node_modules、产物、本机环境专用文件等）；
  - 新增 `LICENSE`（MIT，与 `dsh-hello` 包内声明一致）；
  - 根 `README.md` 升级为「插件索引」页（列出各插件、安装方式、开发入口）。
- 同步受迁移影响的文档与约定：
  - `AGENTS.md` 的仓库布局段落改为 monorepo 描述；
  - `dsh-hello/README.md` 中 link 安装路径更新为 `packages/` 下的新路径。
- 明确不引入构建编排工具：无 TypeScript/打包/跨包依赖，**不引入 Turborepo**（设计决策，随插件演进需要时再评估）。

## Capabilities

### New Capabilities
- `plugin-workspace`: 仓库作为 pnpm workspace monorepo 的布局与根级脚本契约——所有 DSH 插件位于 `packages/*`、可递归跑测试、不要求构建步骤。
- `open-source-foundation`: 仓库对外开源所需的形态与边界——git 版本管理、MIT 许可声明、`.gitignore` 排除范围、根 README 作为插件索引、本机环境专用文件（`bin/pnpm`）的处理方式。

### Modified Capabilities
<!-- 无既有 spec 被修改：这是本仓库首个 change。 -->

## Impact

- **目录移动**：`dsh-hello/` → `packages/dsh-hello/`。若本机 profile 曾以 `link:$(pwd)/dsh-hello` 安装，需重新 link 到新路径（`dsh plugin remove` + `add link:.../packages/dsh-hello`）。
- **新增文件**：根 `package.json`、`pnpm-workspace.yaml`、`.gitignore`、`LICENSE`。
- **文档更新**：根 `README.md`、根 `AGENTS.md`、`packages/dsh-hello/README.md`（路径与布局描述）。
- **保持不动**：`bin/pnpm`（本机 DSH Desktop 环境胶水，保留于仓库根并在 README/AGENTS.md 说明用途）；`dsh-hello` 的插件实现代码与其 `node:test` 测试（迁移不改逻辑）。
- **GitHub**：仓库名 `my-dsh-plugins`；首次提交后推送远端由用户在确认 GitHub 目标后执行（本 change 只做本地初始化与提交准备）。
