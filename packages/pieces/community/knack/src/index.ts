import { createPiece, PieceAuth, Property } from "@activepieces/pieces-framework";
import { doSomething } from "./lib/actions/do-something";
import { triggerSomething } from "./lib/triggers/trigger-something";
import { auth } from "./lib/common/auth";
    
export const knack = createPiece({
  displayName: "Knack",
  auth,
  // auth: PieceAuth.None(),
  minimumSupportedRelease: '0.0.1',
  logoUrl: "https://www.knack.com/wp-content/uploads/2023/06/knack-header-logo.svg",
  authors: [],
  actions: [doSomething],
  triggers: [triggerSomething],
});
    

    