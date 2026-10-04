import { z } from 'zod';
import { database } from '@/lib/database';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { siteConfig } from '@/lib/site-config';

export const dynamic='force-dynamic';
const schema=z.object({
 submissionId:z.string().uuid(),type:z.enum(['project','session']),name:z.string().trim().min(2).max(100),
 email:z.string().trim().email().max(254).transform(s=>s.toLowerCase()),phone:z.string().trim().max(32).default(''),
 service:z.string().trim().min(2).max(120),budget:z.string().max(100).default(''),
 date:z.string().max(10).default(''),time:z.string().max(5).default(''),timezone:z.string().trim().max(70).default(''),
 message:z.string().trim().min(20).max(6000),resourceUrl:z.union([z.literal(''),z.string().url().max(1500)]).default(''),
 consent:z.literal(true),website:z.string().max(200).default(''),
});
function response(body:unknown,status=200){return Response.json(body,{status,headers:{'Cache-Control':'no-store'}})}
function sameOrigin(request:Request){const origin=request.headers.get('origin');return !!origin&&origin===new URL(request.url).origin}
export async function POST(request:Request){
 if(!sameOrigin(request))return response({error:'Please submit the form from this website.'},403);
 if(!request.headers.get('content-type')?.includes('application/json'))return response({error:'Unsupported request format.'},415);
 let value:unknown;
 try{const body=await request.text();if(new TextEncoder().encode(body).length>22000)return response({error:'Your request is too long.'},413);value=JSON.parse(body)}catch{return response({error:'Your request could not be read.'},400)}
 const parsed=schema.safeParse(value);if(!parsed.success)return response({error:'Please check your name, email, category, and message (at least 20 characters), and agree to the terms.'},400);
 const data=parsed.data;
 if(data.website)return response({error:'Unable to accept this request. Please contact us directly.'},400);
 if(data.resourceUrl&&!['https:','http:'].includes(new URL(data.resourceUrl).protocol))return response({error:'Please use an http or https project link.'},400);
 if(data.date){const valid=/^\d{4}-\d{2}-\d{2}$/.test(data.date)&&!Number.isNaN(Date.parse(data.date))&&new Date(data.date).toISOString().slice(0,10)===data.date;if(!valid||data.date<new Date(Date.now()-86400000).toISOString().slice(0,10))return response({error:'Please choose a valid current or future date.'},400)}
 if(data.type==='session'){
  if(!data.date||!/^([01]\d|2[0-3]):[0-5]\d$/.test(data.time)||!data.timezone)return response({error:'Choose a preferred date, time, and time zone for your session.'},400);
  try{new Intl.DateTimeFormat('en',{timeZone:data.timezone}).format(new Date())}catch{return response({error:'Use a valid time zone, such as Africa/Nairobi, Europe/London, or America/New_York.'},400)}
 }
 try{
  const db=database();const user=await getChatGPTUser();
  const existing=await db.prepare('SELECT reference, email FROM inquiries WHERE id = ?').bind(data.submissionId).first<{reference:string;email:string}>();
  if(existing){if(existing.email!==data.email)return response({error:'Please refresh the form and try again.'},409);return response({reference:existing.reference,duplicate:true})}
  const recent=await db.prepare('SELECT COUNT(*) AS count FROM inquiries WHERE email = ? AND created_at > ?').bind(data.email,Date.now()-3600000).first<{count:number}>();
  if(recent&&recent.count>=5)return response({error:'You have sent several requests recently. Please wait an hour or contact us on WhatsApp.'},429);
  const reference='SC-'+data.submissionId.replaceAll('-','').slice(0,12).toUpperCase();const now=Date.now();
  await db.prepare('INSERT INTO inquiries (id, reference, user_id, type, name, email, phone, service, budget, preferred_date, preferred_time, timezone, message, resource_url, status, consent_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING').bind(data.submissionId,reference,user?.userId??null,data.type,data.name,data.email,data.phone,data.service,data.budget,data.date,data.time,data.timezone,data.message,data.resourceUrl,'new',now,now).run();
  return response({reference},201);
 }catch(error){console.error('Inquiry storage failed',error instanceof Error?error.message:'Unknown storage error');return response({error:'We couldn’t save your request just now. Your details are still here. Please try again, email us, or use WhatsApp.'},503)}
}
export async function GET(){
 const user=await getChatGPTUser();if(!user)return response({error:'Please sign in to view your requests.'},401);
 const isOwner=user.email.toLowerCase()===siteConfig.email.toLowerCase();
 try{const db=database();const query=isOwner?db.prepare('SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 200'):db.prepare('SELECT * FROM inquiries WHERE user_id = ? OR email = ? ORDER BY created_at DESC LIMIT 100').bind(user.userId,user.email.toLowerCase());const result=await query.all();return response({inquiries:result.results,isOwner})}catch(error){console.error('Inquiry listing failed',error instanceof Error?error.message:'Unknown storage error');return response({error:'Requests are temporarily unavailable. Please try again.'},503)}
}
export async function PATCH(request:Request){
 if(!sameOrigin(request))return response({error:'Invalid request origin.'},403);
 const user=await getChatGPTUser();if(!user||user.email.toLowerCase()!==siteConfig.email.toLowerCase())return response({error:'This action is only available to the site owner.'},403);
 let body:unknown;try{body=await request.json()}catch{return response({error:'Invalid request.'},400)}
 const p=z.object({id:z.string().uuid(),status:z.enum(['new','in_review','contacted','closed'])}).safeParse(body);if(!p.success)return response({error:'Invalid request status.'},400);
 try{const result=await database().prepare('UPDATE inquiries SET status = ? WHERE id = ?').bind(p.data.status,p.data.id).run();if(!result.meta.changes)return response({error:'This request was not found.'},404);return response({updated:true})}catch{return response({error:'Could not save this update. Please try again.'},503)}
}
