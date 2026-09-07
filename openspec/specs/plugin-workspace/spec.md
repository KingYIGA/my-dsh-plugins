# Plugin Workspace Specification

## Purpose

定义 my-dsh-plugins 作为 pnpm workspace monorepo 的布局与根级脚本契约：所有 DSH 插件位于 `packages/*`，彼此独立、可递归执行测试，且不要求构建步骤，为持续新增与发布插件提供统一骨架。

## Requirements

### Requirement: 插件统一存放于 packages 目录
仓库内所有可发布的 DSH 插件包 SHALL 位于 `packages/<plugin>/`，每个插件包包含 `package.json`（含 `dsh.bundle.patch` 声明）、`cordis.patch.yml`、`lib/` 与 `test/`，插件包之间 MUST NOT 存在源码级相互依赖。

#### Scenario: 现有插件完成迁移
- **WHEN** 仓库被初始化为 monorepo
- **THEN** 原 `dsh-hello/` 目录被迁移为 `packages/dsh-hello/`，且包内结构与插件逻辑保持不变

#### Scenario: 新增插件有明确落点
- **WHEN** 仓库中新建一个 DSH 插件
- **THEN** 其代码 SHALL 放置在 `packages/<plugin>/` 下，而不是仓库根或其他目录

### Requirement: 根级 workspace 配置
仓库根 SHALL 存在 `pnpm-workspace.yaml`，其 `packages` 字段覆盖 `packages/*`；根 `package.json` SHALL 声明 `private: true`，并提供能递归执行所有插件测试的根级脚本。

#### Scenario: 根级递归测试
- **WHEN** 在仓库根执行 `pnpm test`
- **THEN** 所有 `packages/*` 下插件各自的测试 SHALL 被执行，且任一插件测试失败时命令以非零状态退出

#### Scenario: 单插件测试不受影响
- **WHEN** 进入某个 `packages/<plugin>/` 目录执行 `npm test`
- **THEN** 仅该插件的测试被执行并正常通过（迁移后插件测试行为不变）

### Requirement: 无强制构建步骤
插件以纯 ESM JavaScript 编写，MUST NOT 要求编译/打包/转译步骤即可被 DSH 加载；仓库根级测试与发布流程 MUST NOT 依赖构建编排工具。

#### Scenario: 仓库根不引入构建编排
- **WHEN** 检查仓库根依赖与脚本
- **THEN** 不存在 Turborepo 或其他构建编排工具的配置或运行时依赖，插件测试直接基于源码执行
