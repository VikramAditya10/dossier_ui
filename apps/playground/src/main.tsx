import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { DossierProvider, ToastProvider, Button } from '@dossier-ui/react';
import '@dossier-ui/react/styles.css';
import '../../docs/src/styles.css';
import { Dashboard } from '../../docs/src/examples';
function Playground(){const [dark,setDark]=useState(false);return <DossierProvider theme={dark?'dark':'paper'}><ToastProvider><div className="docs-app" style={{padding:'24px clamp(16px, 5vw, 80px)',maxWidth:1440,margin:'0 auto'}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:32}}><a href="http://127.0.0.1:5173">← DOSSIER UI / DOCUMENTATION</a><Button size="sm" onClick={()=>setDark(!dark)}>{dark?'Paper theme':'Dark theme'}</Button></div><Dashboard/></div></ToastProvider></DossierProvider>;}
createRoot(document.getElementById('root')!).render(<Playground/>);
