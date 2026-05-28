export interface $FetchWrapperHandler {
    (res: Response, ...additional_params: any[]): any
}

export interface $FetchWrapperArgs {
    init?: RequestInit
    handler?: $FetchWrapperHandler
}

export async function FetchWrapper<T>(url: string, args: $FetchWrapperArgs): Promise<T> {
    const { init, handler } = args;
    return await fetch(url, init)
        .
        then(async (response) => ({
            info: response, // Saves original response as info
            result: (await handler?.(response)) // Applies callback on response
        }))
        .
        then(data => { // Determines cause of failure
            const { info, result } = data;
            !info.ok && console.log(`[FetchWrapper] Request to '${url}' Failed. Error: ${info.status} (${info.statusText})`);
            return result;
        })
        .
        catch(reason => { // Prevents unhandled exception
            console.log(`[FetchWrapper] Request to '${url}' Aborted. ${reason}`);
        });
}