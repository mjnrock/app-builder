import Tag from "../Tag/package.js";
import EnumTagType from "./TagType.js";

export default Object.freeze({
	ANY: 0,
	INT: 1,
	STRING: 2,
	SHORT: 3,
	TINY: 4,
	LONG: 5,
	BOOL: 6,
	FLOAT: 7,
	DOUBLE: 8,
	LIST: 9,
	COMPOUND: 10,
	CHARACTER: 11,
	UUID: 12,

	GetString: value => {
		let keys = Object.keys(EnumTagType);

		for(let i in keys) {
			if(EnumTagType[keys[i]] === value) {
				return keys[i];
			}
		}
	},

	GetClass: value => {
		switch(value) {
			case EnumTagType.ANY:
				return Tag.ATag;
			case EnumTagType.INT:
				return Tag.TagInt;
			case EnumTagType.STRING:
				return Tag.TagString;
			case EnumTagType.SHORT:
				return Tag.TagShort;
			case EnumTagType.TINY:
				return Tag.TagTiny;
			case EnumTagType.LONG:
				return Tag.TagLong;
			case EnumTagType.BOOL:
				return Tag.TagBoolean;
			case EnumTagType.FLOAT:
				return Tag.TagFloat;
			case EnumTagType.DOUBLE:
				return Tag.TagDouble;
			case EnumTagType.LIST:
				return Tag.TagList;
			case EnumTagType.COMPOUND:
				return Tag.TagCompound;
			case EnumTagType.CHARACTER:
				return Tag.TagCharacter;
			case EnumTagType.UUID:
				return Tag.TagUUID;
			default:
				return null;
		}
	},

	GetAvroType: value => {
		switch(value) {
			case EnumTagType.INT:
				return "int";
			case EnumTagType.STRING:
				return "string";
			case EnumTagType.SHORT:
				return "int";
			case EnumTagType.TINY:
				return "int";
			case EnumTagType.LONG:
				return "long";
			case EnumTagType.BOOL:
				return "boolean";
			case EnumTagType.FLOAT:
				return "float";
			case EnumTagType.DOUBLE:
				return "double";
			case EnumTagType.LIST:
				return "array";
			case EnumTagType.COMPOUND:
				return "record";
			case EnumTagType.CHARACTER:
				return "string";
			case EnumTagType.UUID:
				return "string";
			default:
				return null;
		}
	},

	GetEnum: value => {
		value = value.toUpperCase();
		switch(value) {
			case "ANY" || "ATAG":
				return EnumTagType.ANY;
			case "INT" || "TAGINT":
				return EnumTagType.INT;
			case "STRING" || "TAGSTRING":
				return EnumTagType.STRING;
			case "SHORT" || "TAGSHORT":
				return EnumTagType.SHORT;
			case "TINY" || "TAGTINY":
				return EnumTagType.TINY;
			case "LONG" || "TAGLONG":
				return EnumTagType.LONG;
			case "BOOLEAN" || "TAGBOOLEAN":
				return EnumTagType.BOOL;
			case "FLOAT" || "TAGFLOAT":
				return EnumTagType.FLOAT;
			case "DOUBLE" || "TAGDOUBLE":
				return EnumTagType.DOUBLE;
			case "LIST" || "TAGLIST":
				return EnumTagType.LIST;
			case "COMPOUND" || "TAGCOMPOUND":
				return EnumTagType.COMPOUND;
			case "CHARACTER" || "TAGCHARACTER":
				return EnumTagType.CHARACTER;
			case "UUID" || "TAGUUID":
				return EnumTagType.UUID;
			default:
				return null;
		}
	},

	GetColor: value => {
		switch(value) {
			case EnumTagType.INT:
				return "#1976d2";
			case EnumTagType.STRING:
				return "#c62828";
			case EnumTagType.SHORT:
				return "#42a5f5";
			case EnumTagType.TINY:
				return "#bbdefb";
			case EnumTagType.LONG:
				return "#0d47a1";
			case EnumTagType.BOOL:
				return "#5e35b1";
			case EnumTagType.FLOAT:
				return "#66bb6a";
			case EnumTagType.DOUBLE:
				return "#2e7d32";
			case EnumTagType.LIST:
				return "#a1887f";
			case EnumTagType.COMPOUND:
				return "#616161";
			case EnumTagType.CHARACTER:
				return "#f06292";
			case EnumTagType.UUID:
				return "#ffb74d";
			default:
				return "#000";
		}
	}
});
