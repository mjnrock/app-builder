import React, { Component } from "react";

import PTO from "../../../lib/pto/package";
import { TagComponent } from "./TagComponent";

class TagList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			Container: {}
		};

		this.UUID = this.props.UUID !== null && this.props.UUID !== void 0 ? this.props.UUID : PTO.Utility.Transformer.GenerateUUID();
		if(this.props.ListType !== null && this.props.ListType !== void 0) {
			this.Tag = new PTO.Tag.TagList(this.UUID, +this.props.ListType);
			this.ListType = +this.props.ListType;
		} else {
			this.Tag = new PTO.Tag.TagList(this.UUID);
			this.ListType = PTO.Enum.TagType.STRING;
		}
		
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
		
		if(element.GetTag().GetKey() === void 0 || element.GetTag().GetKey() === null) {
			element.GetTag().SetKey(uuid);
		}
		this.Tag.AddValue(element.GetTag());
	}
	NewListElement(key) {
		let elements = this.state.Container,
			uuid = PTO.Utility.Transformer.GenerateUUID();

		elements[uuid] = {
			UUID: uuid,
			Class: null,
			Timestamp: Date.now()
		};

		elements[uuid]["Element"] = <TagComponent
			UUID={ uuid }
			Type={ this.ListType }
			KeyName={ key }
			RegisterElement={ (mc) => { this.RegisterElement(mc) }}
		/>;

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
				<div className="w-75">
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
							"color": PTO.Enum.TagType.GetColor(PTO.Enum.TagType.LIST)
						}}
					>
						<span>{ PTO.Enum.TagType.GetString(PTO.Enum.TagType.LIST) }</span>
						<span style={{ "color": PTO.Enum.TagType.GetColor(this.ListType) }}>{ `<${ PTO.Enum.TagType.GetString(this.ListType) }>` }</span>
						<span>&nbsp;[{ this.UUID }]</span>
					</p>
					{
						Object.values(this.state.Container).map((e, i) => {
							return (
								<div className="flex mt2 mb2 justify-around" key={ i }>
									<button
										className={
											`btn btn-sm btn-outline-danger ${ e.Class instanceof TagList ? "mr2" : "mr1" }`
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
							onClick={ () => this.NewListElement() }
						>Add Tag</button>
						<button
							type="button"
							className="btn btn-block btn-sm btn-outline-dark mr1"
							onClick={ () => console.log(this) }
						>console.log(this)</button>
					</div>
				</div>
				<div className="w-20">
					<label className="f7 b">Type</label>
					<input
						type="number"
						className="form-control text-center mb-1"
						placeholder="Type"
						mcf=".Type"
						min="1"
						max="12"
						oldvalue="2"
						defaultValue="2"
						onChange={ this.onDataChange.bind(this) }
					/>
				</div>
			</div>
		);
	}

	onDataChange(e) {
		let mcf = e.target.getAttribute("mcf");

		if(e.type === "change") {
			if(mcf === ".Type") {
				if(+e.target.value > +e.target.getAttribute("oldvalue")) {
					e.target.value = +e.target.value === +PTO.Enum.TagType.DOUBLE ? +e.target.value + 1 : +e.target.value;
					e.target.value = +e.target.value === +PTO.Enum.TagType.LIST ? +e.target.value + 1 : +e.target.value;
					e.target.value = +e.target.value === +PTO.Enum.TagType.COMPOUND ? +e.target.value + 1 : +e.target.value;
				} else {
					e.target.value = +e.target.value === +PTO.Enum.TagType.COMPOUND ? +e.target.value - 1 : +e.target.value;
					e.target.value = +e.target.value === +PTO.Enum.TagType.LIST ? +e.target.value - 1 : +e.target.value;
					e.target.value = +e.target.value === +PTO.Enum.TagType.DOUBLE ? +e.target.value - 1 : +e.target.value;
				}
				e.target.setAttribute("oldvalue", e.target.value);

				this.ListType = +e.target.value;
				this.Tag.SetContentType(this.ListType);

				let keys = Object.values(this.state.Container).map((e) => e.Class.Tag.GetKey()),
					elements = this.state.Container;
				
				Object.values(elements).forEach((e) => {
					this.RemoveElement(e);
				});
				this.props.RegisterElement(this);

				//* Not exactly sure what is happening, but without this timeout, the this.forceUpdate() doesn't work
				setTimeout(() => {
					keys.forEach((k) => {
						this.NewListElement(k);
					});
					this.props.RegisterElement(this);
				}, 1);
			} else {
				this.Tag.SetKey(e.target.value);
			}
		}
		
		this.forceUpdate();
	}
}

export { TagList };