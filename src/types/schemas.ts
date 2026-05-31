export interface $RegistrationMeta {
  minimum_age: number;
}

export interface $HcaptchaMeta {
  enabled: boolean;
  sitekey?: string; // if present, store somewhere
}

export interface $FeaturesMeta {
  registration: $RegistrationMeta;
  hcaptcha: $HcaptchaMeta;
}

export interface $InstanceMeta {
  name: string;
  domain: string;
  description?: string;
}

export interface $Meta {
  kestrel: string;
  features: $FeaturesMeta;
  instance: $InstanceMeta;
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

export type $LoginResponseStatus =
  | 'Success'
  | 'RequiresMfa';

export interface $LoginRequest {
  email: string;
  password: string;
  hcaptcha_token?: string; // optional if disabled/not present in meta ?
}

export interface $LoginMfaStepRequest {
  temp_code: string;
  code: string;
}

export interface $LoginResponseShared {
  description?: string;
}

export interface $LoginResponseSuccess extends $LoginResponseShared {
  status: 'Success';
  auth_token: string;
  refresh_token: string;
}

export type $MfaMethod =
  | 'Totp'

export interface $LoginResponseMfa extends $LoginResponseShared {
  status: 'RequiresMfa';
  temp_token: string;
  method: $MfaMethod;
}

export type $LoginResponse = $LoginResponseSuccess | $LoginResponseMfa;

export interface $ChangePasswordRequest {
  email: string;
  old_password: string;
  new_password: string;
}

export interface $SessionView {
  id: string;
  country?: string;
  region?: string;
  city?: string;
  operating_system?: string;
  platform?: string;
  last_used_at: string;
}

export type $SessionResponse = { sessions: $SessionView[] };

export interface $EnableTotpResponse {
  uri: string;
  secret: string;
  temp_token: string;
}

export interface $ConfirmEnableTotpRequest {
  temp_token: string;
  code: string;
  password: string;
}

export interface $DisableTotpRequest {
  password: string;
}
