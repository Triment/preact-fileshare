import { VNode, createContext } from "preact";
import { useContext } from "preact/hooks";
import { PageContext } from "./types";

export { PageContextProvider, usePageContext };

const Context = createContext<PageContext>(undefined as any)

function PageContextProvider({
  pageContext,
  children,
}: {
  pageContext: PageContext
  children: VNode
}) {
  return <Context.Provider value={pageContext}>{children}</Context.Provider>
}

function usePageContext() {
  const pageContext = useContext(Context)
  return pageContext
}
