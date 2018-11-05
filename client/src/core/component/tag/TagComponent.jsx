import React, { Component } from "react";

import PTO from "../../../lib/pto/package";

class TagComponent extends Component {
	constructor(props) {
		super(props);

		this.UUID = this.props.UUID !== null && this.props.UUID !== void 0 ? this.props.UUID : PTO.Utility.Transformer.GenerateUUID();
		this.Tag = new PTO.Tag.TagString(this.UUID);
		this.Type = PTO.Enum.TagType.STRING;

		this.Timestamp = Date.now();
	}

	componentWillMount() {
		this.props.RegisterElement(this);
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
			<div className="w-100 flex justify-around">
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
							"color": PTO.Enum.TagType.GetColor(this.Type)
						}}
					>
						<span>{ PTO.Enum.TagType.GetString(this.Type) }</span>&nbsp;
						<span>[{ this.UUID }]</span>
					</p>
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

				let clazz = PTO.Enum.TagType.GetClass(+e.target.value);
				if(clazz) {
					this.Tag = new clazz(this.UUID);
					this.Type = +e.target.value;
					this.props.RegisterElement(this);
				}
			} else {
				this.Tag.SetKey(e.target.value);
			}
		}
		
		this.forceUpdate();
	}
}

export { TagComponent };