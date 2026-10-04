import { getChatGPTUser, chatGPTSignInPath, chatGPTSignOutPath } from '@/app/chatgpt-auth';
import { PageHero } from '@/components/site/shared';
import { AccountRequests } from '@/components/site/account';
import { UserRound } from 'lucide-react';
export const dynamic='force-dynamic';
export const metadata={title:'My account',robots:{index:false,follow:false}};
export default async function Account(){const user=await getChatGPTUser();return <main id="main"><PageHero eyebrow="My account" title={user?'Your projects, in one place.':'Stay connected to your project.'} description={user?'Review your inquiries, session requests, and their latest status.':'Sign in to view project inquiries and session requests linked to your account.'}/><section className="section"><div className="container">{user?<><div className="account-toolbar"><p>Signed in as {user.email}</p><a className="text-link" href={chatGPTSignOutPath('/account')} target="_top">Sign out</a></div><AccountRequests/></>:<div className="account-card"><UserRound size={40} strokeWidth={1.3}/><h2>Welcome to SavannaCode.</h2><p>Sign in with ChatGPT to access requests you sent with the same email address. You can also submit a project brief without creating an account.</p><a className="button button-primary" href={chatGPTSignInPath('/account')} target="_top">Sign in with ChatGPT</a></div>}</div></section></main>}
