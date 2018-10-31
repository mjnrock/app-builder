import { Mutator } from "./Mutator";

class ModelContainer extends Mutator {
	constructor() {
		super();

		this.Tag = new this.PTO.Tag.TagCompound("ModelContainer");

		this.Tag.AddTag(new this.PTO.Tag.TagUUID("UUID"));
		this.Tag.AddTag(new this.PTO.Tag.TagString("Name"));
		this.Tag.AddTag(new this.PTO.Tag.TagList("Components", this.PTO.Enum.TagType.COMPOUND));
		this.Tag.AddTag(new this.PTO.Tag.TagList("Containers", this.PTO.Enum.TagType.COMPOUND));
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

	GetComponents() {
		return this.Tag.GetTag("Components");
	}
	AddComponent() {
		let tag = this.Tag.GetTag("Components");

		return this;
	}
	RemoveComponent() {
		let tag = this.Tag.GetTag("Components");

		return this;
	}

	GetContainers() {
		return this.Tag.GetTag("Containers");
	}
	AddContainer() {
		let tag = this.Tag.GetTag("Containers");

		return this;
	}
	RemoveContainer() {
		let tag = this.Tag.GetTag("Containers");

		return this;
	}
}

export { ModelContainer };