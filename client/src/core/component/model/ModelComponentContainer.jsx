import React, { Component } from "react";
import { ModelComponent } from "./ModelComponent";

//TODO When on a LIST or a COMPOUND, reveal a <button>Add</button> and then add a ModelComponent.  Make TYPE aware, so LIST can only add ContentType
//TODO Basically have it ANY time a ModelComponent is LIST or COMPOUND, an expansion pane appears to nest more Tags
class ModelComponentContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ModelComponents: {}
		}

		let PTO = this.props.PTO;
		this.Tag = new PTO.Tag.TagCompound("ModelComponentContainer");

		this.Tag.AddTag(new PTO.Tag.TagString("Name"));
		this.Tag.AddTag(new PTO.Tag.TagList("Components", PTO.Enum.TagType.COMPOUND));
	}

	SetTag(tag) {
		this.Tag = tag;

		return this;
	}
	GetTag() {
		return this.Tag;
	}

	GetModelComponent(mc) {
		let mcs = this.state.ModelComponents,
			uuid = mc.props.UUID;

		mcs[uuid].Class = mc;

		this.setState({
			...this.state,
			ModelComponents: mcs
		});

		console.log(this);
	}
	NewModelComponent() {
		let mcs = this.state.ModelComponents,
			uuid = this.props.PTO.Utility.Transformer.GenerateUUID();

		mcs[uuid] = {
			UUID: uuid,
			Class: null,
			Element: <ModelComponent
				PTO={ this.props.PTO }
				UUID={ uuid }
				GetModelComponent={ (mc) => { this.GetModelComponent(mc) }}
			/>
		};

		this.setState({
			...this.state,
			ModelComponents: mcs
		});
	}

	render() {
		return (
			<div className="flex justify-around">
				<div className="w-90">
					{
						Object.entries(this.state.ModelComponents).map((e, i) => {
							console.log(e);

							return React.cloneElement(
								e[1].Element,
								{ key: e[0] }
							);
						})
					}
					<button onClick={ this.NewModelComponent.bind(this) }>Add Tag</button>
					<button onClick={ () => console.log(this.ModelComponents) }>State</button>
				</div>
			</div>
		);
	}
}

export { ModelComponentContainer };