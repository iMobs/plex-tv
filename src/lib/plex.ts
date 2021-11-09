import axios, { AxiosError, AxiosInstance } from 'axios';
import qs from 'qs';
import { v4 as uuid } from 'uuid';

// Set once, preferably externally
const PLEX_ID = process.env.PLEX_ID ?? uuid();
const PLEX_URL = process.env.PLEX_URL ?? 'http://127.0.0.1:32400';

export interface PlexApiOptions {
  authToken?: string;
}

export class PlexApi {
  private authToken?: string;
  private readonly xhr: AxiosInstance;

  constructor(options: PlexApiOptions = {}) {
    const { authToken } = options;

    if (authToken) {
      this.authToken = authToken;
    }

    this.xhr = axios.create({
      baseURL: PLEX_URL,
      headers: {
        'X-Plex-Product': 'iMobs Plex TV',
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

  public authUrl({ code }: Pin, forwardUrl: string) {
    const baseUrl = 'https://app.plex.tv/auth#?';
    const params = qs.stringify({
      clientID: PLEX_ID,
      code,
      forwardUrl,
      context: { device: { product: 'iMobs Plex TV' } },
    });

    return baseUrl + params;
  }

  public async getUser() {
    const res = await this.xhr.get<User>('https://plex.tv/api/v2/user');

    return res.data;
  }
}

export interface Pin {
  id: number;
  code: string;
  authToken?: string;
}

export interface User {
  authToken: string;
}
