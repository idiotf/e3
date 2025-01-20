import { Router } from 'next/router'

export interface E3EventMap {
  routechangestart: E3RouterEvent
  beforehistorychange: E3RouterEvent
  routechangecomplete: E3RouterEvent
  routechangeerror: E3RouterErrorEvent
}

export interface E3Router {
  url: string
  shallow: boolean
}

export interface E3RouterError extends E3Router {
  error: Error
}

export class E3RouterEvent extends CustomEvent<E3Router> {}

export class E3RouterErrorEvent extends CustomEvent<E3RouterError> {}

interface EntryProps {
  initialProps: {
    csrfToken: string
  }
  initialState: {
    common: {
      user: {
        xToken: string
      } | null
    }
  }
}

export interface Community {
  qna(params: Partial<CommunityParams>): AsyncGenerator<QnaList, void, CommunityParams | void>
  tips(params: Partial<CommunityParams>): AsyncGenerator<never, void, unknown>
  entrystory(params: Partial<CommunityParams>): AsyncGenerator<never, void, unknown>
  notice(params: Partial<CommunityParams>): AsyncGenerator<never, void, unknown>
}

export interface CommunityParams {
  start: number
  sort: 'created' | 'score' | 'visit' | 'likesLength'
  query: string
  term: 'today' | 'week' | 'month' | 'quarter'
  /**
   * 50 이하의 숫자만 가능
   */
  display: number
}

export interface QnaList {

}

export interface Qna {
  
}

export default class E3 extends EventTarget {
  #onroutechangestart: ((this: E3, ev: E3EventMap['routechangestart']) => any) | null = null
  #onbeforehistorychange: ((this: E3, ev: E3EventMap['beforehistorychange']) => any) | null = null
  #onroutechangecomplete: ((this: E3, ev: E3EventMap['routechangecomplete']) => any) | null = null
  #onroutechangeerror: ((this: E3, ev: E3EventMap['routechangeerror']) => any) | null = null

  constructor() {
    super()
    next.router.events.on('routeChangeStart', (url, { shallow }) => this.dispatchEvent(new E3RouterEvent('routerchangestart', { detail: { url, shallow } })))
    next.router.events.on('beforeHistoryChange', (url, { shallow }) => this.dispatchEvent(new E3RouterEvent('beforehistorychange', { detail: { url, shallow } })))
    next.router.events.on('routeChangeComplete', (url, { shallow }) => this.dispatchEvent(new E3RouterEvent('routechangecomplete', { detail: { url, shallow } })))
    next.router.events.on('routeChangeError', (error, url, { shallow }) => this.dispatchEvent(new E3RouterErrorEvent('routechangeerror', { detail: { error, url, shallow } })))
  }

  async #request(queryName: string, query: string, variables: object, signal?: AbortSignal) {
    const props = next.router.components[next.router.pathname].props as EntryProps
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Csrf-Token': props.initialProps.csrfToken,
    })
    if (props.initialState.common.user) headers.set('X-Token', props.initialState.common.user?.xToken)
    const request = new Request(`https://playentry.org/graphql/${queryName}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
      signal,
    })
    const v = await fetch(request)
    return v.json()
  }

  async *qna(params: Partial<CommunityParams>): AsyncGenerator<QnaList, void, void> {
    const query = 'query SELECT_QNA_LIST(\n$pageParam:PageParam\n$query:String\n$user:String\n$category:String\n$term:String\n$prefix:String\n$progress:String\n$discussType:String\n$searchType:String\n$searchAfter:JSON\n$tag:String\n){\ndiscussList(\npageParam:$pageParam\nquery:$query\nuser:$user\ncategory:$category\nterm:$term\nprefix:$prefix\nprogress:$progress\ndiscussType:$discussType\nsearchType:$searchType\nsearchAfter:$searchAfter\ntag:$tag\n){\ntotal\nlist{\nid\ntitle\ncreated\ncommentsLength\nlikesLength\nvisit\nuser{\nid\nnickname\nusername\nprofileImage{\nid\nname\nlabel{\nko\nen\nja\nvn\n}\nfilename\nimageType\ndimension{\nwidth\nheight\n}\ntrimmed{\nfilename\nwidth\nheight\n}\n}\nstatus{\nfollowing\nfollower\n}\ndescription\nrole\nmark{\nid\nname\nlabel{\nko\nen\nja\nvn\n}\nfilename\nimageType\ndimension{\nwidth\nheight\n}\ntrimmed{\nfilename\nwidth\nheight\n}\n}\n}\nbestComment{\ncontent\n}\nthumbnail\n}\nsearchAfter\n}\n}'
    const variables = {
      category: 'qna',
      searchType: 'page',
      term: params.term || 'all',
      pageParam: {
        start: params.start || 0,
        display: params.display || 10,
      },
    }
    for (;;) {
      const qnaList = await this.#request('SELECT_QNA_LIST', query, variables)
      if (qnaList.error) throw qnaList.error
      if (!qnaList.data.discussList.list[0]) return
      else for (const qna of qnaList) yield qna
    }
  }

  get onroutechangestart() {
    return this.#onroutechangestart
  }

  set onroutechangestart(handler) {
    if (this.#onroutechangestart) this.removeEventListener('routechangestart', this.#onroutechangestart)
    this.#onroutechangestart = handler
    if (handler) this.addEventListener('routechangestart', handler)
  }

  get onbeforehistorychange() {
    return this.#onbeforehistorychange
  }

  set onbeforehistorychange(handler) {
    if (this.#onbeforehistorychange) this.removeEventListener('beforehistorychange', this.#onbeforehistorychange)
    this.#onbeforehistorychange = handler
    if (handler) this.addEventListener('beforehistorychange', handler)
  }

  get onroutechangecomplete() {
    return this.#onroutechangecomplete
  }

  set onroutechangecomplete(handler) {
    if (this.#onroutechangecomplete) this.removeEventListener('routechangecomplete', this.#onroutechangecomplete)
    this.#onroutechangecomplete = handler
    if (handler) this.addEventListener('routechangecomplete', handler)
  }

  get onroutechangeerror() {
    return this.#onroutechangeerror
  }

  set onroutechangeerror(handler) {
    if (this.#onroutechangeerror) this.removeEventListener('routechangeerror', this.#onroutechangeerror)
    this.#onroutechangeerror = handler
    if (handler) this.addEventListener('routechangeerror', handler)
  }
}

export default interface E3 extends EventTarget {
  addEventListener<K extends keyof E3EventMap>(type: K, listener: (this: E3, ev: E3EventMap[K]) => any, options?: boolean | AddEventListenerOptions): void // eslint-disable-line @typescript-eslint/no-explicit-any
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void
  removeEventListener<K extends keyof E3EventMap>(type: K, listener: (this: E3, ev: E3EventMap[K]) => any, options?: boolean | EventListenerOptions): void // eslint-disable-line @typescript-eslint/no-explicit-any
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void
}

export declare namespace next {
  export const version = '14.1.0'
  export const router: Router
}
