class ActiveTable {
	constructor(model, records = []) {
		this.TableModel = model;
		this.Records = records;
	}

	GetTableModel() {
		return this.TableModel;
	}
	SetTableModel(input) {
		this.TableModel = input;

		return this.TableModel;
	}

	GetRecords() {
		return this.Records;
	}
	SetRecords(input) {
		this.Records = input;

		return this;
	}

	GetRecord(pkvalue) {
		let ret = this.Records.filter((c) => this.TableModel.GetPrimaryKey());

		if(ret.length === 1) {
			return ret[0];
		}

		return ret;
	}
}

export { ActiveTable };