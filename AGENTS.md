# AGENTS.md — my-dsh-plugins 项目规则

本文件是 DSH（DeepSeek Harness）的项目指令文件，等价于 Claude Code 的 CLAUDE.md：
任何工作目录位于本仓库（或其子目录）的会话都会自动加载以下约定。改动本文件后，
正在运行的会话会在上下文协调时感知到；新会话直接生效。

## 这是什么仓库

个人 DSH 插件开发仓库（GitHub 开源：`KingYIGA/my-dsh-plugins`），pnpm monorepo。
仓库根不做业务开发；所有 DSH 插件位于 `packages/*`，每个插件是一个独立、可单独
`npm publish` 的 npm 包。仓库内**不要**写业务逻辑、不要存放与插件无关的个人文档。

## 仓库布局

- `packages/<plugin>/` —— 每个 DSH 插件一个自包含目录（如 `packages/dsh-hello/`）。
  插件彼此独立、无源码级相互依赖；新建插件时复制 `dsh-hello` 骨架。
- `package.json`（根） —— 只做编排（`private: true`、`pnpm -r test`），永不发布。
- `pnpm-workspace.yaml` —— `packages: ['packages/*']`，pnpm 递归测试/安装的入口。
- `bin/pnpm` —— ⚠️ 本机 DSH Desktop 专用包装脚本（缓存指到 `/tmp` 沙箱区）。
  不是通用工具：只读执行即可，不要修改其逻辑；通用环境请用系统 pnpm。
- `openspec/` —— OpenSpec spec 驱动开发工件（specs 与 changes）。
- `AGENTS.md` —— 本文件，DSH 自动加载的项目规则。
- `LICENSE` / `README.md` / `.gitignore` —— MIT 许可、插件索引页、git 忽略规则。

## 一个 DSH bundle 插件的三要素（约定，勿破坏）

```
packages/<plugin>/   # 例如 packages/dsh-hello/
├── package.json     # 声明 dsh.bundle.patch -> ./cordis.patch.yml
├── cordis.patch.yml # patch：把 { id, name, config } 插入 profile 的配置树
├── lib/index.js     # export { name, apply(ctx, config) }，被 cordis 按 name 加载
└── test/            # 不依赖运行时、用假 ctx 的冒烟测试
```

- `name` 决定 cordis 从 profile 的 `node_modules` 加载哪个包，必须与包名一致。
- `config` 来自 patch 中 `insert.config`，在 `apply(ctx, config)` 第二参数收到。
- 对宿主能力（webServer 路由、事件、agent 工具）一律做能力探测后再用
  （如 `ctx.webServer?.register`），保证在任意 profile 下都能安全加载，不做硬依赖。
- 新建插件时复制 `dsh-hello` 的骨架，保持上述结构与命名习惯。

## 常用命令

仓库根：

```sh
pnpm install     # 安装所有 workspace 依赖
pnpm test        # 等价 pnpm -r test：逐个跑 packages/* 的测试
```

插件目录（如 `packages/dsh-hello/`）内：

```sh
node --check lib/index.js   # 语法检查
node --test                 # 跑冒烟测试（node:test，无外部依赖）
pnpm test                   # 同上（npm test 亦可）
```

安装到正在运行的 profile（以 desktop 为例；web 同理换 `--profile web`）：

```sh
dsh plugin --profile desktop add link:/Users/wangyinggang/personal/my-dsh-plugins/packages/<plugin>
```

若 shell 里找不到 `dsh`，检查 PATH 或通过 DSH Desktop 的插件管理入口操作。
若 shell 里找不到 `pnpm`，使用本仓库 `bin/pnpm`（本机 DSH Desktop 场景）。

启用插件两种方式：

1. 把插件加进 profile 的 `dsh.profile.bundles`
   （`~/.dsh/profiles/desktop/package.json`），或
2. 在 profile 的 patch 层（`~/.dsh/profiles/desktop/cordis.patch.yml`）末尾追加等价
   `insert` 条目；desktop profile 的 `patchReload: live` 会监视该文件，保存即热生效。

改完插件后重启 DSH Desktop 或触发热重载验证；运行日志在
`~/Library/Application Support/DSH Desktop/logs/`（macOS）。

## 工作约定

- 保持简洁：每个插件一个自包含目录，能独立 `npm publish`。
- 测试不得依赖 DSH 运行时——用假 `ctx` 验证 `apply` 行为（见 `packages/dsh-hello/test/`）。
- 不改动 `bin/pnpm` 的逻辑；它是本机环境专用胶水。
- 需要发布插件时先 `npm publish`（从插件目录），再走 DSH 插件市场被他人安装。
- 与 DSH 运行机制相关的排查优先查 profile 目录 `~/.dsh/profiles/<profile>/`
  的 `package.json` / `cordis.patch.yml` / `cordis.yml` 与运行日志。
