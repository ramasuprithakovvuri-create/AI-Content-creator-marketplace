import React, { useState } from 'react';
import { getDemoVideoCredit, getPlayableVideoUrl } from '../lib/media';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
}

function formatDuration(seconds: number): string {
  const totalSeconds = Math.floor(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster, className }) => {
  const [duration, setDuration] = useState<number | null>(null);
  const [durationUnavailable, setDurationUnavailable] = useState(false);
  const playableSrc = getPlayableVideoUrl(src);
  const demoVideoCredit = getDemoVideoCredit(playableSrc);

  const updateDuration = (video: HTMLVideoElement) => {
    if (Number.isFinite(video.duration) && video.duration > 0) {
      setDuration(video.duration);
      setDurationUnavailable(false);
    }
  };

  return (
    <div className="relative w-full h-full">
      <video
        src={playableSrc}
        poster={poster}
        controls
        preload="metadata"
        onLoadedMetadata={(event) => updateDuration(event.currentTarget)}
        onDurationChange={(event) => updateDuration(event.currentTarget)}
        onError={() => setDurationUnavailable(true)}
        className={className || 'w-full h-full object-contain'}
      />
      <span className="absolute top-2 right-2 rounded bg-black/75 px-2 py-1 text-[11px] font-mono text-white">
        {duration !== null ? `Duration ${formatDuration(duration)}` : durationUnavailable ? 'Duration unavailable' : 'Loading duration…'}
      </span>
      {demoVideoCredit && (
        <a
          href={demoVideoCredit}
          target="_blank"
          rel="noreferrer"
          className="absolute bottom-12 left-2 rounded bg-black/75 px-2 py-1 text-[11px] text-white underline"
        >
          Demo stock footage · Pexels
        </a>
      )}
    </div>
  );
};
