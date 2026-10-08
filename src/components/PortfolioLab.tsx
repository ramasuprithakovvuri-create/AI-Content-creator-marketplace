import React, { useState } from 'react';
import { PortfolioItem } from '../types';
import { getDemoVideoThumbnail } from '../lib/media';

const CompareSlider: React.FC<{ before: string; after: string; rawFilter: boolean }> = ({ before, after, rawFilter }) => {
  const [pos, setPos] = useState(50);
  return (
    <div className="relative rounded-lg overflow-hidden border border-zinc-800 select-none aspect-video bg-black">
      <img src={after} alt="Final" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img src={before} alt="Raw" className={`absolute inset-0 h-full object-cover max-w-none ${rawFilter ? 'grayscale contrast-75 blur-[1px]' : ''}`} style={{ width: `${10000 / Math.max(pos, 1)}%` }} />
      </div>
      <div className="absolute top-0 bottom-0 w-0.5 bg-amber-400" style={{ left: `${pos}%` }} />
      <span className="absolute top-2 left-2 text-[10px] font-mono bg-black/70 text-zinc-200 px-1.5 py-0.5 rounded">RAW GENERATION</span>
      <span className="absolute top-2 right-2 text-[10px] font-mono bg-black/70 text-amber-300 px-1.5 py-0.5 rounded">FINAL</span>
      <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} className="absolute bottom-2 left-4 right-4 accent-amber-400" aria-label="Compare raw and final" />
    </div>
  );
};

export const PortfolioLab: React.FC<{ item: PortfolioItem; siblings: PortfolioItem[] }> = ({ item, siblings }) => {
  const [tab, setTab] = useState<'compare' | 'poses' | 'style'>('compare');
  const thumbnail = item.mediaType === 'video' ? getDemoVideoThumbnail(item.mediaUrl, item.thumbnailUrl) : item.thumbnailUrl;
  const final = item.mediaType === 'image' ? item.mediaUrl : thumbnail;
  const before = item.beforeImageUrl || thumbnail;
  const poses = item.poseGallery?.length ? item.poseGallery : siblings.map((s) => s.thumbnailUrl).slice(0, 4);
  const styleName = item.customStyleName || item.promptRecipe.loraWeights;

  return (
    <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-3">
      <div className="flex gap-2 text-xs">
        {([['compare', 'Before / After'], ['poses', 'Consistency set'], ['style', 'Custom style']] as const).map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} className={`px-3 py-1 rounded border ${tab === id ? 'border-amber-400 text-amber-300' : 'border-zinc-700 text-zinc-400'}`}>{label}</button>
        ))}
      </div>
      {tab === 'compare' && (
        <>
          <CompareSlider before={before} after={final} rawFilter={!item.beforeImageUrl} />
          <p className="text-[11px] text-zinc-500">Drag the slider to compare the raw model output with the final graded piece.{!item.beforeImageUrl && ' (Demo uses a filtered copy when the creator has not uploaded a raw version.)'}</p>
        </>
      )}
      {tab === 'poses' && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">{poses.map((u, i) => <img key={i} src={u} alt={`Pose ${i + 1}`} className="rounded-lg aspect-square object-cover border border-zinc-800" />)}</div>
          <p className="text-[11px] text-zinc-500">One character or product across multiple poses and scenes, proving consistency.{!item.poseGallery?.length && ' (Showing the creator\'s other work until a pose set is uploaded.)'}</p>
        </>
      )}
      {tab === 'style' && (
        <div className="text-xs text-zinc-300 space-y-1">
          {styleName ? (
            <>
              <div className="text-[11px] font-mono text-amber-400 uppercase">Custom-trained style</div>
              <div className="font-semibold text-white">{styleName}</div>
              <div>Base model: {item.primaryModel} · Seed {item.promptRecipe.seedNumber} · CFG {item.promptRecipe.cfgScale}</div>
            </>
          ) : <p className="text-zinc-500">This creator has not listed a custom-trained style for this piece.</p>}
        </div>
      )}
    </div>
  );
};
