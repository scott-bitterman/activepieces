import { TriggerStrategy, createTrigger } from '@activepieces/pieces-framework';
import {
  HttpRequest,
  HttpMethod,
  AuthenticationType,
  httpClient,
} from '@activepieces/pieces-common';
import { auth } from "../common/auth";
import { KnackWebhookInformation } from '../common';

const triggerNameInStore = 'knack_record_insert_trigger';

export const recordInsertWebHook = createTrigger({
  auth,
  name: 'record-insert-webhook',
  displayName: 'Record Insert - Webhook',
  description: 'Triggers when a record is inserted into a Knack table',
  props: {
    // scope: calendlyCommon.scope,
  },
  type: TriggerStrategy.WEBHOOK,

  // Run when the user enable or publish the flow.
  async onEnable(context) { 
    console.log('~~webhook enabled');
    console.log('context', JSON.stringify(context, null, 2));

    const request: HttpRequest = {
      method: HttpMethod.POST,
      url: `${process.env['KNACK_URL']}/zapier/hooks?key=object_1`,
      body: {
        event: "record_created",
        target_url: context.webhookUrl.replace('localhost', 'host.docker.internal'),
      },
      headers: {
        'X-Knack-Application-Id': context.auth.applicationId,
        'X-Knack-REST-API-Key': context.auth.apiKey,
      },
      queryParams: {},
    };

    const { body } = await httpClient.sendRequest<{
      id: string;
    }>(request);

    await context.store?.put(triggerNameInStore, {
      webhookId: body.id,
    });
    console.log('~~webhook Knack webhook register url: ', `${process.env['KNACK_URL']}/zapier/hooks?key=object_1`);
    console.log('~~webhook enabled request.body', JSON.stringify(body, null, 2));
  },

  // Run when the user disable the flow or
  // the old flow is deleted after new one is published.
  async onDisable(context) { 
    console.log('~~~~~~~webhook disabled');
    console.log('context disabled!', JSON.stringify(context, null, 2));

    const response = await context.store?.get<KnackWebhookInformation>(
      triggerNameInStore
    );
    console.log(response || 'nothing');
    if (response !== null && response !== undefined && response.webhookId) {
      console.log('~~webhook delete url', `${process.env['KNACK_URL']}/zapier/hooks/${response.webhookId}`)
      const request: HttpRequest = {
        method: HttpMethod.DELETE,
        url: `${process.env['KNACK_URL']}/zapier/hooks/${response.webhookId}`,
        headers: {
          'X-Knack-Application-Id': context.auth.applicationId,
          'X-Knack-REST-API-Key': context.auth.apiKey,
        },
      };
      await httpClient.sendRequest(request);

    } else {
      throw Error('context store was null');
    }
  },

  // Trigger implementation, It takes context as parameter.
  // should returns an array of payload, each payload considered
  // a separate flow run.
  async run(context) {
    console.log('~~~webhook run context in trigger: ', JSON.stringify(context, null, 2));
    return [JSON.stringify(context.payload.body, null, 2)];
  },

  sampleData: {
    _id: '65baacf63989f0001dcfdee7',
    field_1: 'Knack Sample Data',
    field_2: 'value_2',
  },
});
