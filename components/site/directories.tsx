'use client';
import { useCallback, useMemo, useState } from 'react';
import { useSearchTool } from '@/lib/webmcp';
import { Search, Code2, Users, Calendar, DollarSign, Briefcase } from 'lucide-react';
import { technologies, projects, services, articles, projectCategories, groups, bookingServices, pricingPlans, jobListings } from '@/lib/content';
import { ServiceCard } from './shared';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
function NoResults({onReset}:{onReset:()=>void}){return <Empty className="empty-state"><EmptyHeader><EmptyTitle>No matches yet</EmptyTitle><EmptyDescription>Try another search term or explore all categories.</EmptyDescription></EmptyHeader><button className="button button-outline" onClick={onReset}>Clear filters</button></Empty>}
function Filters({options,value,onChange}:{options:string[];value:string;onChange:(v:string)=>void}){return <div className="filter-bar" aria-label="Filter by category">{options.map(o=><button className="filter-chip" key={o} aria-pressed={o===value} onClick={()=>onChange(o)}>{o}</button>)}</div>}
function SearchField({value,onChange,label}:{value:string;onChange:(v:string)=>void;label:string}){return <div className="search-field"><Search size={18}/><input type="search" aria-label={label} placeholder={label} value={value} onChange={e=>onChange(e.target.value)} maxLength={100}/></div>}
export function TechnologyDirectory({compact=false,initialCategory='All technologies',initialQuery='',initialPage=1}:{compact?:boolean;initialCategory?:string;initialQuery?:string;initialPage?:number}){
 const categories=['All technologies',...new Set(technologies.map(t=>t.category))];
 const [category,setCategory]=useState(categories.includes(initialCategory)?initialCategory:'All technologies');
 const [query,setQuery]=useState(initialQuery);
 const [page,setPage]=useState(Number.isFinite(initialPage)?Math.max(1,Math.floor(initialPage)):1);
 const filtered=technologies.filter(t=>(category==='All technologies'||t.category===category)&&(t.title+' '+t.description+' '+t.category).toLowerCase().includes(query.toLowerCase()));
 const pageSize=9;
 const pages=Math.ceil(filtered.length/pageSize);
 const currentPage=Math.min(page,Math.max(1,pages));
 const shown=filtered.slice((currentPage-1)*pageSize,currentPage*pageSize);
 const reset=()=>{setCategory('All technologies');setQuery('');setPage(1)};
 const pageHref=(number:number)=>{
  const params=new URLSearchParams({page:String(number)});
  if(category!=='All technologies')params.set('category',category);
  if(query)params.set('q',query);
  return '/technologies?'+params.toString()+'#technology-directory';
 };
 return <div id="technology-directory">
  {!compact&&<div className="directory-toolbar"><SearchField value={query} onChange={q=>{setQuery(q);setPage(1)}} label="Search technologies"/><span className="results-count" aria-live="polite">{filtered.length} technologies</span></div>}
  <Filters options={categories} value={category} onChange={v=>{setCategory(v);setPage(1)}}/>
  <div className="technology-grid" aria-live="polite">{shown.length?shown.map(t=><article key={t.slug} className="technology-card"><div className="tech-card-top"><span className="tech-kind">{t.kind}</span><span className="tech-mark" aria-hidden="true">{t.mark}</span></div><h3><a href={'/technologies/'+t.slug}>{t.title}</a></h3><p>{t.description}</p><a href={'/technologies/'+t.slug} className="text-link">Learn more</a></article>):<NoResults onReset={reset}/>}</div>
  {pages>1&&<div className="pagination-wrapper"><Pagination aria-label="Technology pages"><PaginationContent>{Array.from({length:pages},(_,i)=><PaginationItem key={i}><PaginationLink href={pageHref(i+1)} isActive={currentPage===i+1} aria-label={'Technology page '+(i+1)} onClick={compact?e=>{if(e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey){e.preventDefault();setPage(i+1)}}:undefined}>{i+1}</PaginationLink></PaginationItem>)}</PaginationContent></Pagination></div>}
 </div>
}
export function ProjectDirectory({initialCategory='All projects'}:{initialCategory?:string}){
 const [category,setCategory]=useState(projectCategories.includes(initialCategory)?initialCategory:'All projects');const [query,setQuery]=useState('');
 const filtered=projects.filter(p=>(category==='All projects'||p.category===category)&&(p.title+' '+p.description+' '+p.stack.join(' ')).toLowerCase().includes(query.toLowerCase()));
 return <><div className="directory-toolbar"><SearchField value={query} onChange={setQuery} label="Find your next project"/><span className="results-count" aria-live="polite">{filtered.length} project ideas</span></div><Filters options={projectCategories} value={category} onChange={setCategory}/><div className="project-grid" aria-live="polite">{filtered.length?filtered.map((p,i)=><article className="project-card" key={p.slug}><div className={'project-visual tone-'+(i%3)}><Code2 size={38} strokeWidth={1.3}/><span className="project-index">{String(projects.indexOf(p)+1).padStart(2,'0')}</span></div><div className="project-card-body"><div className="label-row"><span>{p.category}</span><span>{p.level}</span></div><h3><a href={'/projects/'+p.slug}>{p.title}</a></h3><p>{p.description}</p><div className="tags">{p.stack.map(t=><span key={t}>{t}</span>)}</div><a className="text-link" href={'/projects/'+p.slug}>View project guide</a></div></article>):<NoResults onReset={()=>{setCategory('All projects');setQuery('')}}/>}</div></>
}
export function ServiceDirectory(){const [category,setCategory]=useState('All services');const [query,setQuery]=useState('');const filtered=services.filter(s=>(category==='All services'||s.category===category)&&(s.title+' '+s.slug+' '+s.description+' '+s.items.join(' ')).toLowerCase().includes(query.toLowerCase()));return <><div className="directory-toolbar"><SearchField value={query} onChange={setQuery} label="Find the help you need"/><span className="results-count" aria-live="polite">{filtered.length} services</span></div><Filters options={['All services',...new Set(services.map(s=>s.category))]} value={category} onChange={setCategory}/><div className="service-grid" aria-live="polite">{filtered.length?filtered.map(s=><ServiceCard key={s.slug} service={s} index={services.indexOf(s)}/>):<NoResults onReset={()=>{setCategory('All services');setQuery('')}}/>}</div></>}
export function BlogDirectory(){const [category,setCategory]=useState('All articles');const filtered=articles.filter(a=>category==='All articles'||a.category===category);return <><Filters options={['All articles',...new Set(articles.map(a=>a.category))]} value={category} onChange={setCategory}/><div className="blog-grid">{filtered.map(a=><article className="blog-card" key={a.slug}><span className="eyebrow">{a.category}</span><h3><a href={'/blog/'+a.slug}>{a.title}</a></h3><p>{a.intro}</p><div className="blog-bottom"><a className="text-link" href={'/blog/'+a.slug}>Read the guide</a><span>{a.readTime}</span></div></article>)}</div></>}
export function SiteSearch({initialQuery=''}:{initialQuery?:string}){
 const [query,setQuery]=useState(initialQuery);
 const entries=useMemo(()=>[
  ...services.map(s=>({title:s.title,slug:s.slug,description:s.description,category:s.category,href:'/services/'+s.slug,kind:'Service'})),
  ...technologies.map(t=>({title:t.title,slug:t.slug,description:t.description,category:t.category,href:'/technologies/'+t.slug,kind:'Technology'})),
  ...projects.map(p=>({title:p.title,slug:p.slug,description:p.description,category:p.category,href:'/projects/'+p.slug,kind:'Project'})),
  ...articles.map(a=>({title:a.title,slug:a.slug,description:a.intro,category:a.category,href:'/blog/'+a.slug,kind:'Guide'})),
  ...bookingServices.map(b=>({title:b.title,slug:b.slug,description:b.description,category:'1:1 sessions',href:'/service-page/'+b.slug,kind:'Session'})),
  ...jobListings.map(j=>({title:j.title,slug:j.slug,description:j.description,category:j.department,href:'/careers/'+j.slug,kind:'Career'})),
  ...groups.map(g=>({title:g.name,slug:g.slug,description:g.description,category:g.category,href:'/groups/'+g.slug,kind:'Group'})),
  ...pricingPlans.map(p=>({title:p.name,slug:p.id,description:p.description,category:'Pricing',href:'/pricing',kind:'Pricing'})),
 ],[]);
 const find=useCallback((q:string)=>entries.filter(e=>(e.title+' '+e.slug+' '+e.description+' '+e.category).toLowerCase().includes(q.trim().toLowerCase())),[entries]);
 useSearchTool(setQuery,find);
 const results=query.trim()?find(query):[];
 return <><div className="directory-toolbar"><SearchField value={query} onChange={setQuery} label="Search services, technologies & projects"/><span className="results-count" aria-live="polite">{query.trim()?`${results.length} results`:'Enter a topic to get started'}</span></div><div className="search-results" aria-live="polite">{results.map(r=><a className="search-result" href={r.href} key={r.kind+r.href}><small>{r.kind} · {r.category}</small><h2>{r.title}</h2><p>{r.description}</p></a>)}{query.trim()&&!results.length&&<NoResults onReset={()=>setQuery('')}/>}</div></>;
}
export function BookingServiceDirectory(){
 return <div className="service-grid">{bookingServices.map(b=><article className="service-card" key={b.slug}><div className="card-top"><span className="service-icon"><Calendar size={26} strokeWidth={1.5}/></span><span className="card-number">{b.duration}</span></div><h3><a href={'/service-page/'+b.slug}>{b.title}</a></h3><p>{b.description}</p><ul className="service-list">{b.includes.slice(0,3).map(i=><li key={i}>{i}</li>)}</ul><div className="label-row" style={{marginTop:16}}><span>{b.price}</span><span>Online</span></div><a className="text-link" href={'/booking-calendar/'+b.slug}>Request this session</a></article>)}</div>
}
export function PricingSection(){
 return <div className="service-grid">{pricingPlans.map(p=><article className="service-card" key={p.id}><div className="card-top"><span className="service-icon"><DollarSign size={26} strokeWidth={1.5}/></span><span className="card-number">{p.currency}</span></div><h3>{p.name}</h3><p>{p.description}</p><p style={{marginTop:12,fontWeight:600,color:'var(--ink)'}}>From: {p.from}</p><ul className="service-list">{p.items.map(i=><li key={i}>{i}</li>)}</ul><p style={{marginTop:16,fontSize:14}}>{p.note}</p><a className="text-link" href={'/contact?service='+encodeURIComponent(p.name)+'&topic='+encodeURIComponent(p.name)}>Request a quote</a></article>)}</div>
}
export function JobListings(){
 return <div className="service-grid">{jobListings.map(j=><article className="service-card" key={j.slug}><div className="card-top"><span className="service-icon"><Briefcase size={26} strokeWidth={1.5}/></span><span className="card-number">{j.type}</span></div><h3><a href={'/careers/'+j.slug}>{j.title}</a></h3><p>{j.description}</p><div className="label-row" style={{marginTop:16}}><span>{j.department}</span><span>{j.location}</span></div><a className="text-link" href={'/careers/'+j.slug}>View role details</a></article>)}</div>
}
export function GroupDirectory(){
 return <div className="service-grid">{groups.map(g=><article className="service-card" key={g.slug}><div className="card-top"><span className="service-icon"><Users size={26} strokeWidth={1.5}/></span><span className="card-number">{g.posts.length} posts</span></div><h3><a href={'/groups/'+g.slug}>{g.name}</a></h3><p>{g.description}</p><div className="label-row" style={{marginTop:16}}><span>{g.category}</span><span>{g.memberCount===0?'Open to join':g.memberCount+' members'}</span></div><a className="text-link" href={'/groups/'+g.slug}>Visit group</a></article>)}</div>
}
