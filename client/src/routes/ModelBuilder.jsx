import React, { Component } from "react";

class ModelBuilder extends Component {
	render() {
		console.log(this.props);
		return (
			<div>
				<this.props.Core.Component.Model.Model />
			</div>
		);
	}
}

export { ModelBuilder };