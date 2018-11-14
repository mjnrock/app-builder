import React, { Component } from "react";

import PTO from "../../../lib/pto/package";
import { TagContainer } from "./TagContainer";

//@ This is for the File Upload, so the files can just extend Mutator without the import line
// eslint-disable-next-line
const Mutator = PTO.Mutator.Mutator;

class Tag extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.state["UUID"] = this.props.UUID !== null && this.props.UUID !== void 0 ? this.props.UUID : PTO.Utility.Transformer.GenerateUUID();

		this.state["Tag"] = null;
		
		this.state["File"] = null;
		this.state["Descendents"] = [];
		
		this.Timestamp = Date.now();

		console.log(PTO);
	}

	componentWillMount() {
		let state = this.state;

		if(this.props.Tag !== null && this.props.Tag !== void 0) {
			state["Tag"] = this.props.Tag;
		}
		
		if(this.props.UpdateElement) {
			this.props.UpdateElement(this);
		}

		this.setState(state);
	}
	
	UpdateElement(clazz, options) {
		let state = this.state;

		state.Tag = clazz.state.Tag;

		this.setState(state);
	}

	UpdateContainer(file) {
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

			PTO.Utility.Transformer.ToHierarchy(tag).forEach((t, i) => t.Tag.SetOrdinality(i + 1));
	
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
			this.UpdateContainer(file);
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
			<div className="container">
				<h2 className="text-center mt3 mb3">Tag Builder</h2>
				<label 
					className="btn btn-block btn-sm btn-outline-primary mr1 mb0"
				>Load from Mutator File
					<input type="file" accept=".js" onChange={ this.OnFileUpload.bind(this) } onClick={ (e) => e.target.value = null } hidden />
				</label>
				<TagContainer Tag={ this.state.Tag } GetTag={ (tag) => this.GetTag(tag) } UpdateElement={ (tc) => this.UpdateElement(tc) } />
				<div className="text-center mt3 mb2">
					<button
						type="button"
						className="btn btn-sm btn-block btn-outline-success mr1"
						onClick={ () => this.OnSave() }
					>Send Class to Console</button>
					<button
						type="button"
						className="btn btn-sm btn-block btn-outline-warning mr1"
						onClick={ () => this.GetOverview() }
					>Get Overview</button>
				</div>
				<div>
					<p className="text-center">Generate Record Mutator</p>
					<button
						type="button"
						className="btn btn-sm btn-block btn-outline-danger mr1"
						onClick={ () => PTO.Mutator.MutatorFactory.GenerateMutator(this.state.Tag, true) }
					>Save File</button>
					<button
						type="button"
						className="btn btn-sm btn-block btn-outline-danger mr1"
						onClick={ () => console.log(PTO.Mutator.MutatorFactory.GenerateMutator(this.state.Tag)) }
					>Send to Console</button>
				</div>
				{ this.Descendents }
			</div>
		);
	}
	

	OnSave() {
		console.log("This doesn't save anything presently");
		console.log(this);
	}
	//! This is complex enough that it should be a child component
	GetOverview() {
		let CSV = PTO.Utility.Transformer.ToDelimited(this.state.Tag).split("\n").map((v, k) => {
			return v.split(",").map((r, i, a) => {
				if(k > 0) {
					switch(i) {
						case 0:
							return +r;
						case 1:
							return +r;
						case 2:
							return +r;
						case 4:
							return +r;
						default:
							return r.replace(/"/g, "");
					}
				}

				return r;
			});
		});

		this.Descendents = <table className="table mt4">
			<thead>
				<tr>
					{
						CSV[0].map((v, i) => <th key={ i }>{ v }</th>)
					}
				</tr>
			</thead>
			<tbody>
				{
					CSV.map((r, k) => {
						if(k > 0) {
							return <tr key={ k }>
								{
									r.map((v, i) => {
										return <td key={ i }>{ v }</td>
									})
								}
							</tr>;
						}
						return null;
					})
				}
			</tbody>
		</table>;

		this.forceUpdate();
	}
}

export { Tag };