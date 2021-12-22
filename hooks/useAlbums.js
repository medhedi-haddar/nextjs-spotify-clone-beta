
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { albumsState } from "../atoms/mySavedTracks";
import useSpotify from "./useSpotify";


function useAlbums() {

    const spotifyApi = useSpotify();
    const [albums, setAlbums] = useRecoilState(albumsState);

    const fetchAlbums = async () => {
        // if(spotifyApi){
        //     const albumsData = await fetch(
        //         `https://api.spotify.com/v1/albums`,
        //         {
        //             headers: { 
        //                 Authorization: `Bearer ${spotifyApi.getAccessToken()}`
        //             }
        //         }
        //     ).then(res => res.json());
        //     setAlbums(albumsData);
        // }
    }

    useEffect(() => {   
        fetchAlbums();
    },[spotifyApi])
    
    return useAlbums;
    
}

export default useAlbums
