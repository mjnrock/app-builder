import React, { Component } from "react";

import PTO from "../../../lib/pto/package";
import { TagComponent } from "./TagComponent";
import { TagList } from "./TagList";

//@ This is for the File Upload, so the files can just extend Mutator without the import line
// eslint-disable-next-line
const Mutator = PTO.Mutator.Mutator;

class TagContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.state["UUID"] = this.props.UUID !== null && this.props.UUID !== void 0 ? this.props.UUID : PTO.Utility.Transformer.GenerateUUID();
		this.state["Tag"] = new PTO.Tag.TagCompound(this.state["UUID"]);
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
			
				if(child instanceof PTO.Tag.TagCompound) {
					container[uuid]["Element"] = <TagContainer
						UUID={ uuid }
						Tag={ child }
						RegisterElement={ (mc) => { this.RegisterElement(mc) }}
					/>;
				} else if(child instanceof PTO.Tag.TagList) {
					container[uuid]["Element"] = <TagList
						UUID={ uuid }
						Tag={ child }
						RegisterElement={ (mc) => { this.RegisterElement(mc) }}
					/>;
				} else if(child instanceof PTO.Tag.ATag) {
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
	
	InitializeFromTag(tag) {
		let state = this.state;
		
		state.Tag = tag;
		state.Container = this.ContainerFromTag(tag);

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
		

	RegisterElement(element, options) {
		let state = this.state,
			uuid = element.props.UUID,
			eleTag = element.state.Tag;

		state.Container[uuid].Class = element;

		let key = eleTag.GetKey();
		if(options && options.OldKey) {
			key = options.OldKey;
		}

		let tag = state.Tag.GetTag(key);
		if(tag === void 0 || tag === null) {
			state.Tag.AddTag(eleTag);
		} else {
			state.Tag.RemoveTag(key);
			state.Tag.AddTag(eleTag);
		}

		this.setState(state);
	}
	NewContainerElement(type) {
		let state = this.state,
			uuid = PTO.Utility.Transformer.GenerateUUID();

		state.Container[uuid] = {
			UUID: uuid,
			Class: null,
			Timestamp: Date.now()
		};
		
		if(type === "Compound") {
			state.Container[uuid]["Element"] = <TagContainer
				UUID={ uuid }
				RegisterElement={ (mc, options) => { this.RegisterElement(mc, options) }}
			/>;
		} else if(type === "Component") {
			state.Container[uuid]["Element"] = <TagComponent
				UUID={ uuid }
				RegisterElement={ (mc, options) => { this.RegisterElement(mc, options) }}
			/>;
		} else if(type === "List") {
			state.Container[uuid]["Element"] = <TagList
				UUID={ uuid }
				RegisterElement={ (mc, options) => { this.RegisterElement(mc, options) }}
			/>;
		}

		this.setState(state);
	}
	
	RemoveElement(element) {
		let state = this.state;

		state.Tag.RemoveTag(element.Class.state.Tag.GetKey());
		delete state.Container[element.UUID];

		this.setState(state);
	}

	AddTagFromFile(file) {
		if(file !== null && file !== void 0) {
			// eslint-disable-next-line
			file = eval(`(${ file })`);
			let state = this.state,
				uuid = PTO.Utility.Transformer.GenerateUUID(),
				tag = (new file()).GetTag();
	
			state.Container[uuid] = {
				UUID: uuid,
				Class: null,
				Timestamp: Date.now(),
				Element: <TagContainer
					UUID={ uuid }
					Tag={ tag }
					RegisterElement={ (mc, options) => { this.RegisterElement(mc, options) }}
				/>
			};

			this.setState(state);
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
							"color": PTO.Enum.TagType.GetColor(PTO.Enum.TagType.COMPOUND)
						}}
					>
						<span>{ PTO.Enum.TagType.GetString(PTO.Enum.TagType.COMPOUND) }</span>
						<span>&nbsp;[{ this.state.UUID }]</span>
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
						<label
							className="btn btn-block btn-sm btn-outline-dark mr1 mb0"
						>Import from Mutator
							<input type="file" accept=".js" onChange={ this.OnFileUpload.bind(this) } hidden />
						</label>
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
		let mcf = e.target.getAttribute("mcf"),
			state = this.state;

		if(e.type === "change") {
			if(mcf === ".Name") {
				state.Tag.SetKey(e.target.value);

				this.props.RegisterElement(this, {
					OldKey: e.target.getAttribute("oldvalue")
				});
			}
		}
		
		this.setState(state);
	}
}

export { TagContainer };