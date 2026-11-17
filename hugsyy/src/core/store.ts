import {useSyncExternalStore} from 'react';
import {SAVE_KEY,freshSave,hydrateSave} from './logic.mjs';
import type {Save,Scene} from './types';
let warning='';let state:Save;
try {const raw=localStorage.getItem(SAVE_KEY);state=hydrateSave(raw) as Save;if(!raw)state.settings.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;}catch{state=freshSave() as Save;warning='This browser cannot save progress locally. Downloads still work.'}
const listeners=new Set<()=>void>();let timer:ReturnType<typeof setTimeout>;
function flush(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(state))}catch{warning='Local storage is full or unavailable. Export your creations before closing this tab.'}}
export function getGame(){return state}
export function updateGame(fn:(s:Save)=>Save){state=fn(state);listeners.forEach(f=>f());clearTimeout(timer);timer=setTimeout(flush,120)}
export function patchGame(partial:Partial<Save>){updateGame(s=>({...s,...partial}))}
export function useGame(){return useSyncExternalStore(f=>{listeners.add(f);return()=>{listeners.delete(f)}},()=>state)}
export function award(id:string){updateGame(s=>s.achievements.includes(id)?s:{...s,achievements:[...s.achievements,id]});say({cake:'That cake deserves its own tiny museum.',art:'Certified doodler! I knew you had it in you.',memories:'Three little stories, safely kept.',forest:'Every little wing is home. Look at you.',finale:'Birthday legend. Officially.'}[id]||'A new page in your passport.','happy')}
export function setScene(scene:Scene){patchGame({scene});flush()}
export function storageWarning(){return warning}
export function say(text:string,mood='curious'){window.dispatchEvent(new CustomEvent('jv-dialogue',{detail:{text,mood}}))}
export function resetGame(){state=freshSave() as Save;flush();listeners.forEach(f=>f())}
window.addEventListener('pagehide',flush);
let dbPromise:Promise<IDBDatabase>|null=null;
function db(){return dbPromise??=new Promise((resolve,reject)=>{const req=indexedDB.open('dear-jv-art',1);req.onupgradeneeded=()=>req.result.createObjectStore('creations');req.onsuccess=()=>resolve(req.result);req.onerror=()=>{dbPromise=null;reject(new Error('Artwork storage unavailable. Please export a PNG.'))}})}
export async function putCreation(key:string,value:unknown){const d=await db();return new Promise<void>((resolve,reject)=>{const tx=d.transaction('creations','readwrite');tx.objectStore('creations').put(value,key);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(new Error('Could not save this creation. Please export it.'));tx.onabort=()=>reject(new Error('Save was interrupted. Try again.'))})}
export async function getCreation<T>(key:string):Promise<T|undefined>{const d=await db();return new Promise((resolve,reject)=>{const req=d.transaction('creations').objectStore('creations').get(key);req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}
export async function clearCreations(){const d=await db();return new Promise<void>((resolve,reject)=>{const tx=d.transaction('creations','readwrite');tx.objectStore('creations').clear();tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error)})}
export function download(url:string,name:string){const a=document.createElement('a');a.href=url;a.download=name;a.click()}
