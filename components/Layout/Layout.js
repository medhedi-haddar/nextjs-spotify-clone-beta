import { ExternalLinkIcon } from '@heroicons/react/solid';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { IoIosPlay, IoMdArrowDropdown, IoMdPause } from 'react-icons/io';
import { useRecoilState } from 'recoil';
import { colorState } from '../../atoms/color';
import { colorsState } from '../../atoms/colors';
import { playListState } from '../../atoms/playlistAtom';
import { isPlayingState } from '../../atoms/songAtom';
import Header from './Header';
import Player from '../Player/Player';
import Sidebar from './Sidebar';

const Layout = ({children})=> {

  const providers = children?.props?.providers;
  console.log('children?.props',children?.props)
  const router = useRouter();

  function storePathValues() {
    const storage = globalThis?.sessionStorage;

    const paths = JSON.parse(localStorage.getItem("paths"));
    if(!paths){
        localStorage.setItem("paths", JSON.stringify([router.asPath])); 
    }else{
        const sliceOfPath = paths.slice()
        if(sliceOfPath.indexOf(router.asPath) === -1) sliceOfPath.push(router.asPath);

        localStorage.setItem("paths", JSON.stringify(sliceOfPath));
    }
    

  }

  useEffect(() => storePathValues, [router.asPath]);

    return (

        <div className=" bg-black h-screen overflow-hidden">
        <Head>
          <title>Spotify-clone</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
  
        <main className="flex">
          <Sidebar/>
          <div className="overflow-y-scroll scrollbar-hide flex-grow h-screen relative bg-black">
            <Header providers={providers}/>
              {children}
          </div>
        </main>
  
        <div className="sticky bottom-0 pt-5 z-50" style={{backgroundOpacity : "0.5"}}> 
          <Player />
        </div>
      </div>
)
}
export default Layout;