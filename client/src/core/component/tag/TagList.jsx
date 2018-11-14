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

		this.state["Timestamp"] = Date.now();
	}

	componentWillMount() {
		let state = this.state;

		if(this.props.Tag !== null && this.props.Tag !== void 0) {
			state["Tag"] = this.props.Tag;
		}

		if(this.props.UpdateElement !== null && this.props.UpdateElement !== void 0) {
			this.props.UpdateElement(this);
		}

		this.setState(state);
	}

	componentWillReceiveProps(nextProps, nextContext) {
		if(JSON.stringify(this.state.Tag) !== JSON.stringify(nextProps.Tag)) {
			let state = this.state;
			state.Tag = nextProps.Tag;

			this.setState(state);
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
	
	UpdateElement(clazz, options) {
		let state = this.state,
			eleTag = clazz.state.Tag;

		let key = eleTag.GetKey();
		if(options && options.OldKey) {
			key = options.OldKey;
		}

		let tag = state.Tag.GetValues().filter(t => t.GetKey() === key);
		if(tag.length === 0) {
			state.Tag.AddValue(eleTag);
		} else {
			//? This Timestamp overrides the React internal flag that otherwise causes rerenders based on last update timestamp
			//TODO Add an "Ordinality" KVP to the ATag base and adjust downstream consequences (Transformer, etc.)
			let tag = state.Tag.GetValue(key);
			eleTag.Timestamp = tag.Timestamp;

			state.Tag.RemoveTag(key);
			state.Tag.AddValue(eleTag);
		}

		this.setState(state);
	}

	CreateNewTag(key, uuid) {
		let state = this.state;
		uuid = uuid !== null && uuid !== void 0 ? uuid : PTO.Utility.Transformer.GenerateUUID();

		let clazz = PTO.Enum.TagType.GetClass(state.Tag.GetContentType()),
		tag = new clazz(key || uuid);
		tag.Timestamp = Date.now();
		state.Tag.AddValue(tag);

		this.setState(state);
	}
	
	RemoveElement(tag) {
		let state = this.state;

		state.Tag.RemoveTag(tag);

		this.setState(state);
	}

	RenderTag(tag) {
		if(tag !== null && tag !== void 0) {
			let uuid = PTO.Utility.Transformer.GenerateUUID();

			if(tag.GetKey().match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
				uuid = tag.GetKey();
			}
		
			return <TagComponent
				UUID={ uuid }
				Tag={ tag }
				UpdateElement={ (mc, options) => this.UpdateElement(mc, options) }
				hide
			/>;
		}

		return null;
	}

	render() {
		return (
			<div
				className="w-100 flex justify-around mt2 mb2 ba br2 pa2"				
				style={{
					"borderColor" : "rgba(0, 0, 0, 0.2)",
					"backgroundColor" : "rgba(0, 0, 0, 0.03)"
				}}
			>
				<div className="w-75">
					<label className="f7 b">Name</label>
					<input
						type="text"
						className={ `form-control input-${ PTO.Enum.TagType.GetString(this.state.Tag.GetType()).toLowerCase() }` }
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
					{
						this.props.showDetails ? <p
							className="f7 code text-center"						
							style={{
								"color": PTO.Enum.TagType.GetColor(PTO.Enum.TagType.LIST)
							}}
						>
							<span>{ PTO.Enum.TagType.GetString(PTO.Enum.TagType.LIST) }</span>
							<span style={{ "color": PTO.Enum.TagType.GetColor(this.state.Tag.GetContentType()) }}>{ `<${ PTO.Enum.TagType.GetString(this.state.Tag.GetContentType()) }>` }</span>
							<span>&nbsp;[{ this.state.UUID }]</span>
						</p>
						: null
					}
					{
						this.state.Tag.GetValues().sort((a, b) => a.Timestamp - b.Timestamp).map((tag, i) => {
							return (
								<div className="flex mt2 mb2 justify-around" key={ i }>
									<button
										className={
											`btn btn-sm btn-remove-element ${ tag instanceof PTO.Tag.TagCompound ? "mr2" : "mr1" }`
										}
										onClick={ () => this.RemoveElement(tag) }
									>Remove</button>
									{
										this.RenderTag(tag)
									}
								</div>
							);
						})
					}
					<div className="text-center flex justify-around mt3">
						{/* Weird CSS issue that this janky thing fixes, so w/e */}
						<div
							className="btn-block"
							style={{ "display": "none" }}
						></div>

						<button
							type="button"
							className={ `btn btn-block btn-sm btn-${ PTO.Enum.TagType.GetString(this.state.Tag.GetContentType()).toLowerCase() } mr1` }
							onClick={ () => this.CreateNewTag() }
						>Add <strong>{ PTO.Enum.TagType.GetString(this.state.Tag.GetContentType()).toLowerCase() }</strong> Tag</button>
					</div>
				</div>
				<div className="w-20">
					<label className="f7 b">Type: <span className="text-list">List{ "<" }<span className={ `text-${ PTO.Enum.TagType.GetString(this.state.Tag.GetContentType()).toLowerCase() }` }>{ PTO.Enum.TagType.GetString(this.state.Tag.GetContentType()).toLowerCase() }</span>{ ">" }</span></label>
					<input
						type="number"
						className={ `form-control text-center mb-1 input-${ PTO.Enum.TagType.GetString(this.state.Tag.GetContentType()).toLowerCase() }` }
						placeholder="Type"
						mcf=".Type"
						min="1"
						max="12"
						step="1"
						oldvalue={ this.GetTag().GetContentType() }
						value={ this.GetTag().GetContentType() }
						onChange={ this.onDataChange.bind(this) }
						onWheel={ () => null }	// Need to explicitly "activate" scroll functionality with this nothing code, for w/e React reason
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
				} else {
					e.target.value = +e.target.value === +PTO.Enum.TagType.DOUBLE ? +e.target.value - 1 : +e.target.value;
				}
				e.target.setAttribute("oldvalue", e.target.value);

				state.Tag.SetContentType(+e.target.value);

				let keys = this.state.Tag.GetValues().map((e) => e.GetKey());
				
				state.Tag.Values = [];
				this.props.UpdateElement(this);

				//* Not exactly sure what is happening, but without this timeout, the this.forceUpdate() doesn't work
				setTimeout(() => {
					keys.forEach((k) => {
						this.CreateNewTag(k);
					});

					this.props.UpdateElement(this);
				}, 1);
			} else if(mcf === ".Name") {
				state.Tag.SetKey(e.target.value);

				this.props.UpdateElement(this, {
					OldKey: e.target.getAttribute("oldvalue")
				});
			}
		}
		
		this.setState(state);
	}
}

export { TagList };