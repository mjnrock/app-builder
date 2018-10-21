import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";

import Routes from "./routes/package";
import WebSocketHelper from "./ws/WebSocketHelper";

import { CreateFeed, AddFeedPost } from "./actions/Feed";

class App extends Component {
	componentWillMount() {
		this.WebSocketHelper = new WebSocketHelper(this.props);
	}

	render() {
		return (
			<BrowserRouter>
				<div>
					<Switch>
						<Route exact path="/" render={ (props) => <Routes.Feed WebSocketHelper={ this.WebSocketHelper } /> } />
						<Route path="/feed/:id" component={ Routes.Feed } />
					</Switch>
				</div>
			</BrowserRouter>
		);
	}
}

export default connect(
	null,
	(dispatch) => {
		return {
			CreateFeed: (feed) => dispatch(CreateFeed(feed)),
			AddFeedPost: (post) => dispatch(AddFeedPost(post))
		};
	}
)(App);