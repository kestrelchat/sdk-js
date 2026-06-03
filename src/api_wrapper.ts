import { FetchHandler } from './fetch_handler.ts';
import { ModularRequest } from './modular_request.ts';
import type {
  $Meta,
  $ChangePasswordRequest,
  $ConfirmEnableTotpRequest,
  $DisableTotpRequest,
  $EnableTotpResponse,
  $LoginMfaStepRequest,
  $LoginRequest,
  $LoginResponse,
  $LoginResponseSuccess,
  $RegisterRequest,
  $RegisterResponse,
  $SessionResponse,
  $GetSelfResponse,
  $CreateRelationshipRequest,
} from './types/schemas';

export interface $APIError {
  error: {
    code: string;
    status: number;
    message?: string;
  };
  request_id: string;
}

export interface $APIResponseSuccess<T> {
  success: true;
  result: T;
}

export interface $APIResponseFail {
  success: false;
  result: $APIError;
}

export type $APIResponse<T> = Promise<
  $APIResponseSuccess<T> | $APIResponseFail
>;

export async function APIResponseToJSON<T>(
  response: Response,
): Promise<$APIResponse<T>> {
  try {
    if (response.ok) return { success: true, result: await response.json() };
    else throw new Error('Request failed');
  } catch (e) {
    return {
      success: false,
      result: {
        error: {
          code: response.statusText,
          status: response.status,
          message: `[ResponseToJSON] Failed to parse response. ${e}`,
        },
        request_id: '-1',
      },
    };
  }
}

export async function APIResponseToString(
  response: Response,
): Promise<$APIResponse<string>> {
  try {
    if (response.ok) return { success: true, result: await response.text() };
    else throw new Error('Request failed');
  } catch (e) {
    return {
      success: false,
      result: {
        error: {
          code: response.statusText,
          status: response.status,
          message: `[ResponseToString] Failed to parse response. ${e}`,
        },
        request_id: '-1',
      },
    };
  }
}

export async function APIResponseEmpty(
  response: Response,
): Promise<$APIResponse<undefined>> {
  try {
    if (response.ok) return { success: true, result: undefined };
    else throw new Error('Request failed');
  } catch (e) {
    return {
      success: false,
      result: {
        error: {
          code: response.statusText,
          status: response.status,
          message: `[ResponseToString] Failed to parse response. ${e}`,
        },
        request_id: '-1',
      },
    };
  }
}

export class API {
  private session_id!: string;
  private auth_token!: string;
  private base_url: string;

  constructor(base_url: string) {
    this.base_url = base_url;
    // PromptLogin -> this.session_id = session_id;
  }

  async CheckLogin() {
    if (!this.auth_token) console.log('You are not logged in. Please log in!');
    return;
  }

  async GetMeta() {
    return await FetchHandler<$APIResponse<$Meta>>(
      new ModularRequest(`${this.base_url}/`),
      APIResponseToJSON,
    );
  }

  async GetUserCount() {
    return await FetchHandler<$APIResponse<number>>(
      new ModularRequest(`${this.base_url}/users/count`),
      APIResponseToJSON,
    );
  }

  async Register(register_request: $RegisterRequest) {
    return await FetchHandler<$APIResponse<$RegisterResponse>>(
      new ModularRequest(
        `${this.base_url}/auth/register`,
      ).POST.ApplicationJson.Body(register_request),
      APIResponseToJSON,
    );
  }

  async Login(login_request: $LoginRequest) {
    let response = await FetchHandler<$APIResponse<$LoginResponse>>(
      new ModularRequest(
        `${this.base_url}/auth/login`,
      ).POST.ApplicationJson.Body(login_request),
      APIResponseToJSON,
    );
    if (response?.success && response.result.status === 'Success')
      this.auth_token = response.result.auth_token;
    return response;
  }

  async LoginMfaStep(login_mfa_step_request: $LoginMfaStepRequest) {
    let response = await FetchHandler<$APIResponse<$LoginResponseSuccess>>(
      new ModularRequest(
        `${this.base_url}/auth/login/mfa`,
      ).POST.ApplicationJson.Body(login_mfa_step_request),
      APIResponseToJSON,
    );
    if (response?.success && response.result.status === 'Success')
      this.auth_token = response.result.auth_token;
    return response;
  }

  async Logout() {
    // Logs out current session
    await this.CheckLogin();
    return await FetchHandler(
      new ModularRequest(
        `${this.base_url}/auth/logout`,
      ).POST.ApplicationJson.BearerAuth(this.auth_token),
      APIResponseEmpty,
    );
  }

  async ChangePassword(change_password_request: $ChangePasswordRequest) {
    await this.CheckLogin();
    return await FetchHandler(
      new ModularRequest(
        `${this.base_url}/auth/password/change`,
      ).POST.ApplicationJson.BearerAuth(this.auth_token).Body(
        change_password_request,
      ),
      APIResponseEmpty,
    );
  }

  async EnableTotp() {
    await this.CheckLogin();
    return await FetchHandler<$APIResponse<$EnableTotpResponse>>(
      new ModularRequest(
        `${this.base_url}/auth/mfa/totp`,
      ).POST.ApplicationJson.BearerAuth(this.auth_token),
      APIResponseToJSON,
    );
  }

  async ConfirmEnableTotp(
    confirm_enable_totp_request: $ConfirmEnableTotpRequest,
  ) {
    await this.CheckLogin();
    return await FetchHandler(
      new ModularRequest(
        `${this.base_url}/auth/mfa/totp/confirm`,
      ).POST.ApplicationJson.BearerAuth(this.auth_token).Body(
        confirm_enable_totp_request,
      ),
      APIResponseEmpty,
    );
  }

  async DisableTotp(disable_totp_request: $DisableTotpRequest) {
    await this.CheckLogin();
    return await FetchHandler(
      new ModularRequest(
        `${this.base_url}/auth/mfa/totp`,
      ).DELETE.ApplicationJson.BearerAuth(this.auth_token).Body(
        disable_totp_request,
      ),
      APIResponseEmpty,
    );
  }

  async GetSessions() {
    await this.CheckLogin();
    return await FetchHandler<$APIResponse<$SessionResponse>>(
      new ModularRequest(
        `${this.base_url}/auth/sessions`,
      ).GET.ApplicationJson.BearerAuth(this.auth_token),
      APIResponseToJSON,
    );
  }

  async RevokeSession(session: string) {
    // Log out specific session
    await this.CheckLogin();
    return await FetchHandler(
      new ModularRequest(
        `${this.base_url}/auth/sessions/${session}`,
      ).DELETE.ApplicationJson.BearerAuth(this.auth_token),
      APIResponseEmpty,
    );
  }

  async RevokeOtherSessions() {
    await this.CheckLogin();
    return await FetchHandler(
      new ModularRequest(
        `${this.base_url}/auth/sessions`,
      ).DELETE.ApplicationJson.BearerAuth(this.auth_token),
      APIResponseEmpty,
    );
  }

  async RevokeAllSessions() {
    await this.CheckLogin();
    return await this.RevokeOtherSessions().then(this.Logout);
  }

  async GetSelf() {
    await this.CheckLogin();
    return await FetchHandler<$APIResponse<$GetSelfResponse>>(
      new ModularRequest(
        `${this.base_url}/users/@me`,
      ).GET.ApplicationJson.BearerAuth(this.auth_token),
      APIResponseToJSON,
    );
  }

  async FriendUser(target_id: string) {
    await this.CheckLogin();
    return await this.SetRelationship(target_id, {
      action: 'friend',
    });
  }

  async BlockUser(target_id: string) {
    await this.CheckLogin();
    return await this.SetRelationship(target_id, {
      action: 'block',
    });
  }

  async SetRelationship(
    target_id: string,
    create_relationship_request: $CreateRelationshipRequest,
  ) {
    await this.CheckLogin();
    return await FetchHandler<$APIResponse<$GetSelfResponse>>(
      new ModularRequest(
        `${this.base_url}/users/@me/relationships/${target_id}`,
      ).POST.ApplicationJson.BearerAuth(this.auth_token).Body(
        create_relationship_request,
      ),
      APIResponseToJSON,
    );
  }
}
