import EnumTagType from "./../Enum/TagType.js";
import { AException } from "./AException.js";

class IncompatibleType extends AException {
	constructor(types) {
		super(`You have passed an incompatible type; supported types are: `);
		this.Message += `[${ types.reduce((a, v) => `${ a }, ${ EnumTagType.GetString(v) }`) }]`;
	}
}

export { IncompatibleType };