import { createPiece, PieceAuth, Property } from "@activepieces/pieces-framework";
import { doSomething } from "./lib/actions/do-something";
import { recordInserted } from "./lib/triggers/record-inserted";
import { recordDeleteWebHook } from "./lib/triggers/record-delete-webhook";
import { recordInsertWebHook } from "./lib/triggers/record-insert-webhook";
import { recordUpdateWebHook } from "./lib/triggers/record-update-webhook";
import { recordUpdated } from "./lib/triggers/record-updated";
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
    recordDeleteWebHook, 
    recordInserted, 
    recordInsertWebHook, 
    recordUpdateWebHook, 
    recordUpdated,
  ],
});
    

    