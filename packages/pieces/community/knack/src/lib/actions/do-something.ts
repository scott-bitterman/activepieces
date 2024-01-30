import { createAction, Property, PieceAuth } from "@activepieces/pieces-framework";
import { httpClient, HttpMethod } from "@activepieces/pieces-common";

export const doSomething = createAction({
	name: 'do something', // Must be a unique across the piece, this shouldn't be changed.
  auth: PieceAuth.None(),
  displayName:'Knack',
  description: 'Knack',
	props: {
    // Properties to ask from the user, in this ask we will take number of
		number_of_stories: Property.Number({
			displayName: 'Number of Stories',
			description: 'description',
			required: true,
		})
	},
	async run(context) {
		const KNACK_URL = 'http://api.knackdev.com:3000/v1/objects/object_1';
		const {
			KNACK_APPLICATION_ID,
			KNACK_API_KEY,
		} = process.env;
		const object = await httpClient.sendRequest<string[]>({
			method: HttpMethod.GET,
			url: KNACK_URL,
			headers: {
				// Local
				'X-Knack-Application-Id': KNACK_APPLICATION_ID,
				'X-Knack-REST-API-Key': KNACK_API_KEY,
			},
		});

		return ['helloworld', object.body];
	},
});

