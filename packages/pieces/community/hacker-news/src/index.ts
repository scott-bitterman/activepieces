import { createPiece, PieceAuth } from '@activepieces/pieces-framework';
// Don't forget to add the following import.
import { fetchTopStories } from './lib/actions/fetch-top-stories';

export const hackerNews = createPiece({
  displayName: 'Hackernews Tutorial!!...',
  logoUrl: 'https://cdn.activepieces.com/pieces/hackernews.png',
  authors: [],
  auth: PieceAuth.None(),
   // Add the action here.
  actions: [fetchTopStories], // <--------
  triggers: [],
});