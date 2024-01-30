/*
export const createNewIssue = createTrigger({
  auth: PieceAuth | undefined
  name: string, // Unique name across the piece.
  displayName: string, // Display name on the interface.
description: string, // Description for the action
  triggerType: POLLING | WEBHOOK,

  props: {}; // Required properties from the user.
  // Run when the user enable or publish the flow.

onEnable: (ctx) => {};
  // Run when the user disable the flow or
  // the old flow is deleted after new one is published.
onDisable: (ctx) => {};
  
  // Trigger implementation, It takes context as parameter.
  // should returns an array of payload, each payload considered
  // a separate flow run.
  run: async run(ctx): unknown[] => {}
})
*/
import { createTrigger, Property, PieceAuth, TriggerStrategy } from "@activepieces/pieces-framework";

export const triggerSomething = createTrigger({
  auth: undefined,
  name: 'knack-trigger', // Unique name across the piece.
  displayName: 'knack-trigger', // Display name on the interface.
  description: 'knack-trigger', // Description for the action
  type: TriggerStrategy.POLLING,

  props: {}, // Required properties from the user.


  // Run when the user enable or publish the flow.
  onEnable: async () => { },
  // Run when the user disable the flow or
  // the old flow is deleted after new one is published.
  onDisable: async () => { },

  // Trigger implementation, It takes context as parameter.
  // should returns an array of payload, each payload considered
  // a separate flow run.
  run: async () => [],
  sampleData: {
    _id: '5f5e3e3e3e3e3e3e3e3e3e3e',
    value: 'hello world',
  }
})
