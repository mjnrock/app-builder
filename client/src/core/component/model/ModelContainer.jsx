import React, { Component } from "react";
import { ModelComponent } from "./ModelComponent";

//TODO When on a LIST or a COMPOUND, reveal a <button>Add</button> and then add a ModelComponent.  Make TYPE aware, so LIST can only add ContentType
//TODO Basically have it ANY time a ModelComponent is LIST or COMPOUND, an expansion pane appears to nest more Tags
class ModelContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ModelComponents: {},
			ModelContainers: {},
			Elements: []
		}

		let PTO = this.props.PTO;
		this.Tag = new PTO.Tag.TagCompound("ModelContainer");

		this.Tag.AddTag(new PTO.Tag.TagUUID("UUID"));
		this.Tag.AddTag(new PTO.Tag.TagString("Name"));
		this.Tag.AddTag(new PTO.Tag.TagList("Components", PTO.Enum.TagType.COMPOUND));
		this.Tag.AddTag(new PTO.Tag.TagList("Containers", PTO.Enum.TagType.COMPOUND));

		this.UUID = this.Tag.GetTag("UUID").GetValues();
		this.Timestamp = Date.now();
	}
	componentDidMount() {
		console.log(this.props);
		if(this.props.GetModelContainer) {
			this.props.GetModelContainer(this);
		}
		
		//	If this is in constructor, throws: "TypeError: Cannot convert undefined or null to object"
		if(this.props.UUID !== null && this.props.UUID !== void 0) {
			this.Tag.GetTag("UUID").SetValues(this.props.UUID);
			this.UUID = this.props.UUID;
		}
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
		
		mc.GetTag().SetKey(uuid);
		this.Tag.GetTag("Components").AddValue(mc.GetTag());
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
			/>,
			Timestamp: Date.now()
		};

		this.setState({
			...this.state,
			ModelComponents: mcs
		});
	}
	
	GetModelContainer(mc) {		
		let mcs = this.state.ModelContainers,
			uuid = mc.props.UUID;

		mcs[uuid].Class = mc;

		this.setState({
			...this.state,
			ModelContainers: mcs
		});
		
		mc.GetTag().SetKey(uuid);
		this.Tag.GetTag("Containers").AddValue(mc.GetTag());
	}
	NewModelContainer() {
		let mcs = this.state.ModelContainers,
			uuid = this.props.PTO.Utility.Transformer.GenerateUUID();

		mcs[uuid] = {
			UUID: uuid,
			Class: null,
			Element: <ModelContainer
				PTO={ this.props.PTO }
				UUID={ uuid }
				GetModelContainer={ (mc) => { this.GetModelContainer(mc) }}
			/>,
			Timestamp: Date.now()
		};

		this.setState({
			...this.state,
			ModelContainers: mcs
		});
	}

	MergeIntoElements() {
		let Elements = {};
		Object.entries(this.state.ModelComponents).forEach((e, i) => {
			Elements[e[1].Timestamp] = e[1];
		});
		Object.entries(this.state.ModelContainers).forEach((e, i) => {
			Elements[e[1].Timestamp] = e[1];
		});
		Elements = Object.entries(Elements);
		Elements.sort((a, b) => Number(a[1].Timestamp) - Number(b[1].Timestamp));
		Elements = Elements.map((v, i) => v[1]);

		return Elements;
	}

	RemoveComponent(element) {
		let state = this.state;
		if(element.Class instanceof ModelComponent) {
			this.Tag.GetTag("Components").RemoveValue(element.Class.Tag);

			delete state.ModelComponents[element.UUID];
		} else if(element.Class instanceof ModelContainer) {
			this.Tag.GetTag("Containers").RemoveValue(element.Class.Tag);

			delete state.ModelContainers[element.UUID];
		}

		this.setState(state);
	}

	render() {
		let Elements = this.MergeIntoElements();

		return (
			<div className="w-100 flex justify-around mt2 mb2">
				<div className="w-100 ba br2 b--light-gray pa2">
					<label className="f7 b">Name</label>
					<input
						type="text"
						className="form-control mb1"
						placeholder="Container Name"
						mcf=".Name"
						onChange={ this.onDataChange.bind(this) }
					/>
					<p className="f7 code text-center">
						<span>{ this.UUID }</span>
					</p>
					{
						Elements.map((e, i) => {
							return (
								<div className="flex mt2 mb2" key={ i }>
									<button className="btn btn-sm btn-outline-danger mr1" onClick={ () => this.RemoveComponent(e) }>X</button>
									{
										e.Element
									}
								</div>
							);
						})
					}
					<div className="text-center">
						<button
							type="button"
							className="btn btn-sm btn-outline-primary mr1"
							onClick={ this.NewModelComponent.bind(this) }>Add Tag</button>
						<button
							type="button"
							className="btn btn-sm btn-outline-info mr1"
							onClick={ this.NewModelContainer.bind(this) }>Add Container</button>
						<button
							type="button"
							className="btn btn-sm btn-outline-secondary mr1">Add Model</button>
						<button
							type="button"
							className="btn btn-sm btn-outline-dark mr1"
							onClick={ () => console.log(this) }>This</button>
					</div>
				</div>
			</div>
		);
	}

	onDataChange(e) {
		let mcf = e.target.getAttribute("mcf"),
			tag = this.props.PTO.Utility.Navigator.FindTag(this.Tag, mcf);
		
		if(tag !== null && tag !== void 0) {
			if(e.type === "change") {
				tag.SetValues(e.target.value);
			}
			
			//	Because of the construction and no state manipulation, this basically doubly-binds the Tags to the component
			this.forceUpdate();
		}
	}
}

export { ModelContainer };