import Navbar from '@/components/Navbar'
import React from 'react';


export default async function Home() {
  return (
    <main>
      <div className='w-full box-border dark my-4'>
      <Navbar />
      <main className='my-20'>
        home
      </main>
    </div>
      {/* <ul>
        {result.data.pokemons.map((x: any) => (
          <li key={x.id}>{x.name}</li>
        ))}
      </ul> */}
    </main>
  );
}