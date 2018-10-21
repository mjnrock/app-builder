import { combineReducers } from "redux";
import { onCreateFeed } from "./Feed";

export default function RootReducer() {
	return combineReducers({
		Feed: onCreateFeed
	});
}
