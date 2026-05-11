/* ── Featured movies (preloaded, no API key needed) ── */
const FEATURED = [
  {
    imdbID: 'tt0111161', Title: 'The Shawshank Redemption', Year: '1994',
    Type: 'movie', Genre: 'Drama', imdbRating: '9.3',
    Poster: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg',
    Plot: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.'
  },
  {
    imdbID: 'tt0468569', Title: 'The Dark Knight', Year: '2008',
    Type: 'movie', Genre: 'Action, Crime, Drama', imdbRating: '9.0',
    Poster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg',
    Plot: 'When the menace known as the Joker wreaks havoc on Gotham City, Batman must accept one of the greatest psychological and physical tests.'
  },
  {
    imdbID: 'tt1375666', Title: 'Inception', Year: '2010',
    Type: 'movie', Genre: 'Action, Adventure, Sci-Fi', imdbRating: '8.8',
    Poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
    Plot: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.'
  },
  {
    imdbID: 'tt0816692', Title: 'Interstellar', Year: '2014',
    Type: 'movie', Genre: 'Adventure, Drama, Sci-Fi', imdbRating: '8.7',
    Poster: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
    Plot: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival."
  },
  {
    imdbID: 'tt0110912', Title: 'Pulp Fiction', Year: '1994',
    Type: 'movie', Genre: 'Crime, Drama', imdbRating: '8.9',
    Poster: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
    Plot: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.'
  },
  {
    imdbID: 'tt0068646', Title: 'The Godfather', Year: '1972',
    Type: 'movie', Genre: 'Crime, Drama', imdbRating: '9.2',
    Poster: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
    Plot: 'The aging patriarch of an organized crime dynasty transfers control of his empire to his reluctant son.'
  },
  {
    imdbID: 'tt6751668', Title: 'Parasite', Year: '2019',
    Type: 'movie', Genre: 'Comedy, Drama, Thriller', imdbRating: '8.5',
    Poster: 'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg',
    Plot: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.'
  },
  {
    imdbID: 'tt6710474', Title: 'Everything Everywhere All at Once', Year: '2022',
    Type: 'movie', Genre: 'Action, Adventure, Comedy', imdbRating: '7.8',
    Poster: 'https://m.media-amazon.com/images/M/MV5BYTdiOTIyZTQtNmQ1OS00NjZlLWIyMTgtYzk5Y2M3ZDVmMDk1XkEyXkFqcGdeQXVyMTAzMDg4NzU0._V1_SX300.jpg',
    Plot: 'A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence by exploring other universes.'
  }
];

/* ── State ── */
let API_KEY = localStorage.getItem('omdb_key') || '';
let currentQuery = '';
let currentPage = 1;
let totalResults = 0;

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  if (API_KEY) {
    document.getElementById('apiKeyInput').value = API_KEY;
    setKeyStatus('key loaded', '#6ca35e');
  }

  document.getElementById('searchInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') triggerSearch();
  });

  document.getElementById('detailOverlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeDetail();
  });

  showFeatured();
});

/* ── API Key ── */
function saveKey() {
  const val = document.getElementById('apiKeyInput').value.trim();
  if (!val) return;
  API_KEY = val;
  localStorage.setItem('omdb_key', val);
  setKeyStatus('key saved', '#6ca35e');
}

function setKeyStatus(msg, color) {
  const el = document.getElementById('keyStatus');
  el.textContent = msg;
  el.style.color = color;
}

/* ── Featured ── */
function showFeatured() {
  document.getElementById('sectionLabel').textContent = 'Featured';
  document.getElementById('resultsInfo').textContent = '';
  document.getElementById('pagination').style.display = 'none';
  renderCards(FEATURED);
}

/* ── Search ── */
function triggerSearch() {
  const q = document.getElementById('searchInput').value.trim();
  if (!q) { showFeatured(); return; }
  currentQuery = q;
  currentPage = 1;
  searchMovies(q, 1);
}

async function searchMovies(query, page) {
  if (!API_KEY) {
    showError('Enter your OMDB API key above to search.');
    return;
  }
  setLoading();
  try {
    const res = await axios.get('https://www.omdbapi.com/', {
      params: { apikey: API_KEY, s: query, page }
    });
    const data = res.data;
    if (data.Response === 'False') { showError(data.Error || 'No results found.'); return; }
    totalResults = parseInt(data.totalResults) || 0;
    document.getElementById('sectionLabel').textContent = `Results for "${query}"`;
    document.getElementById('resultsInfo').textContent = `${totalResults.toLocaleString()} results`;
    renderCards(data.Search);
    renderPagination(page, totalResults);
  } catch {
    showError('Network error. Check your connection or API key.');
  }
}

/* ── Render Cards ── */
function renderCards(movies) {
  const grid = document.getElementById('movieGrid');
  grid.innerHTML = '';
  movies.forEach(m => {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.onclick = () => openDetail(m.imdbID, m);

    const poster = m.Poster && m.Poster !== 'N/A'
      ? `<img class="card-poster" src="${esc(m.Poster)}" alt="${esc(m.Title)}" loading="lazy" />`
      : `<div class="card-no-poster">&#127916;</div>`;

    const rating = m.imdbRating && m.imdbRating !== 'N/A' ? m.imdbRating : '';

    card.innerHTML = `
      ${poster}
      <div class="card-overlay">
        <div class="card-title">${esc(m.Title)}</div>
        <div class="card-meta">
          <span class="card-year">${esc(m.Year)}</span>
          <span class="card-type">${esc(m.Type)}</span>
          ${rating ? `<span class="card-rating">&#9733; ${rating}</span>` : ''}
        </div>
      </div>
      <div class="card-strip">
        <div class="card-strip-title">${esc(m.Title)}</div>
        <div class="card-strip-meta">
          <span class="card-strip-year">${esc(m.Year)}</span>
          ${rating ? `<span class="card-strip-rating">&#9733; ${rating}</span>` : ''}
        </div>
      </div>`;
    grid.appendChild(card);
  });
}

/* ── Pagination ── */
function renderPagination(page, total) {
  const totalPages = Math.ceil(total / 10);
  const wrap = document.getElementById('pagination');
  if (totalPages <= 1) { wrap.style.display = 'none'; return; }
  wrap.style.display = 'flex';
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  let html = `<button class="page-btn" ${page <= 1 ? 'disabled' : ''} onclick="goPage(${page - 1})">&#8249;</button>`;
  for (let i = start; i <= end; i++) {
    html += `<button class="page-btn ${i === page ? 'active' : ''}" onclick="goPage(${i})">${i}</button>`;
  }
  html += `<button class="page-btn" ${page >= totalPages ? 'disabled' : ''} onclick="goPage(${page + 1})">&#8250;</button>`;
  html += `<span class="page-info">page ${page} of ${totalPages}</span>`;
  wrap.innerHTML = html;
}

function goPage(p) {
  currentPage = p;
  searchMovies(currentQuery, p);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Detail ── */
async function openDetail(imdbID, cached) {
  const overlay = document.getElementById('detailOverlay');
  overlay.style.display = 'block';
  document.body.style.overflow = 'hidden';

  if (cached && cached.Plot) {
    renderDetail(cached);
  } else {
    document.getElementById('dTitle').textContent = cached?.Title || 'Loading...';
    document.getElementById('dSubtitle').textContent = '';
    document.getElementById('detailBody').innerHTML = '<div class="spinner"></div>';
  }

  if (!API_KEY) return;

  try {
    const res = await axios.get('https://www.omdbapi.com/', {
      params: { apikey: API_KEY, i: imdbID, plot: 'full' }
    });
    if (res.data.Response !== 'False') renderDetail(res.data);
  } catch { /* keep cached view */ }
}

function renderDetail(m) {
  document.getElementById('dTitle').textContent = m.Title;
  document.getElementById('dSubtitle').textContent =
    [m.Year, m.Rated, m.Runtime].filter(x => x && x !== 'N/A').join(' · ');

  const imdbPct = ((parseFloat(m.imdbRating) || 0) / 10) * 100;

  const poster = m.Poster && m.Poster !== 'N/A'
    ? `<img class="detail-poster" src="${esc(m.Poster)}" alt="${esc(m.Title)}" />`
    : `<div class="detail-no-poster">🎬</div>`;

  const genres = (m.Genre || '').split(',').map(g => g.trim()).filter(Boolean)
    .map(g => `<span class="genre-tag">${esc(g)}</span>`).join('');

  const stats = [
    { val: m.imdbRating !== 'N/A' ? m.imdbRating : '—', lbl: 'IMDb' },
    { val: m.imdbVotes  !== 'N/A' ? shortenNum(m.imdbVotes) : '—', lbl: 'Votes' },
    { val: m.BoxOffice  && m.BoxOffice !== 'N/A' ? m.BoxOffice : '—', lbl: 'Box Office' },
  ].map(s => `<div class="stat"><div class="stat-val">${esc(s.val)}</div><div class="stat-lbl">${s.lbl}</div></div>`).join('');

  const metaFields = [
    { label: 'Director', value: m.Director },
    { label: 'Cast',     value: m.Actors },
    { label: 'Awards',   value: m.Awards },
  ].filter(f => f.value && f.value !== 'N/A')
   .map(f => `<div class="meta-field"><label>${f.label}</label><p>${esc(f.value)}</p></div>`).join('');

  document.getElementById('detailBody').innerHTML = `
    <div class="detail-poster-wrap">${poster}</div>
    <div class="detail-info">
      ${m.Plot && m.Plot !== 'N/A' ? `<p class="plot">${esc(m.Plot)}</p>` : ''}
      ${genres ? `<div class="genre-tags">${genres}</div>` : ''}
      <div class="stat-row">${stats}</div>
      <div class="ratings">
        <div class="ratings-title">Ratings</div>
        <div class="rating-row">
          <span class="rating-lbl">&#9733; IMDb</span>
          <div class="bar-track"><div class="bar-fill bar-imdb" id="b-imdb" style="width:0%"></div></div>
          <span class="rating-val">${m.imdbRating !== 'N/A' ? m.imdbRating + '/10' : 'N/A'}</span>
        </div>

      </div>
      ${metaFields}
      <a class="imdb-link" href="https://www.imdb.com/title/${esc(m.imdbID)}/" target="_blank">View on IMDb &rarr;</a>
    </div>`;

  requestAnimationFrame(() => setTimeout(() => {
    const bi = document.getElementById('b-imdb');
    if (bi) bi.style.width = imdbPct + '%';
  }, 80));
}

function closeDetail() {
  document.getElementById('detailOverlay').style.display = 'none';
  document.body.style.overflow = '';
}

/* ── UI States ── */
function setLoading() {
  document.getElementById('pagination').style.display = 'none';
  document.getElementById('resultsInfo').textContent = '';
  document.getElementById('movieGrid').innerHTML = '<div class="spinner"></div>';
}

function showError(msg) {
  document.getElementById('sectionLabel').textContent = 'Error';
  document.getElementById('pagination').style.display = 'none';
  document.getElementById('resultsInfo').textContent = '';
  document.getElementById('movieGrid').innerHTML = `<div class="error-msg">${esc(msg)}</div>`;
}

/* ── Utils ── */
function esc(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

function shortenNum(str) {
  const n = parseInt((str || '').replace(/,/g, ''));
  if (isNaN(n)) return str;
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return Math.round(n / 1e3) + 'K';
  return n.toString();
}