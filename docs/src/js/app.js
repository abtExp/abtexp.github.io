/* ========================================================================
   ANUBHAV TIWARI — APP.JS
   Wires: nav, theme, mobile menu, ticker, latent canvas, reveals,
   flip cards, scroll-to-top, all six live ML demos, terminal contact,
   footer neural-network graphic.
   ======================================================================== */

(function () {
    'use strict';

    const $  = (s, root = document) => root.querySelector(s);
    const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

    const PRM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const TOUCH = window.matchMedia('(hover: none)').matches;

    // =========================================
    // 1. THEME TOGGLE
    // =========================================
    const container   = $('#container');
    const themeBtn    = $('#theme-button');
    const themeIcon   = $('#theme-icon');
    const mobileTheme = $('#mobile-theme-button');

    function applyTheme(theme) {
        const isDark = theme === 'dark';
        container.classList.toggle('dark-theme', isDark);
        container.classList.toggle('light-theme', !isDark);
        document.body.classList.toggle('dark-theme', isDark);
        if (themeIcon) themeIcon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        const mIcon = mobileTheme && mobileTheme.querySelector('i');
        if (mIcon) mIcon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
    function toggleTheme() {
        const next = container.classList.contains('dark-theme') ? 'light' : 'dark';
        applyTheme(next);
        try { localStorage.setItem('theme', next); } catch (e) {}
    }
    let saved = null;
    try { saved = localStorage.getItem('theme'); } catch (e) {}
    if (!saved) {
        saved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    applyTheme(saved);
    if (themeBtn)    themeBtn.addEventListener('click', toggleTheme);
    if (mobileTheme) mobileTheme.addEventListener('click', toggleTheme);

    // =========================================
    // 2. NAV — smooth scroll & active state
    // =========================================
    $$('.nav-button[data-target], .mobile-nav-item[data-target], .cta-primary[data-target]').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = $('#' + btn.dataset.target);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                closeMobileMenu();
            }
        });
    });

    const sectionIds = ['home', 'about', 'experience', 'portfolio', 'skills', 'contact'];
    const sections = sectionIds.map(id => $('#' + id)).filter(Boolean);
    function setActiveNav(id) {
        $$('.nav-button[data-target], .mobile-nav-item[data-target]').forEach(b => {
            b.classList.toggle('active', b.dataset.target === id);
        });
    }
    function updateActiveOnScroll() {
        const y = window.scrollY + window.innerHeight * 0.35;
        let current = sections[0]?.id;
        sections.forEach(s => {
            if (s.offsetTop <= y) current = s.id;
        });
        if (current) setActiveNav(current);
    }
    window.addEventListener('scroll', updateActiveOnScroll, { passive: true });

    // =========================================
    // 3. MOBILE MENU
    // =========================================
    const hamburger  = $('#hamburger-menu');
    const mobileMenu = $('#mobile-menu');
    const overlay    = $('#mobile-menu-overlay');
    function openMobileMenu() {
        hamburger?.classList.add('active');
        mobileMenu?.classList.add('active');
        overlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeMobileMenu() {
        hamburger?.classList.remove('active');
        mobileMenu?.classList.remove('active');
        overlay?.classList.remove('active');
        document.body.style.overflow = '';
    }
    hamburger?.addEventListener('click', () => {
        mobileMenu.classList.contains('active') ? closeMobileMenu() : openMobileMenu();
    });
    overlay?.addEventListener('click', closeMobileMenu);

    // =========================================
    // 4. SCROLL-TO-TOP
    // =========================================
    const scrollBtn = $('#scroll-button');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        window.addEventListener('scroll', () => {
            scrollBtn.classList.toggle('visible', window.scrollY > 600);
        }, { passive: true });
    }

    // =========================================
    // 5. REVEAL ON SCROLL + SKILL BAR FILL
    // =========================================
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    // fill skill bars when revealed
                    $$('.bar', entry.target).forEach(bar => {
                        const fill = bar.dataset.fill || 80;
                        const inner = bar.querySelector('span');
                        if (inner) inner.style.width = fill + '%';
                    });
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        $$('.reveal-on-scroll').forEach(el => io.observe(el));
    } else {
        $$('.reveal-on-scroll').forEach(el => el.classList.add('in-view'));
        $$('.bar').forEach(bar => {
            const inner = bar.querySelector('span');
            if (inner) inner.style.width = (bar.dataset.fill || 80) + '%';
        });
    }

    // =========================================
    // 6. (removed: experience flip cards — now flat pastel cards)
    // =========================================

    // =========================================
    // 7. DATA TICKER (top bar)
    // =========================================
    const tickerTrack = $('#ticker-track');
    if (tickerTrack) {
        const tickerItems = [
            { tag: 'INFO',    msg: 'model.predict() · latency 12ms' },
            { tag: 'TRAIN',   msg: 'epoch 47/100 · loss 0.0234' },
            { tag: 'METRIC',  msg: 'PR-AUC 0.94 · F1 0.91' },
            { tag: 'DEPLOY',  msg: 'rolled out v2.3.1 to prod-east' },
            { tag: 'CV',      msg: 'crowd-density · mAP 0.87' },
            { tag: 'AUDIO',   msg: 'vad · precision 0.96 recall 0.93' },
            { tag: 'NLP',     msg: 'tokenizer · 32k vocab loaded' },
            { tag: 'MLOPS',   msg: 'pipeline · build #428 passed' },
            { tag: 'GPU',     msg: 'a100 · util 87% · mem 68GB' },
            { tag: 'INFER',   msg: 'batch=32 · throughput 240/s' },
            { tag: 'OK',      msg: 'monitoring drift · within bounds' },
            { tag: 'COMMIT',  msg: 'main · feat: improve fp-rate' }
        ];
        // duplicate for seamless loop
        const items = tickerItems.concat(tickerItems);
        items.forEach(it => {
            const span = document.createElement('span');
            span.className = 'tk-item';
            span.innerHTML = '<span class="tk-dot"></span><span class="tk-tag">[' + it.tag + ']</span><span>' + it.msg + '</span>';
            tickerTrack.appendChild(span);
        });
    }

    // =========================================
    // 8. BACKGROUND PARTICLES
    // =========================================
    if (!PRM) {
        const canvas = $('#particles-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            let particles = [];
            let raf;
            function fit() {
                const dpr = window.devicePixelRatio || 1;
                canvas.width  = window.innerWidth  * dpr;
                canvas.height = window.innerHeight * dpr;
                canvas.style.width  = window.innerWidth + 'px';
                canvas.style.height = window.innerHeight + 'px';
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.scale(dpr, dpr);
            }
            function spawn() {
                const n = window.innerWidth < 768 ? 28 : 60;
                particles = [];
                for (let i = 0; i < n; i++) {
                    particles.push({
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                        vx: (Math.random() - 0.5) * 0.12,
                        vy: (Math.random() - 0.5) * 0.12,
                        r: 1 + Math.random() * 1.4,
                        a: 0.16 + Math.random() * 0.3
                    });
                }
            }
            function tick() {
                ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
                const isDark = container.classList.contains('dark-theme');
                const colour = isDark ? '255,255,255' : '57,252,155';
                particles.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;
                    if (p.x < 0 || p.x > window.innerWidth)  p.vx *= -1;
                    if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(' + colour + ',' + (p.a * (isDark ? 0.4 : 0.5)) + ')';
                    ctx.fill();
                });
                raf = requestAnimationFrame(tick);
            }
            fit(); spawn(); tick();
            window.addEventListener('resize', () => {
                cancelAnimationFrame(raf); fit(); spawn(); tick();
            });
        }
    }

    // =========================================
    // 9. LATENT-SPACE HERO CANVAS
    // =========================================
    if (!PRM) {
        const latent = $('#latent-canvas');
        if (latent) {
            const ctx = latent.getContext('2d');
            let clusters = [];
            let raf2;
            const palette = [
                { r: 57,  g: 252, b: 155 },  // mint
                { r: 255, g: 107, b: 74  },  // coral
                { r: 125, g: 107, b: 255 },  // violet
                { r: 255, g: 179, b: 71  },  // amber
            ];

            function fitLat() {
                const dpr = window.devicePixelRatio || 1;
                const rect = latent.getBoundingClientRect();
                latent.width  = rect.width  * dpr;
                latent.height = rect.height * dpr;
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.scale(dpr, dpr);
                return rect;
            }
            function spawnClusters() {
                const rect = fitLat();
                clusters = [];
                const positions = [
                    { x: rect.width * 0.18, y: rect.height * 0.28 },
                    { x: rect.width * 0.82, y: rect.height * 0.32 },
                    { x: rect.width * 0.22, y: rect.height * 0.78 },
                    { x: rect.width * 0.78, y: rect.height * 0.72 },
                ];
                positions.forEach((pos, idx) => {
                    const pts = [];
                    const count = 22;
                    for (let i = 0; i < count; i++) {
                        const angle = Math.random() * Math.PI * 2;
                        const dist = Math.pow(Math.random(), 0.7) * 80;
                        pts.push({
                            cx: pos.x,
                            cy: pos.y,
                            ox: Math.cos(angle) * dist,
                            oy: Math.sin(angle) * dist,
                            r: 1 + Math.random() * 2.2,
                            phase: Math.random() * Math.PI * 2,
                            speed: 0.0006 + Math.random() * 0.0012
                        });
                    }
                    clusters.push({ pts, col: palette[idx] });
                });
            }
            function loop(t) {
                const w = latent.width  / (window.devicePixelRatio || 1);
                const h = latent.height / (window.devicePixelRatio || 1);
                ctx.clearRect(0, 0, w, h);
                clusters.forEach(cl => {
                    // halo
                    const grd = ctx.createRadialGradient(cl.pts[0].cx, cl.pts[0].cy, 0,
                                                         cl.pts[0].cx, cl.pts[0].cy, 130);
                    grd.addColorStop(0, 'rgba(' + cl.col.r + ',' + cl.col.g + ',' + cl.col.b + ',0.10)');
                    grd.addColorStop(1, 'rgba(' + cl.col.r + ',' + cl.col.g + ',' + cl.col.b + ',0)');
                    ctx.fillStyle = grd;
                    ctx.beginPath();
                    ctx.arc(cl.pts[0].cx, cl.pts[0].cy, 130, 0, Math.PI * 2);
                    ctx.fill();
                    // points
                    cl.pts.forEach(p => {
                        const drift = Math.sin(t * p.speed + p.phase) * 8;
                        const x = p.cx + p.ox + Math.cos(p.phase) * drift;
                        const y = p.cy + p.oy + Math.sin(p.phase) * drift;
                        ctx.beginPath();
                        ctx.arc(x, y, p.r, 0, Math.PI * 2);
                        ctx.fillStyle = 'rgba(' + cl.col.r + ',' + cl.col.g + ',' + cl.col.b + ',0.55)';
                        ctx.fill();
                    });
                });
                raf2 = requestAnimationFrame(loop);
            }
            spawnClusters();
            loop(0);
            window.addEventListener('resize', () => {
                cancelAnimationFrame(raf2);
                spawnClusters();
                loop(0);
            });
        }
    }

    // =========================================
    // 10. ABOUT — animated mini-wave SVG
    // =========================================
    const aboutWave = $('#about-wave-poly');
    if (aboutWave && !PRM) {
        let phase = 0;
        function drawWave() {
            const pts = [];
            for (let x = 0; x <= 200; x += 5) {
                const y = 20 + Math.sin((x / 28) + phase) * 8 * Math.sin((x / 60) + phase * 0.5);
                pts.push(x + ',' + y.toFixed(1));
            }
            aboutWave.setAttribute('points', pts.join(' '));
            phase += 0.04;
            requestAnimationFrame(drawWave);
        }
        drawWave();
    }

    // =========================================
    // 11-16. DEMO FACTORY + MODAL SYSTEM
    // Each demo factory returns { cleanup } so animation frames
    // / intervals can be cancelled when modal closes.
    // =========================================

    const Demos = {
        // -------- CROWD DENSITY --------
        crowd: function(root, opts) {
            opts = opts || {};
            const ambient = !!opts.ambient;
            const canvas = root.querySelector('[data-canvas="crowd"], .ambient-crowd-canvas');
            const stage = ambient ? canvas.parentElement : root.querySelector('.crowd-stage');
            if (!canvas) return { cleanup: function(){} };

            const ctx = canvas.getContext('2d');
            let people = [];
            let raf = null;

            function fit() {
                const rect = (ambient ? canvas : stage).getBoundingClientRect();
                const dpr = window.devicePixelRatio || 1;
                canvas.width  = rect.width  * dpr;
                canvas.height = rect.height * dpr;
                canvas.style.width  = rect.width + 'px';
                canvas.style.height = rect.height + 'px';
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.scale(dpr, dpr);
            }
            function seed(n) {
                const rect = canvas.getBoundingClientRect();
                for (let i = 0; i < n; i++) {
                    people.push({
                        x: Math.random() * rect.width,
                        y: Math.random() * rect.height,
                        vx: (Math.random() - 0.5) * (ambient ? 0.18 : 0.4),
                        vy: (Math.random() - 0.5) * (ambient ? 0.18 : 0.4)
                    });
                }
            }
            const countEl  = root.querySelector('[data-out="crowd-count"]');
            const densEl   = root.querySelector('[data-out="crowd-density"]');
            const statEl   = root.querySelector('[data-out="crowd-status"]');

            function draw() {
                const rect = canvas.getBoundingClientRect();
                const w = rect.width, h = rect.height;
                ctx.clearRect(0, 0, w, h);

                const gx = ambient ? 12 : 16;
                const gy = ambient ? 8 : 12;
                const cellW = w / gx, cellH = h / gy;
                const grid = new Array(gx * gy).fill(0);
                people.forEach(p => {
                    const ix = Math.floor(p.x / cellW);
                    const iy = Math.floor(p.y / cellH);
                    if (ix >= 0 && ix < gx && iy >= 0 && iy < gy) {
                        grid[iy * gx + ix] += 1;
                        if (ix > 0)     grid[iy * gx + (ix-1)] += 0.4;
                        if (ix < gx-1)  grid[iy * gx + (ix+1)] += 0.4;
                        if (iy > 0)     grid[(iy-1) * gx + ix] += 0.4;
                        if (iy < gy-1)  grid[(iy+1) * gx + ix] += 0.4;
                    }
                });
                const maxV = Math.max(1, ...grid);
                for (let i = 0; i < gy; i++) {
                    for (let j = 0; j < gx; j++) {
                        const v = grid[i * gx + j] / maxV;
                        if (v > 0.02) {
                            ctx.fillStyle = 'rgba(57, 252, 155,' + (v * (ambient ? 0.35 : 0.45)).toFixed(3) + ')';
                            ctx.fillRect(j * cellW, i * cellH, cellW, cellH);
                        }
                    }
                }
                people.forEach(p => {
                    p.x += p.vx; p.y += p.vy;
                    if (p.x < 4 || p.x > w - 4) p.vx *= -1;
                    if (p.y < 4 || p.y > h - 4) p.vy *= -1;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, ambient ? 3 : 4, 0, Math.PI * 2);
                    ctx.fillStyle = '#1e8c50';
                    ctx.fill();
                    if (!ambient) {
                        ctx.lineWidth = 1.5;
                        ctx.strokeStyle = '#ffffff';
                        ctx.stroke();
                    }
                });

                if (countEl) countEl.textContent = people.length.toString().padStart(3, '0');
                if (densEl)  densEl.textContent  = (people.length / (gx * gy)).toFixed(2);
                if (statEl) {
                    statEl.textContent = people.length === 0 ? 'idle'
                                      : people.length < 20  ? 'sparse'
                                      : people.length < 60  ? 'normal'
                                      :                       'crowded';
                    statEl.style.color = people.length >= 60 ? '#ff6b4a'
                                      : people.length >= 20  ? '#ffb347'
                                      :                        '';
                }

                raf = requestAnimationFrame(draw);
            }
            // wait one tick so layout settles
            setTimeout(() => { fit(); seed(ambient ? 14 : 12); draw(); }, 50);

            const onResize = () => fit();
            window.addEventListener('resize', onResize);

            const handlers = [];
            if (!ambient) {
                const onClick = (e) => {
                    const rect = canvas.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    people.push({ x, y, vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6 });
                };
                canvas.addEventListener('click', onClick);
                handlers.push(['click', canvas, onClick]);

                const seedBtn  = root.querySelector('[data-action="crowd-seed"]');
                const resetBtn = root.querySelector('[data-action="crowd-reset"]');
                if (seedBtn) {
                    const f = () => seed(5);
                    seedBtn.addEventListener('click', f);
                    handlers.push(['click', seedBtn, f]);
                }
                if (resetBtn) {
                    const f = () => { people = []; };
                    resetBtn.addEventListener('click', f);
                    handlers.push(['click', resetBtn, f]);
                }
            }

            return {
                cleanup: function() {
                    if (raf) cancelAnimationFrame(raf);
                    window.removeEventListener('resize', onResize);
                    handlers.forEach(([type, el, f]) => el.removeEventListener(type, f));
                    people = [];
                }
            };
        },

        // -------- DIARIZATION --------
        diar: function(root, opts) {
            opts = opts || {};
            const ambient = !!opts.ambient;
            const canvas = root.querySelector('[data-canvas="diar"], .ambient-diar-canvas');
            if (!canvas) return { cleanup: function(){} };
            const ctx = canvas.getContext('2d');
            const speakerCols = ['#39fc9b', '#ff6b4a', '#7d6bff'];
            const segments = [
                { start: 0,    end: 0.18, speaker: 0 },
                { start: 0.18, end: 0.32, speaker: 1 },
                { start: 0.32, end: 0.55, speaker: 0 },
                { start: 0.55, end: 0.72, speaker: 2 },
                { start: 0.72, end: 0.88, speaker: 1 },
                { start: 0.88, end: 1.0,  speaker: 0 }
            ];
            let raf = null;
            let t = 0;

            function fit() {
                const rect = canvas.getBoundingClientRect();
                const dpr = window.devicePixelRatio || 1;
                canvas.width  = rect.width  * dpr;
                canvas.height = rect.height * dpr;
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.scale(dpr, dpr);
            }
            function draw() {
                const rect = canvas.getBoundingClientRect();
                const w = rect.width, h = rect.height;
                ctx.clearRect(0, 0, w, h);

                segments.forEach(seg => {
                    const x = seg.start * w;
                    const sw = (seg.end - seg.start) * w;
                    ctx.fillStyle = speakerCols[seg.speaker] + (ambient ? '18' : '22');
                    ctx.fillRect(x, 0, sw, h);
                    ctx.fillStyle = speakerCols[seg.speaker];
                    ctx.fillRect(x, 0, sw, ambient ? 2 : 3);
                });

                ctx.beginPath();
                for (let x = 0; x <= w; x += 2) {
                    const seg = segments.find(s => x / w >= s.start && x / w < s.end) || segments[0];
                    const amp = h * (ambient ? 0.22 : 0.32);
                    const freq = 0.04 + seg.speaker * 0.015;
                    const y = h / 2 + Math.sin(x * freq + t + seg.speaker * 1.7) * amp
                             * (0.4 + 0.6 * Math.abs(Math.sin(x * 0.01 + t * 0.5)));
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.lineWidth = 1.5;
                ctx.strokeStyle = '#9ba1ac';
                ctx.globalAlpha = ambient ? 0.7 : 0.85;
                ctx.stroke();
                ctx.globalAlpha = 1;

                t += ambient ? 0.04 : 0.08;
                raf = requestAnimationFrame(draw);
            }
            setTimeout(() => { fit(); draw(); }, 50);
            const onResize = () => fit();
            window.addEventListener('resize', onResize);

            return {
                cleanup: function() {
                    if (raf) cancelAnimationFrame(raf);
                    window.removeEventListener('resize', onResize);
                }
            };
        },

        // -------- PLATE --------
        plate: function(root, opts) {
            opts = opts || {};
            const ambient = !!opts.ambient;
            if (ambient) return { cleanup: function(){} }; // ambient is CSS-only
            const out = root.querySelector('[data-out="plate-result"]');
            if (!out) return { cleanup: function(){} };
            const plates = [
                'KA · 03 · MJ · 4271',
                'MH · 12 · DE · 8842',
                'DL · 07 · CA · 5519',
                'TN · 09 · BV · 1023',
                'KA · 04 · NK · 7398'
            ];
            let i = 0;
            out.style.transition = 'opacity 0.2s';
            const interval = setInterval(() => {
                i = (i + 1) % plates.length;
                out.style.opacity = '0';
                setTimeout(() => {
                    out.textContent = plates[i];
                    out.style.opacity = '1';
                }, 200);
            }, 3500);
            return {
                cleanup: function() { clearInterval(interval); }
            };
        },

        // -------- CODEGEN --------
        codegen: function(root, opts) {
            opts = opts || {};
            const ambient = !!opts.ambient;
            if (ambient) return { cleanup: function(){} }; // ambient is static
            const promptEl = root.querySelector('[data-out="codegen-prompt-text"]');
            const outEl    = root.querySelector('[data-out="codegen-out"]');
            if (!promptEl || !outEl) return { cleanup: function(){} };
            const samples = [
                {
                    prompt: 'sort a list of numbers in ascending order',
                    code:  '<span class="kw">def</span> <span class="fn">sort_asc</span>(nums):\n    <span class="cm"># quicksort via builtin</span>\n    <span class="kw">return</span> <span class="fn">sorted</span>(nums)'
                },
                {
                    prompt: 'fetch user by id from the api',
                    code:  '<span class="kw">async def</span> <span class="fn">fetch_user</span>(id):\n    r = <span class="kw">await</span> client.<span class="fn">get</span>(<span class="str">f"/users/{id}"</span>)\n    <span class="kw">return</span> r.<span class="fn">json</span>()'
                },
                {
                    prompt: 'parse a json string safely',
                    code:  '<span class="kw">import</span> json\n<span class="kw">def</span> <span class="fn">safe_parse</span>(s):\n    <span class="kw">try</span>:    <span class="kw">return</span> json.<span class="fn">loads</span>(s)\n    <span class="kw">except</span>: <span class="kw">return</span> {}'
                },
                {
                    prompt: 'compute precision and recall',
                    code:  '<span class="kw">def</span> <span class="fn">metrics</span>(tp, fp, fn):\n    p = tp / (tp + fp)\n    r = tp / (tp + fn)\n    <span class="kw">return</span> p, r'
                }
            ];
            let idx = 0;
            let stopped = false;
            const timers = [];
            function wait(ms) {
                return new Promise(r => {
                    const t = setTimeout(r, ms);
                    timers.push(t);
                });
            }
            async function cycle() {
                while (!stopped) {
                    const s = samples[idx];
                    promptEl.textContent = '';
                    for (let i = 0; i <= s.prompt.length; i++) {
                        if (stopped) return;
                        promptEl.textContent = s.prompt.slice(0, i);
                        await wait(28);
                    }
                    await wait(400);
                    if (stopped) return;
                    outEl.innerHTML = '';
                    const html = s.code;
                    let i = 0;
                    while (i < html.length) {
                        if (stopped) return;
                        if (html[i] === '<') {
                            const end = html.indexOf('>', i);
                            outEl.innerHTML = html.slice(0, end + 1);
                            i = end + 1;
                        } else {
                            outEl.innerHTML = html.slice(0, i + 1);
                            i++;
                            await wait(12);
                        }
                    }
                    await wait(3000);
                    idx = (idx + 1) % samples.length;
                }
            }
            cycle();
            return {
                cleanup: function() {
                    stopped = true;
                    timers.forEach(t => clearTimeout(t));
                }
            };
        },

        // -------- VAD --------
        vad: function(root, opts) {
            opts = opts || {};
            const ambient = !!opts.ambient;
            const canvas = root.querySelector('[data-canvas="vad"], .ambient-vad-canvas');
            if (!canvas) return { cleanup: function(){} };
            const stateEl = root.querySelector('[data-out="vad-state"]');
            const ctx = canvas.getContext('2d');
            let raf = null;
            let t = 0;
            let isSpeech = true;
            let nextFlip = performance.now() + (ambient ? 4000 : 2500) + Math.random() * 2500;

            function fit() {
                const rect = canvas.getBoundingClientRect();
                const dpr = window.devicePixelRatio || 1;
                canvas.width  = rect.width  * dpr;
                canvas.height = rect.height * dpr;
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.scale(dpr, dpr);
            }
            function draw(now) {
                const rect = canvas.getBoundingClientRect();
                const w = rect.width, h = rect.height;
                if (now > nextFlip) {
                    isSpeech = !isSpeech;
                    nextFlip = now + (ambient ? 4000 : 2500) + Math.random() * 2500;
                    if (stateEl) {
                        stateEl.classList.toggle('silence', !isSpeech);
                        const txt = stateEl.querySelector('.state-text');
                        if (txt) txt.textContent = isSpeech ? 'SPEECH' : 'SILENCE';
                    }
                }
                ctx.clearRect(0, 0, w, h);
                if (!ambient) {
                    ctx.strokeStyle = 'rgba(57, 252, 155, 0.25)';
                    ctx.setLineDash([3, 4]);
                    ctx.beginPath();
                    ctx.moveTo(0, h * 0.18); ctx.lineTo(w, h * 0.18);
                    ctx.moveTo(0, h * 0.82); ctx.lineTo(w, h * 0.82);
                    ctx.stroke();
                    ctx.setLineDash([]);
                }
                ctx.beginPath();
                for (let x = 0; x <= w; x += 1.5) {
                    let amp;
                    if (isSpeech) {
                        amp = h * (ambient ? 0.22 : 0.35) * (0.5 + 0.5 * Math.sin(x * 0.04 + t));
                        amp *= 0.6 + 0.4 * Math.sin(x * 0.012 + t * 0.7);
                    } else {
                        amp = h * 0.06 * (Math.random() - 0.5);
                    }
                    const y = h / 2 + Math.sin(x * 0.08 + t) * amp + (isSpeech ? 0 : (Math.random() - 0.5) * 2);
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.lineWidth = 1.6;
                ctx.strokeStyle = isSpeech ? '#39fc9b' : '#8a8f99';
                ctx.stroke();
                t += ambient ? 0.06 : 0.12;
                raf = requestAnimationFrame(draw);
            }
            setTimeout(() => { fit(); raf = requestAnimationFrame(draw); }, 50);
            const onResize = () => fit();
            window.addEventListener('resize', onResize);
            return {
                cleanup: function() {
                    if (raf) cancelAnimationFrame(raf);
                    window.removeEventListener('resize', onResize);
                }
            };
        },

        // -------- MLOPS --------
        mlops: function(root, opts) {
            opts = opts || {};
            const ambient = !!opts.ambient;
            if (ambient) return { cleanup: function(){} }; // ambient is CSS-only
            const flow = root.querySelector('[data-out="mlops-flow"]');
            const log  = root.querySelector('[data-out="mlops-log"]');
            if (!flow || !log) return { cleanup: function(){} };
            const steps = Array.from(flow.querySelectorAll('.mlops-step'));
            const edges = Array.from(flow.querySelectorAll('.mlops-edge'));
            const logsByStep = [
                ['[12:34:01] dataset loaded · 1.2M rows', '[12:34:02] schema validated', '[12:34:03] split 80/10/10'],
                ['[12:34:04] training · epoch 1/10', '[12:34:08] loss 0.124', '[12:34:14] val_acc 0.91'],
                ['[12:34:15] eval on test split', '[12:34:16] PR-AUC 0.94', '[12:34:17] no regression'],
                ['[12:34:18] docker build started', '[12:34:22] image · 482MB', '[12:34:23] pushed to ecr'],
                ['[12:34:24] deploying v2.3.1', '[12:34:27] canary 10%', '[12:34:30] traffic 100% · ✓ healthy']
            ];
            let step = 0;
            const subTimers = [];
            function activate(i) {
                steps.forEach((s, k) => s.classList.toggle('active', k === i));
                edges.forEach((e, k) => e.classList.toggle('lit', k < i));
                const lines = logsByStep[i];
                log.innerHTML = '';
                lines.forEach((line, k) => {
                    const t = setTimeout(() => {
                        const div = document.createElement('div');
                        div.className = 'log-line';
                        const m = line.match(/^\[(.*?)\](.*)$/);
                        if (m) div.innerHTML = '<span class="log-time">[' + m[1] + ']</span>' + m[2];
                        else   div.textContent = line;
                        log.appendChild(div);
                        log.scrollTop = log.scrollHeight;
                    }, k * 400);
                    subTimers.push(t);
                });
            }
            activate(0);
            const interval = setInterval(() => {
                step = (step + 1) % steps.length;
                activate(step);
            }, 3200);
            return {
                cleanup: function() {
                    clearInterval(interval);
                    subTimers.forEach(t => clearTimeout(t));
                }
            };
        }
    };

    // ---------- MODAL CONTROLLER ----------
    const modal     = $('#demo-modal');
    const modalBody = $('#modal-body');
    const modalTitleEl   = $('#modal-title');
    const modalEyebrowEl = $('#modal-eyebrow');

    const projectMeta = {
        crowd:   { num: 'P.01', title: 'Crowd Density Estimation' },
        diar:    { num: 'P.02', title: 'Speaker Diarization' },
        plate:   { num: 'P.03', title: 'License Plate Recognition' },
        codegen: { num: 'P.04', title: 'Code Generation NLP' },
        vad:     { num: 'P.05', title: 'Voice Activity Detection' },
        mlops:   { num: 'P.06', title: 'MLOps Pipeline' }
    };

    let activeDemo = null;

    function openModal(key) {
        const tpl = $('#tpl-' + key);
        const factory = Demos[key];
        if (!tpl || !factory || !modal) return;

        // Clear prior content & inject template
        modalBody.innerHTML = '';
        const node = tpl.content.cloneNode(true);
        modalBody.appendChild(node);

        // Update header
        const meta = projectMeta[key] || { num: '', title: '' };
        if (modalEyebrowEl) modalEyebrowEl.innerHTML = '<span class="modal-eyebrow-tag">' + meta.num + '</span> · live demo';
        if (modalTitleEl)   modalTitleEl.textContent = meta.title;

        // Open
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');

        // Init demo after modal opening animation settles
        setTimeout(() => {
            activeDemo = factory(modalBody, { ambient: false });
        }, 450);
    }
    function closeModal() {
        if (!modal || !modal.classList.contains('open')) return;
        if (activeDemo && activeDemo.cleanup) activeDemo.cleanup();
        activeDemo = null;
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        // Clear after fade so it doesn't flash
        setTimeout(() => { if (!modal.classList.contains('open')) modalBody.innerHTML = ''; }, 350);
    }

    // Wire up open buttons
    $$('[data-open-demo]').forEach(btn => {
        btn.addEventListener('click', () => openModal(btn.dataset.openDemo));
    });
    // Wire up close buttons
    $$('[data-modal-close]').forEach(el => {
        el.addEventListener('click', closeModal);
    });
    // Escape to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // ---------- AMBIENT DEMOS (always running in cards) ----------
    // Each ambient demo is initialized once on the card visual.
    const ambientCrowd = document.querySelector('.ambient-crowd');
    if (ambientCrowd) Demos.crowd(ambientCrowd, { ambient: true });

    const ambientDiar = document.querySelector('.ambient-diar');
    if (ambientDiar) Demos.diar(ambientDiar, { ambient: true });

    const ambientVad = document.querySelector('.ambient-vad');
    if (ambientVad) Demos.vad(ambientVad, { ambient: true });
    // plate, codegen, mlops ambient versions are CSS-only / static — no JS needed.

    // =========================================
    // 17. TERMINAL CONTACT — types out
    // =========================================
    (function terminalDemo() {
        const body = $('#terminal-body');
        if (!body) return;

        const lines = [
            { type: 'cmd',     text: '$ whoami' },
            { type: 'out',     text: 'anubhav.tiwari · senior_mle' },
            { type: 'space' },
            { type: 'cmd',     text: '$ cat contact.json' },
            { type: 'json',    pairs: [
                ['name',     'Anubhav Tiwari'],
                ['role',     'Senior Machine Learning Engineer'],
                ['location', 'Bangalore, India'],
                ['email',    'abt.exp@gmail.com'],
                ['github',   'github.com/abtExp'],
                ['linkedin', 'linkedin.com/in/abtExp'],
                ['twitter',  '@overfitowl']
            ]},
            { type: 'space' },
            { type: 'cmd',     text: '$ echo "let\'s build something"' },
            { type: 'out',     text: "let's build something" },
            { type: 'cursor' }
        ];

        function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

        async function typeText(node, text, speed = 22) {
            for (let i = 0; i <= text.length; i++) {
                node.textContent = text.slice(0, i);
                await wait(speed);
            }
        }

        async function play() {
            for (const ln of lines) {
                if (ln.type === 'space') {
                    body.appendChild(document.createElement('br'));
                    continue;
                }
                if (ln.type === 'cursor') {
                    const c = document.createElement('span');
                    c.className = 'terminal-cursor';
                    body.appendChild(c);
                    continue;
                }
                if (ln.type === 'cmd') {
                    const wrap = document.createElement('div');
                    const prompt = document.createElement('span');
                    prompt.className = 'terminal-prompt';
                    prompt.textContent = '$ ';
                    const txt = document.createElement('span');
                    wrap.appendChild(prompt);
                    wrap.appendChild(txt);
                    body.appendChild(wrap);
                    await typeText(txt, ln.text.replace(/^\$\s/, ''));
                    await wait(280);
                    continue;
                }
                if (ln.type === 'out') {
                    const div = document.createElement('div');
                    div.className = 'terminal-info';
                    body.appendChild(div);
                    await typeText(div, ln.text, 14);
                    await wait(180);
                    continue;
                }
                if (ln.type === 'json') {
                    const open = document.createElement('div');
                    open.textContent = '{';
                    body.appendChild(open);
                    for (const [k, v] of ln.pairs) {
                        const row = document.createElement('div');
                        row.style.paddingLeft = '14px';
                        row.innerHTML = '<span class="terminal-key">"' + k + '"</span>: <span class="terminal-string">"' + v + '"</span>,';
                        body.appendChild(row);
                        await wait(120);
                    }
                    const close = document.createElement('div');
                    close.textContent = '}';
                    body.appendChild(close);
                    await wait(200);
                    continue;
                }
            }
        }

        // start when contact section becomes visible
        if ('IntersectionObserver' in window) {
            let played = false;
            const io = new IntersectionObserver((entries) => {
                entries.forEach(e => {
                    if (e.isIntersecting && !played) {
                        played = true;
                        play();
                    }
                });
            }, { threshold: 0.2 });
            io.observe(body);
        } else {
            play();
        }
    })();

    // =========================================
    // 18. FOOTER NN GRAPHIC
    // =========================================
    (function footerNN() {
        const svg = $('#footer-nn');
        if (!svg) return;
        const W = 600, H = 200;
        // 4 layers: 3 - 5 - 5 - 2
        const layers = [3, 5, 5, 2];
        const xs = layers.map((_, i) => 60 + i * ((W - 120) / (layers.length - 1)));

        const nodes = [];
        layers.forEach((n, li) => {
            const layerNodes = [];
            for (let i = 0; i < n; i++) {
                const y = H / 2 + (i - (n - 1) / 2) * 32;
                layerNodes.push({ x: xs[li], y });
            }
            nodes.push(layerNodes);
        });

        // edges
        for (let li = 0; li < nodes.length - 1; li++) {
            for (const a of nodes[li]) {
                for (const b of nodes[li + 1]) {
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', a.x);
                    line.setAttribute('y1', a.y);
                    line.setAttribute('x2', b.x);
                    line.setAttribute('y2', b.y);
                    line.setAttribute('class', 'nn-edge');
                    svg.appendChild(line);
                }
            }
        }
        // nodes
        nodes.forEach(layer => {
            layer.forEach((n, i) => {
                const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                c.setAttribute('cx', n.x);
                c.setAttribute('cy', n.y);
                c.setAttribute('r', 4);
                c.setAttribute('class', 'nn-node');
                c.style.animation = 'pulse-dot 2.2s infinite';
                c.style.animationDelay = (i * 0.15) + 's';
                svg.appendChild(c);
            });
        });
    })();

    // initial nav state
    updateActiveOnScroll();
})();
