"use client"

import { Client, Provider, fetchExchange } from 'urql';
import { Cache, QueryInput, cacheExchange } from '@urql/exchange-graphcache';
import { LoginMutation, MeDocument, MeQuery, RegisterMutation } from '@/gql/grapqhql';

export function betterUpdateQuery<Result, Query>(
    cache: Cache,
    qi: QueryInput,
    result: any,
    fn: (r: Result, q: Query) => Query
) {
    return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}
    
const client = new Client({
    url: 'http://localhost:8000/graphql',
    exchanges: [cacheExchange({
    updates: {
        Mutation: {
            login: (_result, args, cache, info) => {
                betterUpdateQuery<LoginMutation, MeQuery>(
                    cache,
                    { query: MeDocument },
                    _result,
                    (result, query) => {
                    if (result.login.errors) {
                        return query;
                    } else {
                        return {
                            user: result.login.user,
                        };
                    }
                    }
                );
            },
            register: (_result, args, cache, info) => {
                betterUpdateQuery<RegisterMutation, MeQuery>(
                    cache,
                    { query: MeDocument },
                    _result,
                    (result, query) => {
                    if (result.register.errors) {
                        return query;
                    } else {
                        return {
                            user: result.register.user,
                        };
                    }
                    }
                );
            },
        }
    }
    }), fetchExchange],
    fetchOptions: {
        credentials: "include"
    }
});

export const UrlqWrapper = ({ children }: React.PropsWithChildren) => (
  <Provider value={client}>
    {children}
  </Provider>
);