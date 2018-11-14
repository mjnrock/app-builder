import React, { Component } from "react";

import PTO from "../../../lib/pto/package";
import { TagComponent } from "./TagComponent";
import { TagList } from "./TagList";

//@ This is for the File Upload, so the files can just extend Mutator without the import line
// eslint-disable-next-line
const Mutator = PTO.Mutator.Mutator;

class TagCompound extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.state["UUID"] = this.props.UUID !== null && this.props.UUID !== void 0 ? this.props.UUID : PTO.Utility.Transformer.GenerateUUID();
		this.state["Tag"] = new PTO.Tag.TagCompound(this.state["UUID"]);

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

	UpdateElement(clazz, options) {
		let state = this.state,
			eleTag = clazz.state.Tag;

		let key = eleTag.GetKey();
		if(options && options.OldKey) {
			key = options.OldKey;
		}

		let tag = state.Tag.GetTag(key);
		if(tag === void 0 || tag === null) {
			state.Tag.AddTag(eleTag);
		} else {
			//? This Timestamp overrides the React internal flag that otherwise causes rerenders based on last update timestamp
			//TODO Add an "Ordinality" KVP to the ATag base and adjust downstream consequences (Transformer, etc.)
			let tag = state.Tag.GetTag(key);
			eleTag.Ordinality = tag.Ordinality;

			state.Tag.RemoveTag(key);
			state.Tag.AddTag(eleTag);
		}

		this.setState(state);
	}

	SetTag(tag) {
		let state = this.state;
		state.Tag = tag;

		this.setState(state);
	}
	GetTag() {
		return this.state.Tag;
	}

	CreateNewTag(type, componentType = PTO.Enum.TagType.STRING) {
		let state = this.state,
			uuid = PTO.Utility.Transformer.GenerateUUID(),
			tag = null;
			
		if(type === "Compound") {
			tag = new PTO.Tag.TagCompound(uuid);
		} else if(type === "Component") {
			let clazz = PTO.Enum.TagType.GetClass(componentType);
			tag = new clazz(uuid);
		} else if(type === "List") {
			tag = new PTO.Tag.TagList(uuid, PTO.Enum.TagType.STRING);
		}
		tag.Ordinality = Date.now();
		state.Tag.AddTag(tag);

		this.setState(state);
	}
	
	RemoveElement(tag) {
		let state = this.state;

		state.Tag.RemoveTag(tag);

		this.setState(state);
	}

	AddTagFromFile(file) {
		if(file !== null && file !== void 0) {
			file = file.split("\n");
			//? This removes the "import" and the "export" lines put in by the MutatorFactory.GenerateMutator()
			if(file[0].match(/import/gi) && file[file.length - 1].match(/export/gi)) {
				file = file.slice(2, file.length - 2);
			}
			file = file.join("\n");

			// eslint-disable-next-line
			file = eval(`(${ file })`);
			let state = this.state,
				tag = (new file()).GetTag();
		
			if(state.Tag.Serialize() !== tag.Serialize()) {
				state.Tag = tag;
				this.setState(state);
			} else {
				console.warn("[OPERATION HAULTED]: An identical tag structure was detected.");
			}
		}
	}

	async OnFileUpload(e) {
		let file = await this.UploadFile(e);
		if(file !== null && file !== void 0) {
			this.AddTagFromFile(file);
		}
	}

	UploadFile(event) {
		let file = event.target.files[0];
        
        if (file) {
			const reader = new FileReader();

			return new Promise((resolve, reject) => {
				reader.onerror = () => {
					reader.abort();
					reject(new Error('Problem parsing file'));
				};

				reader.onload = () => {
					resolve(reader.result);
				};

				reader.readAsText(file);
			});
		}
	}

	RenderTag(tag) {
		if(tag !== null && tag !== void 0) {
			let uuid = PTO.Utility.Transformer.GenerateUUID();

			if(tag.GetKey().match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
				uuid = tag.GetKey();
			}
		
			if(tag instanceof PTO.Tag.TagCompound) {
				return <TagCompound
					UUID={ uuid }
					Tag={ tag }
					UpdateElement={ (mc, options) => this.UpdateElement(mc, options) }
				/>;
			} else if(tag instanceof PTO.Tag.TagList) {
				return <TagList
					UUID={ uuid }
					Tag={ tag }
					UpdateElement={ (mc, options) => this.UpdateElement(mc, options) }
				/>;
			} else if(tag instanceof PTO.Tag.ATag) {
				return <TagComponent
					UUID={ uuid }
					Tag={ tag }
					UpdateElement={ (mc, options) => this.UpdateElement(mc, options) }
				/>;
			}
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
				<div className="w-100">
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
						<p
							className="f7 code text-center"						
							style={{
								"color": PTO.Enum.TagType.GetColor(PTO.Enum.TagType.COMPOUND)
							}}
						>
							<span>{ PTO.Enum.TagType.GetString(PTO.Enum.TagType.COMPOUND) }</span>
							<span>&nbsp;[{ this.state.UUID }]</span>
						</p>
						: null
					}
					{
						this.state.Tag.ToArray().sort((a, b) => a.Ordinality - b.Ordinality).map((tag, i) => {
							return (
								<div
									className="flex mt2 mb2 justify-around"
									key={ i }
								>
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
							className="btn btn-block btn-sm btn-outline-primary mr1 dropdown-toggle"
							data-toggle="dropdown"
							aria-haspopup="true"
							aria-expanded="false"
						>Add Tag</button>
						<div
							className="dropdown-menu"
							style={{
								"backgroundColor": "rgb(253, 253, 253)",
								"borderColor": "rgba(0, 0, 0, 0.2)"
							}}
						>
							<div className="dropdown-header text-center">Components</div> 
							{
								PTO.Enum.TagType.ForEach([ PTO.Enum.TagType.LIST, PTO.Enum.TagType.COMPOUND ]).map((t, i) => 
									<button
										type="button"
										className={ `dropdown-item text-${ PTO.Enum.TagType.GetString(t).toLowerCase() }` }
										onClick={ () => this.CreateNewTag("Component", t) }
										key={ i }
									>Add <strong>{ PTO.Enum.TagType.GetString(t).toLowerCase() }</strong> Tag</button>
								)
							}

							<div className="dropdown-divider"></div>

							<div className="dropdown-header text-center">Containers</div> 
							<button
								type="button"
								className={ `dropdown-item text-compound` }
								onClick={ () => this.CreateNewTag("Compound") }
							>Add <strong>compound</strong> Tag</button>
							<button
								type="button"
								className={ `dropdown-item text-list` }
								onClick={ () => this.CreateNewTag("List") }
							>Add <strong>list</strong> Tag</button>
						</div>

						{/* Weird CSS issue that this janky thing fixes, so w/e */}
						<div
							className="btn-block"
							style={{ "display": "none" }}
						></div>
						
						<label
							className="btn btn-block btn-sm btn-outline-secondary mr1 mb0"
						>Import from Mutator
							<input type="file" accept=".js" onChange={ this.OnFileUpload.bind(this) } onClick={ (e) => e.target.value = null } hidden />
						</label>

						{/* <button
							type="button"
							className="btn btn-block btn-sm btn-outline-dark mr1"
							onClick={ () => console.log(this) }
						>console.log(this)</button> */}
					</div>
				</div>
			</div>
		);
	}

	onDataChange(e) {
		let mcf = e.target.getAttribute("mcf"),
			state = this.state;

		if(e.type === "change") {
			if(mcf === ".Name") {
				state.Tag.SetKey(e.target.value);

				this.props.UpdateElement(this, {
					OldKey: e.target.getAttribute("oldvalue")
				});
			}
		}
		
		this.setState(state);
	}
}

export { TagCompound };