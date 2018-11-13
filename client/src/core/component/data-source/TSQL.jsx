import React, { Component } from "react";

import PTO from "../../../lib/pto/package";

class TSQL extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.state["UUID"] = this.props.UUID !== null && this.props.UUID !== void 0 ? this.props.UUID : PTO.Utility.Transformer.GenerateUUID();
		this.state["Tag"] = new PTO.Tag.TagCompound(this.state.UUID);

		this.Timestamp = Date.now();
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

		if(this.props.RegisterElement !== null && this.props.RegisterElement !== void 0) {
			this.props.RegisterElement(this);
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
				
			</div>
		);
	}
}

export { TSQL };