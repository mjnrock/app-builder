class TableColumn {
	constructor(name, dataType, ordinality, tag = null, getter = null, setter = null) {
		this.Name = name;
		this.DataType = dataType;
		this.Ordinality = ordinality;

		this.Tag = tag;
		this.Getter = getter;
		this.Setter = setter;
	}

	GetName() {
		return this.Name;
	}
	SetName(input) {
		this.Name = input;

		return this;
	}

	GetDataType() {
		return this.DataType;
	}
	SetDataType(input) {
		this.DataType = input;

		return this;
	}

	GetOrdinality() {
		return this.Ordinality;
	}
	SetOrdinality(input) {
		this.Ordinality = input;

		return this;
	}

	GetTag() {
		return this.Tag;
	}
	SetTag(input) {
		this.Tag = input;

		return this;
	}

	GetGetter() {
		return this.Getter();
	}
	SetGetter(input) {
		this.Getter = input;

		return this;
	}

	GetSetter() {
		return this.Setter();
	}
	SetSetter(input) {
		this.Setter = input;

		return this;
	}

	Get() {
		return this.Getter();
	}
	Set(...input) {
		return this.Setter(...input);
	}
}

export { TableColumn };