import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <div className='w-full box-border dark my-4'>
      <nav className='mx-auto bg-slate-900 rounded-md'>
        <Navbar />
      </nav>
      <main className='my-20'>
        <h1 className='text-3xl font-medium'>
          This is the where the main content goes
        </h1>
      </main>
    </div>
  )
}
