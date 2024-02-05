import { Property } from '@activepieces/pieces-framework';
import {
  HttpRequest,
  HttpMethod,
  httpClient,
} from '@activepieces/pieces-common';
export interface KnackWebhookInformation {
  webhookId: string;
}

export type KnackAuth = {
  applicationId: string;
  apiKey: string;
}

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