import renderToString from "preact-render-to-string";
import { Main } from "./main";
export function render(url: string){
    return renderToString(<Main url={url} />)
}