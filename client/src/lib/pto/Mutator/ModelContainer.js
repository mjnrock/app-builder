import { Mutator } from "./Mutator";

class ModelContainer extends Mutator {
	constructor() {
		super();

		this.Tag = new this.PTO.Tag.TagCompound("ModelContainer");

		this.Tag.AddTag(new this.PTO.Tag.TagUUID("UUID"));
		this.Tag.AddTag(new this.PTO.Tag.TagString("Name"));
		
		this.Tag.AddTag(new this.PTO.Tag.TagList("Container", this.PTO.Enum.TagType.COMPOUND));
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

	GetContainer() {
		return this.Tag.GetTag("Container");
	}
	AddContainerElement(tag) {
		if(tag) {
			this.Tag.GetTag("Container").AddValue(tag);
		}

		return this;
	}
	RemoveContainerElement(tag) {
		if(tag) {
			this.Tag.GetTag("Container").RemoveTag(tag);
		}

		return this;
	}
}

export { ModelContainer };