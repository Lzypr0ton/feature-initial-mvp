import express from 'express'; import cors from 'cors'; import { z } from 'zod'; import { scan } from '@gigw/scanner'; import { htmlReport } from '@gigw/reports'; import type { ScanResult } from '@gigw/shared';
const app=express(),store=new Map<string,ScanResult>(),request=z.object({url:z.string().url().max(2048)}); app.use(cors());app.use(express.json({limit:'10kb'}));
app.get('/api/health',(_,res)=>res.json({status:'ok'}));
app.post('/api/scans',async(req,res)=>{const parsed=request.safeParse(req.body);if(!parsed.success)return res.status(400).json({error:'Provide a valid URL.'});const queued:ScanResult={id:crypto.randomUUID(),status:'queued',url:parsed.data.url,createdAt:new Date().toISOString(),limitations:[]};store.set(queued.id,queued);void scan(parsed.data.url).then(result=>store.set(queued.id,{...result,id:queued.id}));res.status(202).json(queued);});
app.get('/api/scans/:id',(req,res)=>{const x=store.get(req.params.id);return x?res.json(x):res.status(404).json({error:'Scan not found.'})});
app.get('/api/scans/:id/report',(req,res)=>{const x=store.get(req.params.id);if(!x)return res.status(404).json({error:'Scan not found.'});if(x.status!=='complete')return res.status(409).json({error:'Scan is not complete.'});res.type('html').send(htmlReport(x));});
app.listen(Number(process.env.PORT||3001),()=>console.log('API listening'));
