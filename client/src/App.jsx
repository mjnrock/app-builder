import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Routes from "./routes/package";

import PTO from "./lib/pto/package";

import Core from "./core/package";

class App extends Component {
	componentWillMount() {
		this.setState({
			a: 1,
			b: {
				c: 2,
				d: 3
			}
		});
	}
	componentDidMount() {
		console.log(this);
	}

	render() {
		return (
			<BrowserRouter>
				<div>
					<Switch>
						<Route exact path="/" component={ () => <Routes.ModelBuilder Core={ Core } PTO={ PTO } /> } />
					</Switch>
				</div>
			</BrowserRouter>
		);
	}
}

export default App;