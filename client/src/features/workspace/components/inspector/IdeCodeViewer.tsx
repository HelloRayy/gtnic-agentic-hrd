import React from 'react';
import { ForensicCalloutPin } from './ForensicCalloutPin.js';
import { highlightCodeLine } from './codeSyntaxHighlighter.js';
import type { ForensicCallout } from '../../types.js';

interface IdeCodeViewerProps {
  code: string;
  language: string;
  callouts: ForensicCallout[];
  highlightedLine?: number;
}

export const IdeCodeViewer: React.FC<IdeCodeViewerProps> = ({
  code,
  language,
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
    <div className="flex-1 h-full min-h-0 bg-[#ffffff] text-[#24292f] font-mono text-xs overflow-x-auto overflow-y-auto select-text">
      <table className="w-full border-collapse">
        <tbody>
          {lines.map((lineText, idx) => {
            const lineNum = idx + 1;
            const highlighted = isLineHighlighted(lineNum);
            const calloutOnLine = getLineCallout(lineNum);
            const endCallout = calloutsByEndLine.get(lineNum);

            let rowBg = 'hover:bg-[#f6f8fa]';
            let diffSign = ' ';
            let signColor = 'text-[#8c959f]';

            if (highlighted) {
              if (calloutOnLine?.type === 'VERIFIED') {
                rowBg = 'bg-[#e6ffec] text-[#24292f]';
                diffSign = '+';
                signColor = 'text-[#1a7f37] font-bold';
              } else if (calloutOnLine?.type === 'PARTIAL') {
                rowBg = 'bg-[#fff8c5] text-[#24292f]';
                diffSign = '~';
                signColor = 'text-[#9a6700] font-bold';
              } else {
                rowBg = 'bg-[#ffebe9] text-[#24292f]';
                diffSign = '!';
                signColor = 'text-[#cf222e] font-bold';
              }
            }

            return (
              <React.Fragment key={lineNum}>
                <tr className={`transition-colors ${rowBg}`}>
                  {/* Line Number Gutter */}
                  <td className="w-10 px-2 py-0.5 text-right bg-[#f6f8fa] text-[#8c959f] select-none text-[11px] font-mono border-r border-[#d0d7de] shrink-0 align-top">
                    {lineNum}
                  </td>
                  {/* Diff Symbol (+ / ~ / !) */}
                  <td className={`w-4 text-center select-none text-[11px] font-mono shrink-0 align-top ${signColor}`}>
                    {diffSign}
                  </td>
                  {/* Syntax Highlighted Code Line */}
                  <td className="px-2.5 py-0.5 whitespace-pre leading-relaxed font-mono text-[12px] align-top text-[#24292f]">
                    {highlightCodeLine(lineText, language)}
                  </td>
                </tr>

                {/* GitHub PR Style Inline Review Comment */}
                {endCallout && (
                  <tr>
                    <td colSpan={3} className="p-0 bg-[#f6f8fa] border-y border-[#d0d7de]">
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
