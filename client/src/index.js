import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import initStore from "./store/config.jsx";

import App from "./App";

const store = initStore();

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById("root")
);