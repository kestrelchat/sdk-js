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
  success: true,
  result: T
}

export interface $APIResponseFail {
  success: false,
  result: $APIError
}

export type $APIResponse<T> = Promise<$APIResponseSuccess<T> | $APIResponseFail>;

export async function APIResponseToJSON<T>(
  response: Response,
): Promise<$APIResponse<T>> {
  try {
    if (response.ok) return { success: true, result: await response.json() }
    else throw new Error('Request failed');
  } catch (e) {
    return {
      success: false, result: {
        error: {
          code: response.statusText,
          status: response.status,
          message: `[ResponseToJSON] Failed to parse response. ${e}`
        },
        request_id: '-1'
      }
    };
  }
}

export async function APIResponseToString(
  response: Response,
): Promise<$APIResponse<string>> {
  try {
    if (response.ok) return { success: true, result: await response.text() }
    else throw new Error('Request failed');
  } catch (e) {
    return {
      success: false, result: {
        error: {
          code: response.statusText,
          status: response.status,
          message: `[ResponseToString] Failed to parse response. ${e}`
        },
        request_id: '-1'
      }
    };
  }
}

export async function APIResponseEmpty(
  response: Response,
): Promise<$APIResponse<undefined>> {
  try {
    if (response.ok) return { success: true, result: undefined }
    else throw new Error('Request failed');
  } catch (e) {
    return {
      success: false, result: {
        error: {
          code: response.statusText,
          status: response.status,
          message: `[ResponseToString] Failed to parse response. ${e}`
        },
        request_id: '-1'
      }
    };
  }
}

export async function GetMeta(base_url: string) {
  return await FetchHandler<$APIResponse<$Meta>>(
    new ModularRequest(`${base_url}/`)
    , APIResponseToJSON
  );
}

export async function GetUserCount(base_url: string) {
  return await FetchHandler<$APIResponse<number>>(
    new ModularRequest(`${base_url}/users/count`)
    , APIResponseToJSON
  )
}

export async function Register(
  base_url: string,
  register_request: $RegisterRequest,
) {
  return await FetchHandler<$APIResponse<$RegisterResponse>>(
    new ModularRequest(`${base_url}/auth/register`)
      .POST
      .ApplicationJson
      .Body(register_request)
    , APIResponseToJSON
  );
}

export async function Login(
  base_url: string,
  login_request: $LoginRequest,
) {
  return await FetchHandler<$APIResponse<$LoginResponse>>(
    new ModularRequest(`${base_url}/auth/login`)
      .POST
      .ApplicationJson
      .Body(login_request)
    , APIResponseToJSON
  );
}

export async function LoginMfaStep(
  base_url: string,
  login_mfa_step_request: $LoginMfaStepRequest,
) {
  return await FetchHandler<$APIResponse<$LoginResponseSuccess>>(
    new ModularRequest(`${base_url}/auth/login/mfa`)
      .POST
      .ApplicationJson
      .Body(login_mfa_step_request)
    , APIResponseToJSON
  )
}

export async function Logout(
  base_url: string,
  auth_token: string,
) {
  return await FetchHandler(
    new ModularRequest(`${base_url}/auth/logout`)
      .POST
      .ApplicationJson
      .BearerAuth(auth_token)
    , APIResponseEmpty
  );
}

export async function ChangePassword(
  base_url: string,
  change_password_request: $ChangePasswordRequest,
  auth_token: string,
) {
  return await FetchHandler(
    new ModularRequest(`${base_url}/auth/password/change`)
      .POST
      .ApplicationJson
      .BearerAuth(auth_token)
      .Body(change_password_request)
    , APIResponseEmpty
  );
}

export async function EnableTotp(
  base_url: string,
  auth_token: string
) {
  return await FetchHandler<$APIResponse<$EnableTotpResponse>>(
    new ModularRequest(`${base_url}/auth/mfa/totp`)
      .POST
      .ApplicationJson
      .BearerAuth(auth_token)
    , APIResponseToJSON
  );
}

export async function ConfirmEnableTotp(
  base_url: string,
  confirm_enable_totp_request: $ConfirmEnableTotpRequest,
  auth_token: string
) {
  return await FetchHandler(
    new ModularRequest(`${base_url}/auth/mfa/totp/confirm`)
      .POST
      .ApplicationJson
      .BearerAuth(auth_token)
      .Body(confirm_enable_totp_request)
    , APIResponseEmpty
  )
}

export async function DisableTotp(
  base_url: string,
  disable_totp_request: $DisableTotpRequest,
  auth_token: string
) {
  return await FetchHandler(
    new ModularRequest(`${base_url}/auth/mfa/totp`)
      .DELETE
      .ApplicationJson
      .BearerAuth(auth_token)
      .Body(disable_totp_request)
    , APIResponseEmpty
  )
}

export async function GetSessions(
  base_url: string,
  auth_token: string,
) {
  return await FetchHandler<$APIResponse<$SessionResponse>>(
    new ModularRequest(`${base_url}/auth/sessions`)
      .GET
      .ApplicationJson
      .BearerAuth(auth_token)
    , APIResponseToJSON
  )
}

export async function DisableSession(
  base_url: string,
  session: string,
  auth_token: string,
) {
  return await FetchHandler(
    new ModularRequest(`${base_url}/auth/sessions/${session}`)
      .DELETE
      .ApplicationJson
      .BearerAuth(auth_token)
    , APIResponseEmpty
  )
}

export async function DisableAllSessions(
  base_url: string,
  auth_token: string,
) {
  return await FetchHandler(
    new ModularRequest(`${base_url}/auth/sessions`)
      .DELETE
      .ApplicationJson
      .BearerAuth(auth_token)
    , APIResponseEmpty
  )
}