import React, { Component } from "react";
import { ModelContainer } from "./ModelContainer";

class Model extends Component {
	constructor(props) {
		super(props);

		let PTO = this.props.PTO;
		this.Tag = new PTO.Tag.TagCompound("Model");

		this.Tag.AddTag(new PTO.Tag.TagUUID("UUID"));
		this.Tag.AddTag(new PTO.Tag.TagString("Name"));
	}

	SetTag(tag) {
		this.Tag = tag;

		return this;
	}
	GetTag() {
		return this.Tag;
	}

	GetModelContainer(mc) {
		if(!this.Tag.GetTag("ModelContainer")) {
			this.Tag.AddTag(mc.GetTag());
		}
	}
	OnSave() {
		console.log("This isn't actually saving anything right now.");
		console.log(this.Tag);
	}

	render() {
		return (
			<div className="container">
				<h2 className="text-center mt3 mb3">Model Builder</h2>
				<ModelContainer
					PTO={ this.props.PTO }
					UUID={ this.props.PTO.Utility.Transformer.GenerateUUID() }
					GetModelContainer={ (mc) => { this.GetModelContainer(mc) }}
				/>
				<div className="text-center mt3 mb2">
					<button
						type="button"
						className="btn btn-sm btn-block btn-outline-success mr1"
						onClick={ () => this.OnSave() }
					>Save</button>
				</div>
			</div>
		);
	}
}

export { Model };