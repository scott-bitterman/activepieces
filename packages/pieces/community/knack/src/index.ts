import { createPiece, PieceAuth, Property } from "@activepieces/pieces-framework";
import { doSomething } from "./lib/actions/do-something";
// Polling examples
// import { recordInserted } from "./lib/triggers/polling-record-inserted";
// import { recordUpdated } from "./lib/triggers/polling-record-updated";
import { webhookRecordCreate } from "./lib/triggers/webhook-record-create";
import { webhookRecordDelete } from "./lib/triggers/webhook-record-delete";
import { webhookRecordUpdate } from "./lib/triggers/webhook-record-update";

// import { recordInsertWebHook } from './lib/triggers/OLDwebhook-record-create'
// import { recordDeleteWebHook } from "./lib/triggers/OLDwebhook-record-delete";
// import { recordUpdateWebHook } from "./lib/triggers/OLDwebhook-record-update";
import { auth } from "./lib/common/auth";
    
export const knack = createPiece({
  displayName: "Knack",
  auth,
  minimumSupportedRelease: '0.0.1',
  logoUrl: "https://www.knack.com/wp-content/uploads/2023/06/knack-header-logo.svg",
  authors: [],
  actions: [
    doSomething,
  ],
  triggers: [
    // Polling examples
    // recordInserted, 
    // recordUpdated, 
    webhookRecordCreate,
    webhookRecordDelete,
    webhookRecordUpdate, 
    // recordInsertWebHook,
    // recordDeleteWebHook, 
    // recordUpdateWebHook, 
  ],
});
    

    