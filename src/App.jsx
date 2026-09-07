import { useMemo, useState } from 'react'
import { ArrowRight, Box, Download, Github, Menu, Search, X } from 'lucide-react'
import PreviewViewer from './components/PreviewViewer'
import { assets } from './data/assets'
import { LINKS, PUBLISH } from './data/config'

const KIMM = {
  url: 'https://www.kimm.re.kr/eng',
  logoEn: `${import.meta.env.BASE_URL}brand/kimm-logo-en.png`,
}

function App() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [menu, setMenu] = useState(false)
  const [selected, setSelected] = useState(assets[0])
  const [preview, setPreview] = useState({ ext: '', status: 'loading' })
  const shown = useMemo(() => assets.filter(a =>
    (filter === 'All' || a.type === filter || (filter === 'Articulated' && a.articulated)) &&
    `${a.name} ${a.id} ${a.category}`.toLowerCase().includes(query.toLowerCase())
  ), [query, filter])

  return <>
    <header className="nav shell">
      <div className="nav-left">
        <a className="brand" href="#top"><span className="brand-mark">R</span> RoGeTA</a>
        <span className="nav-divider" aria-hidden="true"/>
        <a className="kimm-logo-link" href={KIMM.url} target="_blank" rel="noreferrer" title="Korea Institute of Machinery & Materials">
          <img src={KIMM.logoEn} alt="Korea Institute of Machinery & Materials" className="kimm-logo-en header"/>
        </a>
      </div>
      <nav className={menu ? 'nav-links open' : 'nav-links'}>
        <a href="#explore">Explore</a><a href="#framework">Framework</a><a href="#docs">Documentation</a>
        {PUBLISH.online
          ? <a className="nav-github" href={LINKS.github}><Github size={16}/> GitHub</a>
          : <span className="nav-github local-badge">Local preview</span>}
      </nav>
      <button className="menu" aria-label="Toggle menu" onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button>
    </header>

    <main id="top">
      <section className="hero shell">
        <div className="eyebrow"><span/> ROBOTICS · SIMULATION · OPEN DATA</div>
        <h1>다양한 일상 서비스를 위한<br/><em>로봇 작업 인공지능</em></h1>
        <div className="hero-en"><strong>RoGeTA</strong><span>Robotic General Task Artificial Intelligence</span></div>
        <p className="lead">An interactive 3D environment and simulation framework for developing general-purpose robotic intelligence in everyday environments.</p>
        <div className="actions"><a className="button primary" href="#explore">Explore the dataset <ArrowRight size={18}/></a>{PUBLISH.online ? <a className="button" href={LINKS.github}><Github size={18}/> View on GitHub</a> : null}</div>
        <div className="viewer-card">
          <div className="viewer-copy"><span>{PUBLISH.online ? 'INTERACTIVE PREVIEW · HOSTED ON HUGGING FACE' : 'INTERACTIVE PREVIEW · LOCAL FILE'}</span><h2>{selected.name}</h2><p>{selected.id}{preview.ext ? ` · ${preview.ext.toUpperCase()}` : ''} · Drag to rotate and scroll to zoom. {PUBLISH.online ? 'Preview files are streamed directly from the RoGeTA dataset.' : 'Inspect the selected asset in the interactive viewer.'}</p>{selected.downloadUrl ? <a href={selected.downloadUrl} target="_blank" rel="noreferrer">View files on Hugging Face <ArrowRight size={15}/></a> : <span className="local-note">USD files stay in local_dataset/assets until Hugging Face is connected.</span>}</div>
          <PreviewViewer asset={selected} onPreview={setPreview} />
        </div>
      </section>

      <section className="stats shell"><div><b>USD</b><span>Simulation-ready source</span></div><div><b>GLB / OBJ / FBX</b><span>Interactive web preview</span></div><div><b>Isaac Sim</b><span>Physics &amp; robotics</span></div><div><b>Open</b><span>Research-ready access</span></div></section>

      <section id="explore" className="catalog shell">
        <div className="section-head"><div><span className="kicker">EXPLORE THE COLLECTION</span><h2>Built for interaction.</h2></div><p>Browse environments and articulated objects prepared for simulation, learning, and evaluation.</p></div>
        <div className="controls"><label><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search assets or IDs..."/></label><div className="filters">{['All','Environment','Object','Articulated'].map(x=><button className={filter===x?'active':''} onClick={()=>setFilter(x)} key={x}>{x}</button>)}</div></div>
        <div className="grid">{shown.map((a,i)=><article className="card" key={a.id}>
          <div className="thumb" style={{'--accent':a.accent}}><span>{String(i+1).padStart(2,'0')}</span><Box size={58}/><small>{a.type}</small></div>
          <div className="card-body"><div className="meta">{a.id} · {a.category}</div><h3>{a.name}</h3><div className="tags">{a.tags.map(t=><span key={t}>{t}</span>)}</div><button className="preview-link" onClick={()=>{setSelected(a); document.querySelector('.viewer-card')?.scrollIntoView({behavior:'smooth', block:'center'})}}>Preview in viewer <ArrowRight size={15}/></button>{a.downloadUrl ? <a href={a.downloadUrl} target="_blank" rel="noreferrer">View on Hugging Face <ArrowRight size={15}/></a> : <span className="local-note">Local asset</span>}</div>
        </article>)}</div>
      </section>

      <section id="framework" className="framework"><div className="shell"><span className="kicker">ONE ASSET, EVERY WORKFLOW</span><h2>From browser to simulation.</h2><div className="pipeline"><div><b>01</b><h3>Explore</h3><p>Inspect GLB, OBJ, or FBX previews directly in the browser.</p></div><i>→</i><div><b>02</b><h3>Download</h3><p>{PUBLISH.online ? 'Access original assets, textures, and metadata on Hugging Face.' : 'Keep USD sources in local_dataset/assets. Hugging Face download comes after local review.'}</p></div><i>→</i><div><b>03</b><h3>Simulate</h3><p>Load physics-ready USD scenes and tasks in NVIDIA Isaac Sim.</p></div></div></div></section>

      <section id="docs" className="cta shell"><div><span className="kicker">GET STARTED</span><h2>Bring RoGeTA into your research.</h2><p>{PUBLISH.online ? 'Clone the tools, download the dataset, and launch your first everyday robotics environment.' : 'Finish the local catalog and 3D previews first. GitHub and Hugging Face links will be attached once the dataset is ready to publish.'}</p></div><div className="actions">{PUBLISH.online ? <><a className="button primary" href={LINKS.github}><Github size={18}/> Read documentation</a><a className="button" href={LINKS.huggingface}><Download size={18}/> Download dataset</a></> : <a className="button primary" href="#explore">Review local assets <ArrowRight size={18}/></a>}</div></section>
    </main>
    <footer className="shell">
      <a className="brand" href="#top"><span className="brand-mark">R</span> RoGeTA</a>
      <p>Robotic General Task Artificial Intelligence</p>
      <a className="kimm-footer" href={KIMM.url} target="_blank" rel="noreferrer">
        <img src={KIMM.logoEn} alt="Korea Institute of Machinery & Materials" className="kimm-logo-en footer"/>
      </a>
    </footer>
  </>
}
export default App
