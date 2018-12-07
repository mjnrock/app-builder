import PTO from "./../package.js";

class Text {
	static get COMPATIBILITY() {
		return [
			PTO.Enum.TagType.CHARACTER,
			PTO.Enum.TagType.STRING,	
			PTO.Enum.TagType.UUID,
			
			PTO.Enum.TagType.TINY,
			PTO.Enum.TagType.SHORT,
			PTO.Enum.TagType.INT,
			PTO.Enum.TagType.LONG,
			PTO.Enum.TagType.FLOAT,
			PTO.Enum.TagType.DOUBLE
		];
	}
    static IsCompatible(...tags) {
        for(let i in tags) {
            if(!Text.COMPATIBILITY.includes(tags[i].Type)) {
                return false;
            }
        }

        return true;
	}
	
	/**
	 * Functionally equivalent to a TSQL CONCAT.  If a boolean is found, it will treat is as the "returnAsTag" flag.
	 * @param  {...any} input | Any combination of a String or a Tag
	 */
	static Concat(...inputs) {		
		let string = "",
			returnAsTag = false;

		for(let i in inputs) {
			let input = inputs[i];

			if(typeof input === "string" || input instanceof String) {
				string += input;
			} else if(input instanceof PTO.Tag.ATag) {		
				if(!Text.IsCompatible(input)) {
					throw new PTO.Error.IncompatibleType(Text.COMPATIBILITY);
				} else {
					string += input.GetValues();
				}
			} else if(input === true || input === false) {
				returnAsTag = input;
			}
		}

		if(returnAsTag) {
			return new PTO.Tag.TagString("Concat", string);
		}

		return string;
	}
}

// Text.COMPATIBILITY = [
// 	PTO.Enum.TagType.CHARACTER,
// 	PTO.Enum.TagType.STRING,	
// 	PTO.Enum.TagType.UUID
// ];
export { Text };