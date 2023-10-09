"use client"

import { Client, Provider, cacheExchange, fetchExchange } from 'urql';


const client = new Client({
  url: 'http://localhost:8000/graphql',
  exchanges: [cacheExchange, fetchExchange],
});

export const UrlqWrapper = ({ children }: React.PropsWithChildren) => (
  <Provider value={client}>
    {children}
  </Provider>
);