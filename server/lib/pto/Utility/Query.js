import PTO from "../package.js";

class Query {
	/**
	 * This function is designed to be called internally to the class Query
	 * Like a .filter(), TRUE keeps the tag, FALSE removes the tag, and "break" is used for Query.Execute()
	 * @param {ATag} schema | The Tag to be checked
	 * @param {String} tier | A singular tier in a query statement
	 * @param {*} tdepth | The tier depth of @tier (i.e. the array index)
	 * @param {*} sdepth | The schema depth of @tag (i.e. the array index)
	 */
	static Tier(schema, tier) {
		if(tier === "**") {
			return "break";
		} else if(tier === "*") {
			return true;
		} else if(tier === "$" && (schema.ParentID === null || schema.ParentID === 0)) {
			return true;
		} else if(tier.match(/\/(.*)\/([a-z]{0,})/) !== null) {	// Test if string is RegEx
			//	Actually filter off of the RegEx
			let matches = tier.match(/\/(.*)\/([a-z]{0,})/),
				regex = RegExp(matches[1], typeof matches[2] === "string" || matches[2] instanceof String ? matches[2] : "gi");

			return regex.test(schema.Key);
		} else if(tier.match(/<(Boolean|Character|Compound|Double|Float|Int|List|Long|Short|String|Tiny|UUID)+(\|(Boolean|Character|Compound|Double|Float|Int|List|Long|Short|String|Tiny|UUID))*>/gi)) {
			let regex = /<(Boolean|Character|Compound|Double|Float|Int|List|Long|Short|String|Tiny|UUID)+(\|(Boolean|Character|Compound|Double|Float|Int|List|Long|Short|String|Tiny|UUID))*>/gi,
				match = regex.exec(tier),
				r = RegExp(`^${ PTO.Enum.TagType.GetString(schema.Tag.Type) }$`, "gi");

			for(let i = 0; i < match.length - 2; i++) {
				if((match[i].match(/^[a-zA-Z]+$/gi) !== null) && (r.test(match[i]))) {
					return true;
				}
			}

			return false;
		} else {			
			if(tier.indexOf("[") > -1) {
				let i = tier.indexOf("["),
					startWith = schema.Key.startsWith(tier.substring(0, i)),
					contains = schema.Key.includes(tier.substring(i + 1));

				return startWith && contains;
			}

			return schema.Key.startsWith(tier);
		}
	}

	/**
	 * Search a Tag with a Query.
	 * @param {ATag} baseTag | The Tag to search
	 * @param {String} query | default: "$" | The Query to run.  If $query === "$", this is functionally equivalent to PTO.Utility.General.Copy(baseTag, 1)
	 * 
	 * @returns {ATag} | A (?modified) copy of $baseTag
	 */
	//TODO This is not complete
	static Execute(baseTag, query = "$") {
		if(query === "$" || query === "**") {
			return PTO.Utility.General.Copy(baseTag);
		}

		let tag = PTO.Utility.General.Copy(baseTag),
			schema = PTO.Utility.Transformer.ToSchema(tag),
			depth = +(query.match(/\./g) || []).length,			//	Counts the "."
			tiers = query.split(/\./g),							//	i.e. Array.from(@query.split("."))
			ret = [];

		schema.sort((a, b) => (a.Route.match(/\./g) || []).length - (b.Route.match(/\./g) || []).length);

		schemaLoop:
		for(let j in schema) {
			let s = schema[j],
				sDepth = (s.Route.match(/\./g) || []).length;

			if(sDepth > depth) {		// Break if Schema depth exceeds Query depth
				break schemaLoop;
			} else {
				let tier = tiers[sDepth],
					result = Query.Tier(s, tier);

				if(result === false) {
					let remaining = schema.filter(t => +t.ID === +s.ParentID)[0];
					remaining.Tag.RemoveTag(s.Tag);
				} else if(result === "break") {
					break schemaLoop;
				}
			}
		};

		// tierLoop:
		// for(let i in tiers) {
		// 	let tier = tiers[i],
		// 		filtered = [];

		// 	schemaLoop:
		// 	for(let j in schema) {
		// 		let s = schema[j];

		// 		if((s.Route.match(/\./g) || []).length >= depth) {
		// 			break tierLoop;
		// 		}
				
		// 		if((s.Route.match(/\./g) || []).length === +i) {
		// 			let result = Query.Tier(s, tier, i, j);

		// 			if(result === false) {
		// 				filtered.push(j);
		// 			} else if(result === "break") {
		// 				break tierLoop;
		// 			}
		// 		}
		// 	};

		// 	filterLoop:
		// 	for(let k = filtered.length -1; k >= 0; k--) {
		// 		schema.splice(filtered[k], 1);
		// 	}
		// };

		return tag;
	}
	static Exec(tag, query) {
		return Query.Execute(tag, query);
	}
}

export { Query };