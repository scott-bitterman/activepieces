import { createAction, Property, PieceAuth } from "@activepieces/pieces-framework";
import { httpClient, HttpMethod } from "@activepieces/pieces-common";
import { auth } from "../common/auth";

export const doSomething = createAction({
	name: 'do something', // Must be a unique across the piece, this shouldn't be changed.
  // auth: PieceAuth.None(),
  auth,
  displayName: 'Knack',
  description: 'Knack',
	props: {
    // Properties to ask from the user, in this ask we will take number of
		number_of_stories: Property.Number({
			displayName: 'Something else',
			description: 'description of something else',
			required: true,
		}),
	},
	async run(context) {
		console.log('~~~context: ', JSON.stringify(context, null, 2));
		const KNACK_URL = 'http://api.knackdev.com:3000/v1/objects/object_1';

		const object = await httpClient.sendRequest<string[]>({
			method: HttpMethod.GET,
			url: KNACK_URL,
			headers: {
				// Local
				'X-Knack-Application-Id': context.auth.applicationId,
				'X-Knack-REST-API-Key': context.auth.apiKey,
			},
		});

		return ['helloworld', object.body];
	},
});

