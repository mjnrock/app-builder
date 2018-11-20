import Tag from "./../Tag/package.js";
import { Transformer } from "./../Utility/Transformer.js";

class AStruct {
	constructor() {
		this.Tag = null;
	}

	Compare(tag) {
		if(tag instanceof Tag.ATag) {
			return this.Tag.GetSchema() === tag.GetSchema();
		} else if(typeof tag === "string" || tag instanceof String) {
			while(typeof tag === "string" || tag instanceof String) {
				tag = JSON.parse(tag);
			}
			let keys = Object.keys(tag);
			if(keys.length > 0) {
				if(keys.includes("Type") && keys.includes("Key") && keys.includes("Value")) {
					return this.Tag.GetSchema() === Transformer.FromJSON(tag).GetSchema();
				}
			}
			
			return this.Tag.GetSchema() === Transformer.InferTagStructure("HTML", tag, false).GetSchema();
		}
	
		return false;
	}

	GetTag() {
		return this.Tag;
	}
	SetTag(tag) {
		if(tag instanceof Tag.ATag) {
			this.Tag = tag;
		}

		return this;
	}
}

export { AStruct };