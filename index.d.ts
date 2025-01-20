import { Router } from 'next/router';
export interface E3EventMap {
    routechangestart: E3RouterEvent;
    beforehistorychange: E3RouterEvent;
    routechangecomplete: E3RouterEvent;
    routechangeerror: E3RouterErrorEvent;
}
export interface E3Router {
    url: string;
    shallow: boolean;
}
export interface E3RouterError extends E3Router {
    error: Error;
}
export declare class E3RouterEvent extends CustomEvent<E3Router> {
}
export declare class E3RouterErrorEvent extends CustomEvent<E3RouterError> {
}
export interface Community {
    qna(params: Partial<CommunityParams>): AsyncGenerator<QnaList, void, CommunityParams | void>;
    tips(params: Partial<CommunityParams>): AsyncGenerator<never, void, unknown>;
    entrystory(params: Partial<CommunityParams>): AsyncGenerator<never, void, unknown>;
    notice(params: Partial<CommunityParams>): AsyncGenerator<never, void, unknown>;
}
export interface CommunityParams {
    start: number;
    sort: 'created' | 'score' | 'visit' | 'likesLength';
    query: string;
    term: 'today' | 'week' | 'month' | 'quarter';
    /**
     * 50 이하의 숫자만 가능
     */
    display: number;
}
export interface QnaList {
}
export interface Qna {
}
export default class E3 extends EventTarget {
    #private;
    constructor();
    qna(params: Partial<CommunityParams>): AsyncGenerator<QnaList, void, void>;
    get onroutechangestart(): ((this: E3, ev: E3EventMap["routechangestart"]) => any) | null;
    set onroutechangestart(handler: ((this: E3, ev: E3EventMap["routechangestart"]) => any) | null);
    get onbeforehistorychange(): ((this: E3, ev: E3EventMap["beforehistorychange"]) => any) | null;
    set onbeforehistorychange(handler: ((this: E3, ev: E3EventMap["beforehistorychange"]) => any) | null);
    get onroutechangecomplete(): ((this: E3, ev: E3EventMap["routechangecomplete"]) => any) | null;
    set onroutechangecomplete(handler: ((this: E3, ev: E3EventMap["routechangecomplete"]) => any) | null);
    get onroutechangeerror(): ((this: E3, ev: E3EventMap["routechangeerror"]) => any) | null;
    set onroutechangeerror(handler: ((this: E3, ev: E3EventMap["routechangeerror"]) => any) | null);
}
export default interface E3 extends EventTarget {
    addEventListener<K extends keyof E3EventMap>(type: K, listener: (this: E3, ev: E3EventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof E3EventMap>(type: K, listener: (this: E3, ev: E3EventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
export declare namespace next {
    const version = "14.1.0";
    const router: Router;
}
