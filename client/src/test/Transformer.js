import { Test } from "./Test.js";

class Transformer extends Test {
	Test() {
		let Tag = new PTO.Tag.TagCompound("ModelComponent");

		Tag.AddTag(new PTO.Tag.TagUUID("UUID"));
		Tag.AddTag(new PTO.Tag.TagString("Name"));
		Tag.AddTag(new PTO.Tag.TagInt("Type", PTO.Enum.TagType.STRING));
		Tag.AddTag(new PTO.Tag.TagCompound("RegEx"));

		let RegEx = Tag.GetTag("RegEx");
		RegEx.AddTag(new PTO.Tag.TagString("Match"));
		RegEx.AddTag(new PTO.Tag.TagString("Replace"));

		Tag.GetTag("Name").SetValues("Test Name");

		console.log(Tag);

		let tbuff = PTO.Utility.Transformer.ToBuffer(Tag);
		let fbuff = PTO.Utility.Transformer.FromBuffer(tbuff);
		console.warn(`[Buffer]: ${ this.AssertEquals(Tag, fbuff) }`);

		let thier = PTO.Utility.Transformer.ToHierarchy(Tag);
		let fhier = PTO.Utility.Transformer.FromHierarchy(thier);
		console.warn(`[Hierarchy]: ${ this.AssertEquals(Tag, fhier) }`);

		let tdel = PTO.Utility.Transformer.ToDelimited(Tag);
		let fdel = PTO.Utility.Transformer.FromDelimited(tdel);
		console.warn(`[Delimited]: ${ this.AssertEquals(Tag, fdel) }`);

		let txml = PTO.Utility.Transformer.ToXML(Tag);
		let fxml = PTO.Utility.Transformer.FromXML(txml);
		console.warn(`[XML]: ${ this.AssertEquals(Tag, fxml) }`);

		let tavro = PTO.Utility.Transformer.ToAvro(Tag, "TEST");
		let favro = PTO.Utility.Transformer.FromAvro(tavro);
		console.warn(`[Avro]: ${ this.AssertEquals(Tag, favro) }`);
	}
}

export { Transformer };