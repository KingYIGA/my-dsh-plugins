// dsh-hello 冒烟测试：不依赖 DSH 运行时，用假 ctx 验证 apply() 行为。
import test from 'node:test'
import assert from 'node:assert/strict'
import { name, apply } from '../lib/index.js'

function makeCtx({ withWebServer = true } = {}) {
  const registered = []
  const infoLogs = []
  const ctx = {
    logger: {
      info: (...args) => infoLogs.push(args),
      warn: () => {},
      error: () => {},
    },
  }
  if (withWebServer) {
    ctx.webServer = {
      register: (options) => registered.push(options),
    }
  }
  return { ctx, registered, infoLogs }
}

/** 极简的 node:http res 替身。 */
function makeRes() {
  let status = 0
  let body = ''
  return {
    res: {
      writeHead(code, headers) {
        status = code
      },
      end(text) {
        body = String(text)
      },
    },
    get status() {
      return status
    },
    get body() {
      return body
    },
  }
}

test('模块导出约定与 dsh-whale-widget 一致：export { name, apply }', () => {
  assert.equal(name, 'dsh-hello')
  assert.equal(typeof apply, 'function')
})

test('无 webServer 时也能安全加载，并打印问候日志', () => {
  const { ctx, infoLogs } = makeCtx({ withWebServer: false })
  apply(ctx, {})
  assert.equal(infoLogs.length, 1)
  assert.ok(String(infoLogs[0][0]).includes('Hello from dsh-hello!'))
})

test('存在 webServer 时注册 GET /dsh-hello 路由并响应问候', () => {
  const { ctx, registered } = makeCtx({ withWebServer: true })
  apply(ctx, { greeting: '你好，DSH！' })

  const route = registered.find((r) => r.kind === 'exact' && r.path === '/dsh-hello')
  assert.ok(route, '应注册 /dsh-hello 路由')

  const mock = makeRes()
  route.handler({}, mock.res)
  const payload = JSON.parse(mock.body)
  assert.equal(payload.plugin, 'dsh-hello')
  assert.equal(payload.message, '你好，DSH！')
  assert.ok(payload.time)
})
