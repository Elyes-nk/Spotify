import React from 'react'
import { useRecoilValue } from 'recoil'
import { playlistState } from '../atoms/playlistAtom'
import Song from './Song';

function Songs() {
    const playlist = useRecoilValue(playlistState);
    console.log(playlist)
    return (
        <div className='text-white'>
            {playlist?.tracks.items.map((song, i)=>(
                <div>
                    <Song key={song.track.id} song={song} order={i}/>
                </div>
            ))}
        </div>
    )
}

export default Songs
