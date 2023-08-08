import renderToString from "preact-render-to-string";
import { Main } from '../src/main'
import { PageContextProvider } from "./PageContext";
export function render(url: string, initState: any){
    return renderToString(<PageContextProvider pageContext={initState} ><Main url={url} /></PageContextProvider>)
}