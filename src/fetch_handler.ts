import { ModularRequest } from './modular_request.ts';

export type $FetchHandlerCallback<T> = (
  res: Response,
  err?: (reason: unknown) => PromiseLike<never>,
) => Promise<T>;

export async function FetchHandler<T>(
  src: ModularRequest | string,
  callback?: $FetchHandlerCallback<T>,
): Promise<T | undefined> {
  const url = typeof src === 'string' ? src : src.url;
  const init = typeof src === 'string' ? undefined : src.init;
  return await fetch(url, init)
    .then(async (response) => {
      return {
        info: response, // Saves a copy of the original response for error information
        result: await callback?.(response), // Applies callback on response
      };
    })
    .then((data) => {
      // Determines cause of failure (HTTP error)
      const { info, result } = data;
      !info.ok &&
        console.log(
          `[FetchHandler] Request to '${url}' Failed. Error: ${info.status} (${info.statusText})`,
          info,
        );
      return result;
    })
    .catch((reason) => {
      // Prevents unhandled exception (fetch error)
      console.log(`[FetchHandler] Request to '${url}' Aborted. ${reason}`);
      return undefined;
    });
}
