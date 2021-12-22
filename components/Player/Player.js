
import { useSession } from "next-auth/react"
import { useEffect, useState, useCallback} from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../../atoms/songAtom"; 
import useSpotify from "../../hooks/useSpotify"
import { IoIosShuffle, IoIosSkipForward, IoIosSkipBackward, IoIosRepeat  } from "react-icons/io";
import { FiVolume2, FiVolume1, FiVolumeX } from "react-icons/fi"; 
import  {AiFillPauseCircle,AiFillPlayCircle} from "react-icons/ai";
import { debounce } from "lodash"; 
import SpotifyWebPlayer from "react-spotify-web-playback";
import { playListState } from "../../atoms/playlistAtom"
import { chooseTrackState } from "../../atoms/trackAtom"; 
import { playerState } from "../../atoms/player";
import { Slider } from "@mui/material";
import { currentPlayedTypeState, currentPlaylistState } from "../../atoms/currentPlaylist";
import Link from "next/link";
import RepeatIcon from '../../assets/repeatOff.svg';
import { playBackState } from "../../atoms/playBackState";
import { playerListState } from "../../atoms/playerList";

function Player() {

    // Hooks
    const spotifyApi = useSpotify();
    // Recoils
    const [shuffle,setShuffle] = useState(false)
    const [repeat,setRepeat] = useState('off')
    // const [playerList, setPlayerList] = useState(null)
    const [playerList, setPlayerList] = useRecoilState(playerListState)
    const [playBackStatus, setPlayBackStatus] = useRecoilState(playBackState);
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [chooseTrack, setChooseTrack] = useRecoilState(chooseTrackState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [player, setPlayer] = useRecoilState(playerState);
    const [playlist,] = useRecoilState(playListState);

    const [currentPlaylist, setCurrentPlaylist] = useRecoilState(currentPlaylistState);
    const [currentPlayedType, setCurrentPlayedType] = useRecoilState(currentPlayedTypeState);

    // States
    const { data : session, status } = useSession();

    const [randomTrack,setRandomTrack] = useState(false)
    // const [repeat,setRepeat] = useState(false)
    const token  = spotifyApi.getAccessToken(); 
    const [playButtonPressedCount, setPlayButtonPressedCount] = useState(0);
    const [volume, setVolume] = useState(50);

    // Functions
    const handlePlayPause = () =>{
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
            if(data?.body?.is_playing){
                spotifyApi.pause();
                setIsPlaying(false)
            }else{
                spotifyApi.play().catch((err)=> {return {message: "No device detected"}});
                setIsPlaying(true)
            }
        }).catch((err) => console.log('no track / no device '))
    }
    const handleRepeat = () =>{ 
    
        // switch (repeat) {
        //     case 'off':
        //         spotifyApi.setRepeat('context')
        //         setRepeat('context')
        //         break;
        //     case 'context':
        //         spotifyApi.setRepeat('track')
        //         setRepeat('track')
        //         break;
        //     case 'track':
        //         spotifyApi.setRepeat('off')
        //         setRepeat('off')
        //         break;
        //     default:
        //         break;
        // }
        if(repeat === 'off'){
            spotifyApi.setRepeat('context').then(() => setRepeat('context'))
            
        }
        else if(repeat === 'context'){
            spotifyApi.setRepeat('track').then(() => setRepeat('track'))
            
        }
        else if(repeat === 'track'){
            spotifyApi.setRepeat('off').then(() => setRepeat('off'))
            
        }
        
    }
    const handleShuffle = () =>{ 
        
        if(shuffle) {
            spotifyApi.setShuffle(false);
            setShuffle(false)
        }
        else{
            spotifyApi.setShuffle(true)
            setShuffle(true); 
        } 
    }
    const debouncedAdjustVolume  = useCallback(
        
        debounce((volume)=> {
            if(player?.device){
                spotifyApi.setVolume(volume).catch((err) =>{ return {massage : 'No device detected'}});
            }
        }, 500,[])
    );
    
    let trackPointer = currentPlaylist && currentPlaylist?.type === 'playlist' ?
    (
        currentPlaylist?.tracks?.items && currentPlaylist?.tracks?.items.length >= 0
        ? currentPlaylist?.tracks?.items?.findIndex((item) => item.track.id === chooseTrack.id)
        : currentPlaylist?.tracks && currentPlaylist?.tracks?.items.findIndex((item) => item.id === chooseTrack?.id))
    :(
        console.log('Components/Player.js - 87')
        // currentPlaylist?.tracks && currentPlaylist?.tracks?.length >= 0
        // ? currentPlaylist.tracks.findIndex((track) => track.id === chooseTrack.id)
        // : currentPlaylist.tracks && currentPlaylist.tracks.findIndex((track) => track.id === chooseTrack.id)
    );

    const next = () => { 
        spotifyApi.skipToNext().then((data)=> {
            
            spotifyApi.getMyCurrentPlayingTrack().then(data => console.log('MyCurrentPlayingTrack',data.body))
            // console.log('currentPlaylist', currentPlaylist)
            // console.log('ChooseTrack', chooseTrack)
            spotifyApi.getMyCurrentPlaybackState().then(data => console.log('playback state',data))
        })
    };
    const refrechPlayer = () => {
         spotifyApi.getMyCurrentPlayingTrack().then(data => {
             if(data?.body?.item) setChooseTrack(data?.body?.item)
         })

         spotifyApi.getMyCurrentPlaybackState().then(data => 
                {
                    if(data?.body){
                        setPlayBackStatus(data.body)
                    }
                }
            )
    }
    const prev = () => {
       
        spotifyApi.skipToPrevious().then((response)=> console.log('skip to next' ,response))

    };
    const handleVolume = (volumeLevel) => {
        setVolume(volumeLevel);
    }
    // UseEffects
    useEffect(() => {
        handleVolume(50);
    }, [currentTrackIdState, spotifyApi, session])

    useEffect(async () => {
        if(volume >= 0 && volume <= 100){
            debouncedAdjustVolume(volume);
        }
    }, [volume]);
    useEffect(async () => {

       if(token){
           const playerInstance = await fetch(
               `https://api.spotify.com/v1/me/player`,
               {
                   headers: { 
                       Authorization: `Bearer ${spotifyApi.getAccessToken()}`
                   }
               }
           )
           .then(res => res.json())
           .catch(err => console.error('[Custom Error] : no player existing', err.message))
   
           if(playerInstance) setPlayer(playerInstance);
          
       }

    }, [token])
    useEffect(() => {
        if(currentPlaylist){
            setPlayerList(currentPlaylist)
        }
    },[currentPlaylist])
 
    return (
        <> 
            {token && 
                <div className={`text-white bg-neutral-900 p-3 grid grid-cols-3 text-xs md:text-base px-2 md:px-8 ${chooseTrack ? '' : 'hidden'}`} > 
                    <> 
                    <div className="flex items-center space-x-4 ">
                        <div style={{position: 'absolute',display:"block" , width: '100%', top: '16px', left : 0} }> 
                            <SpotifyWebPlayer width="100%" style={{position: 'relative'} }
                                token={token}
                                styles={{
                                    activeColor: '#fff',
                                    bgColor: '#1e293b',
                                    color: '#fff',
                                    loaderColor: '#fff',
                                    sliderColor: '#1cb954',
                                    trackArtistColor: '#ccc',
                                    trackNameColor: '#fff',
                                    width : "100%",
                                    position : "absolute",
                                    sliderHandleColor : "#AAA",
                                    sliderTrackColor : "#555"
                                }}
                                play={isPlaying}
                                autoPlay={true}
                                uris={playerList?.uri ? [playerList.uri] : []}

                                callback={(state) => {
                                    // refrechPlayer()
                                    console.log('playerState',state)
                                    setIsPlaying(state.isPlaying)
                                    if(state.devices){
                                        setPlayer(state.devices[0])
                                    }
                                    if(currentPlaylist?.type==='playlist'){

                                        const  position = currentPlaylist.tracks.items.findIndex((item) => item.track.id === state.track.id )
                                       
                                        if(position >= 0){ 
                                            setChooseTrack(currentPlaylist.tracks.items[position].track);
                                            setCurrentTrackId(state.track.id)
                                        }
                                    }else if(currentPlaylist?.type==='album'){

                                        const  position = currentPlaylist.tracks.findIndex((item) => item.id === state.track.id )
                                        if(position >= 0){
                                            setChooseTrack(currentPlaylist.tracks[position]);
                                            setCurrentTrackId(state.track.id)
                                        }
                                    }
 
                                    if (!state.isPlaying) {
                                        // setIsPlaying(false)
                                        switch (currentPlayedType) {
                                            case 'playlist':
                                                if(state.progressMs === 0 && trackPointer < currentPlaylist?.tracks?.items?.length){
                                                    next();  
                                                    setIsPlaying(true) 
                                                    }
                                                break;
                                            case 'album':
                                                if(state.progressMs === 0 && trackPointer < currentPlaylist?.tracks?.length){
                                                    next();  
                                                    setIsPlaying(true) 
                                                    }
                                                break;
                                        
                                            default:
                                                break;
                                        }
                                        
                                    } 
                                }} 
                            /> 
                        </div> 
                        
                        <Link href={`/${currentPlayedType}/${currentPlaylist?.id}`} passHref >
                            <div className="flex space-x-2 items-center cursor-pointer text-gray-400 hover:text-gray-300 ">

                                <img id="image" className="hidden md:inline h-10 w-10" src={chooseTrack?.album?.images?.[0]?.url} alt={chooseTrack?.name}/>
                                <div className="truncate text-xs ">
                                    <h3>{chooseTrack?.name}</h3>
                                    <p>{chooseTrack?.artists?.[0]?.name}</p>
                                </div> 
                            </div>
                        </Link>

                    </div> 
                    <div className="flex items-center justify-evenly">
                        {/*  X Shuffle */}
                        <div className={`relative  ${shuffle ? 'shuffle' : ''}`}>
                            <IoIosShuffle className={`button-sm`} onClick={handleShuffle} />
                        </div>
                        {/*  <= Previous */}
                        <IoIosSkipBackward 
                            className="button-sm" 
                            onClick={prev}
                            opacity={trackPointer === 0 ? '0.4' : '1'}
                        />
                        {/* Play > / Pause || */}
                        {isPlaying 
                            ? (<AiFillPauseCircle  onClick={handlePlayPause} className="button button-2"/>)
                            :( <AiFillPlayCircle onClick={handlePlayPause}  className="button button-2" />)}
                        {/* Next => */}
                        <IoIosSkipForward 
                            className="button-sm" 
                            onClick={next}
                        />
                        {/* O Repeat */}
                        <div className={`relative  ${repeat}`}>
                            <IoIosRepeat className={` button-sm`} onClick={handleRepeat} />
                        </div>
                    </div> 
                    {/* Volume % */}
                    <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-4"> 
                        {(volume === 0) 
                        ?(<FiVolumeX  onClick={() => volume > 0 &&  handleVolume(volume - 10)} className="button h-4 w-4 "/>) 
                        :(<FiVolume1 onClick={() => volume > 0 &&  handleVolume(volume - 10)} className="button h-4 w-4 "/>)}
                        <Slider
                            size="small"
                            style={{width : "100px"}}
                            defaultValue={volume}
                            min={0} max={100}
                            aria-label="Small" 
                            color="primary"
                            onChange={(e) => handleVolume(Number(e.target.value))}
                            />
                        <FiVolume2 onClick={() => volume < 100 &&  handleVolume(volume + 10)} className="button h-4 w-4 "/>
                    </div>
                    </>
                </div>
             }
    </>
    )
}

export default Player
