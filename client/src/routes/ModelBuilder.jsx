import React, { Component } from "react";

class ModelBuilder extends Component {
	render() {
		return (
			<div>
				<this.props.Core.Component.Model.ModelComponentContainer PTO={ this.props.PTO } />
			</div>
		);
	}
}

export { ModelBuilder };