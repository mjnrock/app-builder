import React, { Component } from "react";
import { ModelContainer } from "./ModelContainer";

class Model extends Component {
	constructor(props) {
		super(props);
		
		this.Mutator = new this.props.PTO.Mutator.Model();

		this.Timestamp = Date.now();
	}

	SetTag(tag) {
		this.Mutator.SetTag(tag);

		return this;
	}
	GetTag() {
		return this.Mutator.GetTag();
	}

	GetModelContainer(mc) {
		if(!this.Mutator.GetModelContainer()) {
			this.Mutator.SetModelContainer(mc.GetTag());
		}
	}
	OnSave() {
		console.log(this.Mutator.GetTag());
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
					>Send Tag to Console</button>
				</div>
			</div>
		);
	}
}

export { Model };