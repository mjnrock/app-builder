import PTO from "./../package";

class Mutator {
	constructor() {
		this.PTO = PTO;
		this.Tag = null;
	}

	Compare(tag) {
		if(tag instanceof PTO.Tag.ATag) {
			return this.Tag.GetSchema() === tag.GetSchema();
		} else if(typeof tag === "string" || tag instanceof String) {
			while(typeof tag === "string" || tag instanceof String) {
				tag = JSON.parse(tag);
			}
			let keys = Object.keys(tag);
			if(keys.length > 0) {
				if(keys.includes("Type") && keys.includes("Key") && keys.includes("Value")) {
					return this.Tag.GetSchema() === PTO.Utility.Transformer.FromJSON(tag).GetSchema();
				}
			}
			
			return this.Tag.GetSchema() === PTO.Utility.Transformer.InferTagStructure("HTML", tag, false).GetSchema();
		}
	
		return false;
	}

	GetTag() {
		return this.Tag;
	}
	SetTag(tag) {
		this.Tag = tag;

		return this;
	}

	/**
	 * This is designed to build a basic Mutator class with a Getter and a Setter for each tag in the Mutator.
	 * @param TagCompound | tag 
	 */
	//REFACTOR This was strongly piecemealed
	static GenerateMutator(tag, downloadFile = false) {
		let hierarchy = PTO.Utility.Transformer.ToHierarchy(tag);

		if(hierarchy.length <= 1) {
			// throw new Error("You must have at least two (2) tags to generate a Mutator");
			console.warn("You must have at least two (2) tags to generate a Mutator");

			return false;
		}

		let SanitizeName = (input, firstCharCheck = true) => {
				input = input.replace(/\W+/g, "");

				if(firstCharCheck) {
					return input[0].match(/\d/g) ? `_${ input }` : input;
				}
				return input;
			},
			MakeGetter = (key, path) => {
				path = path === null || path === void 0 ? `this.Tag.GetTag("${ key }")` : path;
				return [
					`\tGet${ SanitizeName(key, false) }() {\n`,
					`\t\treturn ${ path };\n`,
					`\t}\n`
				];
			},
			MakeSetter = (key) => {
				return [
					`\tSet${ SanitizeName(key, false) }(input) {\n`,
					`\t\tthis.Get${ SanitizeName(key, false) }().SetValues(input);\n\n`,
					`\t\treturn this;\n`,
					`\t}\n`
				];
			},
			MakeAdderRemover = (key, path, isCompound = true) => {
				path = path === null || path === void 0 ? `this.Tag.GetTag("${ key }")` : path;
				return [
					`\tAddTag${ SanitizeName(key, false) }(tag) {\n`,
					// `\t\tlet tag = this.Get${ SanitizeName(key, false) }();\n`,
					`\t\t${ path }.Add${ isCompound === false ? "Value" : "Tag"}(tag);\n\n`,
					`\t\treturn this;\n`,
					`\t}\n`,

					`\tRemoveTag${ SanitizeName(key, false) }(tag) {\n`,
					`\t\t${ path }.RemoveTag(tag);\n\n`,
					`\t\treturn this;\n`,
					`\t}\n`,
					
					`\n`
				];
			},
			MakeGetterSetter = (key, path) => {
				return [
					...MakeGetter(key, path),
					...MakeSetter(key, path),
					`\n`
				];
			},
			IDKeyMapping = {};

		hierarchy.sort((a, b) => +a.ParentID - +b.ParentID);
		hierarchy.forEach(v => {
			IDKeyMapping[+v.ID] = {
				ParentID: +v.ParentID,
				Key: v.Tag.GetKey(),
				SaniKey: SanitizeName(v.Tag.GetKey()),
				Tag: v.Tag
			};
		});

		let root = hierarchy.shift().Tag,
			saniRootKey = SanitizeName(root.GetKey());

		let currentVariable = "this.Tag",
			currentParentID = 1,
			lines = [
				`import { Mutator } from "./Mutator";\n\n`,
				// `import { Mutator } from "./Mutator";\n`,
				// `// import { Mutator } from "./path/to/mutator/";\n\n`,

				`class ${ saniRootKey } extends Mutator {\n`,
				`\tconstructor() {\n`,
				`\t\tsuper();\n\n`,

				`\t\t${ currentVariable } = new this.PTO.Tag.TagCompound("${ root.GetKey() }");\n\n`
			],
			funcs = [
				...MakeGetterSetter(root.GetKey())
			];

		// Because of the hierarchy.shift() above, anything in this loop will necessarily be a child
		for(let i in hierarchy) {
			let hier = hierarchy[i],
				key = hier.Tag.GetKey(),
				type = hierarchy[i].Tag.GetType(),
				className = PTO.Enum.TagType.GetClass(+type).name;

			if(+hier.ParentID !== +currentParentID) {
				let parent = IDKeyMapping[hier.ParentID];

				lines.push(`\n`);
				lines.push(`\t\tlet ${ parent.SaniKey } = ${ currentVariable }.GetTag("${ parent.Key }");\n`);
				currentVariable = parent.SaniKey;
				currentParentID = +hier.ParentID;
			}
			lines.push(`\t\t${ currentVariable }.AddTag(new this.PTO.Tag.${ className }("${ key }"));\n`);

			//TODO Same-tier, Key collisions will still produce unexpected results.  Don't accept Key name if it would result in a collision.
			funcs.push(
				...MakeGetterSetter(key, `this.Get${ SanitizeName(IDKeyMapping[hier.ParentID].Key, false) }().GetTag("${ IDKeyMapping[hier.ID].Key }")`)
			);
			if(hier.Tag instanceof PTO.Tag.TagCompound || hier.Tag instanceof PTO.Tag.TagList) {
				funcs.push(
					...MakeAdderRemover(key, `this.Get${ SanitizeName(IDKeyMapping[hier.ID].Key, false) }()`, hier.Tag instanceof PTO.Tag.TagCompound)
				);
			}
		}
		lines.push(`\t}\n\n`);	// End Constructor
		lines.push(...funcs);
		lines.pop();	// Cleanup an aesthetically unpleasing extra line
		lines.push(`}`);

		// Download the created file
		if(downloadFile === true) {
			const download = (filename, text) => {
				var element = document.createElement('a');
				element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
				element.setAttribute('download', filename);
			
				element.style.display = 'none';
				document.body.appendChild(element);
			
				element.click();
			
				document.body.removeChild(element);
			};
			download(`${ saniRootKey }.js`, lines.join(""));
		}

		return lines.join("");
	}
}

export { Mutator };