import React, { Component } from "react";

class DataSource extends Component {
	render() {
		//? Here to remind about the "Router" object and its data
		// console.log(this.props);
		return (
			<div>
				<this.props.Core.Component.Tag.Tag />
			</div>
		);
	}
}

export { DataSource };