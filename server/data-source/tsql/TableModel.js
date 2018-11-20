class TableModel {
	constructor(name, mutator, columns = {}) {
		this.Name = name;

		this.Mutator = mutator;
		this.Columns = columns;

		this.PrimaryKey = null;
	}

	GetName() {
		return this.Name;
	}
	SetName(input) {
		this.Name = input;

		return this;
	}

	GetMutator() {
		return this.Mutator;
	}
	SetMutator(input) {
		this.Mutator = input;

		return this;
	}

	GetPrimaryKey() {
		return this.PrimaryKey;
	}
	SetPrimaryKey(input) {
		this.PrimaryKey = input;

		return this;
	}

	GetColumns() {
		return this.Columns;
	}
	SetColumns(input) {
		this.Columns = input;

		return this;
	}

	AddColumn(key, value) {
		this.Columns[key] = value;
	}
	RemoveColumn(key) {
		delete this.Columns[key];
	}

	Column(name) {
		let ret = this.Columns.filter((c) => c.GetLabel() === name);

		if(ret.length === 1) {
			return ret[0];
		}

		return ret;
	}
}

export { TableModel };