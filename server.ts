import express from "express";
import fs from "fs";
import path from "path";
import { ExpressPeerServer } from 'peer';
import { fileURLToPath } from "url";
import { ViteDevServer, createServer as createViteServer } from "vite";
import { getCssUrls } from "./getSSRCssUrls.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production'

async function createServer() {
  const app = express();
  
  let vite:ViteDevServer | null
  if (isProduction) {
    app.use(express.static(`${__dirname}/client`))
  } else {
    // 以中间件模式创建 Vite 应用，并将 appType 配置为 'custom'
    // 这将禁用 Vite 自身的 HTML 服务逻辑
    // 并让上级服务器接管控制
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
      build: {
        ssrEmitAssets: false,
      },
    });

    // 使用 vite 的 Connect 实例作为中间件
    // 如果你使用了自己的 express 路由（express.Router()），你应该使用 router.use
    app.use(vite.middlewares);
  }
  

  

  const server = app.listen(5173);
  const peerServer = ExpressPeerServer(server, {
    generateClientId: () =>{
      const id = (Math.random().toString(36) + "0000000000000000000").substr(2, 6)
      return id
  },
    path: "/peer",
    proxied: true
  });
  app.use(peerServer)
  app.use("*", async (req, res, next) => {
    // 服务 index.html - 下面我们来处理这个问题
    const url = req.originalUrl;
    console.log(isProduction)
    if(!isProduction)
    try {
      // 1. 读取 index.html
      let template = fs.readFileSync(
        path.resolve(__dirname, "index.html"),
        "utf-8"
      );

      // 2. 应用 Vite HTML 转换。这将会注入 Vite HMR 客户端，
      //    同时也会从 Vite 插件应用 HTML 转换。
      //    例如：@vitejs/plugin-react 中的 global preambles
      template = await vite!.transformIndexHtml(url, template);

      // 3. 加载服务器入口。vite.ssrLoadModule 将自动转换
      //    你的 ESM 源码使之可以在 Node.js 中运行！无需打包
      //    并提供类似 HMR 的根据情况随时失效。
      const { render } = await vite!.ssrLoadModule("/render/server-render.tsx");

      // 4. 渲染应用的 HTML。这假设 entry-server.js 导出的 `render`
      //    函数调用了适当的 SSR 框架 API。
      //    例如 ReactDOMServer.renderToString()
      // css注入方案 https://github.com/vitejs/vite/issues/2013#issuecomment-786804302
      const appHtml = await render(url,{});
      const mod = await vite!.moduleGraph.getModuleByUrl(
        "/src/main.tsx"
      ); /* replace with your entry */
      const cssUrls = mod!.ssrTransformResult!.deps!.filter((d) =>
        d.endsWith(".css")
      );
      // 5. 注入渲染后的应用程序 HTML 到模板中。
      const devCss =
        getCssUrls(mod!) +
        cssUrls.map((url) => {
          return `<link rel="stylesheet" type="text/css" href="${url}">`;
        });
      const html = template
        .replace(`<!--ssr-outlet-->`, appHtml)
        .replace(`<!--dev-css-->`, devCss);

      // 6. 返回渲染后的 HTML。
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e: unknown) {
      // 如果捕获到了一个错误，让 Vite 来修复该堆栈，这样它就可以映射回
      // 你的实际源码中。
      vite!.ssrFixStacktrace(e as Error);
      next(e);
    } else {
      const { render } = await import(path.join(__dirname, 'server/server-render.js'))
      const appHtml = await render(url,{})
      console.log(appHtml)
      const html = fs.readFileSync(path.join(__dirname, "client/index.html"), { encoding: 'utf-8'}).replace(`<!--ssr-outlet-->`, appHtml)
      res.status(200).set({ "Content-Type": "text/html" }).end(html)
    }
    
  });
}

createServer();
