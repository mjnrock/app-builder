import React, { Component } from "react";

class ModelBuilder extends Component {
	render() {
		//? Here to remind about the "Router" object and its data
		// console.log(this.props);
		return (
			<div>
				<this.props.Core.Component.Model.Model />
			</div>
		);
	}
}

export { ModelBuilder };