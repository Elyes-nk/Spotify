import { HeartIcon, VolumeUpIcon as VolumeDownIcon } from '@heroicons/react/outline';
import { 
        RewindIcon,
        SwitchHorizontalIcon,
        FastForwardIcon,
        PauseIcon,
        PlayIcon,
        ReplyIcon,
        VolumeUpIcon,
    } from '@heroicons/react/solid';
import { debounce } from 'lodash';

import { useSession } from 'next-auth/react';
import React from 'react'
import { useState, useCallback, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSongInfo from '../hooks/useSongInfo';
import useSpotify from '../hooks/useSpotify'

function Player() {
    const spotifyApi = useSpotify();
    const songInfo = useSongInfo();
    const {data: session, data} = useSession();

    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

    const [volume, setVolume] = useState(50);

    const [player, setPlayer] = useState(undefined);


    const fetchCurrentSong = () => {
        if(songInfo){
            spotifyApi.getMyCurrentPlayingTrack().then(data => {
                setCurrentTrackId(data.body?.item.id);
                console.log("now playing", data.body?.item)

                spotifyApi.getMyCurrentPlaybackState().then(data => {
                    setIsPlaying(data.body?.is_playing)
                })
            })
        }
    }

    useEffect(() => {
        if(spotifyApi.getAccessToken()){
            fetchCurrentSong();
        }
    }, [currentTrackId, spotifyApi, session])


    //change
    useEffect(() => {
        if(volume > 0 && volume < 100){
            debouncedAdjustVolume(volume);
        }
    }, [volume])
    const debouncedAdjustVolume = useCallback(
       debounce((volume)=> {
           spotifyApi.setVolume(volume).catch((err)=> {});
       },500),
       []
    )


    //change
    const handlePlayPause = () => {
        // //FIRST WAY
        // spotifyApi.getMyCurrentPlaybackState((data)=>{
        //     if(data.body.is_playing){
        //         spotifyApi.pause();
        //         setIsPlaying(false);
        //     }else{
        //         spotifyApi.play();
        //         setIsPlaying(true);
        //     }
        // })
        isPlaying ? setIsPlaying(false) : setIsPlaying(true)

        // //ANOTHER WAY
        //player.togglePlay();

    }
    // //ANOTHER WAY
    // //https://developer.spotify.com/documentation/web-playback-sdk/guide/
    // useEffect(() => {
    //     const script = document.createElement("script");
    //     script.src = "https://sdk.scdn.co/spotify-player.js";
    //     script.async = true;
    //     document.body.appendChild(script);
    //     window.onSpotifyWebPlaybackSDKReady = () => {
    //         const player = new window.Spotify.Player({
    //             name: 'Web Playback SDK',
    //             getOAuthToken: cb => { cb(spotifyApi.getAccessToken()); },
    //             volume: 0.5
    //         });
    //         setPlayer(player);
    //         player.addListener('ready', ({ device_id }) => {
    //             console.log('Ready with Device ID', device_id);
    //         });
    //         player.addListener('not_ready', ({ device_id }) => {
    //             console.log('Device ID has gone offline', device_id);
    //         });
    //         player.connect();
    //         player.addListener('player_state_changed', ( state => {
    //             if (!state) {
    //                 return;
    //             }
    //             setTrack(state.track_window.current_track);
    //             setPaused(state.paused);

    //             player.getCurrentState().then( state => { 
    //                 (!state)? setActive(false) : setActive(true) 
    //             });            
    //         }));
    //     };
    // }, []);
    
    

    return (
        <div className='h-24 bg-gradient-to-b from-black to-gray-900 text-white
        grid grid-cols-3 text-xs md:text-base md:px-8'>


            <div className='flex items-center space-x-4'>
                <img 
                    className='hidden md:inline h-10 w-10'
                    src={songInfo?.album.images?.[0]?.url} 
                    alt=""
                />
                <div>
                    <h3>{songInfo?.name}</h3>
                    <p>{songInfo?.artists?.[0]?.name}</p>
                </div> 
            </div>




            <div className='flex items-center justify-evenly'>
                <SwitchHorizontalIcon 
                    className='w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out'
                />
                <RewindIcon 
                    className='w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out'
                    //onClick={()=>{player.previousTrack()}}
                />
                {isPlaying? (
                    <PauseIcon 
                        onClick={() => handlePlayPause()}
                        className='w-10 h-10 cursor-pointer hover:scale-125 transition transform duration-100 ease-out' 
                    />
                ):(
                    <PlayIcon 
                        onClick={() => handlePlayPause()}
                        className='w-10 h-10 cursor-pointer hover:scale-125 transition transform duration-100 ease-out' 
                    />
                )}

                <FastForwardIcon
                    className='w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out'
                    //onClick={()=>{player.nextTrack()}}
                />
                <ReplyIcon
                    className='w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out'
                />
            </div>


            <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
                <VolumeDownIcon 
                    onClick={() => volume > 0 && setVolume(volume - 10)}
                    className='w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out'
                />
                <input 
                    className="w-14 md:w-28" 
                    type="range" 
                    value={volume} 
                    onChange={(e) => setVolume(Number(e.target.value))}
                    min={0}
                    max={100}
                />
                <VolumeUpIcon 
                    onClick={() => volume < 100 && setVolume(volume + 10)}
                    className='w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out'                />
            </div>
        </div>
    )
}

export default Player
