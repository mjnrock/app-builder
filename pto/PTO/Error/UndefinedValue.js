import { AException } from "./AException.js";

export class UndefinedValue extends AException {
	constructor(passedValue) {
		super(`Value is not defined.`, passedValue);
	}
}
