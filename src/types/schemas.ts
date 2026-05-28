export interface $Error {
  error: {
    code: string;
    status: number;
    message?: string;
  };
  request_id: string;
}

export interface $Meta {
  kestrel: string;
  features: $FeaturesMeta;
}

export interface $FeaturesMeta {
  registration: $RegistrationMeta;
}

export interface $RegistrationMeta {
  minimum_age: number;
}

export interface $RegisterRequest {
  email: string;
  username: string;
  password: string;
  birthday?: string;
}

export interface $RegisterResponse {
  id: string;
  email: string;
}

export interface $LoginRequest {
  email: string;
  password: string;
  token: string; // hcaptcha
}

export interface $LoginResponse {
  auth_token: string;
  refresh_token: string;
}

export interface $ChangePasswordRequest {
  email: string;
  old_password: string;
  new_password: string;
}

export interface $SessionView {
  id: string;
  last_used_at: string;
  operating_system?: string;
  platform?: string;
  country?: string;
  region?: string;
  city?: string;
}

export type $SessionResponse = $SessionView[];
