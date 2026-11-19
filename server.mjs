import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
const html = await readFile(new URL('./index.html',import.meta.url));
createServer(async(req,res)=>{res.setHeader('X-Content-Type-Options','nosniff');if(req.url==='/template.json'){try{res.setHeader('Content-Type','application/json');res.end(await readFile(new URL('./dist/open-grant.xo.json',import.meta.url)));}catch{res.writeHead(404);res.end('Run npm run export first.');}return;}res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html);}).listen(4203,'127.0.0.1',()=>console.log('Open Grant: http://127.0.0.1:4203'));
