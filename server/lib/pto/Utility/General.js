import PTO from "../package.js";

class General {	
	static Copy(tag, copies = 1) {
		let serialize = tag.Serialize(),
			clazz = PTO.Enum.TagType.GetClass(tag.Type),
			ret = [tag];
			
		for(let i = 0; i < copies; i++) {
			let t = new clazz(tag.Key);
			t.Deserialize(serialize);

			ret.push(t);
		}

		return ret;
	}

    static OverwriteValue(t1, t2) {
        t1.Value = t2.Value;

        return t1;
    }
}

export { General };