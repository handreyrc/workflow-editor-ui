import { Client, fetchExchange } from '@urql/svelte'

import { BASE_URLS } from '$lib/constants/url'

class GraphQLService {
  client: Client

  constructor() {
    this.client = new Client({
      url: BASE_URLS.KOGITO_GRAPHQL_URL,
      exchanges: [fetchExchange],
    })
  }
}

const graphqlService = new GraphQLService()

export { graphqlService }
