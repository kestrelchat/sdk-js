import { FetchWrapper } from './fetch_wrapper';
import type { $FetchWrapperArgs } from './fetch_wrapper';
import type { $ChangePasswordRequest, $Error, $LoginRequest, $LoginResponse, $Meta, $RegisterRequest, $RegisterResponse, $SessionResponse } from './types/schemas';

export type $SuccessOrError<T> = Promise<
    | { success: true, result: T }
    | { success: false, result: $Error }
>;

export async function ResponseToJSON<T>(response: Response): $SuccessOrError<T> {
    let result;
    try {
        result = await response.json();
        return { success: response.ok, result };
    } catch (e) {
        return { success: response.ok, result: undefined as never } // I don't know anymore
    };
};

export const APPLICATION_JSON = {
    'content-type': 'application/json',
    'accept': 'application/json'
};

export const DEFAULT_GET_WRAPPER_ARGS: $FetchWrapperArgs = {
    init: {
        headers: APPLICATION_JSON,
        method: 'GET'
    },
    handler: ResponseToJSON
}

export const DEFAULT_POST_WRAPPER_ARGS: $FetchWrapperArgs = {
    init: {
        headers: APPLICATION_JSON,
        method: 'POST'
    },
    handler: ResponseToJSON
}

export async function GetMeta(base_url: string): $SuccessOrError<$Meta> {
    return await FetchWrapper(`${base_url}/`, DEFAULT_GET_WRAPPER_ARGS);
}

export async function GetUserCount(base_url: string): $SuccessOrError<number> {
    return await FetchWrapper(`${base_url}/users/count`, DEFAULT_GET_WRAPPER_ARGS);
}

export async function GetSessions(base_url: string, auth_token: string): $SuccessOrError<$SessionResponse> {
    return await FetchWrapper(`${base_url}/auth/sessions`, {
        handler: ResponseToJSON,
        init: {
            ...DEFAULT_GET_WRAPPER_ARGS.init,
            headers: {
                'authorization': `Bearer ${auth_token}`
            }
        }
    });
}

export async function Register(base_url: string, register_request: $RegisterRequest): $SuccessOrError<$RegisterResponse> {
    return await FetchWrapper(`${base_url}/auth/register`, {
        handler: ResponseToJSON,
        init: {
            ...DEFAULT_POST_WRAPPER_ARGS.init,
            body: JSON.stringify(register_request)
        }
    });
}

export async function Login(base_url: string, login_request: $LoginRequest): $SuccessOrError<$LoginResponse> {
    return await FetchWrapper(`${base_url}/auth/login`, {
        handler: ResponseToJSON,
        init: {
            ...DEFAULT_POST_WRAPPER_ARGS.init,
            body: JSON.stringify(login_request)
        }
    });
}

export async function ChangePassword(base_url: string, change_password_request: $ChangePasswordRequest): $SuccessOrError<void> {
    return await FetchWrapper(`${base_url}/auth/password/change`, {
        handler: ResponseToJSON,
        init: {
            ...DEFAULT_POST_WRAPPER_ARGS.init,
            body: JSON.stringify(change_password_request)
        }
    });
}