import { Auth, google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TOKEN_FILE = path.resolve(__dirname, '../../.google_tokens.json');

export class GoogleAuthService {
  private oauth2Client: Auth.OAuth2Client | null = null;
  private tokens: Auth.Credentials | null = null;
  private userEmail: string | null = null;

  public static readonly SCOPES = [
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/userinfo.email',
  ];

  constructor() {
    this.initializeClient();
    this.loadSavedTokens();
  }

  private initializeClient(): void {
    if (config.google.clientId && config.google.clientSecret) {
      this.oauth2Client = new google.auth.OAuth2(
        config.google.clientId,
        config.google.clientSecret,
        config.google.redirectUri
      );
    }
  }

  private loadSavedTokens(): void {
    try {
      if (fs.existsSync(TOKEN_FILE)) {
        const raw = fs.readFileSync(TOKEN_FILE, 'utf-8');
        const data = JSON.parse(raw) as { tokens?: Auth.Credentials; email?: string };
        this.tokens = data.tokens || null;
        this.userEmail = data.email || null;

        if (this.oauth2Client && this.tokens) {
          this.oauth2Client.setCredentials(this.tokens);
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn('[GoogleAuthService] Failed to load saved tokens:', message);
    }
  }

  private persistTokens(): void {
    try {
      fs.writeFileSync(
        TOKEN_FILE,
        JSON.stringify({ tokens: this.tokens, email: this.userEmail }, null, 2),
        'utf-8'
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn('[GoogleAuthService] Failed to save tokens:', message);
    }
  }

  public isConfigured(): boolean {
    return Boolean(config.google.clientId && config.google.clientSecret);
  }

  public isAuthenticated(): boolean {
    return Boolean(this.oauth2Client && this.tokens?.access_token);
  }

  public getUserEmail(): string | null {
    return this.userEmail;
  }

  public getAuthUrl(state?: string): string {
    if (!this.oauth2Client) {
      throw new Error('Google OAuth credentials not configured in environment.');
    }

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: GoogleAuthService.SCOPES,
      state: state || 'talenttrace-auth',
    });
  }

  public async exchangeCode(code: string): Promise<{ success: boolean; email?: string }> {
    if (!this.oauth2Client) {
      throw new Error('Google OAuth client is not initialized.');
    }

    const { tokens } = await this.oauth2Client.getToken(code);
    this.tokens = tokens;
    this.oauth2Client.setCredentials(tokens);

    try {
      const oauth2 = google.oauth2({ version: 'v2', auth: this.oauth2Client });
      const userInfo = await oauth2.userinfo.get();
      this.userEmail = userInfo.data.email || null;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn('[GoogleAuthService] Unable to fetch userinfo:', message);
    }

    this.persistTokens();
    return { success: true, email: this.userEmail || undefined };
  }

  public getClient(): Auth.OAuth2Client {
    if (!this.oauth2Client) {
      throw new Error('Google OAuth client is not initialized.');
    }
    return this.oauth2Client;
  }

  public disconnect(): void {
    this.tokens = null;
    this.userEmail = null;
    if (this.oauth2Client) {
      this.oauth2Client.setCredentials({});
    }
    if (fs.existsSync(TOKEN_FILE)) {
      try {
        fs.unlinkSync(TOKEN_FILE);
      } catch {
        // ignore
      }
    }
  }
}

export const googleAuthService = new GoogleAuthService();
