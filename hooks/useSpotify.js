
import { useEffect } from "react";
import { signIn, useSession , signOut} from "next-auth/react";
import spotifyApi from "../lib/spotify";


function useSpotify() {

    const { data : session, status } = useSession();

    useEffect(() => {
        if(session){
            if(session.error === "RefreshAccessTokenError"){
                // signIn();
                signOut();
            }
        }
        spotifyApi.setAccessToken(session?.user.accessToken);

    }, [session]);

    return spotifyApi ; 
}

export default useSpotify
