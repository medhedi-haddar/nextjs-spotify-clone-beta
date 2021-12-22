
import { BiLibrary } from 'react-icons/bi';
import { AiFillPlusSquare } from 'react-icons/ai';
import { FiSearch } from 'react-icons/fi';
import { VscHome } from 'react-icons/vsc';
import { RssIcon, LogoutIcon,PlusSmIcon } from '@heroicons/react/outline'
import { HeartIcon } from '@heroicons/react/solid'
import { signOut, useSession} from 'next-auth/react'
import { useState, useEffect } from 'react';
import useSpotify from '../../hooks/useSpotify';
import { useRecoilState } from 'recoil';
import { playlistIdState } from '../../atoms/playlistAtom';
import Logo from '../../assets/spotify-logo.png';
import Image from 'next/image';
import { mySavedTracksState } from '../../atoms/mySavedTracks';
import Link from 'next/link';
import { myPlayListsState } from '../../atoms/myPlayListsAtom';
import { useRouter } from 'next/router';
import { FiVolume2 } from "react-icons/fi"; 
import { currentPlaylistState } from '../../atoms/currentPlaylist';

function  Sidebar() {

    const router = useRouter()
    const { id } = router.query 

    const { data : session, status } = useSession();
    const [playLists, setPlayLists] = useRecoilState(myPlayListsState);

    const [currentPlaylist,] = useRecoilState(currentPlaylistState);
    const spotifyApi = useSpotify();
    const [,setPlaylistId] = useRecoilState(playlistIdState);

    useEffect(() => {
        if(spotifyApi.getAccessToken()){
            spotifyApi.getUserPlaylists().then((data)=> {
                setPlayLists(data.body.items);
                setPlaylistId(data.body.items[0]?.id)
            });
        }

    },[session,spotifyApi])
    return (
        <div className="text-zinc-500 p-5 border-r border-zinc-900  overflow-y-scroll scrollbar-hide h-screen
        text-xs lg:text-sm  sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex min-w-[241px]">
            <div className="space-y-4">
                <div className="mb-8" >
                    <Image src={Logo} width="131" height="40"/>
                </div>
                <Link href='/' passHref >
                    <button className="flex items-center space-x-2 hover:text-white ">
                        <VscHome className="h-5 w-5"/>
                        <p>Accueil</p>
                    </button>
                </Link>
                <button className="flex items-center  space-x-2 hover:text-white ">
                    <FiSearch className="h-5 w-5"/>
                    <p>Recherche</p>
                </button>
                <button className="flex items-center  space-x-2 hover:text-white ">
                    <BiLibrary className="h-5 w-5"/>
                    <p>Bibliothèque</p>
                </button>
                <hr className="border-t-[0.1px] border-zinc-900"/>
                <button className="flex items-center  space-x-2 hover:text-white ">
                    <PlusSmIcon className="h-5 w-5   bg-zinc-300"/>
                    <p>Créer une playlist</p>
                </button>
                <Link href='/' passHref >
                <button className="flex items-center text-zinc-600 space-x-2 hover:text-white  ">
                    <HeartIcon className="h-5 w-5 p-1 bg-gradient-to-tl from-green-300 to-purple-400 hover:text-zinc-700 "/>
                    <p className="text-zinc-500">Titre likés </p>
                </button>
                </Link>
                <button className="flex items-center  space-x-2 hover:text-white ">
                    <RssIcon className="h-5 w-5"/>
                    <p>Your episodes</p>
                </button>
                <hr className="border-t-[0.1px] border-zinc-900"/>
                {playLists && playLists.map((playlist)=> (
                    <Link href={`/playlist/${playlist.id}`} passHref > 
                        <div key={playlist.id} onClick={()=> setPlaylistId(playlist.id)} className={` flex items-center justify-between cursor-pointer hover:text-white ${id === playlist.id ? 'text-white' : '' }`}>
                            {playlist.name} 
                            {currentPlaylist?.id === playlist.id ? <FiVolume2/> : ''}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Sidebar;

