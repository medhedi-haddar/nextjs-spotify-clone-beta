
import spotifyApi from "../lib/spotify"
import { v4 as uuid } from 'uuid';


export const getMySavedTracks = async () =>{

    const unique_id = uuid();
    const small_id = unique_id.slice(0,16)

   const { body }  = await spotifyApi.getMySavedTracks();
    // const { body }  = await spotifyApi.getMyTopTracks();
  
    return ({id: small_id, tracks : body});
}

export const getFeaturedPlaylists = async () =>{

    const { body }  = await spotifyApi.getFeaturedPlaylists();

    return body?.playlists;
}

export const getMyRecentlyPlayedTracks = async () =>{

    const { body }  = await spotifyApi.getMyRecentlyPlayedTracks();
    
    console.log('myRecentlyPlayedTracks',body)

    body.items = body.items.filter((value, index, self) =>
                    index === self.findIndex((t) => (
                        t.track.id === value.track.id )
                    ))
    return body;
}

export const getMyTopTracks = async () =>{

    const { body }  = await spotifyApi.getMyTopTracks();
    console.log('getMyTopTracks',body)
    return body;
}
export const getPlaylist = async (id) =>{

    const { body }  = await spotifyApi.getPlaylist(id);
    // console.log('getPlaylist',body)
    return body;
}
export const getAlbum = async (id) =>{

    const { body }  = await spotifyApi.getAlbum(id);
    let tracks = new Array();

    body.tracks.items.map(async (track,i)=>{
        tracks.push(track.id);
    })
    let tracksDetails = await spotifyApi.getTracks(tracks);
    return { ...body , tracks : tracksDetails.body.tracks};
}

export const getTopPlaylists = async () =>{

    const data  = await spotifyApi.getNewReleases();
    const never  = await spotifyApi.getMyCurrentPlaybackState();
    console.log('getMyCurrentPlayingTrack -----',never)
    // return body;
}

