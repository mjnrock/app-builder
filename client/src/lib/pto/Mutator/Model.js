import { Mutator } from "./Mutator";

class Model extends Mutator {
	constructor() {
		super();
		this.Tag = new this.PTO.Tag.TagCompound("Model");

		this.Tag.AddTag(new this.PTO.Tag.TagUUID("UUID"));
		this.Tag.AddTag(new this.PTO.Tag.TagString("Name"));
		this.Tag.AddTag(new this.PTO.Tag.TagCompound("ModelContainer"));
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