import axios, { AxiosError, AxiosInstance } from 'axios';
import qs from 'qs';
import { v4 as uuid } from 'uuid';

// Set once, preferably externally
const PLEX_ID = process.env.PLEX_ID ?? uuid();

export interface PlexApiOptions {
  authToken?: string;
  baseURL?: string;
}

export class PlexApi {
  private authToken?: string;
  private readonly xhr: AxiosInstance;

  constructor(options: PlexApiOptions = {}) {
    const { authToken, baseURL = 'http://localhost:32400' } = options;

    if (authToken) {
      this.authToken = authToken;
    }

    this.xhr = axios.create({
      baseURL,
      headers: {
        'X-Plex-Product': 'imobs-plex-tv',
        'X-Plex-Client-Identifier': PLEX_ID,
      },
    });

    this.xhr.interceptors.request.use((config) => {
      config.headers ??= {};

      if (this.authToken) {
        config.headers['X-Plex-Token'] = this.authToken;
      }

      return config;
    });

    this.xhr.interceptors.response.use(
      (res) => res,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.clearAuthToken();
          // TODO: Throw other error
        }

        throw error;
      },
    );
  }

  public getAuthToken() {
    return this.authToken;
  }

  public setAuthToken(authToken: string) {
    this.authToken = authToken;
  }

  public clearAuthToken() {
    delete this.authToken;
  }

  /**
   * @deprecated Use token login flow
   */
  public async login(email: string, password: string): Promise<User> {
    const res = await this.xhr.post<{ user: User }>(
      'https://plex.tv/user/sign_in',
      { user: { login: email, password } },
    );

    return res.data.user;
  }

  public async createPin(): Promise<Pin> {
    const res = await this.xhr.post<Pin>('https://plex.tv/api/v2/pins', {
      strong: true,
    });

    return res.data;
  }

  public async getPin(id: number, code: string): Promise<Pin> {
    const res = await this.xhr.get<Pin>(`https://plex.tv/api/v2/pins/${id}`, {
      params: { code },
    });

    return res.data;
  }

  public authUrl(code: string, forwardUrl: string) {
    const baseUrl = 'https://app.plex.tv/auth#?';
    const params = qs.stringify({
      clientID: PLEX_ID,
      code,
      forwardUrl,
      context: { device: { product: 'mobs-plex-tv' } },
    });

    return baseUrl + params;
  }
}

export interface Pin {
  id: number;
  code: string;
  authToken: string | null;
}

export interface User {
  authToken: string;
}
