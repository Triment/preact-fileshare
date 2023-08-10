export function createStore(reducer: Function){
  let initalState = {}
  const subFuncs: Function[] = []
  const subscribe = (func: ()=>void)=>{
    subFuncs.push(func);
  }
  const dispatch = (payload: any)=>{
    initalState = reducer(initalState, payload);
    for(const func of subFuncs){
      func()
    }
  }
  const getState = ()=>initalState
  return ()=>{
    return { subscribe, dispatch, getState }
  }
}
