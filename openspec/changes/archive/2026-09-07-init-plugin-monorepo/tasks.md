## 1. 迁移 dsh-hello 到 packages/

- [x] 1.1 与用户确认 LICENSE 版权署名（姓名或 GitHub 用户名），确认后方可生成 LICENSE
- [x] 1.2 创建 `packages/` 目录并把 `dsh-hello/` 整体移入 `packages/dsh-hello/`，验证目录 `packages/dsh-hello/{package.json,cordis.patch.yml,lib,test}` 齐全
- [x] 1.3 在 `packages/dsh-hello/` 下执行 `node --check lib/index.js && node --test`，验证 3 个用例全部通过（迁移不改任何插件代码）

## 2. 根级 monorepo 骨架

- [x] 2.1 新增根 `package.json`（`private: true`、`"test": "pnpm -r test"`），验证 `node -e "JSON.parse(require('fs').readFileSync('package.json'))"` 无错且含 `private: true`
- [x] 2.2 新增 `pnpm-workspace.yaml`（`packages: ['packages/*']`），验证根 `pnpm install` 能识别 workspace（或 `pnpm -r test` 列出 packages/dsh-hello 的测试）
- [x] 2.3 根级测试编排可用：执行根 `pnpm test`（若本机无 pnpm 则用 `bin/pnpm test` 或逐包 `cd packages/dsh-hello && npm test` 兜底），验证所有插件测试通过

## 3. 开源地基

- [x] 3.1 新增根 `.gitignore`（排除 `node_modules/`、`*.log`、产物目录等），验证 `git check-ignore node_modules/x` 返回该路径
- [x] 3.2 新增根 `LICENSE`（MIT，署名用 1.1 确认的信息），验证文件头部与 `dsh-hello/package.json` 的 MIT 声明一致
- [x] 3.3 改写根 `README.md` 为插件索引页（仓库用途、插件清单、本地开发/安装指引、`bin/pnpm` 本机专用说明），验证内容覆盖这些小节

## 4. 文档与约定同步

- [x] 4.1 更新根 `AGENTS.md` 的「仓库布局」段落为 monorepo 描述（packages/*、根 package.json/workspace 职责、bin/pnpm 边界），验证该段落与新目录一致
- [x] 4.2 更新 `packages/dsh-hello/README.md` 中 link 安装路径为 `link:/Users/wangyinggang/personal/my-dsh-plugins/packages/dsh-hello`（及文中其他旧路径），验证全文不再出现指向仓库根的旧 `dsh-hello` 路径

## 5. 本机 profile 联动检查

- [x] 5.1 检查本机是否曾以旧路径 `link:.../my-dsh-plugins/dsh-hello` 安装过 dsh-hello（查看 `~/.dsh/profiles/*/package.json` 与 `dsh plugin` 列表），验证：若存在则记录需 remove+重新 add 到 packages 路径，不存在则跳过并注明——**检查结果：desktop/web 两个 profile 的 package.json、cordis.patch.yml、node_modules 均无 dsh-hello 记录，从未以旧路径安装，跳过联动操作**

## 6. git 初始化与首次提交

- [x] 6.1 在仓库根执行 `git init`，验证 `.git` 目录生成且 `git status` 能列出待跟踪文件
- [x] 6.2 执行首次提交（`git add -A && git commit`，提交信息如 `chore: initialize pnpm monorepo for dsh plugins`），验证 `git log` 存在初始提交且工作区干净（`git status` 无未提交变更）——**完成：提交 59f6ad6**
- [x] 6.3 （后续手动，非自动）若用户已创建 GitHub 远端：`git remote add origin <repo-url>` 并 `git push -u origin main`，验证远端出现仓库内容——此步骤等待用户确认 GitHub 目标——**完成：远端已建并推送，main 跟踪 origin/main，工作区干净**

## 7. 变更收尾验证

- [x] 7.1 在仓库根核对最终结构：`packages/dsh-hello/` 存在、根含 `package.json`/`pnpm-workspace.yaml`/`.gitignore`/`LICENSE`/`README.md`/`AGENTS.md`/`openspec/`，验证目录树符合 design.md 的目标形态
- [x] 7.2 全量测试回归：根执行测试（2.3 的方式），验证所有插件测试通过且无回归
