class Test {
	constructor() {}
	
	AssertEquals(a, b) {
		return JSON.stringify(a) === JSON.stringify(b);
	}
}

export { Test };