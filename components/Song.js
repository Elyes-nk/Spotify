import React from 'react'
import { useRecoilState } from 'recoil'
import {millisToMinutesAndSeconds} from '../lib/time'
import {currentTrackIdState, isPlayingState} from '../atoms/songAtom';
import useSpotify from '../hooks/useSpotify';

function Song({song, order}) {
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState)
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
    const spotifyApi = useSpotify();

    const playSong = () => {
        setCurrentTrackId(song.track.id);
        setIsPlaying(true);
        // //FIRST WAY
        // spotifyApi.play({
        //     uris: [song.track.uri],
        // })
    }
    return (
        <div className='grid grid-cols-2 text-gray-500 py-4 px-5 hover:bg-gray-900'>
            <div 
                className='flex items-center space-x-4 rounded-lg cursor-pointer'
                onClick={() => playSong()}
            >
                <p>{order+1}</p>
                <img 
                    src={song.track.album.images[0].url}
                    className='w-10 h-10'
                />
                <div>
                    <p className='w-36 lg:w-64 text-white truncate'>{song.track.name}</p>
                    <p className='w-40'>{song.track.artists[0].name}</p>
                </div>
            </div>

            <div className='flex items-center justify-between ml-auto md:ml-0'>
                <p className='w-40 hidden md:inline'>{song.track.album.name}</p>
                <p>{millisToMinutesAndSeconds(song.track.duration_ms)}</p>
            </div>
        </div>
    )
}

export default Song
