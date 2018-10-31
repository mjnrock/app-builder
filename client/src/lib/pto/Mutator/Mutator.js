import PTO from "./../package";

class Mutator {
	constructor() {
		this.PTO = PTO;
		this.Tag = null;
	}

	Compare(tag) {
		if(tag instanceof PTO.Tag.ATag) {
			return this.Tag.GetSchema() === tag.GetSchema();
		} else if(typeof tag === "string" || tag instanceof String) {
			while(typeof tag === "string" || tag instanceof String) {
				tag = JSON.parse(tag);
			}
			let keys = Object.keys(tag);
			if(keys.length > 0) {
				if(keys.includes("Type") && keys.includes("Key") && keys.includes("Value")) {
					return this.Tag.GetSchema() === PTO.TagUtil.FromJSON(tag).GetSchema();
				}
			}
			
			return this.Tag.GetSchema() === PTO.TagUtil.InferTagStructure("HTML", tag, false).GetSchema();
		}
	
		return false;
	}

	GetTag() {
		return this.Tag;
	}
	SetTag(tag) {
		this.Tag = tag;

		return this;
	}
}

export { Mutator };