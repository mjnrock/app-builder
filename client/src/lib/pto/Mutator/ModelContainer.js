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
	AddComponent(tag) {
		if(tag) {
			this.Tag.GetTag("Components").AddValue(tag);
		}

		return this;
	}
	RemoveComponent(tag) {
		if(tag) {
			this.Tag.GetTag("Components").RemoveTag(tag);
		}

		return this;
	}

	GetContainers() {
		return this.Tag.GetTag("Containers");
	}
	AddContainer(tag) {
		if(tag) {
			this.Tag.GetTag("Containers").AddValue(tag);
		}

		return this;
	}
	RemoveContainer(tag) {
		if(tag) {
			this.Tag.GetTag("Containers").RemoveTag(tag);
		}

		return this;
	}
}

export { ModelContainer };