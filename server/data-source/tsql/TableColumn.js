class TableColumn {
	constructor(name, dataType, tag = null, getter = null, setter = null) {
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
	SetName(name) {
		this.Name = name;

		return this;
	}

	GetDataType() {
		return this.DataType;
	}
	SetDataType(dataType) {
		this.DataType = dataType;

		return this;
	}

	GetTag() {
		return this.Data.Tag;
	}
	SetTag(tag) {
		this.Data.Tag = tag;

		return this;
	}

	GetGetter() {
		return this.Data.Getter;
	}
	SetGetter(getter) {
		this.Data.Getter = getter;

		return this;
	}

	GetSetter() {
		return this.Data.Setter;
	}
	SetSetter(setter) {
		this.Data.Setter = setter;

		return this;
	}
}

export { TableColumn };