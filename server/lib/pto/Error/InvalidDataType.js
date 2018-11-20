import { AException } from "./AException.js";
import EnumTagType from "./../Enum/TagType.js";

class InvalidDataType extends AException {
	constructor(tagType, passedValue) {
		super(`Value is not of type ${EnumTagType.GetString(tagType)} [${tagType}].`, passedValue);
	}
}

export { InvalidDataType };