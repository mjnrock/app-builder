import React, { Component } from "react";

import PTO from "../../../lib/pto/package";
import { TagComponent } from "./TagComponent";
import { TagList } from "./TagList";

class TagContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			Container: {}
		};

		this.UUID = this.props.UUID !== null && this.props.UUID !== void 0 ? this.props.UUID : PTO.Utility.Transformer.GenerateUUID();
		this.Tag = new PTO.Tag.TagCompound(this.UUID);
		
		this.Timestamp = Date.now();
	}

	componentWillMount() {
		if(this.props.RegisterElement) {
			this.props.RegisterElement(this);
		}
	}

	SetTag(tag) {
		this.Tag = tag;

		return this;
	}
	GetTag() {
		return this.Tag;
	}
	
	RegisterElement(element) {
		let elements = this.state.Container,
			uuid = element.props.UUID;

		elements[uuid].Class = element;

		this.setState({
			...this.state,
			Container: elements
		});
		
		element.GetTag().SetKey(uuid);
		this.Tag.AddTag(element.GetTag());
	}
	NewContainerElement(type) {
		let elements = this.state.Container,
			uuid = PTO.Utility.Transformer.GenerateUUID();

		elements[uuid] = {
			UUID: uuid,
			Class: null,
			Timestamp: Date.now()
		};
		
		if(type === "Compound") {
			elements[uuid]["Element"] = <TagContainer
				UUID={ uuid }
				RegisterElement={ (mc) => { this.RegisterElement(mc) }}
			/>;
		} else if(type === "Component") {
			elements[uuid]["Element"] = <TagComponent
				UUID={ uuid }
				Type={ this.ListType }
				RegisterElement={ (mc) => { this.RegisterElement(mc) }}
			/>;
		} else if(type === "List") {
			elements[uuid]["Element"] = <TagList
				UUID={ uuid }
				ListType={ PTO.Enum.TagType.STRING }
				RegisterElement={ (mc) => { this.RegisterElement(mc) }}
			/>;
		}

		this.setState({
			...this.state,
			Container: elements
		});
	}
	
	RemoveElement(element) {
		let state = this.state;

		this.Tag.RemoveTag(element.Class.Tag);
		delete state.Container[element.UUID];

		this.setState(state);
	}

	render() {
		return (
			<div className="w-100 flex justify-around mt2 mb2 ba br2 b--ddd pa2">
				<div className="w-100">
					<label className="f7 b">Name</label>
					<input
						type="text"
						className="form-control"
						placeholder="Name"
						mcf=".Name"
						defaultValue={ this.Tag.GetKey() }
						onFocus={
							(e) => {
								if(e.target.value === this.UUID) {
									e.target.setSelectionRange(0, e.target.value.length);
								}
							}
						}
						onChange={ this.onDataChange.bind(this) }
					/>
					<p
						className="f7 code text-center"						
						style={{
							"color": PTO.Enum.TagType.GetColor(PTO.Enum.TagType.COMPOUND)
						}}
					>
						<span>{ PTO.Enum.TagType.GetString(PTO.Enum.TagType.COMPOUND) }</span>
						<span>&nbsp;[{ this.UUID }]</span>
					</p>
					{
						Object.values(this.state.Container).map((e, i) => {
							return (
								<div className="flex mt2 mb2 justify-around" key={ i }>
									<button
										className={
											`btn btn-sm btn-outline-danger ${ e.Class instanceof TagContainer ? "mr2" : "mr1" }`
										}
										onClick={ () => this.RemoveElement(e) }
									>X</button>
									{
										e.Element
									}
								</div>
							);
						})
					}
					<div className="text-center flex justify-around">
						{/* Weird CSS issue that this janky thing fixes, so w/e */}
						<div
							className="btn-block"
							style={{ "display": "none" }}
						></div>

						<button
							type="button"
							className="btn btn-block btn-sm btn-outline-primary mr1"
							onClick={ () => this.NewContainerElement("Component") }
						>Add Tag</button>
						<button
							type="button"
							className="btn btn-block btn-sm btn-outline-info mr1"
							onClick={ () => this.NewContainerElement("Compound") }
						>Add Compound</button>
						<button
							type="button"
							className="btn btn-block btn-sm btn-outline-info mr1"
							onClick={ () => this.NewContainerElement("List") }
						>Add List</button>
						<button
							type="button"
							className="btn btn-block btn-sm btn-outline-dark mr1"
							onClick={ () => console.log(this) }
						>console.log(this)</button>
					</div>
				</div>
			</div>
		);
	}

	onDataChange(e) {
		if(e.type === "change") {
			this.Tag.SetValues(e.target.value);
		}
		
		//	Because of the construction and no state manipulation, this basically doubly-binds the Tags to the component
		this.forceUpdate();
	}
}

export { TagContainer };