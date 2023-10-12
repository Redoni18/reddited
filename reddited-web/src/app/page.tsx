"use client"
import Navbar from '@/components/Navbar'
import React from 'react';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '@/lib/createUrqlClient';
import { usePostsQuery } from '@/gql/grapqhql';


function Home() {
  const [{ data }] = usePostsQuery()
  return (
    <main>
      <div className='w-full box-border dark my-4'>
      <Navbar />
      <main className='my-20'>
        home
      </main>
    </div>
      <h1 className='text-3xl font-medium'>
        {!data ? <div>loading...</div> : data?.posts.map((post) => 
          <li key={post.id}>
            {post.title}
          </li>
        )}
      </h1>
    </main>
  );
}

export default withUrqlClient(createUrqlClient) (Home) 