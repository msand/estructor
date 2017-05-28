// @flow
import { defineMessages } from 'react-intl';

const messages = defineMessages({
  'auth/email-already-in-use': {
    defaultMessage: `The new user account cannot be created because the
      specified email address is already in use.`,
    id: 'firebase.error.EMAIL_TAKEN',
  },
  'auth/invalid-email': {
    defaultMessage: 'The specified email is not a valid email.',
    id: 'firebase.error.INVALID_EMAIL',
  },
  'auth/user-not-found': {
    defaultMessage: 'The specified user account does not exist.',
    id: 'firebase.error.INVALID_USER',
  },
  'auth/wrong-password': {
    defaultMessage: 'The specified user account password is incorrect.',
    id: 'firebase.error.INVALID_PASSWORD',
  },
  'auth/network-request-failed': {
    defaultMessage: 'No internet connection.',
    id: 'firebase.error.auth/network-request-failed',
  },
  'auth/too-many-requests': {
    defaultMessage: 'Too many requests. Try it later, please.',
    id: 'firebase.error.auth/too-many-requests',
  },
  'auth/user-token-expired': {
    defaultMessage: 'Your credential has expired. Please sign in.',
    id: 'firebase.error.auth/user-token-expired',
  },
});

export default messages;
