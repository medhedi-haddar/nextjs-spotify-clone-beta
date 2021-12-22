// import { getProviders, getSession, useSession } from 'next-auth/react';
// import { useRouter } from 'next/router';
// import { useEffect, useState } from 'react';
// import { useRecoilState } from 'recoil';
// import { getAlbum, getPlaylist } from '../../api/api';
// import { albumState } from '../../atoms/album';
// import { playerState } from '../../atoms/player';
// import { playListState } from '../../atoms/playlistAtom';
// import Album from '../../components/Album';
// import MyPlaylists from '../../components/MyPlaylists';
// import Playlist from '../../components/Playlist';
// import useSpotify from '../../hooks/useSpotify';
// import spotifyApi from '../../lib/spotify';

export default function album() {

  // const router = useRouter()
  // const { id } = router.query
  // // console.log('id : ', id)
  // // console.log(playlist)
  // const spotifyApi = useSpotify();
  // const [player, setPlayer] = useRecoilState(playerState);
  // const [album,setAlbum] = useRecoilState(albumState)

  // useEffect( async () => {
  //   console.log(spotifyApi.getAccessToken())
  //   if(spotifyApi.getAccessToken()){
  //     const dataAlbum = await getAlbum(id);
  //     console.log('getMyTopTracks',spotifyApi.getMyTopTracks());
  //     setAlbum(dataAlbum);
  //   }

  // },[spotifyApi.getAccessToken()]);

  return (
    <>
    <h1>Album PAge</h1>
    {/* {Object.keys(album).length && 
      <Album album={album}/>
    }
    {Object.keys(album).length && console.log('album',album)} */}
    </>

  )
}