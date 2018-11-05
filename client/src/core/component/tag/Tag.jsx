import React, { Component } from "react";

import PTO from "../../../lib/pto/package";
import { TagContainer } from "./TagContainer";

class Tag extends Component {
	constructor(props) {
		super(props);		

		this.Tag = null;

		this.Descendents = [];
		this.Timestamp = Date.now();
	}

	SetTag(tag) {
		this.Tag = tag;

		return this;
	}
	GetTag() {
		return this.Tag;
	}

	RegisterElement(mc) {
		this.Tag = mc.GetTag();
	}

	OnSave() {
		console.log("This doesn't save anything presently");
		console.log(this.Tag);
	}

	//! This is complex enough that it should be a child component
	GetOverview() {
		let CSV = PTO.Utility.Transformer.ToDelimited(this.Tag).split("\n").map((v, k) => {
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

	render() {
		console.log(this.Tag);
		return (
			<div className="container">
				<h2 className="text-center mt3 mb3">Tag Builder</h2>
				<TagContainer
					UUID={ PTO.Utility.Transformer.GenerateUUID() }
					RegisterElement={ (mc) => { this.RegisterElement(mc) }}
				/>
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
						onClick={ () => PTO.Mutator.MutatorFactory.GenerateMutator(this.Tag, true) }
					>Save File</button>
					<button
						type="button"
						className="btn btn-sm btn-block btn-outline-danger mr1"
						onClick={ () => console.log(PTO.Mutator.MutatorFactory.GenerateMutator(this.Tag)) }
					>Send to Console</button>
				</div>
				{ this.Descendents }
			</div>
		);
	}
}

export { Tag };