import React from "react";
import ReactDOM from "react-dom";

import PTO from "./lib/pto/package";

import App from "./App";

ReactDOM.render(
	<App
		Library={{
			PTO
		}}
	/>,
	document.getElementById("root")
);