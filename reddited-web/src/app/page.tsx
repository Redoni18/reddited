import Navbar from '@/components/Navbar'
import Head from 'next/head';
import { PostsDocument, PostsQuery, } from '@/gql/grapqhql'
import React from 'react';
import { cacheExchange, createClient, fetchExchange, ssrExchange } from '@urql/core';
import { registerUrql } from '@urql/next/rsc';

const isServerSide = typeof window === 'undefined';

const ssr = ssrExchange({
  isClient: !isServerSide,
  initialState: {}
});

const makeClient = () => {
  return createClient({
    url: 'https://trygql.formidable.dev/graphql/basic-pokedex',
    exchanges: [cacheExchange, fetchExchange, ssr],
  });
};

const { getClient } = registerUrql(makeClient);

export default async function Home() {
  const result = await getClient().query(PostsDocument, {});
  console.log(result)
  return (
    <main>
      <div className='w-full box-border dark my-4'>
      <Navbar />
      <main className='my-20'>
        home
      </main>
    </div>
      <ul>
        {result.data.pokemons.map((x: any) => (
          <li key={x.id}>{x.name}</li>
        ))}
      </ul>
    </main>
  );
}