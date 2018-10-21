import { createStore, applyMiddleware } from "redux";

import RootReducer from "../reducers";

export default function initStore() {
	let store = createStore(
		RootReducer(),
		applyMiddleware()
	);

	return store;
}