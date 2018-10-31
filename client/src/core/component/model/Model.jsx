import React, { Component } from "react";

import PTO from "./../../../lib/pto/package";
import { ModelContainer } from "./ModelContainer";

class Model extends Component {
	constructor(props) {
		super(props);
		
		this.Mutator = new PTO.Mutator.Model();

		this.ModelOverview = [];
		this.Timestamp = Date.now();
	}

	SetTag(tag) {
		this.Mutator.SetTag(tag);

		return this;
	}
	GetTag() {
		return this.Mutator.GetTag();
	}

	RegisterElement(mc) {
		this.Mutator.SetModelContainer(mc.GetTag());
	}

	OnSave() {
		console.log(this.Mutator.GetTag());
	}

	//! This is complex enough that it should be a child component
	GetOverview() {
		let CSV = PTO.Utility.Transformer.ToDelimited(this.Mutator.GenerateSimpleTag()).split("\n").map((v, k) => {
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

		this.ModelOverview = <table className="table mt4">
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
		return (
			<div className="container">
				<h2 className="text-center mt3 mb3">Model Builder</h2>
				<ModelContainer
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
				{ this.ModelOverview }
			</div>
		);
	}
}

export { Model };