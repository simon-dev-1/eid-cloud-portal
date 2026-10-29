import { apiClient } from './api.client';

export type VerificationState = 'PENDING' | 'SUCCESS' | 'FAILED' | 'EXPIRED';

export interface CreateVerificationResponse {
  verificationId: string;
  deeplink: string;
}

export interface UnlockResult {
  state: VerificationState;
  displayName?: string;
  vaultId?: string;
  masterKey?: string;
  error?: string;
}

export const createVerification = (): Promise<CreateVerificationResponse> =>
  apiClient.post<CreateVerificationResponse>('/api/v1/verifications');

export const getVerification = (id: string, signal?: AbortSignal): Promise<UnlockResult> =>
  apiClient.get<UnlockResult>(`/api/v1/verifications/${id}`, signal);
