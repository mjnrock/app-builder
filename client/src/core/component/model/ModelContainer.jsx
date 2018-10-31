import React, { Component } from "react";
import { ModelComponent } from "./ModelComponent";

class ModelContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			Container: {},
			Elements: []
		};

		this.Mutator = new this.props.PTO.Mutator.ModelContainer();
		
		this.Timestamp = Date.now();
	}

	componentDidMount() {
		if(this.props.RegisterElement) {
			this.props.RegisterElement(this);
		}
		
		if(this.props.UUID !== null && this.props.UUID !== void 0) {
			this.Mutator.SetUUID(this.props.UUID);
		}
	}

	SetTag(tag) {
		this.Mutator.SetTag(tag);

		return this;
	}
	GetTag() {
		return this.Mutator.GetTag();
	}
	
	RegisterElement(element) {
		let elements = this.state.Container,
			uuid = element.props.UUID;

		elements[uuid].Class = element;

		this.setState({
			...this.state,
			ContainerElements: elements
		});
		
		element.GetTag().SetKey(uuid);
		this.Mutator.AddContainerElement(element.GetTag());
	}
	NewContainerElement(type) {
		let elements = this.state.Container,
			uuid = this.props.PTO.Utility.Transformer.GenerateUUID();

		elements[uuid] = {
			UUID: uuid,
			Class: null,
			Timestamp: Date.now()
		};
		
		if(type === "Container") {
			elements[uuid]["Element"] = <ModelContainer
				PTO={ this.props.PTO }
				UUID={ uuid }
				RegisterElement={ (mc) => { this.RegisterElement(mc) }}
			/>;
		} else if(type === "Component") {
			elements[uuid]["Element"] = <ModelComponent
				PTO={ this.props.PTO }
				UUID={ uuid }
				RegisterElement={ (mc) => { this.RegisterElement(mc) }}
			/>;
		}

		this.setState({
			...this.state,
			ContainerElements: elements
		});
	}

	MergeIntoElements() {
		let Elements = {};
		Object.entries(this.state.Container).forEach((e, i) => {
			Elements[e[1].Timestamp] = e[1];
		});
		Elements = Object.entries(Elements);
		Elements.sort((a, b) => Number(a[1].Timestamp) - Number(b[1].Timestamp));
		Elements = Elements.map((v, i) => v[1]);

		return Elements;
	}
	
	RemoveElement(element) {
		let state = this.state;

		this.Mutator.RemoveContainerElement(element.Class.Mutator.GetTag());
		delete state.Container[element.UUID];

		this.setState(state);
	}

	render() {
		return (
			<div className="w-100 flex justify-around mt2 mb2 ba br2 b--ddd pa2">
				<div className="w-100">
					<label className="f7 b">Name</label>
					<input
						type="text"
						className="form-control mb1"
						placeholder="Container Name"
						mcf=".Name"
						onChange={ this.onDataChange.bind(this) }
					/>
					<p className="f7 code text-center">
						<span>{ this.UUID }</span>
					</p>
					{
						Object.values(this.state.Container).map((e, i) => {
							return (
								<div className="flex mt2 mb2 justify-around" key={ i }>
									<button
										className={
											`btn btn-sm btn-outline-danger ${ e.Class instanceof ModelContainer ? "mr2" : "mr1" }`
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
							onClick={ () => this.NewContainerElement("Container") }
						>Add Container</button>
						<button
							type="button"
							className="btn btn-block btn-sm btn-outline-secondary mr1"
						>Add Model</button>
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
			tag = this.props.PTO.Utility.Navigator.FindTag(this.Mutator.GetTag(), mcf);
		
		if(tag !== null && tag !== void 0) {
			if(e.type === "change") {
				tag.SetValues(e.target.value);
			}
			
			//	Because of the construction and no state manipulation, this basically doubly-binds the Tags to the component
			this.forceUpdate();
		}
	}
}

export { ModelContainer };