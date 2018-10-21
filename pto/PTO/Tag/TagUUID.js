import { TagString } from "./TagString.js";
import Enum from "../Enum/package.js";

export class TagUUID extends TagString {
	constructor(key, value) {
		super(key, value);

		this.SetType(Enum.TagType.UUID);
		this.SetValues(value);
	}

	Generate() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		    let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		    return v.toString(16);
		});
	}

	SetValues(value) {
		if(value === null || value === void 0 || this.GetValues().length === 0) {
			value = this.Generate();
		}
		super.SetValues(value);

		return this;
	}
}
