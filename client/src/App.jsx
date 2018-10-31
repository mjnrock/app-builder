import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Routes from "./routes/package";

// import PTO from "./lib/pto/package";
import Core from "./core/package";

class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<Switch>
					<Route exact path="/model/builder" component={ (router) => <Routes.ModelBuilder Router={ router } Core={ Core } /> } />
				</Switch>
			</BrowserRouter>
		);
	}
}

export default App;