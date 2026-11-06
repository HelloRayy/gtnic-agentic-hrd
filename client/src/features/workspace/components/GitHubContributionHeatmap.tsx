import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, RotateCw, AlertCircle } from 'lucide-react';
import { fetchCandidateContributions } from '@/services/auditApi.js';
import type { ContributionDay } from '@/types/audit.js';

interface GitHubContributionHeatmapProps {
  githubUsername?: string;
  candidateName: string;
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
const DAY_LABELS = ['', 'Sen', '', 'Rab', '', 'Jum', ''];

const LEVEL_COLORS: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: '#ebedf0',
  1: '#9be9a8',
  2: '#40c463',
  3: '#30a14e',
  4: '#216e39',
};

function formatDateIndo(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const day = d.getDate();
    const month = MONTH_NAMES[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return dateStr;
  }
}

export const GitHubContributionHeatmap: React.FC<GitHubContributionHeatmapProps> = ({
  githubUsername = '',
  candidateName,
}) => {
  const [days, setDays] = useState<ContributionDay[]>([]);
  const [totalContributions, setTotalContributions] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);

  const loadContributions = async (username: string) => {
    if (!username) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchCandidateContributions(username);
      setDays(data.days);
      setTotalContributions(data.totalContributions);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat aktivitas kontribusi.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (githubUsername) {
      loadContributions(githubUsername);
    }
  }, [githubUsername]);

  // Kelompokkan hari ke dalam kolom minggu (setiap minggu berisi 7 hari)
  const { weeks, monthHeaders } = useMemo(() => {
    if (days.length === 0) return { weeks: [], monthHeaders: [] };

    // Urutkan hari secara kronologis agar tidak terjadi lompatan acak antar minggu
    const sortedDays = [...days].sort((a, b) => a.date.localeCompare(b.date));

    const groupedWeeks: ContributionDay[][] = [];
    let currentWeek: ContributionDay[] = [];

    // Pastikan awalan sesuai hari dalam seminggu (0 = Minggu)
    const firstDateObj = new Date(sortedDays[0].date);
    const startDayOfWeek = isNaN(firstDateObj.getTime()) ? 0 : firstDateObj.getDay();
    for (let i = 0; i < startDayOfWeek; i++) {
      currentWeek.push({ date: '', count: 0, level: 0 });
    }

    sortedDays.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        groupedWeeks.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push({ date: '', count: 0, level: 0 });
      }
      groupedWeeks.push(currentWeek);
    }

    // Hitung posisi label bulan di atas kolom minggu dengan proteksi jarak minimum
    const headers: { month: string; colIndex: number }[] = [];
    let lastMonth = -1;
    let lastColIndex = -10;

    groupedWeeks.forEach((week, colIdx) => {
      const validDay = week.find((d) => Boolean(d.date));
      if (validDay) {
        const dObj = new Date(validDay.date);
        const m = dObj.getMonth();
        // Hanya tampilkan jika bulan berganti, berjarak minimal 3 kolom (~39px), dan tidak mepet ujung kanan
        if (m !== lastMonth && colIdx - lastColIndex >= 3 && colIdx < groupedWeeks.length - 2) {
          headers.push({ month: MONTH_NAMES[m], colIndex: colIdx });
          lastMonth = m;
          lastColIndex = colIdx;
        }
      }
    });

    return { weeks: groupedWeeks, monthHeaders: headers };
  }, [days]);

  return (
    <div className="bg-white rounded-[14px] border border-[#d0d7de] p-4.5 shadow-[0_1px_3px_rgba(31,35,40,0.04)] mb-3">
      {/* 1. Header Heatmap */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#f0eee9] flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Calendar size={15} className="text-[#2b8a3e]" />
          <span className="text-[13px] font-bold text-[#1f2328] tracking-tight">
            Aktivitas Kontribusi & Commit (Grafik Hijau GitHub)
          </span>
          {totalContributions > 0 && !isLoading && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#dafbe1] text-[#1a7f37] border border-[#4ac26b]/40">
              {totalContributions.toLocaleString()} Kontribusi 1 Tahun Terakhir
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => loadContributions(githubUsername)}
          disabled={isLoading || !githubUsername}
          className="p-1 rounded-[6px] text-[#57606a] hover:text-[#0969da] hover:bg-[#eaedf0] transition-colors cursor-pointer disabled:opacity-50"
          title="Muat ulang kontribusi"
        >
          <RotateCw size={13} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* 2. Defensive States */}
      {isLoading && (
        <div className="py-6 flex items-center justify-center gap-2 text-xs text-[#57606a]">
          <RotateCw size={14} className="animate-spin text-[#2b8a3e]" />
          <span>Memuat kalender kontribusi GitHub {githubUsername || candidateName}...</span>
        </div>
      )}

      {!isLoading && error && (
        <div className="p-3 bg-[#fff8f8] border border-[#ffc1c0] rounded-[8px] flex items-center justify-between text-xs text-[#cf222e]">
          <div className="flex items-center gap-2">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => loadContributions(githubUsername)}
            className="px-2 py-1 bg-white border border-[#d0d7de] rounded-[5px] text-[#24292f] hover:bg-[#f6f8fa]"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {!isLoading && !error && weeks.length > 0 && (
        <div>
          {/* Scrollable Container untuk Heatmap 52 Minggu */}
          <div className="overflow-x-auto pb-1.5 pt-0.5 select-none">
            <div className="inline-block min-w-full">
              {/* Baris Label Bulan */}
              <div className="relative h-4 text-[10px] text-[#57606a] font-medium mb-1 pl-7">
                {monthHeaders.map((hdr, idx) => (
                  <span
                    key={idx}
                    className="absolute"
                    style={{ left: `${hdr.colIndex * 13 + 30}px` }}
                  >
                    {hdr.month}
                  </span>
                ))}
              </div>

              {/* Matriks Kotak Hijau Kontribusi */}
              <div className="flex items-start gap-1">
                {/* Kolom Nama Hari */}
                <div className="flex flex-col gap-[3px] pr-1.5 text-[9.5px] text-[#57606a] font-medium leading-[10px] select-none">
                  {DAY_LABELS.map((label, idx) => (
                    <div key={idx} className="h-[10px] flex items-center justify-end w-5">
                      {label}
                    </div>
                  ))}
                </div>

                {/* Kolom-kolom Minggu */}
                <div className="flex gap-[3px]">
                  {weeks.map((week, wIdx) => (
                    <div key={wIdx} className="flex flex-col gap-[3px]">
                      {week.map((day, dIdx) => {
                        if (!day.date) {
                          return <div key={dIdx} className="w-[10px] h-[10px] rounded-[2px] opacity-0" />;
                        }
                        const isHovered = hoveredDay?.date === day.date;
                        return (
                          <div
                            key={day.date || dIdx}
                            onMouseEnter={() => setHoveredDay(day)}
                            onMouseLeave={() => setHoveredDay(null)}
                            className="w-[10px] h-[10px] rounded-[2px] cursor-pointer transition-all border border-black/[0.04]"
                            style={{
                              backgroundColor: LEVEL_COLORS[day.level],
                              transform: isHovered ? 'scale(1.35)' : 'none',
                              zIndex: isHovered ? 10 : 1,
                            }}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Footer: Tooltip Deskripsi & Legend Hijau */}
          <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-[#f0eee9] text-xs text-[#57606a] flex-wrap gap-2">
            <div className="min-h-[18px]">
              {hoveredDay ? (
                <span className="font-semibold text-[#1f2328] text-[11.5px]">
                  {hoveredDay.count > 0
                    ? `${hoveredDay.count} kontribusi pada ${formatDateIndo(hoveredDay.date)}`
                    : `Tidak ada kontribusi pada ${formatDateIndo(hoveredDay.date)}`}
                </span>
              ) : (
                <span className="text-[11px] text-[#8c959f]">Arahkan kursor ke kotak hijau untuk melihat detail tanggal</span>
              )}
            </div>

            {/* Legend Skala Warna Hijau GitHub */}
            <div className="flex items-center gap-1.5 text-[10.5px] text-[#636c76] ml-auto">
              <span>Sedikit</span>
              {([0, 1, 2, 3, 4] as const).map((lvl) => (
                <span
                  key={lvl}
                  className="w-[10px] h-[10px] rounded-[2px] border border-black/[0.04] inline-block"
                  style={{ backgroundColor: LEVEL_COLORS[lvl] }}
                  title={`Level ${lvl}`}
                />
              ))}
              <span>Banyak</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
