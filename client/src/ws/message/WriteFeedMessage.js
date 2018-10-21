import AMessage from './AMessage';
import MessageType from './../enum/MessageType';

export class WriteFeedMessage extends AMessage {
	constructor(id, author, message) {
		super(MessageType.WRITE_POST_MESSAGE, {
			ID: id,
			Author: author,
			Message: message
		});
	}
}