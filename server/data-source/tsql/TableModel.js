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
	SetName(name) {
		this.Name = name;

		return this;
	}

	GetMutator() {
		return this.Mutator;
	}
	SetMutator(mutator) {
		this.Mutator = mutator;

		return this;
	}
	InstantiateMutator(...args) {
		try {
			return new this.Mutator(...args);
		} catch (e) {
			console.warn("[FAILED]: Mutator Instantiation.  The attached Mutator is probably corrupt or misshapen.");
		}
	}

	GetPrimaryKey() {
		return this.PrimaryKey;
	}
	SetPrimaryKey(pk) {
		this.PrimaryKey = pk;

		return this;
	}

	GetColumns() {
		return this.Columns;
	}
	SetColumns(columns) {
		this.Columns = columns;

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