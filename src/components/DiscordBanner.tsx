import React from 'react';
import { MessageSquare, ExternalLink, Users } from 'lucide-react';

export const DiscordBanner: React.FC = () => {
  return (
    <div
      id="discord-top-banner"
      className="w-full bg-[#0a0f1c] border-b-2 border-[#5865F2]/60 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 font-mono text-xs shadow-[0_4px_20px_rgba(88,101,242,0.25)] sticky top-0 z-50 backdrop-blur-md"
    >
      <div className="flex items-center gap-3 flex-wrap">
        {/* Discord Tag */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#5865F2] text-white text-[11px] font-extrabold uppercase tracking-wider shadow-[0_0_12px_rgba(88,101,242,0.6)]">
          <MessageSquare size={13} fill="currentColor" />
          <span>DISCORD</span>
        </div>

        {/* Hyperlinked text MINDBUILDING */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-zinc-300 font-medium">Join our community:</span>
          <a
            id="link-discord-mindbuilding"
            href="https://discord.gg/brain"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00ff88] hover:text-[#5865F2] font-black tracking-wider text-sm sm:text-base underline underline-offset-4 decoration-2 decoration-[#00ff88] hover:decoration-[#5865F2] transition-all inline-flex items-center gap-1.5 bg-[#00ff88]/10 hover:bg-[#5865F2]/20 px-2.5 py-0.5 rounded border border-[#00ff88]/40 shadow-[0_0_10px_rgba(0,255,136,0.2)]"
          >
            <span>MINDBUILDING</span>
            <ExternalLink size={14} className="inline" />
          </a>
        </div>

        <span className="hidden md:inline text-zinc-400 text-xs">
          • Cognitive rhythm & speech-generation training hub
        </span>
      </div>

      {/* Direct link button */}
      <div className="flex items-center gap-2 ml-auto sm:ml-0">
        <span className="text-zinc-400 text-[11px] hidden sm:inline">Invite Link:</span>
        <a
          id="link-discord-pill"
          href="https://discord.gg/brain"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 bg-[#5865F2] hover:bg-[#4752c4] text-white rounded font-bold text-xs transition-all shadow-[0_0_15px_rgba(88,101,242,0.5)] active:scale-95 cursor-pointer"
        >
          <Users size={13} />
          <span>discord.gg/brain</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
};
