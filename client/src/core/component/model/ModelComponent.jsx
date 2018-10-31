import React, { Component } from "react";

class ModelComponent extends Component {
	constructor(props) {
		super(props);

		this.Mutator = new this.props.PTO.Mutator.ModelComponent();
		
		this.Type = this.props.PTO.Enum.TagType.STRING;
		this.ListContentType = this.props.PTO.Enum.TagType.STRING;

		this.Timestamp = Date.now();
	}

	componentDidMount() {
		this.props.GetModelComponent(this);
		
		//	If this is in constructor, throws: "TypeError: Cannot convert undefined or null to object"
		if(this.props.UUID !== null && this.props.UUID !== void 0) {
			this.Mutator.SetUUID(this.props.UUID);
		}
	}

	IsList() {
		return +this.Type === this.props.PTO.Enum.TagType.LIST;
	}

	SetTag(tag) {
		this.Mutator.SetTag(tag);

		return this;
	}
	GetTag() {
		return this.Mutator.GetTag();
	}

	GetTagListContentType() {
		if(this.IsList()) {
			return (
				<span
					style={{
						"color": this.props.PTO.Enum.TagType.GetColor(this.ListContentType)
					}}
				>
					{ `<${this.props.PTO.Enum.TagType.GetString(this.ListContentType)}>` }
				</span>
			);
		}
		
		return "";
	}

	render() {
		return (
			<div className="w-100 flex justify-around">
				<div className="w-60">
					<label className="f7 b">Name</label>
					<input
						type="text"
						className="form-control"
						placeholder="Name"
						mcf=".Name"
						onChange={ this.onDataChange.bind(this) }
					/>
					<p
						className="f7 code text-center"						
						style={{
							"color": this.props.PTO.Enum.TagType.GetColor(this.Type)
						}}
					>
						<span>{ this.props.PTO.Enum.TagType.GetString(this.Type) }{ this.GetTagListContentType() }</span>&nbsp;
						<span>[{ this.props.UUID }]</span>
					</p>
				</div>
				<div className="w-15">
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
					{
						this.Type === this.props.PTO.Enum.TagType.LIST ?
						<input
							type="number"
							className="form-control text-center"
							placeholder="List Type"
							pto="list-only"
							mcf=".Type"
							min="1"
							max="12"
							oldvalue="2"
							defaultValue="2"
							onChange={ this.onDataChange.bind(this) }
						/> : null
					}
				</div>
				<div className="w-25">
					<label className="f7 b">RegEx</label>
					<input
						type="text"
						className="form-control mb-1"
						placeholder="Match Pattern"
						mcf=".RegEx.Match"
						onFocus={ this.onRegExFocusBlur.bind(this) }
						onBlur={ this.onRegExFocusBlur.bind(this) }
						onChange={ this.onDataChange.bind(this) }
					/>
					<input
						type="text"
						className="form-control"
						placeholder="Replace Pattern"
						mcf=".RegEx.Replace"
						onFocus={ this.onRegExFocusBlur.bind(this) }
						onBlur={ this.onRegExFocusBlur.bind(this) }
						onChange={ this.onDataChange.bind(this) }
					/>
				</div>
			</div>
		);
	}

	onRegExFocusBlur(e) {
		// 1st index will be FOCUS DEFAULT
		let options = [
			"//g",

			"/ /g",
			"/ /",
			"//"
		];
		
		if(e.type === "focus")  {
			if(e.target.value.length === 0) {
				e.target.value = options[0];
			}

			e.target.setSelectionRange(1, 2);
		} else if(e.type === "blur") { 
			if(options.includes(e.target.value)) {
				e.target.value = null;
			}
		}
	}
	onDataChange(e) {
		let mcf = e.target.getAttribute("mcf"),
			tag = this.props.PTO.Utility.Navigator.FindTag(this.Mutator.GetTag(), mcf);

		if(tag !== null && tag !== void 0) {
			if(e.type === "change") {
				if(e.target.getAttribute("pto") && e.target.getAttribute("pto").split(" ").includes("list-only")) {
					if(+e.target.value > +e.target.getAttribute("oldvalue")) {
						e.target.value = +e.target.value === +this.props.PTO.Enum.TagType.LIST ? +e.target.value + 1 : +e.target.value;
						e.target.value = +e.target.value === +this.props.PTO.Enum.TagType.COMPOUND ? +e.target.value + 1 : +e.target.value;
					} else {
						e.target.value = +e.target.value === +this.props.PTO.Enum.TagType.COMPOUND ? +e.target.value - 1 : +e.target.value;
						e.target.value = +e.target.value === +this.props.PTO.Enum.TagType.LIST ? +e.target.value - 1 : +e.target.value;
					}
					e.target.setAttribute("oldvalue", e.target.value);

					tag.SetValue(1, e.target.value);
					this.ListContentType = this.Mutator.GetType().GetValue(1);
				} else if(mcf === ".Type") {
					if(+e.target.value > +e.target.getAttribute("oldvalue")) {
						e.target.value = +e.target.value === +this.props.PTO.Enum.TagType.COMPOUND ? +e.target.value + 1 : +e.target.value;
					} else {
						e.target.value = +e.target.value === +this.props.PTO.Enum.TagType.COMPOUND ? +e.target.value - 1 : +e.target.value;
					}
					e.target.setAttribute("oldvalue", e.target.value);

					tag.SetValues(e.target.value);
					this.Type = this.Mutator.GetType().GetValue(0);
				} else {
					tag.SetValues(0, e.target.value);
				}
			}
			
			this.forceUpdate();
		}
	}
}

export { ModelComponent };