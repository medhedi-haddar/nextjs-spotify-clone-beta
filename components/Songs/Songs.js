import { useEffect, useState } from "react";
import { IoIosPlay, IoMdPause, IoIosTimer } from "react-icons/io";
import { constSelector, useRecoilState, useRecoilValue } from "recoil"
import { currentPlayedTypeState, currentPlaylistState } from "../../atoms/currentPlaylist";
import { playListState } from "../../atoms/playlistAtom"
import { currentTrackIdState, isPlayingState } from "../../atoms/songAtom";
import { chooseTrackState } from "../../atoms/trackAtom";

import Song from "./Song";

function Songs({handleChooseTrack,tracks,typeOfTracks , initializeCurrentPlay,playlist}){

    const [chooseTrack, setChooseTrack] = useRecoilState(chooseTrackState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [currentPlaylist, setCurrentPlaylist] = useRecoilState(currentPlaylistState);
    const [currentPlayedType, setCurrentPlayedType] = useRecoilState(currentPlayedTypeState);
  
    return (
   
       
        <div className=" px-[32px] flex flex-col space-y-1 pb-3  text-white overflow-y-scroll scrollbar-hide relative">

            <div className="py-5">
                <div className="button-play h-[56px] w-[56px] bg-[#1cb854] rounded-full flex justify-center items-center shadow-md" onClick={handleChooseTrack}>
                {/* {isPlaying && currentPlaylist?.tracks?.items?.findIndex((item) => item.track.id === chooseTrack.id ) != -1  */}
                {isPlaying && playlist?.id ===  currentPlaylist?.id 
                ? <IoMdPause className=" text-white" size={30}/> 
                : <IoIosPlay className=" text-white" size={35}/>}
                 
                </div>
            </div>
            <div className={`grid grid-cols-2 text-sm text-gray-500 border-b border-zinc-600 py-1  px-4 sticky top-0 font-light uppercase` }> 
                <div className={`flex items-center space-x-4 `} >
                    <p className="w-3 text-center"> #</p>
                    
                    <div>
                        <p className="w-36 lg:w-64 ">Titre</p>
                    </div>
                </div>
                <div className="flex items-center justify-between ml-auto md:ml-0 ">
                    <p className="w-40 hidden truncate md:inline text-left"> Album</p>
                    <p className="w-40 text-right flex items-center justify-end"> <IoIosTimer className="mr-3"/>Durée</p>
                    
                </div>
            </div>
            <div className="py-3">

            {
             (typeOfTracks === 'playlist') ?
            tracks?.tracks?.items.map((track, index) => (
                <Song 
                    key={track?.track.id+index} 
                    order={index} 
                    track={track} 
                    typeOfTrack={typeOfTracks} 
                    initializeCurrentPlay={initializeCurrentPlay} 
                    playlist={playlist}
                    handleChooseTrack={handleChooseTrack}
                    />
                ))
            : 
            tracks.tracks.map((track, index) => (
                <Song 
                    key={track?.id+index} 
                    order={index} 
                    track={track} 
                    typeOfTrack={typeOfTracks} 
                    initializeCurrentPlay={initializeCurrentPlay} 
                    playlist={playlist}
                    handleChooseTrack={handleChooseTrack}
                />        
                ))
            }
            </div>
        </div>
       
    )
}

export default Songs
