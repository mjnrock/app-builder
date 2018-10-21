import ActionType from "./../enum/ActionType";

export function onCreateFeed(state = [false], action) {
	if(action.type === ActionType.CREATE_FEED) {
		return action.payload;
	} else if(action.type === ActionType.ADD_FEED_POST) {
		return [
			...state,
			action.payload[0]
		];
	}

	return state;
}
