import PTO from "../package.js";

class Query {
	//	Shape Example:
	//		PTO.Utility.Transformer.ToSchema(tag)
	//	---------------------------------------------
	// { ID: 1,
	// 	ParentID: null,
	// 	Key: 1,
	// 	Path: '1',					//* Use "Path" and count "." levels to determine the Tag's Tier
	// 	Ordinality: 1544212849179,
	// 	Tag: TagString { Type: 2, Key: 1, Value: [Object], Ordinality: 1544212849179 } }

	/**
	 * This function is designed to be called internally to the class Query
	 * Like a .filter(), TRUE keeps the tag, FALSE removes the tag, and "break" is used for Query.Execute()
	 * @param {ATag} tag | The Tag to be checked
	 * @param {String} tier | A singular tier in a query statement
	 * @param {*} tdepth | The tier depth of @tier (i.e. the array index)
	 * @param {*} sdepth | The schema depth of @tag (i.e. the array index)
	 */
	static Tier(tag, tier, tdepth, sdepth) {
		if(tier === "**") {
			return "break";
		} else if(tier === "*") {
			return true;
		} else if(tier === "$" && (tag.ParentID === null || tag.ParentID === 0)) {
			return true;
		}
	}

	/**
	 * Search a Tag with a Query.
	 * @param {ATag} baseTag | The Tag to search
	 * @param {String} query | default: "$" | The Query to run.  If $query === "$", this is functionally equivalent to PTO.Utility.General.Copy(baseTag, 1)
	 * 
	 * @returns {ATag} | A (?modified) copy of $baseTag
	 */
	static Execute(baseTag, query = "$") {
		if(tiers[0] === "$" || tiers[0] === "**") {
			return PTO.Utility.General.Copy(baseTag);
		}

		let tag = PTO.Utility.General.Copy(baseTag),
			schema = PTO.Utility.Transformer.ToSchema(tag),
			depth = (query.match(/\./) || []).length,			//	Counts the "."
			tiers = query.split(/\./g);							//	i.e. Array.from(@query.split("."))

		tierLoop:
		for(i in tiers) {
			let tier = tiers[i],
				filtered = [];

			schemaLoop:
			for(j in schema) {
				let t = schema[j],
					result = Query.Tier(t, tier, i, j);

				if(result === false) {
					filtered.push(j);
				} else if(result === "break") {
					break tierLoop;
				}
			};

			filterLoop:
			for(let k = filtered.length -1; k >= 0; k--) {
				schema.splice(filtered[k],1);
			}
		};

		return PTO.Utility.Transformer.FromSchema(schema);
	}
	static Exec(tag, query) {
		return Query.Execute(tag, query);
	}
}

export { Query };