// script.js
document.addEventListener('DOMContentLoaded', () => {
  const accordion = document.getElementById('accordion');
  const searchInput = document.getElementById('searchInput');
  const fillBar = document.querySelector('.progress .fill');
  const pctText = document.querySelector('.progress .percent');
  const COMPLETE_KEY = 'chemCourseCompleted';
  let completed = JSON.parse(localStorage.getItem(COMPLETE_KEY) || '[]');

  // 1) Accordion toggles
  accordion.querySelectorAll('.topic-header').forEach(btn => {
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      btn.nextElementSibling.hidden = open;
    });
  });
  accordion.querySelectorAll('.subtopic-header').forEach(btn => {
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      btn.parentElement.querySelector('.videos').hidden = open;
    });
  });

  // 2) Live search (enhanced)
  function collapseAll() {
    // collapse all topics & videos
    accordion.querySelectorAll('[aria-expanded]').forEach(el => el.setAttribute('aria-expanded', 'false'));
    accordion.querySelectorAll('.subtopics, .videos').forEach(sec => sec.hidden = true);
    // show all topics/subtopics
    accordion.querySelectorAll('.topic, .subtopic').forEach(el => el.style.display = '');
  }

  searchInput.addEventListener('input', () => {
    const term = searchInput.value.trim().toLowerCase();
    if (!term) {
      collapseAll();
      return;
    }

    accordion.querySelectorAll('.topic').forEach(topic => {
      const header = topic.querySelector('.topic-header');
      const subList = topic.querySelector('.subtopics');
      const subs = Array.from(subList.querySelectorAll('.subtopic'));

      let anyMatch = 0;
      subs.forEach(sub => {
        const title = sub.dataset.title.toLowerCase();
        if (title.includes(term)) {
          sub.style.display = '';
          anyMatch++;
        } else {
          sub.style.display = 'none';
        }
      });

      if (anyMatch) {
        topic.style.display = '';
        header.setAttribute('aria-expanded', 'true');
        subList.hidden = false;
      } else {
        topic.style.display = 'none';
      }
    });
  });

  // 3) Expand/Collapse All
  document.getElementById('expandAll').addEventListener('click', () => toggleAll(true));
  document.getElementById('collapseAll').addEventListener('click', () => toggleAll(false));
  function toggleAll(expand) {
    accordion.querySelectorAll('[aria-expanded]').forEach(el => el.setAttribute('aria-expanded', String(expand)));
    accordion.querySelectorAll('.subtopics, .videos').forEach(sec => sec.hidden = !expand);
  }

  // 4) Pick Random
  document.getElementById('pickRandom').addEventListener('click', () => {
    const subs = Array.from(accordion.querySelectorAll('.subtopic')).filter(s => s.style.display !== 'none');
    if (!subs.length) return;
    const choice = subs[Math.floor(Math.random() * subs.length)];
    choice.closest('.topic').querySelector('.topic-header').click();
    choice.querySelector('.subtopic-header').click();
    choice.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  // 5) Mark-as-complete & progress
  function updateProgress() {
    const total = accordion.querySelectorAll('.subtopic').length;
    const done = completed.length;
    const pct = Math.round(done / total * 100);
    fillBar.style.width = `${pct}%`;
    pctText.textContent = `${pct}%`;
  }
  accordion.querySelectorAll('.subtopic').forEach(sub => {
    const id = sub.dataset.title;
    const toggle = sub.querySelector('.complete-toggle');
    if (completed.includes(id)) toggle.classList.add('completed');
    toggle.addEventListener('click', e => {
      e.stopPropagation();
      if (toggle.classList.toggle('completed')) completed.push(id);
      else completed = completed.filter(x => x !== id);
      localStorage.setItem(COMPLETE_KEY, JSON.stringify(completed));
      updateProgress();
    });
  });
  updateProgress();

  // 6) Back-to-top
  const backBtn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => backBtn.style.display = window.scrollY > 300 ? 'block' : 'none');
  backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // 7) Theme toggle
  const themeBtn = document.getElementById('themeToggle');
  const stored = localStorage.getItem('chemCourseTheme') || 'dark';
  document.body.classList.toggle('light', stored === 'light');
  themeBtn.textContent = stored === 'dark' ? '☀️' : '🌙';
  themeBtn.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light');
    themeBtn.textContent = isLight ? '🌙' : '☀️';
    localStorage.setItem('chemCourseTheme', isLight ? 'light' : 'dark');
  });
});
