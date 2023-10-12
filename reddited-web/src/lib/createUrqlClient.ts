import { cacheExchange } from "@urql/exchange-graphcache";
import { fetchExchange } from "urql";
import { betterUpdateQuery } from "./betterUpdateQuery";
import { LoginMutation, MeDocument, MeQuery, RegisterMutation } from "@/gql/grapqhql";

export const createUrqlClient = (_ssrExchange: any) => ({
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
    }), _ssrExchange, fetchExchange],
    fetchOptions: {
        credentials: "include" as const
    }
});