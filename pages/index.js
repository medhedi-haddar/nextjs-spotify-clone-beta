import { getSession, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { playerState } from '../atoms/player';
import HomePage from '../components/HomePage/HomePage'
import useSpotify from '../hooks/useSpotify';
import { getProviders, signIn } from "next-auth/react"
import NoLogged from '../components/NoLogged';
import { getTopPlaylists } from '../api/api';

export default function Home() {

  const { data: session } = useSession();
  useEffect(() => {
    if(session?.token){
      getTopPlaylists()
    }
  }, [session?.user])
  return (
    <>
      {
        (session?.user) ? <HomePage />
        : <NoLogged />
      }
    </>
  )
}

export async function getServerSideProps(context){
  const session = await getSession(context);
  const providers = await getProviders();
  return {
    props : {
      session : session, 
      providers : providers,
    }
  }
}