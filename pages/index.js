import Head from 'next/head';
import Sidebar from '../components/Sidebar';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Whatsapp 2.0</title>
        <link rel="icon" href="http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png" />
      </Head>

      <Sidebar />
      
    </div>
  )
}
