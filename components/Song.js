import React from 'react';
import useSpotify from '../hooks/useSpotify';
import {milliToMinutesAndSeconds} from '../lib/time';

function Song({order, track}) {
    const spotifyApi= useSpotify();
  return (
    <div className='grid grid-cols-2'>
        <div className='flex items-center space-x-4'>
            <p>
                {order+1}
            </p>
            <img className='h-10 w-5' 
            src={track?.track.album.images[0].url} alt=''/>
            <div>
                <p>{track?.track.name}</p>
                <p>
                    {track?.track.artists[0].name}
                </p>
            </div>
            <div className='flex items-center justify-between ml-auto
            md:ml-0'>
                <p className='hidden md:inline'>
                    {track.track.album.name}
                </p>
                <p>
                    {milliToMinutesAndSeconds()}
                </p>
            </div>
        </div>
    </div>
  )
}

export default Song