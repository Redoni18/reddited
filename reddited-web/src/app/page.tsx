"use client"
import Navbar from '@/components/Navbar'
import { usePostsQuery } from '@/gql/grapqhql'

export default function Home() {
  const [{ data }] = usePostsQuery()
  return (
    <div className='w-full box-border dark my-4'>
      <Navbar />
      <main className='my-20'>
        <h1 className='text-3xl font-medium'>
          {!data ? <div>loading...</div> : data?.posts.map((post) => 
            <li key={post.id}>
              {post.title}
            </li>
          )}
        </h1>
      </main>
    </div>
  )
}
