import { getProviders, getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { getPlaylist } from '../../api/api';
import { playerState } from '../../atoms/player';
import Playlist from '../../components/Playlist/Playlist';
import useSpotify from '../../hooks/useSpotify';
import spotifyApi from '../../lib/spotify';

export default function playlist() {

  const router = useRouter()
  const { id } = router.query
  const { data: session } = useSession();

  const [player, setPlayer] = useRecoilState(playerState);
  const [playlist,setPlaylist] = useState({})

  useEffect( async() => {
    console.log('token',spotifyApi.getAccessToken())
    if(spotifyApi.getAccessToken() && id){
      const newplaylist = await getPlaylist(id)
      setPlaylist(newplaylist)
    }

  },[spotifyApi.getAccessToken(),id]);

  return (
    <>
    {Object.keys(playlist).length && 
      <Playlist playlist={playlist}/>
    }
    </>

  )
}

// export async function getServerSideProps({ params : { id }}){
//   const playlist = await getPlaylist(id);
//   const providers = await getProviders();
//   const session = await getSession(context);
//   console.log(session)
//   return {
//       props : {
//         playlist :playlist ,
//       }
//   }
// }


