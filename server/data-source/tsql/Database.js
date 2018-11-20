class Database {
	constructor(conn, tables = []) {
		 this.ConnectionString = conn;
		 this.Tables = tables;
	}

	GetConnectionString() {
		return this.ConnectionString;
	}
	SetConnectionString(input) {
		this.ConnectionString = input;

		return this;
	}

	GetTables() {
		return this.Tables;
	}
	SetTables(input) {
		this.Tables = input;

		return this;
	}

	AddTable(key, value) {
		this.Tables[key] = value;
	}
	RemoveTable(key) {
		delete this.Tables[key];
	}

	Table(name) {
		let ret = this.Tables.filter((c) => c.GetName() === name);

		if(ret.length === 1) {
			return ret[0];
		}

		return ret;
	}
}

export { Database };