const state={all:[],filtered:[]}
const newsGrid=document.getElementById('newsGrid')
const topStory=document.getElementById('topStory')
const searchInput=document.getElementById('searchInput')
const categorySelect=document.getElementById('categorySelect')
const refreshBtn=document.getElementById('refreshBtn')
const updatedStamp=document.getElementById('updatedStamp')
const themeToggle=document.getElementById('themeToggle')

function fmtDate(d){return new Date(d).toLocaleString()}
function setUpdated(){updatedStamp.textContent=`Updated ${new Date().toLocaleString()}`}

function pickTop(items){if(!items.length)return null;const cats=['Politics','World','Business','Science','Tech','Health','Sports'];for(const c of cats){const f=items.find(x=>x.category===c);if(f)return f}return items[0]}

function renderTop(item){
  if(!item){topStory.innerHTML='';return}
  topStory.innerHTML=`
  <div class="card"><img src="${item.image||'images/default.png'}" alt=""></div>
  <div class="content">
    <span class="badge">${item.category}</span>
    <h3>${item.title}</h3>
    <p class="meta">${new Date(item.published_at).toDateString()}</p>
    <p>${item.summary}</p>
    <div class="actions">
      <a href="${item.source_url}" target="_blank" rel="noopener">Read source: ${item.source_name}</a>
      <span class="meta">QuickBrief</span>
    </div>
  </div>`
}

function renderList(items){
  newsGrid.innerHTML=items.map(it=>`
  <article class="card">
    <img src="${it.image||'images/default.png'}" alt="">
    <div class="pad">
      <span class="badge">${it.category}</span>
      <h4>${it.title}</h4>
      <p class="meta">${new Date(it.published_at).toDateString()}</p>
      <p>${it.summary}</p>
      <div class="actions">
        <a href="${it.source_url}" target="_blank" rel="noopener">Source: ${it.source_name}</a>
      </div>
    </div>
  </article>`).join('')
}

function applyFilters(){
  const q=searchInput.value.trim().toLowerCase()
  const cat=categorySelect.value
  let arr=[...state.all]
  if(cat!=='All'){arr=arr.filter(x=>x.category===cat)}
  if(q){arr=arr.filter(x=>x.title.toLowerCase().includes(q)||x.summary.toLowerCase().includes(q))}
  state.filtered=arr
  const top=pickTop(arr)
  renderTop(top)
  const rest=arr.filter(x=>!top||x.id!==top.id)
  renderList(rest)
}

async function load(){
  const res=await fetch('data/news.json?_v='+(Date.now()))
  const data=await res.json()
  state.all=data
  setUpdated()
  applyFilters()
}

searchInput.addEventListener('input',applyFilters)
categorySelect.addEventListener('change',applyFilters)
refreshBtn.addEventListener('click',load)

function initTheme(){
  const saved=localStorage.getItem('qb_theme')||'dark'
  document.documentElement.setAttribute('data-theme',saved)
}
function toggleTheme(){
  const cur=document.documentElement.getAttribute('data-theme')
  const next=cur==='light'?'dark':'light'
  document.documentElement.setAttribute('data-theme',next)
  localStorage.setItem('qb_theme',next)
}
themeToggle.addEventListener('click',toggleTheme)

initTheme()
load()
