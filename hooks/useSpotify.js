import { signIn, useSession } from 'next-auth/react';
import {useEffect} from 'react';
import React from 'react';
import SpotifyWebApi from 'spotify-web-api-node/src/spotify-web-api';


const spotifyApi = new SpotifyWebApi({
    clientId:process.env.SPOTIFY_ID,
    clientSecret:process.env.SPOTIFY_SECRET,
});

function useSpotify() {
    const {data: session, status} = useSession();
    useEffect(() => {
        if(session){
            if(session.error === 'refreshAccessTokenError') return signIn()
            spotifyApi.setAccessToken(session.user.accessToken)
        }
    }, [session])
    return spotifyApi
}

export default useSpotify
