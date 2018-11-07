import React, { Component } from "react";

import PTO from "../../../lib/pto/package";
import { TagComponent } from "./TagComponent";

class TagList extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.state["UUID"] = this.props.UUID !== null && this.props.UUID !== void 0 ? this.props.UUID : PTO.Utility.Transformer.GenerateUUID();
		this.state["Tag"] = new PTO.Tag.TagList(
			this.state["UUID"],
			this.props.ListType !== null && this.props.ListType !== void 0 ? +this.props.ListType : PTO.Enum.TagType.STRING
		);
		this.state["Container"] = {};
		
		this.Timestamp = Date.now();
	}

	componentWillMount() {
		let state = this.state;

		if(this.props.Tag !== null && this.props.Tag !== void 0) {
			state["Tag"] = this.props.Tag;
			state["Container"] = this.ContainerFromTag(this.props.Tag);
		}
		
		if(this.props.RegisterElement) {
			this.props.RegisterElement(this);
		}

		this.setState(state);
	}

	componentWillReceiveProps(nextProps, nextContext) {
		if(JSON.stringify(this.state.Tag) !== JSON.stringify(nextProps.Tag)) {
			let state = this.state;
			state.Tag = nextProps.Tag;
			state.Container = this.ContainerFromTag(nextProps.Tag);

			this.setState(state);
		}
	}

	ContainerFromTag(tag) {
		if(tag !== null && tag !== void 0) {
			let children = Object.values(tag.GetValues()),
				container = {};

			for(let i in children) {
				let child = children[i],
					uuid = PTO.Utility.Transformer.GenerateUUID();

				container[uuid] = {
					UUID: uuid,
					Class: null,
					Timestamp: Date.now()
				};
			
				if(child instanceof PTO.Tag.ATag) {
					container[uuid]["Element"] = <TagComponent
						UUID={ uuid }
						Tag={ child }
						RegisterElement={ (mc) => { this.RegisterElement(mc) }}
					/>;
				}
			}
			
			return container;
		}
	}

	SetTag(tag) {
		let state = this.state;
		state.Tag = tag;

		this.setState(state);
	}
	GetTag() {
		return this.state.Tag;
	}
	
	RegisterElement(element, options) {
		let state = this.state,
			uuid = element.props.UUID,
			eleTag = element.state.Tag;

		state.Container[uuid].Class = element;

		let key = eleTag.GetKey();
		if(options && options.OldKey) {
			key = options.OldKey;
		}

		let tag = state.Tag.GetValues().filter(t => t.GetKey() === key);
		if(tag.length === 0) {
			state.Tag.AddValue(eleTag);
		} else {
			state.Tag.RemoveTag(key);
			state.Tag.AddValue(eleTag);
		}

		this.setState(state);
	}
	NewListElement(key, uuid) {
		let state = this.state;
		uuid = uuid !== null && uuid !== void 0 ? uuid : PTO.Utility.Transformer.GenerateUUID();

		state.Container[uuid] = {
			UUID: uuid,
			Class: null,
			Timestamp: Date.now()
		};
		
		state.Container[uuid]["Element"] = <TagComponent
			UUID={ uuid }
			Type={ state.Tag.GetContentType() }
			KeyName={ key }
			RegisterElement={ (mc, options) => { this.RegisterElement(mc, options) }}
		/>;

		this.setState(state);
	}
	
	RemoveElement(element) {
		let state = this.state;

		state.Tag.RemoveTag(element.Class.state.Tag);
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
						oldvalue={ this.GetTag().GetKey() }
						value={ this.GetTag().GetKey() }
						onFocus={
							(e) => {
								if(e.target.value === this.state.UUID) {
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
						<span style={{ "color": PTO.Enum.TagType.GetColor(this.state.Tag.GetContentType()) }}>{ `<${ PTO.Enum.TagType.GetString(this.state.Tag.GetContentType()) }>` }</span>
						<span>&nbsp;[{ this.state.UUID }]</span>
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
						oldvalue={ this.GetTag().GetContentType() }
						value={ this.GetTag().GetContentType() }
						onChange={ this.onDataChange.bind(this) }
					/>
				</div>
			</div>
		);
	}

	onDataChange(e) {
		let mcf = e.target.getAttribute("mcf"),
			state = this.state;

		if(e.type === "change") {
			if(mcf === ".Type") {
				if(+e.target.value > +e.target.getAttribute("oldvalue")) {
					e.target.value = +e.target.value === +PTO.Enum.TagType.DOUBLE ? +e.target.value + 1 : +e.target.value;
					// e.target.value = +e.target.value === +PTO.Enum.TagType.LIST ? +e.target.value + 1 : +e.target.value;
					// e.target.value = +e.target.value === +PTO.Enum.TagType.COMPOUND ? +e.target.value + 1 : +e.target.value;
				} else {
					// e.target.value = +e.target.value === +PTO.Enum.TagType.COMPOUND ? +e.target.value - 1 : +e.target.value;
					// e.target.value = +e.target.value === +PTO.Enum.TagType.LIST ? +e.target.value - 1 : +e.target.value;
					e.target.value = +e.target.value === +PTO.Enum.TagType.DOUBLE ? +e.target.value - 1 : +e.target.value;
				}
				e.target.setAttribute("oldvalue", e.target.value);

				state.Tag.SetContentType(+e.target.value);

				let keys = Object.values(this.state.Container).map((e) => [e.Class.state.Tag.GetKey(), e.Class.state.UUID]),
					elements = this.state.Container;
				
				Object.values(elements).forEach((e) => {
					this.RemoveElement(e);
				});
				this.props.RegisterElement(this);

				//* Not exactly sure what is happening, but without this timeout, the this.forceUpdate() doesn't work
				setTimeout(() => {
					keys.forEach((k) => {
						this.NewListElement(k[0], k[1]);
					});

					this.props.RegisterElement(this);
				}, 1);
			} else if(mcf === ".Name") {
				state.Tag.SetKey(e.target.value);

				this.props.RegisterElement(this, {
					OldKey: e.target.getAttribute("oldvalue")
				});
			}
		}
		
		this.setState(state);
	}
}

export { TagList };