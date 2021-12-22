import { useEffect, useRef, useState } from 'react';
import { shuffle } from 'lodash';
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistIdState, playListState} from '../../atoms/playlistAtom';
import { IoIosPlay, IoMdPause } from 'react-icons/io';
import useSpotify from '../../hooks/useSpotify';
import Songs from '../Songs/Songs';

import { currentTrackIdState, isPlayingState } from '../../atoms/songAtom';
import { chooseTrackState } from '../../atoms/trackAtom';
import { playerState } from '../../atoms/player';
import { getFeaturedPlaylists, getMySavedTracks } from '../../api/api';
import { mySavedTracksState } from '../../atoms/mySavedTracks';
import { colorsState } from '../../atoms/colors';
import { colorState } from '../../atoms/color';
import { currentPlayedTypeState, currentPlaylistState } from '../../atoms/currentPlaylist';

function Playlist({playlist}){

    const spotifyApi = useSpotify()
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [chooseTrack, setChooseTrack] = useRecoilState(chooseTrackState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [player, setPlayer] = useRecoilState(playerState);
    const [mySavedTracks,setMySavedTracks] = useRecoilState(mySavedTracksState);

    const [currentPlaylist, setCurrentPlaylist] = useRecoilState(currentPlaylistState);
    const [currentPlayedType, setCurrentPlayedType] = useRecoilState(currentPlayedTypeState);

    const playlistId = useRecoilValue(playlistIdState);
    // const [playList, setPlayList] = useRecoilState(playListState)

    const [colors,]= useRecoilState(colorsState)
    const [color, setColor] = useRecoilState(colorState)

    const divEaseHeader = useRef()
    const contentRef = useRef()
    const headerDivPlayButton = useRef()
    const filterHeader = useRef()

    const goToViolation = (id) =>{
        const violation = document.getElementById(id); 
        const div = contentRef.current;

        let isHidden = violation?.getBoundingClientRect().bottom;

        if(isHidden < 0 || isHidden > window.innerHeight){
            div.scrollTo({
              top:violation?.offsetTop,
              behavior:"smooth"
          });
        }
    };

    const initializeCurrentPlay = () => {
        if(!currentPlaylist || currentPlaylist?.id !== playlist?.id){
            setCurrentPlaylist(playlist);
            setCurrentPlayedType('playlist');
            
        }
       return true
    }
    const handleChooseTrack = () => { 
        
        if(initializeCurrentPlay()){

            

                if(!isPlaying || playlist.id !== currentPlaylist?.id ||  !currentPlaylist ) {
        
                    if(playlist?.id !== currentPlaylist?.id){
                        setChooseTrack(playlist?.tracks?.items[0]?.track);
                        setCurrentTrackId(playlist?.tracks?.items[0]?.track.id);
                        setCurrentPlaylist(playlist)
                    }
                    setTimeout(() => {
                        if(player?.device && !isPlaying) spotifyApi.play().then(success => { if(success)setIsPlaying(true)});
                        setIsPlaying(true)
                        
                    }, 500);
                }else if(isPlaying && playlist?.tracks?.items.findIndex((item) => item.track.id === chooseTrack.id ) != -1){
                    handlePlayPause()
                }
            

        }
        }

  
    const handlePlayPause = () =>{
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
            if(isPlaying){
                spotifyApi.pause();
                setIsPlaying(false)
            }else{
                spotifyApi.play().catch((err)=> {return {message: "No device detected"}});
                setIsPlaying(true)
            }
        }).catch((err) => console.log('no track / no device '))
    }

    useEffect(async() => {
        setColor(shuffle(colors).pop());
    }, [playlistId]);

    useEffect(() => {
        if(currentTrackId){
            goToViolation(currentTrackId)
        }
    },[currentTrackId])


    const handleScroll = () => {
        let distanceFromTop = divEaseHeader?.current.getBoundingClientRect().top;

        
        if(distanceFromTop <= 0 ) {
            filterHeader.current.style.opacity = '1'
            filterHeader.current.style.borderBottom = '1px solid rgb(50 50 50)'
            headerDivPlayButton.current.style.opacity = '1';
        ;}
        else if(distanceFromTop > 0) {
            filterHeader.current.style.opacity = '0'
            filterHeader.current.style.borderBottom = 'none';
            headerDivPlayButton.current.style.opacity = '0';
        }
    }
    useEffect(() => {
       spotifyApi.getMyDevices().then(res => console.log('res0ààààààààààà',res.body))

    }, [player?.devices])
    useEffect(() => {
        
        // if(playlist){
            setColor({gradient : '', color:'rgb(85 30 171)'});
            const div = contentRef.current;
            div.addEventListener('scroll', handleScroll);
        // }
      
    }, [])
    useEffect(() => {
        // if(currentPlaylist?.id){
        // }
       
    },[currentPlaylist])
    return (
        <>
        {playlist && 
        
        <div className="mt-[-128px] h-full-128 overflow-y-scroll scrollbar-hide flex-grow " ref={contentRef}>
              <div className="sticky flex items-center justify-start h-[64px] opacity-0 top-[64px] left-0 w-full  transition-all duration-1000 ease-in-out z-20" style={{backgroundColor: color?.color ? color?.color : ' rgb(55, 65, 81)'}} ref={filterHeader}>
                    <div className=" ml-20 flex items-center space-x-4 text-white ">
                        <div className=" ml-7 button-play h-[45px] w-[45px] bg-[#1cb854] rounded-full flex justify-center items-center shadow-md " ref={headerDivPlayButton} onClick={handleChooseTrack}>
                        {/* {isPlaying && currentPlaylist?.tracks?.items?.findIndex((item) => item.track.id === chooseTrack.id ) != -1  */}
                        {isPlaying && playlist?.id ===  currentPlaylist?.id  
                        ? <IoMdPause className="" size={28}/> 
                        : <IoIosPlay className="" size={31}/>}
                        
                        </div>
                        <span className="text-2xl font-semibold">{playlist?.name}</span>
                    </div>
                </div>
              
            <div className={`text-white flex-grow h-screen  relative`} style={{background : color?.gradiant ? color?.gradiant : 'linear-gradient(rgb(55, 65, 81), rgb(17, 24, 39), rgb(0, 0, 0))'}}>

                <section className={`flex items-end space-x-7  z-20 text-white p-8 pt-20 h-70 top-0`}>
                    <div className="h-60 w-60 min-w-[15rem] overflow-hidden shadow-2xl bg-slate-50">

                    <img className="h-full max-w-none " src={playlist?.images?.[0]?.url}/> 
                    </div>
                    <div>
                        <p className="text-sm font-light text-zinc-100 pb-3" > PLAYLISTE</p>
                            <h1 className="text-2xl md:text-3xl xl:text-5xl font-extrabold mb-5"> {playlist?.name}</h1>
                            <p className="text-sm font-light text-weight.100 text-zinc-300 pb-3">{playlist?.description}</p>
                    </div> 
                </section>
                <div className="overflow-hidden relative bg-neutral-900/60 z-10" style={{minHeight:"100%"}} ref={divEaseHeader}>
                    <div className="pb-20 mb-10 ">
                        <Songs handleChooseTrack={handleChooseTrack} tracks={playlist} typeOfTracks={'playlist'}  initializeCurrentPlay={initializeCurrentPlay} playlist={playlist}/>
                    </div>
                </div> 
            </div>
        </div>
        }
        </>
    )
}

export default Playlist
