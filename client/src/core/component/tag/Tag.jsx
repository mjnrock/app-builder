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

		this.state["Tag"] = new PTO.Tag.TagCompound(this.state.UUID);
		this.state["Class"] = null;
		this.state["File"] = null;
		this.state["Descendents"] = [];
		
		this.Timestamp = Date.now();
	}

	componentWillMount() {
		let state = this.state;

		if(this.props.Tag !== null && this.props.Tag !== void 0) {
			state["Tag"] = this.props.Tag;
		}
		
		if(this.props.RegisterElement) {
			this.props.RegisterElement(this);
		}

		this.setState(state);
	}

	RegisterElement(element) {
		let state = this.state;

		state.Class = element;
		state.Tag = element.state.Tag;

		this.setState(state);
	}

	UpdateContainer(state) {
		if(state.File !== null && state.File !== void 0) {
			let tag = (new state.File()).GetTag();
			state.Class.InitializeFromTag(tag);
			
			this.RegisterElement(state.Class);
		}
	}

	async UploadFile(event) {
		let state = this.state,
			file = event.target.files[0];
        
        if (file) {
			const reader = new FileReader();
			let upload = new Promise((resolve, reject) => {
				reader.onload = event => resolve(event.target.result);
				reader.onerror = error => reject(error);

				reader.readAsText(file);
			});
			
			return await upload.then((result) => {
				// eslint-disable-next-line
				state.File = eval(`(${ result })`);

				return state;
			});
		}
	}


	OnSave() {
		console.log("This doesn't save anything presently");
		console.log(this);
	}
	//! This is complex enough that it should be a child component
	GetOverview() {
		let CSV = PTO.Utility.Transformer.ToDelimited(this.state.Class.state.Tag).split("\n").map((v, k) => {
			return v.split(",").map((r, i, a) => {
				if(k > 0) {
					switch(i) {
						case 0:
							return +r;
						case 1:
							return +r;
						case 2:
							return +r;
						case 5:
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

	async OnFileUpload(e) {
		let state = await this.UploadFile(e);
		if(state !== null && state !== void 0) {
			this.UpdateContainer(state);
		}
	}

	render() {
		console.log(this.state.Container);
		return (
			<div className="container">
				<h2 className="text-center mt3 mb3">Tag Builder</h2>
				<div className="alert alert-primary">
					<input type="file" accept=".js" onChange={ this.OnFileUpload.bind(this) } />
				</div>
				<TagContainer Tag={ this.state.Tag } RegisterElement={ (tc) => this.RegisterElement(tc) } />
				<div className="text-center mt3 mb2">
					<button
						type="button"
						className="btn btn-sm btn-block btn-outline-success mr1"
						onClick={ () => this.OnSave() }
					>Send Tag to Console</button>
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
						onClick={ () => PTO.Mutator.MutatorFactory.GenerateMutator(this.state.Class.state.Tag, true) }
					>Save File</button>
					<button
						type="button"
						className="btn btn-sm btn-block btn-outline-danger mr1"
						onClick={ () => console.log(PTO.Mutator.MutatorFactory.GenerateMutator(this.state.Class.state.Tag)) }
					>Send to Console</button>
				</div>
				{ this.Descendents }
			</div>
		);
	}
}

export { Tag };