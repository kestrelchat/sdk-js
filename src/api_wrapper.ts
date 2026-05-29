import { FetchWrapper } from './fetch_wrapper.ts';
import type { $FetchWrapperArgs } from './fetch_wrapper.ts';
import type {
  $ChangePasswordRequest,
  $ConfirmEnableTotpRequest,
  $DisableTotpRequest,
  $EnableTotpResponse,
  $Error,
  $LoginMfaStepRequest,
  $LoginRequest,
  $LoginResponse,
  $LoginResponseDefault as $LoginResponseSuccess,
  $Meta,
  $RegisterRequest,
  $RegisterResponse,
  $SessionResponse,
} from './types/schemas';

export type $APIResponse<T> = Promise<
  { success: true; result: T } | { success: false; result: $Error }
>;

export async function ResponseToJSON<T>(
  response: Response,
): $APIResponse<T> {
  let result;
  try {
    result = await response.json();
    return { success: response.ok, result };
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

export function BEARER_AUTH(auth_token: string) {
  return { authorization: `Bearer ${auth_token}` }
}

export const APPLICATION_JSON = {
  'content-type': 'application/json',
  accept: 'application/json',
};

export const DEFAULT_GET_WRAPPER_ARGS: $FetchWrapperArgs = {
  init: {
    headers: APPLICATION_JSON,
    method: 'GET',
  },
  handler: ResponseToJSON,
};

export const DEFAULT_POST_WRAPPER_ARGS: $FetchWrapperArgs = {
  init: {
    headers: APPLICATION_JSON,
    method: 'POST',
  },
  handler: ResponseToJSON,
};

export const DEFAULT_DELETE_WRAPPER_ARGS: $FetchWrapperArgs = {
  init: {
    headers: APPLICATION_JSON,
    method: 'DELETE',
  },
  handler: ResponseToJSON,
};

export async function GetMeta(base_url: string): $APIResponse<$Meta> {
  return await FetchWrapper(`${base_url}/`, DEFAULT_GET_WRAPPER_ARGS);
}

export async function GetUserCount(base_url: string): $APIResponse<number> {
  return await FetchWrapper(
    `${base_url}/users/count`,
    DEFAULT_GET_WRAPPER_ARGS,
  );
}

export async function Register(
  base_url: string,
  register_request: $RegisterRequest,
): $APIResponse<$RegisterResponse> {
  return await FetchWrapper(`${base_url}/auth/register`, {
    ...DEFAULT_POST_WRAPPER_ARGS,
    init: {
      ...DEFAULT_POST_WRAPPER_ARGS.init,
      body: JSON.stringify(register_request),
    },
  });
}

export async function Login(
  base_url: string,
  login_request: $LoginRequest,
): $APIResponse<$LoginResponse> {
  return await FetchWrapper(`${base_url}/auth/login`, {
    ...DEFAULT_POST_WRAPPER_ARGS,
    init: {
      ...DEFAULT_POST_WRAPPER_ARGS.init,
      body: JSON.stringify(login_request),
    },
  });
}

export async function LoginMfaStep(
  base_url: string,
  login_mfa_step_request: $LoginMfaStepRequest,
): $APIResponse<$LoginResponseSuccess> {
  return await FetchWrapper(`${base_url}/auth/login/mfa`, {
    ...DEFAULT_POST_WRAPPER_ARGS,
    init: {
      ...DEFAULT_POST_WRAPPER_ARGS.init,
      body: JSON.stringify(login_mfa_step_request),
    },
  });
}

export async function ChangePassword(
  base_url: string,
  change_password_request: $ChangePasswordRequest,
): $APIResponse<void> {
  return await FetchWrapper(`${base_url}/auth/password/change`, {
    ...DEFAULT_POST_WRAPPER_ARGS,
    init: {
      ...DEFAULT_POST_WRAPPER_ARGS.init,
      body: JSON.stringify(change_password_request),
    },
  });
}

export async function EnableTotp(
  base_url: string,
  // auth_token: string
): $APIResponse<$EnableTotpResponse> {
  return await FetchWrapper(`${base_url}/auth/mfa/totp`, {
    ...DEFAULT_POST_WRAPPER_ARGS,
    init: {
      // headers: BEARER_AUTH(auth_token),
      ...DEFAULT_POST_WRAPPER_ARGS.init,
      body: null,
    },
  });
}

export async function DisableTotp(
  base_url: string,
  disable_totp_request: $DisableTotpRequest,
  // auth_token: string
): $APIResponse<void> {
  return await FetchWrapper(`${base_url}/auth/mfa/totp`, {
    ...DEFAULT_DELETE_WRAPPER_ARGS,
    init: {
      // headers: BEARER_AUTH(auth_token),
      body: JSON.stringify(disable_totp_request),
    },
    ...DEFAULT_DELETE_WRAPPER_ARGS,
  });
}

export async function ConfirmEnableTotp(
  base_url: string,
  confirm_enable_totp_request: $ConfirmEnableTotpRequest,
  // auth_token: string
): $APIResponse<void> {
  return await FetchWrapper(`${base_url}/auth/mfa/totp/confirm`, {
    ...DEFAULT_POST_WRAPPER_ARGS,
    init: {
      ...DEFAULT_POST_WRAPPER_ARGS.init,
      // headers: BEARER_AUTH(auth_token),
      body: JSON.stringify(confirm_enable_totp_request),
    },
  });
}

export async function GetSessions(
  base_url: string,
  auth_token: string,
): $APIResponse<$SessionResponse> {
  return await FetchWrapper(`${base_url}/auth/sessions`, {
    ...DEFAULT_GET_WRAPPER_ARGS,
    init: {
      ...DEFAULT_GET_WRAPPER_ARGS.init,
      headers: BEARER_AUTH(auth_token),
    },
  });
}