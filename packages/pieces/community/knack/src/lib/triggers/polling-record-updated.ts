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
import dayjs from 'dayjs';

type AuthProps = {
  apiKey: string;
  applicationId: string;
  subdomain?: string;
};

type KnackResponse = {
  records: any;
};

interface KnackFilter {
  field: string;
  operator: string;
  value: number;
}


/*==============================
  Polling Trigger
  ==============================*/
const polling: Polling<AuthProps, {}> = {
  strategy: DedupeStrategy.TIMEBASED,
  items: async ({ auth, propsValue, lastFetchEpochMS }) => {
    console.log('~~~polling context', JSON.stringify({ auth, propsValue, lastFetchEpochMS }, null, 2));
    let url = `${process.env['KNACK_URL']}/v1/objects/object_1/records?rows_per_page=10`;

    if (lastFetchEpochMS) {
      const filters = [
        {
          field:'updated',
          operator:'is after',
          value: new Date(lastFetchEpochMS).toISOString(),
        },
      ];
      console.log('~~~filters', JSON.stringify(filters, null, 2));
      url = url + `&filters=${encodeURIComponent(JSON.stringify(filters))}`;
    }

    console.log({ url })

		const response = await httpClient.sendRequest<KnackResponse>({
			method: HttpMethod.GET,
			url,
			headers: {
				// Local
				'X-Knack-Application-Id': auth.applicationId,
				'X-Knack-REST-API-Key': auth.apiKey,
			},
		});

    console.log('~~~response.body.records', JSON.stringify(response.body.records, null, 2));


    const now = new Date().toISOString();
    console.log('~~~now', now);

    // This will return any updated records
    const timeMapResponse = response.body.records.map((record: any) => ({
      epochMilliSeconds: dayjs(now).valueOf(),
      data: JSON.stringify(record, null, 2),
    }));
    console.log('~~~timeMapResponse', JSON.stringify(timeMapResponse, null, 2));
    return timeMapResponse;
  }
}

export const recordUpdated = createTrigger({
  auth,
  name: 'knack-trigger-record-update', // Unique name across the piece.
  displayName: 'Record Updated', // Display name on the interface.
  description: 'Triggers when a record is updated in a Knack table', // Description for the action
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
    "id": "65baacf63989f0001dcfdee7",
    "field_1": "8",
    "field_1_raw": "8",
    "field_2": "01/31/2024",
    "field_2_raw": {
      "date": "01/31/2024",
      "date_formatted": "01/31/2024",
      "hours": "12",
      "minutes": "00",
      "am_pm": "AM",
      "unix_timestamp": 1706659200000,
      "iso_timestamp": "2024-01-31T00:00:00.000Z",
      "timestamp": "01/31/2024 12:00 am",
      "time": 720
    }
  }

})
