import { PieceAuth, createPiece } from '@activepieces/pieces-framework';
import { PieceCategory } from '@activepieces/shared';
import { readConnection } from './lib/actions/read-connection';

export const connections = createPiece({
  displayName: 'Connections',
  minimumSupportedRelease: '0.5.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/connections.png',
  categories: [PieceCategory.CORE],
  auth: PieceAuth.None(),
  authors: ['abuaboud'],
  actions: [readConnection],
  triggers: [],
});
