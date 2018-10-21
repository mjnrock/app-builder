import AMessage from './AMessage';
import MessageType from './../enum/MessageType';

export class InitializeFeedMessage extends AMessage {
	constructor(id) {
		super(MessageType.INITIALIZE_FEED, {
			ID: id
		});
	}
}