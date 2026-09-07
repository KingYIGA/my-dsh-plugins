# my-dsh-plugins

个人 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH）插件 monorepo。
每个插件都是 `packages/` 下的独立 npm 包，可单独安装、单独发布，供任意 DSH profile（Desktop / Web / dsh CLI）使用。

## 插件清单

| 插件 | 说明 | 类型 |
| --- | --- | --- |
| [dsh-hello](packages/dsh-hello/) | 最简单的 DSH bundle 插件示例：启动时打印问候，并注册 `GET /dsh-hello` 测试路由 | bundle 插件 |

## 仓库结构

```
my-dsh-plugins/
├── packages/               # 各插件（每个都是可独立发布的 npm 包）
│   └── dsh-hello/
├── openspec/               # OpenSpec spec 驱动开发工件（changes/specs）
├── bin/pnpm                # ⚠️ 本机 DSH Desktop 专用包装脚本（见下方说明）
├── pnpm-workspace.yaml
└── package.json            # 根编排：pnpm -r test 跑全部插件测试
```

## 本地开发

要求：Node.js >= 22 与 pnpm（本仓库用 pnpm workspace 管理）。

```sh
# 在仓库根安装并跑全部插件测试
pnpm install
pnpm test                 # 等价 pnpm -r test，逐个跑 packages/* 的测试

# 只测某个插件
cd packages/dsh-hello && pnpm test   # 或 npm test
```

### 把某个插件装进正在运行的 DSH profile

以 DSH Desktop 的 `desktop` profile 为例（`web` profile 同理换 `--profile web`）：

```sh
# link: 本地软链安装，改代码即时生效（开发期推荐）
dsh plugin --profile desktop add link:/Users/wangyinggang/personal/my-dsh-plugins/packages/dsh-hello

# 启用插件：把它加进 profile 的 dsh.profile.bundles，
# 或在 profile 的 patch 层（~/.dsh/profiles/desktop/cordis.patch.yml）追加等价 insert 条目
```

安装与启用的完整说明见各插件自己的 README。

## ⚠️ bin/pnpm 说明

`bin/pnpm` 是本机 DSH Desktop 环境的专用包装脚本（内部把 pnpm 缓存指到 `/tmp` 的可写沙箱区），
**不是**通用开发工具。在普通环境下请使用系统安装的 pnpm/npm，无需也不应使用它。

## 发布插件

从对应插件目录执行 `npm publish` 即可发布到 npm registry，之后可通过 DSH 插件市场被其他用户安装。
仓库采用多包独立版本管理，暂无自动发布管线（需要时再引入 changesets 等工具）。

## 开源协议

[MIT](LICENSE) © [KingYIGA](https://github.com/KingYIGA)
