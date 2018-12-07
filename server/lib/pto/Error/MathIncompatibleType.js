import { AException } from "./AException.js";

class MathIncompatibleType extends AException {
	constructor() {
		super(`You have passed an incompatible type; supported types are: [SHORT, INT, LONG, FLOAT, and DOUBLE].`);
	}
}

export { MathIncompatibleType };