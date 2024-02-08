import { createPiece, PieceAuth, Property } from "@activepieces/pieces-framework";
import { auth } from "./lib/common/auth";

// Polling examples
// import { recordInserted } from "./lib/triggers/polling-record-inserted";
// import { recordUpdated } from "./lib/triggers/polling-record-updated";

// Action examples
import { recordCreate } from "./lib/actions/record-create";
import { recordDelete } from "./lib/actions/record-delete";
import { recordUpdate } from "./lib/actions/record-update";

// Webhook examples
import { webhookRecordCreate } from "./lib/triggers/webhook-record-create";
import { webhookRecordDelete } from "./lib/triggers/webhook-record-delete";
import { webhookRecordUpdate } from "./lib/triggers/webhook-record-update";
    
export const knack = createPiece({
  displayName: "Knack",
  auth,
  minimumSupportedRelease: '0.0.1',
  logoUrl: "https://www.knack.com/wp-content/uploads/2023/06/knack-header-logo.svg",
  authors: [],
  actions: [
    recordCreate,
    recordDelete,
    recordUpdate,
  ],
  triggers: [
    webhookRecordCreate,
    webhookRecordDelete,
    webhookRecordUpdate, 
  ],
});
    

    