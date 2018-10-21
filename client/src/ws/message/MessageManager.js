import MessageType from "../enum/MessageType";

export default class MessageManager {
	constructor(dispatchers) {
		this.Dispatchers = dispatchers;
	}
	
	OnMessage(msg) {
		if(msg !== void 0 && msg !== null) {
			let message = JSON.parse(msg);

			switch(message.Type) {
				case MessageType.INITIALIZE_FEED:
					this.Dispatchers.CreateFeed(message.Payload);
					break;
				case MessageType.WRITE_POST_MESSAGE:
					this.Dispatchers.AddFeedPost(message.Payload);
					break;
				default:
					break;
			}
		}
	}
}