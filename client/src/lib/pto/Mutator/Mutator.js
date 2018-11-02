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
	static GenerateMutator(tag, downloadFile = false) {
		let hierarchy = PTO.Utility.Transformer.ToHierarchy(tag);

		let SanitizeName = (input, firstCharCheck = true) => {
				input = input.replace(/\W+/g, "");

				if(firstCharCheck) {
					return input[0].match(/\d/g) ? `_${ input }` : input;
				}
				return input;
			},
			MakeGetter = (key) => {
				return [
					`\tGet${ SanitizeName(key, false) }() {\n`,
					`\t\treturn this.Tag.GetTag("${ key }");\n`,
					`\t}\n`
				];
			},
			MakeSetter = (key) => {
				return [
					`\tSet${ SanitizeName(key, false) }(input) {\n`,
					`\t\tthis.Tag.GetTag("${ key }").SetValues(input);\n\n`,
					`\t\treturn this;\n`,
					`\t}\n`
				];
			},
			MakeGetterSetter = (key) => {
				return [
					...MakeGetter(key),
					...MakeSetter(key),
					`\n`
				];
			},
			IDKeyMapping = {};

		hierarchy.sort((a, b) => +a.ParentID - +b.ParentID);
		hierarchy.forEach(v => {
			IDKeyMapping[+v.ID] = {
				ParentID: +v.ParentID,
				Key: v.Tag.GetKey(),
				SaniKey: SanitizeName(v.Tag.GetKey())
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
			funcs = [];
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

			//TODO Need to add some sort of "tiering" awareness so that nested tags have appropriately-functioning Getters and Setters
			funcs.push(...MakeGetterSetter(key));
		}
		lines.push(`\t}\n\n`);	// End Constructor
		lines.push(...funcs);
		lines.push(`}`);

		//? Download the created file
		if(downloadFile === false) {
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
	}
}

export { Mutator };