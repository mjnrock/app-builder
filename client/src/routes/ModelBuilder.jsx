import React, { Component } from "react";

class ModelBuilder extends Component {
	render() {
		return (
			<div>
				<this.props.Core.Component.Model.Model PTO={ this.props.PTO } />
			</div>
		);
	}
}

export { ModelBuilder };