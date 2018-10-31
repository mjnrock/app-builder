import { Mutator } from "./Mutator";
import { ModelContainer } from "./ModelContainer";

class Model extends Mutator {
	constructor() {
		super();
		this.Tag = new this.PTO.Tag.TagCompound("Model");

		this.Tag.AddTag(new this.PTO.Tag.TagUUID("UUID"));
		this.Tag.AddTag(new this.PTO.Tag.TagString("Name"));
		this.Tag.AddTag(new this.PTO.Tag.TagCompound("ModelContainer"));
	}

	//TODO Come up with a simple way to offload as much of the setup as possible by creating SUPER functions and passing info
	//@ This creates the Tag that the user input dictates, NOT the Tag that this Mutator uses as a variable
	GenerateSimpleTag() {
		let name = this.GetName().GetValues() || this.GetUUID().GetValues(),
			comp = new this.PTO.Tag.TagCompound(name),
			mutator = new ModelContainer();

		mutator.SetTag(this.GetModelContainer());
		comp.AddTag(mutator.GenerateSimpleTag());

		return comp;
	}

	GetUUID() {
		return this.Tag.GetTag("UUID");
	}
	SetUUID(uuid) {
		this.Tag.GetTag("UUID").SetValues(uuid);

		return this;
	}

	GetName() {
		return this.Tag.GetTag("Name");
	}
	SetName(name) {
		this.Tag.GetTag("Name").SetValues(name);

		return this;
	}

	GetModelContainer() {
		return this.Tag.GetTag("ModelContainer");
	}
	SetModelContainer(tag) {
		this.Tag.RemoveTag("ModelContainer");
		this.Tag.AddTag(tag);

		return this;
	}
}

export { Model };