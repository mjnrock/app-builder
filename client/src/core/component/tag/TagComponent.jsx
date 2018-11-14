import React, { Component } from "react";

import PTO from "../../../lib/pto/package";

class TagComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.state["UUID"] = this.props.UUID !== null && this.props.UUID !== void 0 ? this.props.UUID : PTO.Utility.Transformer.GenerateUUID();
		this.state["Tag"] = new PTO.Tag.TagString(this.state.UUID);

		this.state["Timestamp"] = Date.now();
	}

	componentWillMount() {
		let state = this.state;

		if(this.props.Type !== null && this.props.Type !== void 0) {
			let clazz = PTO.Enum.TagType.GetClass(+this.props.Type);
			if(clazz) {
				state.Tag = new clazz(state.UUID);
			}
		}

		if(this.props.KeyName !== null && this.props.KeyName !== void 0) {
			state.Tag.SetKey(this.props.KeyName);
		}

		if(this.props.Tag !== null && this.props.Tag !== void 0) {
			state.Tag = this.props.Tag;
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

	render() {
		return (
			<div className="w-100 flex justify-around">
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
						this.props.showDetails ?
						<div
							className="f7 code text-center"						
							style={{
								"color": PTO.Enum.TagType.GetColor(this.GetTag().GetType())
							}}
						>
							<span>{ PTO.Enum.TagType.GetString(this.GetTag().GetType()) }</span>&nbsp;
							<span>[{ this.state.UUID }]</span>
						</div>
						: null
					}
				</div>
				{
					<div className="w-20">
						<label className="f7 b">Type: <span className={ `text-${ PTO.Enum.TagType.GetString(this.state.Tag.GetType()).toLowerCase() }` }>{ PTO.Enum.TagType.GetString(this.state.Tag.GetType()).toLowerCase() }</span></label>
						<input
							type="number"
							className={ `form-control text-center mb-1 input-${ PTO.Enum.TagType.GetString(this.state.Tag.GetType()).toLowerCase() }` }
							placeholder="Type"
							mcf=".Type"
							min="1"
							max="12"
							step="1"
							oldvalue={ this.GetTag().GetType() }
							value={ this.GetTag().GetType() }
							onChange={ this.onDataChange.bind(this) }
							onWheel={ () => null }	// Need to explicitly "activate" scroll functionality with this nothing code, for w/e React reason
							disabled={ this.props.hide ? true : false }
						/>
					</div>
				}
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
					e.target.value = +e.target.value === +PTO.Enum.TagType.LIST ? +e.target.value + 1 : +e.target.value;
					e.target.value = +e.target.value === +PTO.Enum.TagType.COMPOUND ? +e.target.value + 1 : +e.target.value;
				} else {
					e.target.value = +e.target.value === +PTO.Enum.TagType.COMPOUND ? +e.target.value - 1 : +e.target.value;
					e.target.value = +e.target.value === +PTO.Enum.TagType.LIST ? +e.target.value - 1 : +e.target.value;
					e.target.value = +e.target.value === +PTO.Enum.TagType.DOUBLE ? +e.target.value - 1 : +e.target.value;
				}
				e.target.setAttribute("oldvalue", e.target.value);

				let clazz = PTO.Enum.TagType.GetClass(+e.target.value),
					key = state.Tag.GetKey();
				if(clazz) {
					state.Tag = new clazz(key !== null && key !== void 0 ? key : state.UUID);
				}

				this.props.UpdateElement(this);
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

export { TagComponent };