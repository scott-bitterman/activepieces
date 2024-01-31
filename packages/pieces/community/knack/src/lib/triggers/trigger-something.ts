import { 
  createTrigger, 
  TriggerStrategy 
} from "@activepieces/pieces-framework";
import {
  DedupeStrategy,
  Polling,
  pollingHelper,
  httpClient, 
  HttpMethod,
} from '@activepieces/pieces-common';
import { auth } from "../common/auth";

type AuthProps = {
  apiKey: string;
  applicationId: string;
  subdomain?: string;
};

type KnackResponse = {
  records: any;
  body: {
    records: any[];
  }
};

/*==============================
  Polling Trigger
  ==============================*/
const polling: Polling<AuthProps, {}> = {
  strategy: DedupeStrategy.LAST_ITEM,
  items: async (context: any) => {
    console.log('~~~polling context', JSON.stringify(context, null, 2));
    const KNACK_URL = 'http://api.knackdev.com:3000/v1/objects/object_1/records?rows_per_page=10';

		const response = await httpClient.sendRequest<KnackResponse>({
			method: HttpMethod.GET,
			url: KNACK_URL,
			headers: {
				// Local
				'X-Knack-Application-Id': context.auth.applicationId,
				'X-Knack-REST-API-Key': context.auth.apiKey,
			},
		});

    console.log('~~~response.body.records', JSON.stringify(response.body.records, null, 2));

    // This will return any new records
    return response.body.records.map((record: any) => ({
        id: record.id,
        data: record,
    }));
  }
}

export const triggerSomething = createTrigger({
  auth,
  name: 'knack-trigger', // Unique name across the piece.
  displayName: 'Record Insert', // Display name on the interface.
  description: 'Triggers when a record is inserted into a Knack table', // Description for the action
  type: TriggerStrategy.POLLING,

  props: {}, // Required properties from the user.


  // Run when the user enable or publish the flow.
  onEnable: async (context) => { 
    console.log('~~~~~~~enabled');
    console.log('context enabled!', JSON.stringify(context, null, 2));
    await pollingHelper.onEnable(polling, {
      auth: context.auth,
      store: context.store,
      propsValue: context.propsValue,
    });
  },

  // Run when the user disable the flow or
  // the old flow is deleted after new one is published.
  onDisable: async (context) => { 
    console.log('~~~~~~~disabled');
    console.log('context disabled!', JSON.stringify(context, null, 2));
    await pollingHelper.onDisable(polling, {
      auth: context.auth,
      store: context.store,
      propsValue: context.propsValue,
    });
  },

  // Trigger implementation, It takes context as parameter.
  // should returns an array of payload, each payload considered
  // a separate flow run.
  run: async (context) => {
    console.log('~~~run context in trigger: ', JSON.stringify(context, null, 2));
    return await pollingHelper.poll(polling, {
      auth: context.auth,
      store: context.store,
      propsValue: context.propsValue,
    });
  },

  test: async (context) => {
    return await pollingHelper.test(polling, {
      auth: context.auth,
      store: context.store,
      propsValue: context.propsValue,
    });
  },

  sampleData: {
    _id: '5f5e3e3e3e3e3e3e3e3e3e3e',
    value: 'hello world',
  }
})
