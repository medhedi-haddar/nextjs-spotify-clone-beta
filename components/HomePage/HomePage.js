import Image from "next/image";
import { useEffect, useRef, useState } from "react"
import { useRecoilState } from "recoil";
import { getFeaturedPlaylists, getMyRecentlyPlayedTracks, getMyTopTracks, getPlaylist } from "../../api/api";
import { featuredPlaylistsState } from "../../atoms/featuredPlaylists";
import { myPlayListsState } from "../../atoms/myPlayListsAtom";
import { IoIosPlay, IoIosTimer } from "react-icons/io";
import LikedIcon from '../../assets/likedIicon.png'
import { myRecentlyPlayedTracksState } from "../../atoms/myRecentlyPlayedTracks";
import { myTopTracksState } from "../../atoms/myTopTracks";
import Link from "next/link";
import { currentPlaylistState } from "../../atoms/currentPlaylist";
import { playerListState } from "../../atoms/playerList";
import { playerState } from "../../atoms/player";
import { isPlayingState } from "../../atoms/songAtom";

function HomePage(){
    
    const [featuredPlaylists, setFeaturedPlaylists] = useRecoilState(featuredPlaylistsState)
    const [recentlyPlayedTracks, setRecentlyPlayedTracks] = useRecoilState(myRecentlyPlayedTracksState)
    const [topTracksState, setTopTracksState] = useRecoilState(myTopTracksState)
    const [currentPlaylist, setCurrentPlaylist] = useRecoilState(currentPlaylistState);
    const [playerList, setPlayerList] = useRecoilState(playerListState)
    const [myPlaylists,] = useRecoilState(myPlayListsState)
    const [player, setPlayer] = useRecoilState(playerState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    
    const [widthContent, setWidthContent] = useState(0);
    const contentRef = useRef()

    useEffect(async () =>{
        const datafeaturedPlaylists = await getFeaturedPlaylists();
        const dataRecentlyPlayedTracks = await getMyRecentlyPlayedTracks()
        const dataTopTracks = await getMyTopTracks();
        console.log('dataRecentlyPlayedTracks', dataRecentlyPlayedTracks)
        setTopTracksState(dataTopTracks);
        setRecentlyPlayedTracks(dataRecentlyPlayedTracks)
        setFeaturedPlaylists(datafeaturedPlaylists)
    },[currentPlaylist]) 

    useEffect(() => {
        setWidthContent(contentRef?.current?.offsetWidth);
    },[contentRef?.current?.offsetWidth]) 
    
    const initializeCurrentPlay = (playlist) => {
        if(!currentPlaylist || currentPlaylist?.id !== playlist?.id){
            setCurrentPlaylist(playlist);
        }
       return true
    }
    const handleChooseTrack = (playlist) => { 

        if(initializeCurrentPlay(playlist)){

            if(!isPlaying || playlist.id !== currentPlaylist?.id ||  !currentPlaylist ) {
    
                if(playlist?.id !== currentPlaylist?.id){
                    setCurrentPlaylist(playlist)
                }
                setTimeout(() => {
                    if(player?.device && !isPlaying) spotifyApi.play().then(success => { if(success)setIsPlaying(true)});
                    setIsPlaying(true)
                    
                }, 500);
            }else if(isPlaying && currentPlaylist?.id === playlist.id){
                handlePlayPause()
            }

        }
        }

    const handleany = async (playlist) => {
        const playlistId = playlist?.id;
        const playlistContent = await getPlaylist(playlistId)
        if(playlistContent) {
            handleChooseTrack(playlistContent)
        }
        console.log('any................................................................',playlistContent)
    }
    return (
        <>
            <div className="h-full overflow-y-scroll scrollbar-hide  mt-[-64px] flex-grow text-white " ref={contentRef}> 
                <div className="relative">
                    <div className="absolute min-h-full bg-gradient-to-b  w-full from-violet-700/60 via-black to-zinc-900/70 z-1"></div>
                    <div className="pb-12 relative pt-[128px] px-5 ">
                    {/* Playlists */}
                        <div className="mb-9">
                            <h1 className="flex flex-wrap justify-between  items-center text-3xl font-extrabold">Bonsoir</h1>
                            <div className="flex flex-wrap mt-6">
                                {myPlaylists && 
                                myPlaylists?.slice(0,5).map((playlist) =>(
                                    <>
                                    
                                   
                                    <div className="relative flex h-20 w-80 min-w-80 m-2 shadow-xl  text-white cursor-pointer">
                                        <div className="h-20 min-w-20 w-20   overflow-hidden bg-zinc-800 shadow-[10px_2px_10px_-6px_rgba(0,0,0,1)] rounded-tl rounded-bl">
                                            <img src={playlist?.images[0]?.url} className="h-20 min-w-fit"/>
                                        </div>
                                        <div className=" play-opacity-handler flex justify-between grow items-center  p-4 text-sm text-gray-200 font-semibold bg-zinc-800/70 
                                        transition-all duration-500 ease-in-out hover:bg-zinc-700 rounded-br rounded-tr cursor-pointer">
                                            <div className="">
                                                <a>{playlist.name}</a>
                                            </div>
                                            <div className=" home-playlist play-opacity-depended ml-7 button-play min-h-[45px] min-w-[45px] opacity-0 transition-opacity duration-500 ease-in-out bg-[#1cb854] rounded-full flex justify-center items-center shadow-[0_8px_8px_rgb(0,0,0,0.3)]" >
                                                <IoIosPlay size={31} onClick={() => handleany(playlist)}/>
                                            </div>
                                        </div>
                                        {/* <div className="home-playlist-link  absolute bg-black/30  w-full h-full ">
                                            <Link href={`/playlist/${playlist.id}`} >
                                                    <div className="w-full h-full "></div>
                                            </Link>
                                        </div> */}
                                    </div>
                                    </>
                                ))
                                } 
                                <div className=" flex h-20 w-80 min-w-80 m-2 shadow-xl  text-white  cursor-pointer">
                                    <div className="h-20 w-20 overflow-hidden bg-zinc-800 shadow-xl rounded-tl rounded-bl">
                                        <Image src={LikedIcon} className="h-20 min-w-fit"/>
                                    </div>
                                    <div className=" play-opacity-handler flex justify-between  items-center grow p-4 text-sm text-gray-200 font-semibold bg-zinc-800/70 
                                    transition-all duration-500 ease-in-out hover:bg-zinc-700 rounded-br rounded-tr cursor-pointer">
                                        <a>Titres likés</a>
                                        <div className="play-opacity-depended ml-7 button-play min-h-[45px] min-w-[45px] opacity-0 transition-opacity duration-500 ease-in-out bg-[#1cb854] rounded-full flex justify-center items-center shadow-[0_8px_8px_rgb(0,0,0,0.3)]" >
                                            <IoIosPlay size={31}/>
                                        </div>
                                    </div>
                                </div> 
                            </div>
                        </div>
                        {/* recentrly played */}
                        <div className="mb-9">
                            <h1 className="flex flex-wrap justify-between  items-center text-3xl font-extrabold">Écoutés récemment</h1>
                            <div className="grid grid-flow-col auto-cols-max gap-8 mt-6">
                                {recentlyPlayedTracks && 
                                recentlyPlayedTracks.items?.slice(0, Math.round(widthContent/225)).map((playlist) =>(
                                    <div className=" relative flex justify-center flex-col  w-[201px] min-w-[201px]  shadow-[0_8px_24px_0px_rgba(0,0,0,0.5)]  shadow-black text-white bg-zinc-800/30 transition-all duration-500 ease-in-out hover:bg-zinc-900 p-4 mb-7 play-opacity-handler rounded play2-opacity-position-handler cursor-pointer">
                                    
                                        <div className=" absolute play2-opacity-position-depended min-h-[45px] min-w-[45px]  button-play  transition-all duration-500 ease-in-out bg-[#1cb854] rounded-full flex justify-center items-center shadow-[0_8px_8px_rgb(0,0,0,0.5)]" >
                                            <IoIosPlay size={31}/>
                                        </div>

                                        <div className=" w-content overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.5)] rounded-sm ">
                                            <img src={playlist.track.album.images[0].url} className=" "/>
                                        </div>
                                        <div className=" grow pt-4 text-sm text-gray-200 font-semibold  rounded-br rounded-tr cursor-pointer">
                                            <a>{playlist.track.name}</a>
                                            <p className="text-gray-400 text-xs font-light mt-2" >{playlist.track.album.artists[0].name}</p>
                                        </div>
                                    </div>
                                ))
                                } 
                            </div>
                        </div> 
                        {/*  my Tops Tracks */}
                        
                        <div className="mb-9">
                            <h1 className="flex flex-wrap justify-between  items-center text-3xl font-extrabold">Vos mix préférés</h1>
                            <div className="grid grid-flow-col auto-cols-max gap-8 mt-6">
                                {topTracksState && 
                                topTracksState.items?.slice(0, Math.round(widthContent/225)).map((topMix) =>(
                                    <Link href={`/album/${topMix.album.id}`} passHref >
                                    <div className=" relative flex justify-center flex-col  w-[201px] min-w-[201px]  shadow-[0_8px_24px_0px_rgba(0,0,0,0.5)]   text-white bg-zinc-800/30 
                                    transition-all duration-500 ease-in-out hover:bg-zinc-900 p-4 mb-7 play-opacity-handler rounded play2-opacity-position-handler cursor-pointer">
                                    
                                        <div className=" absolute play2-opacity-position-depended min-h-[45px] min-w-[45px]  button-play  transition-all duration-500 ease-in-out bg-[#1cb854] rounded-full flex justify-center items-center shadow-[0_8px_8px_rgb(0,0,0,0.5)]" >
                                            <IoIosPlay size={31}/>
                                        </div>

                                        <div className=" w-content overflow-hidden shadow-[0_8px_24px_rgb(0,0,0,0.5)] rounded-sm">
                                            <img src={topMix.album.images[0].url} className=" "/>
                                        </div>
                                        <div className=" grow pt-4 text-sm text-gray-200 font-semibold  rounded-br rounded-tr cursor-pointer">
                                            <a>{topMix.album.name}</a>
                                            <p className="text-gray-400 text-xs font-light mt-2" >{topMix.album.artists[0].name}</p>
                                        </div>
                                    </div>
                                    </Link>
                                ))
                                } 
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomePage 