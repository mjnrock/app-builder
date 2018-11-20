class TableColumn {
	constructor(name, dataType, ordinality, tag = null, getter = null, setter = null) {
		this.Name = name;
		this.DataType = dataType;

		this.Data = {
			Tag: tag,
			Getter: getter,
			Setter: setter
		};
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

	GetTag() {
		return this.Data.Tag;
	}
	SetTag(input) {
		this.Data.Tag = input;

		return this;
	}

	GetGetter() {
		return this.Data.Getter;
	}
	SetGetter(input) {
		this.Data.Getter = input;

		return this;
	}

	GetSetter() {
		return this.Data.Setter;
	}
	SetSetter(input) {
		this.Data.Setter = input;

		return this;
	}
}

export { TableColumn };