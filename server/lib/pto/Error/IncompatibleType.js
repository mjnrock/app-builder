import EnumTagType from "./../Enum/TagType.js";
import { AException } from "./AException.js";

class IncompatibleType extends AException {
	constructor(types) {
		super(`You have passed an incompatible type; supported types are: `);
		types = types.map(v => EnumTagType.GetString(v));
		this.Message += `[${ types.join(", ") }]`;
	}
}

export { IncompatibleType };