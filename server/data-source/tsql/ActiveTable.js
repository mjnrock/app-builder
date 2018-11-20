class ActiveTable {
	constructor(model, records = []) {
		this.TableModel = model;
		this.Records = records;
	}

	GetTableModel() {
		return this.TableModel;
	}
	SetTableModel(tableModel) {
		this.TableModel = tableModel;

		return this.TableModel;
	}

	GetRecords() {
		return this.Records;
	}
	SetRecords(records) {
		this.Records = records;

		return this;
	}

	//TODO Doesn't do anything useful yet
	GetRecord(pkvalue) {
		let ret = this.Records.filter((r) => this.TableModel.GetPrimaryKey());

		if(ret.length === 1) {
			return ret[0];
		}

		return ret;
	}
}

export { ActiveTable };