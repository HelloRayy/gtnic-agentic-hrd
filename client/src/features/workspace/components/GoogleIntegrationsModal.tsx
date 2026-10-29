import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Calendar, LogOut, ExternalLink } from 'lucide-react';
import { Modal } from '@/components/ui/Modal.js';
import { Button } from '@/components/ui/button.js';
import { PillBadge } from '@/components/ui/PillBadge.js';
import type { GoogleAuthStatus } from '@/types/audit.js';
import {
  fetchGoogleAuthStatus,
  fetchGoogleAuthUrl,
  disconnectGoogleAccount,
} from '@/services/auditApi.js';

interface GoogleIntegrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (status: GoogleAuthStatus) => void;
}

export const GoogleIntegrationsModal: React.FC<GoogleIntegrationsModalProps> = ({
  isOpen,
  onClose,
  onStatusChange,
}) => {
  const [status, setStatus] = useState<GoogleAuthStatus>({
    isConfigured: false,
    isAuthenticated: false,
    email: null,
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchGoogleAuthStatus()
        .then((s) => {
          setStatus(s);
          onStatusChange?.(s);
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, onStatusChange]);

  const handleConnect = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const url = await fetchGoogleAuthUrl();
      if (url) {
        window.location.href = url;
      } else {
        setErrorMsg('Google OAuth belum dikonfigurasi di server (.env: GOOGLE_CLIENT_ID & SECRET).');
        setLoading(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg);
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      await disconnectGoogleAccount();
      const updated = await fetchGoogleAuthStatus();
      setStatus(updated);
      onStatusChange?.(updated);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Integrasi Google Workspace HRD"
      description="Hubungkan akun Google Workspace perusahaan untuk sinkronisasi otomatis Google Calendar, tautan Meet, dan draf Gmail."
      maxWidth="md"
    >
      <div className="space-y-4">
        {errorMsg && (
          <div className="p-3 bg-[#fdf0ef] border border-[#f6cbc7] rounded-xl text-xs text-[#912d26] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Status Card */}
        <div className="p-4 bg-[#fbfaf8] border border-[#e9e8e6] rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#e9e8e6] flex items-center justify-center text-[#7285d5]">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#333641]">
                  Google Calendar & Meet API
                </div>
                <div className="text-[11px] text-[#8c8d97]">
                  {status.isAuthenticated && status.email
                    ? status.email
                    : 'Belum terotentikasi'}
                </div>
              </div>
            </div>
            <PillBadge
              variant={status.isAuthenticated ? 'verified' : 'neutral'}
              size="sm"
            >
              {status.isAuthenticated ? 'TERHUBUNG' : 'DISCONNECT'}
            </PillBadge>
          </div>

          <div className="pt-2 border-t border-[#f0eee9] text-xs text-[#555660] space-y-1">
            <div className="flex items-center gap-1.5 text-[11.5px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#8cac91]" />
              <span>Pembuatan tautan Google Meet langsung dari panel inspeksi</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11.5px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#8cac91]" />
              <span>Sinkronisasi jadwal wawancara teknis ke kalender HRD & Kandidat</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-2 border-t border-[#f0eee9]">
          <span className="text-[10px] text-[#a3a3ab]">OAuth 2.0 PKCE Protected</span>
          <div className="flex gap-2">
            {status.isAuthenticated ? (
              <Button
                variant="destructive"
                onClick={handleDisconnect}
                isLoading={loading}
              >
                <LogOut className="w-3.5 h-3.5 mr-1" />
                Putuskan Akun
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleConnect}
                isLoading={loading}
              >
                <ExternalLink className="w-3.5 h-3.5 mr-1" />
                Hubungkan Akun Google
              </Button>
            )}
            <Button variant="default" onClick={onClose}>
              Tutup
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
