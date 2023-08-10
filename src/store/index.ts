import { combineReducers, createStore } from "redux";
import { FileReducer } from "./FileShare/reducer";

export default createStore(combineReducers({
  FileReducer
})) 