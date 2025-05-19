import { NextRequest } from 'next/server';
import { APIError } from './api-error-handler';

export const getIdFromReq = (request: NextRequest) => {
  const id = request.nextUrl.pathname.split('/').pop();
  if (!id) throw new APIError('Instrument ID is required', 400);
  return id;
};
