import React, { Component } from "react";
import { ModelContainer } from "./ModelContainer";

class Model extends Component {
	constructor(props) {
		super(props);

		let PTO = this.props.PTO;
		this.Tag = new PTO.Tag.TagCompound("Model");

		this.Tag.AddTag(new PTO.Tag.TagUUID("UUID"));
		this.Tag.AddTag(new PTO.Tag.TagString("Name"));
		this.Tag.AddTag(new PTO.Tag.TagCompound("ModelContainer"));
	}

	SetTag(tag) {
		this.Tag = tag;

		return this;
	}
	GetTag() {
		return this.Tag;
	}

	render() {
		return (
			<div className="container">
				<h2 className="text-center mt3 mb3">Model Builder</h2>
				<ModelContainer PTO={ this.props.PTO } />
				<div className="text-center mt3 mb2">
					<button type="button" className="btn btn-sm btn-block btn-outline-success mr1">Save</button>
				</div>
			</div>
		);
	}
}

export { Model };