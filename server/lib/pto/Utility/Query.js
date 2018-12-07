import PTO from "../package.js";

class Query {
	//	Shape Example:
	//		PTO.Utility.Transformer.ToSchema(tag)
	//	---------------------------------------------
	// { ID: 1,
	// 	ParentID: null,
	// 	Key: 1,
	// 	Path: '1',
	// 	Ordinality: 1544212849179,
	// 	Tag: TagString { Type: 2, Key: 1, Value: [Object], Ordinality: 1544212849179 } }

	static Execute(tag, query) {

	}
	static Exec(tag, query) {
		return Query.Execute(tag, query);
	}
}

export { Query };