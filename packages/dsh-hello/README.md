# dsh-hello —— 最简单的 DSH 插件

一个为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH，即 DSH Desktop / dsh CLI）编写的最简 bundle 插件：

- profile 启动时打印一句问候（`apply` 即插件主体）；
- 若宿主提供了 `webServer` 服务（web / desktop profile），额外注册 `GET /dsh-hello` 路由，浏览器打开即可验证。

它的"插件外壳"与 DSH Desktop 插件市场里的 [dsh-whale-widget](https://www.npmjs.com/package/dsh-whale-widget)、dsh-synapse 完全同构，可作为你继续开发插件的起点。

## 一个 DSH 插件由什么组成

DSH 的 profile 是一条按序叠加的"配置树"（cordis tree）。插件包提供 **3 个部分**：

```
dsh-hello/
├── package.json        # 声明 dsh.bundle.patch -> ./cordis.patch.yml
├── cordis.patch.yml    # patch：把 { id, name, config } 插入 profile 配置树
├── lib/index.js        # 被 cordis 按 name 加载，export { name, apply(ctx, config) }
└── test/               # 不依赖运行时、用假 ctx 的冒烟测试
```

三者缺一不可：patch 声明"树里要有一个叫 `dsh-hello` 的节点"，`name` 决定 cordis 去 profile 的 `node_modules` 里加载哪个包，`apply(ctx, config)` 是插件真正执行的逻辑（`config` 来自 patch 里 `insert.config`）。

## 本地验证（无需安装到 profile）

```sh
cd packages/dsh-hello
node --check lib/index.js
node --test            # 3 个用例全过
```

## 安装到 DSH profile 并启用

以 DSH Desktop 正在运行的 `desktop` profile 为例（换成 `web` profile 同理）：

```sh
# 1) 把插件装进 profile 的 node_modules（link: 本地软链，改代码即时生效）
dsh plugin --profile desktop add link:/Users/wangyinggang/personal/my-dsh-plugins/packages/dsh-hello

# 2) 在 profile 里启用插件：把 dsh-hello 加进 bundles（也可以手动编辑
#    ~/.dsh/profiles/desktop/package.json 的 dsh.profile.bundles）
```

启用后**重启 DSH Desktop**（或触发配置热重载，见下）。

### 另一种启用方式：写入你自己的 patch 层

不需要动 `dsh.profile.bundles`：在 profile 的 `cordis.patch.yml`
（`~/.dsh/profiles/desktop/cordis.patch.yml`）末尾追加与包内 patch 等价的内容：

```yaml
- insert:
    - id: dsh-hello
      name: dsh-hello
      config:
        greeting: Hello from dsh-hello!
```

`desktop` profile 的 `patchReload: live` 会监视该文件——某些情况下保存即可热生效，不必重启应用。

## 验证是否生效

1. 启动日志里应出现 `Hello from dsh-hello!`；
2. 浏览器访问 DSH 网页界面同端口的 `/dsh-hello`（例如 `http://127.0.0.1:43120/dsh-hello`），返回：

```json
{ "plugin": "dsh-hello", "message": "Hello from dsh-hello!", "time": "..." }
```

## 卸载

```sh
dsh plugin --profile desktop remove dsh-hello   # 移除依赖
# 再手动把 dsh-hello 从 dsh.profile.bundles / patch 中删掉
```

## 从这里继续

- 想扩展宿主能力（路由、事件、agent 工具），照 `ctx.webServer`/`ctx.on(...)` 的用法即可，DSH Desktop 的日志 `~/Library/Application Support/DSH Desktop/logs/` 有运行线索；
- 想做成面向 UI 的 client 插件（注入前端模块），参考 `dsh-synapse` 的 `dsh.client` 字段；
- 想发布：`npm publish` 后即可通过 DSH 的插件市场被他人 `add`。
