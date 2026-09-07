## Purpose

定义仓库对外开源所需的形态与边界：git 版本管理、MIT 许可声明、`.gitignore` 的排除范围、根 README 作为插件索引，以及本机环境专用文件（`bin/pnpm`）在开源仓库中的处理方式，确保任何开发者克隆后能理解并运行仓库。

## ADDED Requirements

### Requirement: git 版本管理
仓库根 SHALL 是 git 仓库（含 `.git`），首次提交 SHALL 包含迁移后的全部项目文件与文档，且提交历史可从仓库根查看。

#### Scenario: 仓库可被 git 管理
- **WHEN** 在仓库根执行 `git status` 或 `git log`
- **THEN** 命令成功执行且能看到已跟踪文件与初始提交

### Requirement: 开源许可声明
仓库根 SHALL 包含 `LICENSE` 文件（MIT），其版权人/年份信息与各插件包 `package.json` 中声明的 MIT 许可一致。

#### Scenario: 克隆者能确认许可
- **WHEN** 查看仓库根 `LICENSE` 与任一插件包的 `package.json`
- **THEN** 二者均声明 MIT 许可且不互相矛盾

### Requirement: .gitignore 排除范围
仓库根 SHALL 存在 `.gitignore`，至少排除 `node_modules`、日志与临时产物，并针对本机环境专用文件（`bin/pnpm`）或 profile 相关本地文件给出明确的纳入或排除决策。

#### Scenario: 依赖目录不进版本库
- **WHEN** 执行 `git add .` 后检查待提交清单
- **THEN** 任何 `node_modules` 目录 SHALL 不被跟踪

### Requirement: 根 README 作为插件索引
根 `README.md` SHALL 以中文概述仓库用途、列出 `packages/*` 下的每个插件（名称、一句话说明）、给出本地开发（测试、安装到 DSH profile）与发布的基本指引。

#### Scenario: 新贡献者按索引快速了解
- **WHEN** 克隆仓库并阅读根 README
- **THEN** 能得知每个插件的作用、如何运行其测试、如何安装到本机 DSH profile

### Requirement: 本机环境专用文件边界
`bin/pnpm`（DSH Desktop 沙箱环境胶水，依赖本机 `/tmp` 路径）SHALL 不作为通用开发工具对外宣传；其用途 SHALL 在仓库文档（README 或 AGENTS.md）中说明，克隆者在普通环境使用系统 pnpm/npm 即可。

#### Scenario: 环境差异不阻塞开发
- **WHEN** 在没有 `bin/pnpm` 环境布局的机器上克隆仓库
- **THEN** 仍可通过系统 pnpm/npm 执行根级与插件级测试与开发
