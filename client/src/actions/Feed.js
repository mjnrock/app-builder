import ActionType from "./../enum/ActionType";

// Some of these are invoked by the WS MessageManager, so data is already returned by this point
export function CreateFeed(feed) {
	return {
		type: ActionType.CREATE_FEED,
		payload: feed
	};
}

export function AddFeedPost(post) {
	return {
		type: ActionType.ADD_FEED_POST,
		payload: post
	};
}