import { createPiece, PieceAuth } from '@activepieces/pieces-framework';
import { PieceCategory } from '@activepieces/shared';
import { generatePassword } from './lib/actions/generate-password';
import { hashText } from './lib/actions/hash-text';

export const Crypto = createPiece({
  displayName: 'Crypto',
  auth: PieceAuth.None(),
  minimumSupportedRelease: '0.9.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/crypto.png',
  categories: [PieceCategory.CORE],
  authors: ['AbdullahBitar'],
  actions: [hashText, generatePassword],
  triggers: [],
});
