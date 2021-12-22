
import { useRecoilState, useRecoilValue } from "recoil";
import { currentTrackIdState, isPlayingState } from "../../atoms/songAtom";
import useSpotify from "../../hooks/useSpotify";
import { convertTimeStampToTime } from "../../lib/time";
import Equalizer from '../../assets/Equalizer.gif'
import Image from "next/image";
import { chooseOffsetState, chooseTrackState } from "../../atoms/trackAtom";
import { playListState } from "../../atoms/playlistAtom";
import { playerState } from "../../atoms/player";
import { HeartIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import { BsSpotify } from "react-icons/bs";
import { currentPlaylistState } from "../../atoms/currentPlaylist";
import { getTopPlaylists } from "../../api/api";


function Song({ order, track, typeOfTrack, playlist}) {
    const spotifyApi = useSpotify()
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [chooseTrack, setChooseTrack] = useRecoilState(chooseTrackState);
    const [player, setPlayer] = useRecoilState(playerState);
    const [currentPlaylist, setCurrentPlaylist] = useRecoilState
    
    (currentPlaylistState);
    const [trackInfos , setTRackInfos] = useState({
        trackId : '',
        trackImage : '',
        trackName : '',
        trackDuration_ms : '',
        ready : false
    })
    // const handleChooseTrack = () => { 
    //     initializeCurrentPlay()
    //     switch (typeOfTrack) {
    //         case 'album':
    //             setChooseTrack(track);
    //             setCurrentTrackId(track.id);
    //             setIsPlaying(true); 
    //             break;
            
    //         default:
    //             setChooseTrack(track.track);
    //             setCurrentTrackId(track.track.id);
    //             setIsPlaying(true);
    //     }
    //     setTimeout(() => {
    //         if(player) spotifyApi.play();
    //     }, 500);
        
    // }

    const playSong = () => {
        setChooseTrack(track.track);
        setCurrentTrackId(track.track.id);
        setIsPlaying(true); 
        setTimeout(() => {
            spotifyApi.play();
        }, 500);
    };

    useEffect(() => {
       switch (typeOfTrack) {
           case 'playlist':
               setTRackInfos({
                trackId : track?.track?.id,
                trackImage : track?.track?.album.images[0].url,
                trackName : track?.track?.name,
                trackAlbumName : track?.track?.album.name,
                trackArtistName : track?.track?.artists[0]?.name,
                trackDuration_ms : track?.track?.duration_ms,
                ready : true  
               })
               break;

               case 'album':
                setTRackInfos({
                 trackId : track?.id,
                 trackImage : track?.album ?track?.album?.images[0].url : '',
                 trackName : track?.name,
                 trackAlbumName : 'track',
                 trackArtistName : track?.artists[0]?.name,
                 trackDuration_ms : track?.duration_ms,
                 ready : true  
                })
                break;
        
           default:
               break;
       }
    }, [track])
    const choose = () =>{

        if(playlist.id != currentPlaylist.id){
            setCurrentPlaylist(playlist)
            currentPlaylist = playlist;
        }
        const  position =  currentPlaylist &&
        (
            currentPlaylist?.type === 'playlist' ? 
            currentPlaylist?.tracks?.items?.findIndex((item) => item.track.id === track.track.id )
            : 
            currentPlaylist?.tracks?.findIndex((item) => item.id === track.id )
        )
        console.log('position',position)
        if(currentPlaylist?.uri && position >= 0){
            spotifyApi.play({
                "context_uri": `${currentPlaylist?.uri}`,
            "offset": {
              "position": position
            },
            "position_ms": 0
          }).then(()=>{
                if(currentPlaylist?.type==='playlist'){
                    setChooseTrack(track.track)
                    setCurrentTrackId(track?.track?.id);
                }
                else{
                    setChooseTrack(track);
                    setCurrentTrackId(track.id)
                }
          })
        }
        
    }
    const pick = () =>{
       
    }
    const initializPlaylist = ()=>{
        // setCurrentPlaylist(playlist)
        // choose()
    }
    useEffect(() => {
       initializPlaylist()
    }, [chooseTrack])
    return (
        <>
         
        { trackInfos.ready &&

        <div className={`grid grid-cols-2 text-sm font-light py-2 px-4 rounded-sm hover:bg-zinc-900 cursor-pointer text-zinc-400 ` }
        // onClick={playSong}
        // onClick={handleChooseTrack}
        onClick={choose}
        id={trackInfos.trackId}
        > 
            <div className={`flex items-center space-x-4 `} >
                {(currentTrackId === trackInfos.trackId && isPlaying === true ) ? (
                    <Image src={Equalizer} width="15" height="15"/>
                ) : (
                    <p className="w-3 text-center"> {order + 1}</p>
                )}
                {trackInfos.trackImage ? <img className="w-10 h-10" src={trackInfos.trackImage}/> : <BsSpotify size="20" className="w-10 h-10 p-2 bg-black" color="gray" /> }
                
                <div>
                    <p className={`w-36 lg:w-64 text-white truncate ${(currentTrackId === trackInfos.trackId && isPlaying === true) ? 'text-[#1cb854]' : ''}`}>{trackInfos.trackName}</p>
                    <p>{trackInfos.trackArtistName}</p>
                </div>
            </div>
            <div className="flex items-center justify-between ml-auto md:ml-0 ">
                <p className=" w-40 hidden truncate md:inline ">{trackInfos.trackAlbumName}</p>
                
                <div className="flex justify-between items-center pr-6">
                {/* {track.track.explicit && <HeartIcon className="h-5 w-5 text-[#1cb854]"/>} */}
                <p className="ml-6"> {convertTimeStampToTime(trackInfos.trackDuration_ms)}</p>
                </div>
            </div>
        </div>
        }
        </>
    )
}

export default Song;