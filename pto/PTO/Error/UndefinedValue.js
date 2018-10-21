import { AException } from "./AException.js";

class UndefinedValue extends AException {
	constructor(passedValue) {
		super(`Value is not defined.`, passedValue);
	}
}

export { UndefinedValue };