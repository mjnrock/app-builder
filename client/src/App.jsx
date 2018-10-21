import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Routes from "./routes/package";

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
						{/* <Route exact path="/" render={ (props) => <Routes.Feed WebSocketHelper={ this.WebSocketHelper } /> } /> */}
						<Route exact path="/" component={ Routes.Feed } />
						<Route path="/feed/:id" component={ Routes.Feed } />
					</Switch>
				</div>
			</BrowserRouter>
		);
	}
}

export default App;