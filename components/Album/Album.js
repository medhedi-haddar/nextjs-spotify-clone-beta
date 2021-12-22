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

function Album({album}){
    
    console.log(album);
    const spotifyApi = useSpotify()
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [chooseTrack, setChooseTrack] = useRecoilState(chooseTrackState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [player, setPlayer] = useRecoilState(playerState);
    const [mySavedTracks,setMySavedTracks] = useRecoilState(mySavedTracksState);
    const [currentPlaylist, setCurrentPlaylist] = useRecoilState(currentPlaylistState);
    const [currentPlayedType, setCurrentPlayedType] = useRecoilState(currentPlayedTypeState);

    const divEaseHeader = useRef()
    const contentRef = useRef()
    const headerDivPlayButton = useRef()
    const filterHeader = useRef()

    const [colors,]= useRecoilState(colorsState)
    const [color, setColor] = useRecoilState(colorState)

    

    const playlistId = useRecoilValue(playlistIdState);
    const [playList, setPlayList] = useRecoilState(playListState)

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
        if(!currentPlaylist || currentPlaylist?.id !== album.id){
            setCurrentPlaylist(album);
            setCurrentPlayedType('album');
        }
    }

    const handleChooseTrack = () => { 
        initializeCurrentPlay()
        // if(!currentPlaylist || currentPlaylist?.id !== album.id){
        //     setCurrentPlaylist(album);
        //     setCurrentPlayedType('album');
        // }

        // if( Object.keys(currentPlaylist).length){
            // console.log('currentPlaylist ----',currentPlaylist)
            // console.log('currentPlaylistType ++',currentPlayedType)
            // if(!isPlaying || album?.tracks.findIndex((track) => track.id === chooseTrack.id ) === -1) {
            if(!isPlaying || album?.id !== currentPlaylist.id ) {

                if(album?.id !== currentPlaylist.id  ){
                    setChooseTrack(album?.tracks[0]);
                    setCurrentTrackId(album?.tracks[0]?.id);
                }
                setTimeout(() => {
                    if(player.devices && !isPlaying) spotifyApi.play();
                    setIsPlaying(true);
                }, 500);
            }else if(isPlaying && album.tracks.findIndex((track) => track.id === chooseTrack.id ) != -1){
                console.log('album handle playypause')
                handlePlayPause() 
            }
        // }
    }
    useEffect(() => {
        console.log('currentPlaylist ----',currentPlaylist)
        console.log('currentPlaylistType ++',currentPlayedType)
    }, [currentPlaylist])
    
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

    // useEffect(async() => {
    //     setCurrentPlaylist(album);
    // },[album])

    // useEffect( () => {
    //     spotifyApi.getPlaylist(playlistId).then((data) => {
    //         setPlayList(data.body);
    //     }).catch((error) => console.error("error album fetch" ,error?.message))
        
    // }, [spotifyApi, playlistId])

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

        if(album.length > 0){
            setColor({gradient : '', color:'rgb(85 30 171)'});
            const div = contentRef.current;
            div.addEventListener('scroll', handleScroll);
        }
        console.log('currentPlaylist.id',currentPlaylist?.id)
        console.log('album.id',album.id)
    }, [album])

    return (
        <>
        {/* <div className="text-white"> 
        <p>HElmlo Album</p>
        </div> */}
        {Object.keys(album).length > 0  && 
        
        <div className="mt-[-128px] h-full-128 overflow-y-scroll scrollbar-hide flex-grow " ref={contentRef}>
              <div className="sticky flex items-center justify-start h-[64px] opacity-0 top-[64px] left-0 w-full  transition-all duration-1000 ease-in-out z-20" style={{backgroundColor: color?.color ? color?.color : ' rgb(55, 65, 81)'}} ref={filterHeader}>
                    <div className=" ml-20 flex items-center space-x-4 text-white">
                        <div className=" ml-7 button-play h-[45px] w-[45px] bg-[#1cb854] rounded-full flex justify-center items-center shadow-md " ref={headerDivPlayButton} onClick={handleChooseTrack}>
                        {/* {isPlaying && album?.tracks?.findIndex((item) => item.id === chooseTrack.id ) != -1  */}
                        {isPlaying && (album?.id === currentPlaylist?.id)  
                        ? <IoMdPause className=" " size={28}/> 
                        : <IoIosPlay className=" " size={31}/>}
                        
                        </div>
                        <span className="text-2xl font-semibold">{album?.name}</span>
                    </div>
                </div>
              
            <div className={`text-white flex-grow h-screen  relative`} style={{background : color?.gradiant ? color?.gradiant : 'linear-gradient(rgb(55, 65, 81), rgb(17, 24, 39), rgb(0, 0, 0))'}}>

                <section className={`flex items-end space-x-7  z-20 text-white p-8 pt-20 h-70 top-0`}>
                    <div className="h-60 w-60 min-w-[15rem] overflow-hidden shadow-2xl bg-slate-50">

                    <img className="h-full max-w-none " src={album?.images?.[0]?.url}/> 
                    </div>
                    <div>
                        <p className="text-sm font-light text-zinc-100 pb-3" > PLAYLISTE</p>
                            <h1 className="text-2xl md:text-3xl xl:text-5xl font-extrabold mb-5"> {album?.name}</h1>
                            <p className="text-sm font-light text-weight.100 text-zinc-300 pb-3">{album?.description}</p>
                    </div> 
                </section>
                <div className="overflow-hidden relative bg-neutral-900/60 z-10" style={{minHeight:"100%"}} ref={divEaseHeader}>
                    <div className="pb-20 mb-10 ">
                        <Songs handleChooseTrack={handleChooseTrack} tracks={album} typeOfTracks={'album'} initializeCurrentPlay={initializeCurrentPlay} playlist={album}/>
                    </div>
                </div> 
            </div>
        </div>
        }
        </>
    )
}

export default Album
