
    import { createPiece, PieceAuth, Property } from "@activepieces/pieces-framework";
    import { doSomething } from "./lib/actions/do-something";
    import { triggerSomething } from "./lib/triggers/trigger-something";
    
    export const knack = createPiece({
      displayName: "Knack",
      auth: PieceAuth.None(),
    //   auth: PieceAuth.CustomAuth({
    //     description: 'Enter custom authentication details',
    //     props: {
    //         applicationId: Property.ShortText({
    //             displayName: 'Application Id',
    //             description: 'You can find your Application ID by logging into Knack and selecting one of your Apps. Click the Settings gear icon on the top of the left-hand menu panel, then select "API & Code"',
    //             required: true,
    //         }),
    //         apiKey: PieceAuth.SecretText({
    //             displayName: 'API Key',
    //             description: 'You can find your API Key directly underneath the Application ID from the previous step.',
    //             required: true
    //         })
    //     },
    //     // Optional Validation
    //     validate: async ({auth}) => {
    //       console.log('~~~~auth', auth) // props defined above are available here
    //         if (auth){
    //             return {
    //                 valid: true,
    //             }
    //         }
    //         return {
    //             valid: false,
    //             error: 'Invalid Api Key'
    //         }
    //     },
    //     required: true
    // }),
      minimumSupportedRelease: '0.0.1',
      logoUrl: "https://www.knack.com/wp-content/uploads/2023/06/knack-header-logo.svg",
      authors: [],
      actions: [doSomething],
      triggers: [triggerSomething],
    });
    

    