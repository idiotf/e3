export class E3RouterEvent extends CustomEvent {
}
export class E3RouterErrorEvent extends CustomEvent {
}
export default class E3 extends EventTarget {
    #onroutechangestart = null;
    #onbeforehistorychange = null;
    #onroutechangecomplete = null;
    #onroutechangeerror = null;
    constructor() {
        super();
        next.router.events.on('routeChangeStart', (url, { shallow }) => this.dispatchEvent(new E3RouterEvent('routerchangestart', { detail: { url, shallow } })));
        next.router.events.on('beforeHistoryChange', (url, { shallow }) => this.dispatchEvent(new E3RouterEvent('beforehistorychange', { detail: { url, shallow } })));
        next.router.events.on('routeChangeComplete', (url, { shallow }) => this.dispatchEvent(new E3RouterEvent('routechangecomplete', { detail: { url, shallow } })));
        next.router.events.on('routeChangeError', (error, url, { shallow }) => this.dispatchEvent(new E3RouterErrorEvent('routechangeerror', { detail: { error, url, shallow } })));
    }
    async #request(queryName, query, variables, signal) {
        const props = next.router.components[next.router.pathname].props;
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Csrf-Token': props.initialProps.csrfToken,
        });
        if (props.initialState.common.user)
            headers.set('X-Token', props.initialState.common.user?.xToken);
        const request = new Request(`https://playentry.org/graphql/${queryName}`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ query, variables }),
            signal,
        });
        const v = await fetch(request);
        return v.json();
    }
    async *qna(params) {
        const query = `query SELECT_QNA_LIST(
$pageParam:PageParam
$query:String
$user:String
$category:String
$term:String
$prefix:String
$progress:String
$discussType:String
$searchType:String
$searchAfter:JSON
$tag:String
){
discussList(
pageParam:$pageParam
query:$query
user:$user
category:$category
term:$term
prefix:$prefix
progress:$progress
discussType:$discussType
searchType:$searchType
searchAfter:$searchAfter
tag:$tag
){
total
list{
id
title
created
commentsLength
likesLength
visit
user{
id
nickname
username
profileImage{
id
name
label{
ko
en
ja
vn
}
filename
imageType
dimension{
width
height
}
trimmed{
filename
width
height
}
}
status{
following
follower
}
description
role
mark{
id
name
label{
ko
en
ja
vn
}
filename
imageType
dimension{
width
height
}
trimmed{
filename
width
height
}
}
}
bestComment{
content
}
thumbnail
}
searchAfter
}
}`;
        const variables = {
            category: 'qna',
            searchType: 'page',
            term: params.term || 'all',
            pageParam: {
                start: params.start || 0,
                display: params.display || 10,
            },
        };
        for (;;) {
            const qnaList = await this.#request('SELECT_QNA_LIST', query, variables);
            if (qnaList.error)
                throw qnaList.error;
            if (!qnaList.data.discussList.list[0])
                return;
            else
                for (const qna of qnaList)
                    yield qna;
        }
    }
    get onroutechangestart() {
        return this.#onroutechangestart;
    }
    set onroutechangestart(handler) {
        if (this.#onroutechangestart)
            this.removeEventListener('routechangestart', this.#onroutechangestart);
        this.#onroutechangestart = handler;
        if (handler)
            this.addEventListener('routechangestart', handler);
    }
    get onbeforehistorychange() {
        return this.#onbeforehistorychange;
    }
    set onbeforehistorychange(handler) {
        if (this.#onbeforehistorychange)
            this.removeEventListener('beforehistorychange', this.#onbeforehistorychange);
        this.#onbeforehistorychange = handler;
        if (handler)
            this.addEventListener('beforehistorychange', handler);
    }
    get onroutechangecomplete() {
        return this.#onroutechangecomplete;
    }
    set onroutechangecomplete(handler) {
        if (this.#onroutechangecomplete)
            this.removeEventListener('routechangecomplete', this.#onroutechangecomplete);
        this.#onroutechangecomplete = handler;
        if (handler)
            this.addEventListener('routechangecomplete', handler);
    }
    get onroutechangeerror() {
        return this.#onroutechangeerror;
    }
    set onroutechangeerror(handler) {
        if (this.#onroutechangeerror)
            this.removeEventListener('routechangeerror', this.#onroutechangeerror);
        this.#onroutechangeerror = handler;
        if (handler)
            this.addEventListener('routechangeerror', handler);
    }
}
//# sourceMappingURL=index.js.map