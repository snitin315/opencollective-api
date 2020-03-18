import { GraphQLString, GraphQLInt, GraphQLInputObjectType } from 'graphql';
import models from '../../../models';
import { idDecode, IDENTIFIER_TYPES } from '../identifiers';
import { NotFound } from '../../errors';

/**
 * An input for referencing ConnectedAccounts.
 */
export const ConnectedAccountReferenceInput = new GraphQLInputObjectType({
  name: 'ConnectedAccountReferenceInput',
  fields: {
    id: {
      type: GraphQLString,
      description: 'The public id identifying the connected account (ie: dgm9bnk8-0437xqry-ejpvzeol-jdayw5re)',
    },
    legacyId: {
      type: GraphQLInt,
      description: 'The internal id of the account (ie: 580)',
      deprecationReason: '2020-01-01: should only be used during the transition to GraphQL API v2.',
    },
  },
});

export const fetchConnectedAccountWithReference = async (input, { throwIfMissing } = {}) => {
  let connectedAccount;
  if (input.id) {
    const id = idDecode(input.id, IDENTIFIER_TYPES.CONNECTED_ACCOUNT);
    connectedAccount = await models.ConnectedAccount.findByPk(id);
  } else if (input.legacyId) {
    connectedAccount = await models.ConnectedAccount.findByPk(input.legacyId);
  } else {
    throw new Error('Please provide an id or a legacyId');
  }
  if (!connectedAccount && throwIfMissing) {
    throw new NotFound({ message: 'ConnectedAccount Not Found' });
  }
  return connectedAccount;
};
