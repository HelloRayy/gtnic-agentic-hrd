import React from 'react';
import { ForensicCalloutPin } from './ForensicCalloutPin.js';
import type { ForensicCallout } from '../../types.js';

interface IdeCodeViewerProps {
  code: string;
  language: string;
  callouts: ForensicCallout[];
  highlightedLine?: number;
}

export const IdeCodeViewer: React.FC<IdeCodeViewerProps> = ({
  code,
  callouts,
  highlightedLine,
}) => {
  const lines = code.split('\n');

  const calloutsByEndLine = new Map<number, ForensicCallout>();
  callouts.forEach((c) => {
    calloutsByEndLine.set(c.endLine, c);
  });

  const isLineHighlighted = (lineNum: number) => {
    if (highlightedLine === lineNum) return true;
    return callouts.some((c) => lineNum >= c.startLine && lineNum <= c.endLine);
  };

  const getLineCallout = (lineNum: number) => {
    return callouts.find((c) => lineNum >= c.startLine && lineNum <= c.endLine);
  };

  return (
    <div className="bg-[#0d1117] text-[#e6edf3] font-mono text-xs overflow-x-auto overflow-y-auto max-h-[520px] select-text border-t border-[#30363d] rounded-b-xl">
      <table className="w-full border-collapse">
        <tbody>
          {lines.map((lineText, idx) => {
            const lineNum = idx + 1;
            const highlighted = isLineHighlighted(lineNum);
            const calloutOnLine = getLineCallout(lineNum);
            const endCallout = calloutsByEndLine.get(lineNum);

            let rowBg = 'hover:bg-[#161b22]';
            let diffSign = ' ';
            let signColor = 'text-[#6e7681]';

            if (highlighted) {
              if (calloutOnLine?.type === 'VERIFIED') {
                rowBg = 'bg-[#2ea043]/15 text-[#e6edf3]';
                diffSign = '+';
                signColor = 'text-[#3fb950] font-bold';
              } else if (calloutOnLine?.type === 'PARTIAL') {
                rowBg = 'bg-[#bb8009]/15 text-[#e6edf3]';
                diffSign = '~';
                signColor = 'text-[#d29922] font-bold';
              } else {
                rowBg = 'bg-[#f85149]/15 text-[#e6edf3]';
                diffSign = '!';
                signColor = 'text-[#f85149] font-bold';
              }
            }

            return (
              <React.Fragment key={lineNum}>
                <tr className={`transition-colors ${rowBg}`}>
                  {/* Line Number Gutter ala GitHub PR */}
                  <td className="w-10 px-2 py-0.5 text-right text-[#6e7681] select-none text-[11px] font-mono border-r border-[#30363d]/60 shrink-0 align-top">
                    {lineNum}
                  </td>
                  {/* Diff Sign (+ / ~ / !) */}
                  <td className={`w-4 text-center select-none text-[11px] font-mono shrink-0 align-top ${signColor}`}>
                    {diffSign}
                  </td>
                  {/* Code Line Content */}
                  <td className="px-2.5 py-0.5 whitespace-pre leading-relaxed font-mono text-[12px] text-[#e6edf3] align-top">
                    {lineText || ' '}
                  </td>
                </tr>

                {/* GitHub Style Inline Review Comment Box */}
                {endCallout && (
                  <tr>
                    <td colSpan={3} className="p-0 bg-[#0d1117] border-y border-[#30363d]">
                      <ForensicCalloutPin callout={endCallout} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
