import React, { useState } from 'react';
import { X, Send, Paperclip, MessageSquarePlus, ShieldAlert, Lock } from 'lucide-react';
import { EngagementRequest, FeedbackPin, User, WorkspaceMessage } from '../types';

interface Props {
  engagement: EngagementRequest;
  currentUser: User | null;
  onUpdate: (id: string, patch: Partial<EngagementRequest>) => void;
  onClose: () => void;
}

const readFile = (f: File) =>
  new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = () => rej(new Error('read failed'));
    r.readAsDataURL(f);
  });

export const WorkspacePanel: React.FC<Props> = ({ engagement: e, currentUser, onUpdate, onClose }) => {
  const [text, setText] = useState('');
  const [pending, setPending] = useState<{ url: string; x: number; y: number } | null>(null);
  const [pinText, setPinText] = useState('');

  // access rule: only the two parties of this engagement may open the room (row-level permission check)
  const allowed = !!currentUser && (currentUser.id === e.brandId || currentUser.id === e.creatorId);
  if (!allowed) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4">
        <div className="rounded-xl border border-red-500/30 bg-zinc-950 p-6 text-center">
          <ShieldAlert className="h-8 w-8 text-red-400 mx-auto mb-2" />
          <p className="text-sm text-white font-semibold">Access denied</p>
          <p className="text-xs text-zinc-400 mt-1">This workspace belongs to another project.</p>
          <button onClick={onClose} className="mt-3 px-3 py-1.5 rounded bg-zinc-800 text-xs text-white">Close</button>
        </div>
      </div>
    );
  }

  const messages = e.messages || [];
  const pins = e.pins || [];
  const files = messages.filter((m) => m.attachmentUrl);

  const send = (extra?: Partial<WorkspaceMessage>) => {
    if (!text.trim() && !extra?.attachmentUrl) return;
    const msg: WorkspaceMessage = {
      id: `m-${Date.now()}`,
      senderId: currentUser!.id,
      senderName: currentUser!.name,
      text: text.trim(),
      at: new Date().toISOString(),
      ...extra,
    };
    onUpdate(e.id, { messages: [...messages, msg] });
    setText('');
  };

  const attach = async (f?: File) => {
    if (!f) return;
    if (f.size > 1_500_000) return alert('Please keep files under 1.5 MB in this demo.');
    send({ attachmentUrl: await readFile(f), attachmentName: f.name });
  };

  const placePin = (ev: React.MouseEvent<HTMLDivElement>, url: string) => {
    const r = ev.currentTarget.getBoundingClientRect();
    setPending({ url, x: ((ev.clientX - r.left) / r.width) * 100, y: ((ev.clientY - r.top) / r.height) * 100 });
    setPinText('');
  };

  const savePin = () => {
    if (!pending || !pinText.trim()) return;
    const pin: FeedbackPin = { id: `p-${Date.now()}`, attachmentUrl: pending.url, x: pending.x, y: pending.y, comment: pinText.trim(), authorName: currentUser!.name, at: new Date().toISOString() };
    onUpdate(e.id, { pins: [...pins, pin] });
    setPending(null);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl h-[85vh] rounded-xl border border-zinc-800 bg-zinc-950 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-400"><Lock className="h-3 w-3" /> PRIVATE WORKSPACE · MEMBERS ONLY</div>
            <h3 className="text-sm font-bold text-white">{e.briefTitle}</h3>
            <p className="text-[11px] text-zinc-500">{e.brandName} and {e.creatorName}. Demo data stays in your browser; production adds TLS and AES-256 at rest.</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        <div className="flex-1 grid md:grid-cols-2 min-h-0">
          {/* Chat */}
          <div className="flex flex-col min-h-0 border-r border-zinc-800">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {!messages.length && <p className="text-xs text-zinc-500">No messages yet. Share a logo or reference image to start collecting visual feedback.</p>}
              {messages.map((m) => (
                <div key={m.id} className={`max-w-[85%] p-2.5 rounded-lg text-xs ${m.senderId === currentUser!.id ? 'ml-auto bg-amber-400/10 border border-amber-400/20' : 'bg-zinc-900 border border-zinc-800'}`}>
                  <div className="text-[10px] text-zinc-500 mb-0.5">{m.senderName} · {new Date(m.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  {m.text && <p className="text-zinc-100">{m.text}</p>}
                  {m.attachmentUrl && <img src={m.attachmentUrl} alt={m.attachmentName} className="mt-1.5 rounded max-h-32" />}
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-zinc-800 flex items-center gap-2">
              <label className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 cursor-pointer hover:bg-zinc-800">
                <Paperclip className="h-4 w-4" />
                <input type="file" accept="image/*" className="hidden" onChange={(ev) => attach(ev.target.files?.[0])} />
              </label>
              <input value={text} onChange={(ev) => setText(ev.target.value)} onKeyDown={(ev) => ev.key === 'Enter' && send()} placeholder="Message..." className="flex-1 px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-white" />
              <button onClick={() => send()} className="p-2 rounded bg-amber-400 text-zinc-950"><Send className="h-4 w-4" /></button>
            </div>
          </div>

          {/* Visual feedback */}
          <div className="overflow-y-auto p-4 space-y-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white"><MessageSquarePlus className="h-4 w-4 text-amber-400" /> Visual feedback (click an image to drop a pin)</div>
            {!files.length && <p className="text-xs text-zinc-500">Shared images appear here.</p>}
            {files.map((m) => (
              <div key={m.id}>
                <div className="relative cursor-crosshair rounded-lg overflow-hidden border border-zinc-800" onClick={(ev) => placePin(ev, m.attachmentUrl!)}>
                  <img src={m.attachmentUrl} alt="" className="w-full block" draggable={false} />
                  {pins.filter((p) => p.attachmentUrl === m.attachmentUrl).map((p, i) => (
                    <div key={p.id} title={`${p.authorName}: ${p.comment}`} className="absolute -translate-x-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-amber-400 text-zinc-950 text-[10px] font-bold flex items-center justify-center" style={{ left: `${p.x}%`, top: `${p.y}%` }}>{i + 1}</div>
                  ))}
                  {pending?.url === m.attachmentUrl && <div className="absolute -translate-x-1/2 -translate-y-1/2 h-5 w-5 rounded-full border-2 border-amber-400" style={{ left: `${pending.x}%`, top: `${pending.y}%` }} />}
                </div>
                <ul className="mt-1.5 space-y-1">
                  {pins.filter((p) => p.attachmentUrl === m.attachmentUrl).map((p, i) => (
                    <li key={p.id} className="text-[11px] text-zinc-300"><span className="text-amber-400 font-mono">#{i + 1}</span> {p.authorName}: {p.comment}</li>
                  ))}
                </ul>
                {pending?.url === m.attachmentUrl && (
                  <div className="flex gap-2 mt-2">
                    <input autoFocus value={pinText} onChange={(ev) => setPinText(ev.target.value)} placeholder="Feedback for this spot..." className="flex-1 px-3 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-xs text-white" />
                    <button onClick={savePin} className="px-3 rounded bg-amber-400 text-zinc-950 text-xs font-bold">Pin</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
