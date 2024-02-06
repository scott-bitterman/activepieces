import { Property } from '@activepieces/pieces-framework';
import { TriggerStrategy, createTrigger } from '@activepieces/pieces-framework';
import {
  HttpRequest,
  HttpMethod,
  httpClient,
} from '@activepieces/pieces-common';
import { auth } from "./auth";

export interface KnackWebhookInformation {
  webhookId: string;
}

export type KnackAuth = {
  applicationId: string;
  apiKey: string;
}

export type KnackTriggerTypes = 'create' | 'update' | 'delete';

/**
 * This Property definition is used to populate the dropdown used
 * to select the Knack table to watch for changes.
 */
export const knackTables = Property.Dropdown({
  displayName: 'Tables',
  description: 'Pick a table to watch for changes',
  required: true,
  refreshers: [],

  async options({ auth }) {
    if (!auth) {
      return {
          disabled: true,
          placeholder: 'connect knack account',
          options: [],
      };
    }
    const authentication = auth as KnackAuth;
    const request: HttpRequest = {
      method: HttpMethod.GET,
      url: `${process.env['KNACK_URL']}/v1/objects`,
      headers: {
        'X-Knack-Application-Id': authentication.applicationId,
        'X-Knack-REST-API-Key': authentication.apiKey,
      },
    };
  
    const response = await httpClient.sendRequest<{
      objects: { name: string; key: string }[];
    }>(request);
      return {
        disabled: false,
        placeholder: 'Select Table',
        options: response.body.objects.map((object) => {
          return {
            label: object.name,
            value: object.key,
          };
        }),
      };
    },
});

/**
 * Dynamically creates a Knack trigger based on the action type.
 */
export function createTriggerKnack(type: KnackTriggerTypes) {
  const triggerNameInStore = `knack_record_trigger_${type}`;
  const typePastTense = `${type}d`;

  return createTrigger({
    auth,
    // WARN: name is used to identify the trigger in the store, changing is not recommended.
    name: `webhook-record-${type}`, 
    displayName: `Record ${type} - Webhook`,
    description: `Triggers when a record is ${typePastTense}`, 
    props: {
      table: knackTables, 
    },
    type: TriggerStrategy.WEBHOOK,

    // Run when the user enable or publish the flow.
    async onEnable(context) { 
      console.log('~~webhook enabled', type, typePastTense);
      console.log('context', JSON.stringify(context, null, 2));

      const request: HttpRequest = {
        method: HttpMethod.POST,
        url: `${process.env['KNACK_URL']}/zapier/hooks?key=${context.propsValue.table}`,
        body: {
          event: `record_${typePastTense}`,
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

    // Run when the user disables the flow or
    // the old flow is deleted after new one is published.
    async onDisable(context) { 
      console.log('~~~~~~~webhook disabled');
      console.log('context disabled!', JSON.stringify(context, null, 2));

      const response = await context.store?.get<KnackWebhookInformation>(
        triggerNameInStore
      );
      console.log(response || 'nothing');
      if (response !== null && response !== undefined && response.webhookId) {
        const url = `${process.env['KNACK_URL']}/zapier/hooks/${response.webhookId}`;
        console.log('~~webhook record url', url)

        const request: HttpRequest = {
          method: HttpMethod.DELETE,
          url,
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
}
