import React, { Component } from "react";

class ModelComponent extends Component {
	constructor(props) {
		super(props);

		let PTO = this.props.PTO;
		//	This exists really just because of the List Content Type issue below (l#47)
		this.Type = PTO.Enum.TagType.STRING;
		this.ListContentType = PTO.Enum.TagType.STRING;

		this.Tag = new PTO.Tag.TagCompound("ModelComponent");

		this.Tag.AddTag(new PTO.Tag.TagUUID("UUID"));
		this.Tag.AddTag(new PTO.Tag.TagString("Name"));
		this.Tag.AddTag(new PTO.Tag.TagInt("Type", this.ListContentType));	
		this.Tag.AddTag(new PTO.Tag.TagCompound("RegEx"));

		let RegEx = this.Tag.GetTag("RegEx");
		RegEx.AddTag(new PTO.Tag.TagString("Match"));
		RegEx.AddTag(new PTO.Tag.TagString("Replace"));
	}

	componentDidMount() {
		this.props.GetModelComponent(this);
		
		//	If this is in constructor, throws: "TypeError: Cannot convert undefined or null to object"
		if(this.props.UUID !== null && this.props.UUID !== void 0) {
			this.Tag.GetTag("UUID").SetValues(this.props.UUID);
		}
	}

	SetTag(tag) {
		this.Tag = tag;

		return this;
	}
	GetTag() {
		return this.Tag;
	}

	GetTagListContentType() {
		if(this.Type === this.props.PTO.Enum.TagType.LIST) {
			if(this.Tag.GetTag("ListContentType")) {
				return `<${this.props.PTO.Enum.TagType.GetString(this.Tag.GetTag("ListContentType").GetValue(0))}>`;
			}

			//	I don't know why (or care to spend more time figuring it out) this.Tag.GetTag("ListContentType") isn't populated by this call, so this workaround
			return `<${this.props.PTO.Enum.TagType.GetString(this.ListContentType)}>`;
		}
		
		return "";
	}

	render() {
		return (
			<div className="flex justify-around">
				<div className="w-60">
					<label className="f7 b">Name</label>
					<input
						type="text"
						className="form-control"
						placeholder="Name"
						mcf=".Name"
						onChange={ this.onDataChange.bind(this) }
					/>
					<p className="code text-center">
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
							mcf=".ListContentType"
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
						mcf=".RegEx.Pattern"
						onFocus={ this.onRegExFocusBlur.bind(this) }
						onBlur={ this.onRegExFocusBlur.bind(this) }
						onChange={ this.onDataChange.bind(this) }
					/>
				</div>
			</div>
		);
	}

	onRegExFocusBlur(e) {
		let options = [
			"/ /g",		// 1st index will be FOCUS DEFAULT

			"//g",
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
		let mcf = e.target.getAttribute("mcf");
		if(mcf === ".ListContentType" || (mcf === ".Type" && +e.target.value === +this.props.PTO.Enum.TagType.LIST)) {
			this.Tag.AddTag(new this.props.PTO.Tag.TagInt("ListContentType", this.ListContentType));
		}

		let tag = this.props.PTO.Utility.Navigator.FindTag(this.Tag, mcf);

		if(tag !== null && tag !== void 0) {
			if(e.type === "change") {
				//	This checks the directionality to skip the LIST<LIST> possibility
				if(e.target.getAttribute("pto") && e.target.getAttribute("pto").split(" ").includes("list-only")) {
					if(+e.target.value > +e.target.getAttribute("oldvalue")) {
						e.target.value = +e.target.value === +this.props.PTO.Enum.TagType.LIST ? +e.target.value + 1 : +e.target.value;
					} else {
						e.target.value = +e.target.value === +this.props.PTO.Enum.TagType.LIST ? +e.target.value - 1 : +e.target.value;
					}
					e.target.setAttribute("oldvalue", e.target.value);

					tag.SetValues(e.target.value);
				} else {
					tag.SetValues(e.target.value);
					this.Tag.RemoveTag("ListContentType");
				}

				if(mcf === ".Type" || mcf === ".ListContentType") {
					this.Type = this.Tag.GetTag("Type") ? this.Tag.GetTag("Type").GetValue(0) : this.Type;
					this.ListContentType = this.Tag.GetTag("ListContentType") ? this.Tag.GetTag("ListContentType").GetValue(0) : this.ListContentType;
				}
			}
			
			//	Because of the construction and no state manipulation, this basically doubly-binds the Tags to the component
			this.forceUpdate();
		}
	}
}

export { ModelComponent };