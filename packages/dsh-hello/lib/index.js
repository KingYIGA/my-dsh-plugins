// dsh-hello —— 最简单的 DSH 插件
//
// 一个 DSH "bundle 插件" 由三部分组成：
//   1. package.json 里声明  dsh.bundle.patch -> ./cordis.patch.yml
//   2. cordis.patch.yml 把 { id, name, config } 插入 profile 的配置树
//   3. 本模块被 cordis 按 name 加载，插件主体就是 apply(ctx, config)
//
// 参考：同目录安装的 dsh-whale-widget / dsh-synapse 遵循同一约定。

export const name = 'dsh-hello'

export function apply(ctx, config = {}) {
  const greeting =
    typeof config.greeting === 'string' && config.greeting.trim() !== ''
      ? config.greeting
      : 'Hello from dsh-hello!'

  ctx.logger.info(greeting)

  // 若宿主提供了 webServer 服务（web / desktop profile），顺手注册一个测试路由，
  // 打开浏览器访问 http://127.0.0.1:<端口>/dsh-hello 即可看到效果。
  // 这里不做 inject 声明，插件在任意 profile 下都能安全加载。
  if (ctx.webServer?.register) {
    ctx.webServer.register({
      kind: 'exact',
      path: '/dsh-hello',
      handler: (req, res) => {
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-store',
        })
        res.end(
          JSON.stringify({
            plugin: name,
            message: greeting,
            time: new Date().toISOString(),
          }),
        )
      },
    })
    ctx.logger.info('dsh-hello: 已注册路由 GET /dsh-hello')
  }
}
