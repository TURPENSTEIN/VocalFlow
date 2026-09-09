import React from 'react';
import { MessageSquare, ExternalLink } from 'lucide-react';

export const DiscordBanner: React.FC = () => {
  return (
    <div
      id="discord-top-banner"
      className="w-full bg-[#0a0f1c] border-b-2 border-[#5865F2]/50 px-4 py-2.5 flex items-center justify-between gap-3 font-mono text-xs shadow-[0_4px_20px_rgba(88,101,242,0.2)] sticky top-0 z-40 backdrop-blur-md"
    >
      <div className="flex items-center gap-3 flex-wrap">
        {/* Discord Tag */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#5865F2] text-white text-[11px] font-extrabold uppercase tracking-wider shadow-[0_0_12px_rgba(88,101,242,0.6)]">
          <MessageSquare size={13} fill="currentColor" />
          <span>DISCORD</span>
        </div>

        {/* Hyperlinked MINDBUILDING button */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-zinc-300 font-medium hidden sm:inline">Join community:</span>
          <a
            id="link-discord-mindbuilding"
            href="https://discord.gg/brain"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00ff88] hover:text-[#5865F2] font-black tracking-wider text-sm sm:text-base underline underline-offset-4 decoration-2 decoration-[#00ff88] hover:decoration-[#5865F2] transition-all inline-flex items-center gap-1.5 bg-[#00ff88]/10 hover:bg-[#5865F2]/20 px-3 py-1 rounded border border-[#00ff88]/40 shadow-[0_0_10px_rgba(0,255,136,0.2)]"
            title="Join the MINDBUILDING Discord server"
          >
            <span>MINDBUILDING</span>
            <ExternalLink size={14} className="inline" />
          </a>
        </div>

        <span className="hidden md:inline text-zinc-400 text-xs">
          • Cognitive rhythm & speech-generation training hub
        </span>
      </div>

      <div className="text-[11px] text-zinc-500 font-mono hidden sm:block">
        Free Flow & Neuro-Linguistic Rhythms
      </div>
    </div>
  );
};
