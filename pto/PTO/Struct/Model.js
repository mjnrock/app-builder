import Tag from "./../Tag/package.js";

import { AStruct } from "./AStruct.js";

class Model extends AStruct {
	constructor() {
		super();

		this.Tag = new Tag.TagCompound("Model");

		this.Tag.AddTag(new Tag.TagUUID("UUID"));
		this.Tag.AddTag(new Tag.TagCompound("Meta"));
		this.Tag.AddTag(new Tag.TagCompound("Tag"));
		this.Tag.AddTag(new Tag.TagCompound("Components"));

		let meta = this.Tag.GetTag("Meta");
		meta.AddTag(new Tag.TagString("Name"));
		meta.AddTag(new Tag.TagString("Description"));
	}

	GetUUID() {
		return this.Tag.GetTag("UUID");
	}
	
	GetMeta() {
		return this.Tag.GetTag("Meta");
	}
	GetName() {
		return this.GetMeta().GetTag("Name");
	}
	SetName(name) {
		this.GetName().SetValues(name);
	}
	GetDescription() {
		return this.GetMeta().GetTag("Description");
	}
	SetDescription(desc) {
		this.GetDescription().SetValues(desc);
	}

	//TODO Do all the Tag/Component manipulations
}

export { Model };