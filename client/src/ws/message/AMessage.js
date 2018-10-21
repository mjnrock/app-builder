export default class AMessage {
	constructor(messageType, data) {
		this.Type = messageType;
		this.Data = data;
		this.Timestamp = Date.now();
	}
}