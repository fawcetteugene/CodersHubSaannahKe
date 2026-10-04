'use client';
import { useEffect } from 'react';
import { flushSync } from 'react-dom';
type SiteTool={name:string;title:string;description:string;inputSchema:object;annotations:{readOnlyHint:boolean;untrustedContentHint:boolean};execute:(input:unknown)=>unknown};
export function useSearchTool(setQuery:(q:string)=>void,find:(q:string)=>{title:string;href:string;kind:string}[]){
 useEffect(()=>{const context=(document as Document&{modelContext?:{registerTool:(t:SiteTool,o:{signal:AbortSignal})=>void|Promise<void>}}).modelContext;if(!context?.registerTool)return;const lifecycle=new AbortController();
  try{Promise.resolve(context.registerTool({name:'search_savannacode',title:'Search SavannaCode',description:'Search services, technologies, project ideas, and guides. Updates the visible search results without submitting an inquiry.',inputSchema:{type:'object',properties:{query:{type:'string',minLength:1,maxLength:100}},required:['query'],additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute(input){if(!input||typeof input!=='object'||!('query'in input)||typeof input.query!=='string'||!input.query.trim()||input.query.length>100)throw new Error('Provide a search query from 1 to 100 characters.');const q=input.query.trim();flushSync(()=>setQuery(q));return {query:q,results:find(q).map(r=>({title:r.title,path:r.href,type:r.kind}))}}},{signal:lifecycle.signal})).catch(()=>{})}catch{}return ()=>lifecycle.abort();
 },[setQuery,find]);
}
