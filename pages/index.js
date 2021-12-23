import { getSession, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { playerState } from '../atoms/player';
import HomePage from '../components/HomePage/HomePage'
import useSpotify from '../hooks/useSpotify';
import { getProviders, signIn } from "next-auth/react"
import NoLogged from '../components/NoLogged';
import { getTopPlaylists } from '../api/api';

export default function Home({providers,session}) {

  // const { data: session } = useSession();
  // useEffect(() => {
  //   if(session?.token){
  //     getTopPlaylists()
  //   }
  // }, [session?.user])
  console.log('providers',providers)
  console.log('process.env.NEXTAUTH_URL',process.env.NEXTAUTH_URL)
  console.log('process.env.NEXT_PUBLIC_CLIENT_SECRET',process.env.NEXT_PUBLIC_CLIENT_SECRET)
  console.log('process.env.NEXT_PUBLIC_CLIENT_ID',process.env.NEXT_PUBLIC_CLIENT_ID)
  console.log('process.env.JWT_SECRET',process.env.JWT_SECRET)
  return (
    <>
      {
        (session?.user) ? <HomePage />
        : 
          <NoLogged/>
        // providers && Object.values(providers).map((provider) => (
         
        //   <div key={provider.name} className={` flex justify-end items-center top-0 right-0 px-5 py-3 z-30 w-[100%] bg-zinc-900`} >

        //       <div  onClick={() => signIn(provider.id, { callbackUrl : "/"})} type="button" 
        //       className="flex relative width-w-screen items-center spaces-x-3 bg-white  hover:opacity-80 cursor-pointer rounded-full px-4 py-2"
        //       id="menu-button" aria-expanded="true" aria-haspopup="true" >
        //           Connexion   
        //       </div>
        //   </div>
        // ))
      }
    </>
  )
}

export async function getServerSideProps(context){
  const session = await getSession(context);
  const providers = await getProviders();
  return {
    props : {
      providers,
      session
    }
  }
}