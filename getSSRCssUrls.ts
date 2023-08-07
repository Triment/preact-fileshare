import { ModuleNode } from "vite";

//返回注入应用的静态资源
export function getCssUrls(mod: ModuleNode){
  
  let cssJsUrls:string[] = []
  let cssUrls:string[] = []
  const collectCssUrls = (mod: ModuleNode)=> {
    mod.importedModules.forEach(submod => {
  
      //if (submod!.id!.match(/\?vue.*&lang\.css/)) return cssJsUrls.push(submod.url)
      if (submod!.file!.endsWith(".css")) return cssUrls.push(submod.url)
      if (submod.file!.endsWith(".tsx")) return collectCssUrls(submod)
      // XXX need to continue recursing in your routes file
      if (submod!.file!.match(/route/)) return collectCssUrls(submod)
    })
  }
  collectCssUrls(mod)
  return cssUrls.map(url => {
    return `<link rel="stylesheet" type="text/css" href="${url}">\n`
  }).join("") + cssJsUrls.map(url => {
    return `<script type="module" src="${url}"></script>\n`
  }).join("")
}