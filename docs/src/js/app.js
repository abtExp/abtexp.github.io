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
    // 6. EXPERIENCE FLIP CARDS
    // Hover flips on desktop; tap toggles on touch
    // =========================================
    $$('.etl-card').forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.classList.toggle('flipped');
            }
        });
    });

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
    // 8. (background particles removed — new design uses latent canvas in hero)
    // =========================================

    // =========================================
    // =========================================
    // 9. HERO — three-scene ML showcase
    //    Scene 0: object detection (cutout + boxes)
    //    Scene 1: k-means clustering (centroids converge, points colorize)
    //    Scene 2: token generation (ML terms form the portrait)
    // =========================================
    (function heroShowcase() {
        const canvas = document.getElementById('portrait-canvas');
        const stage  = document.getElementById('portrait-stage');
        const data   = window.PORTRAIT_DATA;
        if (!canvas || !stage || !data) return;

        const ctx = canvas.getContext('2d');
        const skillLabels = Array.from(document.querySelectorAll('.skill-label'));
        const sceneCapName = document.getElementById('ssc-name');
        const sceneCapNum  = document.querySelector('#hero-scene-caption .ssc-num');
        const sceneNames = ['object detection','clustering','generation'];

        // cutout image
        const cutImg = new Image();
        let cutReady = false;
        cutImg.onload = () => {
            cutReady = true;
            // calligram needs the loaded image; rebuild now that it's ready
            if (layout.geo) buildCalligram(layout.geo.drawW, layout.geo.drawH, layout.geo.offX, layout.geo.offY);
        };
        cutImg.src = data.cutout;

        // skill label anchor offsets (used in clustering scene)
        const labelAnchors = [
            { dx: 0.00, dy:-0.13 }, { dx: 0.27, dy:-0.03 }, { dx:-0.28, dy: 0.00 },
            { dx:-0.26, dy: 0.10 }, { dx: 0.24, dy: 0.08 },
        ];
        const clusterCols = ['43,179,111','125,107,255','255,107,74','255,179,71','77,171,247'];
        const skillNames  = ['computer vision','python','nlp','audio','mlops'];

        // detection box accent colours by id
        const boxCols = { hair:'43,179,111', glasses:'125,107,255', face:'255,107,74', shirt:'77,171,247' };

        // ML terms for the generation scene
        const mlTerms = ['gradient','tensor','epoch','softmax','attention','embedding','dropout','relu',
            'conv2d','backprop','logits','entropy','adam','batchnorm','sigmoid','encoder','decoder','kernel',
            'pooling','feature','vector','weights','bias','loss','accuracy','recall','f1','auc','sgd','lstm',
            'transformer','token','vocab','corpus','ngram','cosine','manifold','latent','cluster','kmeans',
            'pipeline','docker','deploy','inference','dataset','augment','overfit','regularize','tuning','prior'];

        let pts = [];
        let dpr = 1;
        let raf = null;
        let clock = 0;            // ms master clock
        let last = null;
        let sceneStart = 0;       // ms when current scene started
        let scene = 0;            // 0,1,2
        let paused = false;
        let mouse = { x:-999, y:-999, active:false };

        // scene durations (ms) including their intro/hold
        const DUR = [5200, 7000, 8000];

        function layout() {
            dpr = window.devicePixelRatio || 1;
            const rect = stage.getBoundingClientRect();
            canvas.width = rect.width*dpr; canvas.height = rect.height*dpr;
            canvas.style.width = rect.width+'px'; canvas.style.height = rect.height+'px';
            ctx.setTransform(dpr,0,0,dpr,0,0);

            const padX = rect.width*0.10, padY = rect.height*0.04;
            const availW = rect.width-padX*2, availH = rect.height-padY*2;
            let drawW = availW, drawH = availW/data.aspect;
            if (drawH>availH){ drawH=availH; drawW=availH*data.aspect; }
            const offX=(rect.width-drawW)/2, offY=(rect.height-drawH)/2;

            pts = data.points.map((p,i) => {
                const tx=offX+(p[0]/1000)*drawW, ty=offY+(p[1]/1000)*drawH;
                return {
                    tx, ty,
                    sx: rect.width/2 + (Math.random()-0.5)*rect.width,
                    sy: rect.height/2 + (Math.random()-0.5)*rect.height,
                    r:p[2], g:p[3], b:p[4], cluster:p[5],
                    size:1.5+Math.random()*1.2, ph:Math.random()*Math.PI*2,
                    sp:0.0004+Math.random()*0.0009, idx:i
                };
            });
            layout.rect=rect; layout.geo={drawW,drawH,offX,offY};

            // map detection boxes + centroids to pixel space
            layout.boxes = (data.boxes||[]).map(b => ({
                id:b.id, label:b.label, conf:b.conf, side:b.side,
                x: offX + b.box[0]/1000*drawW, y: offY + b.box[1]/1000*drawH,
                w: (b.box[2]-b.box[0])/1000*drawW, h: (b.box[3]-b.box[1])/1000*drawH
            }));
            layout.cents = data.centroids.map((c,i)=>({
                tx: offX + c[0]*drawW, ty: offY + c[1]*drawH, cluster:i
            }));

            // build calligram cells (text that forms the portrait shape)
            buildCalligram(drawW, drawH, offX, offY);
        }

        // Sample the cutout into a grid of character cells, colored by pixel,
        // assigning a continuous stream of ML-term characters in reading order.
        function buildCalligram(drawW, drawH, offX, offY) {
            layout.cells = [];
            if (!cutReady) return;   // rebuilt on image load
            const COL = 4, ROW = 7;             // small cells → denser, clearer portrait
            const ow = Math.max(1, Math.round(drawW));
            const oh = Math.max(1, Math.round(drawH));
            const oc = document.createElement('canvas');
            oc.width = ow; oc.height = oh;
            const octx = oc.getContext('2d', { willReadFrequently: true });
            octx.drawImage(cutImg, 0, 0, ow, oh);
            let img;
            try { img = octx.getImageData(0, 0, ow, oh).data; }
            catch(e){ return; }

            // continuous character stream from ML terms
            const stream = mlTerms.join(' ') + ' ';
            let si = 0;
            const cells = [];
            for (let gy = 0; gy < oh; gy += ROW) {
                let insidePrev = false;
                for (let gx = 0; gx < ow; gx += COL) {
                    const px = Math.min(ow-1, gx + (COL>>1));
                    const py = Math.min(oh-1, gy + (ROW>>1));
                    const o = (py * ow + px) * 4;
                    const a = img[o+3];
                    if (a > 70) {
                        // advance past a space when re-entering silhouette so words don't split oddly
                        if (!insidePrev) { while (stream[si % stream.length] === ' ') si++; }
                        let ch = stream[si % stream.length];
                        si++;
                        if (ch === ' ') { insidePrev = true; continue; } // gap = space
                        let r = img[o], g = img[o+1], b = img[o+2];
                        // contrast expansion around mid-grey so dark features
                        // (hair, glasses, beard) separate from skin, then darken
                        // slightly for legibility on the light background
                        const k = 1.45;
                        r = (r-128)*k+128; g = (g-128)*k+128; b = (b-128)*k+128;
                        r = Math.max(0,Math.min(255,r))*0.74;
                        g = Math.max(0,Math.min(255,g))*0.74;
                        b = Math.max(0,Math.min(255,b))*0.74;
                        r=Math.round(r); g=Math.round(g); b=Math.round(b);
                        const mxv = Math.max(r,g,b);
                        if (mxv < 38) { r+=30; g+=27; b+=25; }   // keep darkest hair visible
                        cells.push({ x: offX+gx, y: offY+gy+ROW*0.5, ch, r, g, b });
                        insidePrev = true;
                    } else {
                        insidePrev = false;
                    }
                }
            }
            layout.cells = cells;
            layout.cellFont = '6px "JetBrains Mono", monospace';
        }

        function clearStageLabels() { skillLabels.forEach(l=>l.classList.remove('shown')); }

        function showClusterLabels(on) {
            const rect=layout.rect, g=layout.geo;
            if (!rect||!g) return;
            data.centroids.forEach((c,i)=>{
                const lbl = skillLabels.find(l=>+l.dataset.cluster===i); if(!lbl) return;
                const bx=g.offX+c[0]*g.drawW, by=g.offY+c[1]*g.drawH;
                const a=labelAnchors[i];
                lbl.style.left=(bx+a.dx*rect.width)+'px';
                lbl.style.top =(by+a.dy*rect.height)+'px';
                lbl.classList.toggle('shown', on);
            });
        }

        const easeOut = t => 1-Math.pow(1-t,3);
        const easeInOut = t => t<0.5 ? 2*t*t : 1-Math.pow(-2*t+2,2)/2;

        // ---------- SCENE 0: OBJECT DETECTION ----------
        function drawDetection(st) {
            const rect=layout.rect, g=layout.geo;
            ctx.clearRect(0,0,rect.width,rect.height);
            const fade = Math.min(1, st/500);

            // draw cutout
            if (cutReady) {
                ctx.globalAlpha = fade;
                ctx.drawImage(cutImg, g.offX, g.offY, g.drawW, g.drawH);
                ctx.globalAlpha = 1;
            }

            // boxes draw in sequentially
            const boxes = layout.boxes;
            const perBox = 520; // ms per box reveal
            const placed = []; // label rects already placed this frame
            boxes.forEach((b,i) => {
                const bt = st - 600 - i*perBox;
                if (bt < 0) return;
                const p = Math.min(1, bt/420);
                const col = boxCols[b.id] || '57,252,155';
                drawBoxAnim(b.x,b.y,b.w,b.h,easeOut(p),col);
                if (p >= 1) drawBoxLabel(b, col, placed);
            });

            // scanning line during first 1.2s
            if (st < 1300) {
                const sy = g.offY + (st/1300)*g.drawH;
                ctx.strokeStyle='rgba(57,252,155,0.5)';
                ctx.lineWidth=1.5; ctx.setLineDash([4,4]);
                ctx.beginPath(); ctx.moveTo(g.offX,sy); ctx.lineTo(g.offX+g.drawW,sy); ctx.stroke();
                ctx.setLineDash([]);
            }
        }
        function drawBoxAnim(x,y,w,h,p,col){
            // draw 4 corner brackets growing, then full rect
            const c=Math.min(w,h)*0.22;
            ctx.strokeStyle='rgba('+col+',0.95)';
            ctx.lineWidth=2.5;
            // corners
            const cl=c*p;
            ctx.beginPath();
            // TL
            ctx.moveTo(x,y+cl); ctx.lineTo(x,y); ctx.lineTo(x+cl,y);
            // TR
            ctx.moveTo(x+w-cl,y); ctx.lineTo(x+w,y); ctx.lineTo(x+w,y+cl);
            // BR
            ctx.moveTo(x+w,y+h-cl); ctx.lineTo(x+w,y+h); ctx.lineTo(x+w-cl,y+h);
            // BL
            ctx.moveTo(x+cl,y+h); ctx.lineTo(x,y+h); ctx.lineTo(x,y+h-cl);
            ctx.stroke();
            // faint full rect fading in
            if (p>0.6){
                ctx.strokeStyle='rgba('+col+','+((p-0.6)/0.4*0.35)+')';
                ctx.lineWidth=1; ctx.strokeRect(x,y,w,h);
            }
        }
        function drawBoxLabel(b,col,placed){
            ctx.font='600 11px '+'"JetBrains Mono", monospace';
            const text=b.label+'  '+b.conf.toFixed(2);
            const tw=ctx.measureText(text).width+14;
            const th=18;
            const g=layout.geo;
            // anchor to the box's outer side so tags sit toward the margins, not the face
            let lx = b.side==='right' ? b.x+b.w-tw : b.x;
            lx = Math.max(g.offX-6, Math.min(lx, g.offX+g.drawW-tw+6));
            // sit just above the box top edge (attached), flip below if off the top
            let ly = b.y-th-2;
            const flipUp = (b.y - g.offY) < g.drawH*0.5;   // top-half boxes push up, bottom-half push down
            if (ly < g.offY-th) ly = b.y+2;

            if (placed) {
                let guard=0;
                const overlap = r => (lx < r.x+r.w+5 && lx+tw > r.x-5 && ly < r.y+r.h+4 && ly+th > r.y-4);
                while (placed.some(overlap) && guard<14) {
                    ly += flipUp ? -(th+4) : (th+4);   // move away from the face center
                    guard++;
                }
                placed.push({x:lx,y:ly,w:tw,h:th});
            }
            // connector tick from tag to the box corner
            ctx.strokeStyle='rgba('+col+',0.6)'; ctx.lineWidth=1;
            const tickX = b.side==='right' ? lx+tw-3 : lx+3;
            ctx.beginPath(); ctx.moveTo(tickX, ly+th); ctx.lineTo(tickX, b.y); ctx.stroke();

            ctx.fillStyle='rgba('+col+',0.96)';
            roundRect(lx,ly,tw,th,3); ctx.fill();
            ctx.fillStyle='#fff';
            ctx.textBaseline='middle';
            ctx.fillText(text, lx+7, ly+th/2+0.5);
        }
        function roundRect(x,y,w,h,r){
            ctx.beginPath();
            ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r);
            ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath();
        }

        // ---------- SCENE 1: K-MEANS CLUSTERING ----------
        // initial centroids = random data points (k-means++ style), so they
        // start INSIDE the portrait and converge inward to the cluster centers
        function ensureKmeansStart(){
            if (layout.kmStart) return;
            layout.kmStart = layout.cents.map(()=>{
                const p = pts[(Math.random()*pts.length)|0];
                return { x: p.tx, y: p.ty };
            });
        }
        // label position for a cluster (pill sits offset; connector links it to centroid)
        function labelPos(i){
            const rect=layout.rect, g=layout.geo;
            const c=data.centroids[i];
            const cx=g.offX+c[0]*g.drawW, cy=g.offY+c[1]*g.drawH;
            const a=labelAnchors[i];
            return { x: cx+a.dx*rect.width, y: cy+a.dy*rect.height, cx, cy };
        }
        function drawKmeans(st){
            const rect=layout.rect;
            ctx.clearRect(0,0,rect.width,rect.height);
            ensureKmeansStart();

            const INTRO=600, CONVERGE=3800;       // timings
            // overall convergence progress
            const conv = Math.max(0, Math.min(1, (st-INTRO)/CONVERGE));
            const ce = easeInOut(conv);

            // points appear (grey) during intro, sitting at target positions
            const appear = Math.min(1, st/INTRO);

            // current centroid positions: lerp random -> true (with a little staged wobble)
            const cents = layout.cents.map((c,i)=>{
                const s=layout.kmStart[i];
                // stagger per centroid so they don't all arrive at once
                const cp = Math.max(0,Math.min(1,(ce*1.25 - i*0.05)));
                const e = easeInOut(cp);
                return { x: s.x+(c.tx-s.x)*e, y: s.y+(c.ty-s.y)*e, cluster:c.cluster, prog:cp };
            });

            // draw points
            for (let i=0;i<pts.length;i++){
                const p=pts[i];
                let x=p.tx, y=p.ty;
                // breathing once converged
                if (conv>=1){ x+=Math.sin(clock*p.sp+p.ph)*1.4; y+=Math.cos(clock*p.sp+p.ph)*1.4;
                    if(mouse.active){const ddx=x-mouse.x,ddy=y-mouse.y,d2=ddx*ddx+ddy*ddy;
                        if(d2<9000){const f=(1-d2/9000)*16,d=Math.sqrt(d2)||1;x+=ddx/d*f;y+=ddy/d*f;}}}
                // colorize based on this point's cluster centroid progress
                const cprog = cents[p.cluster].prog;
                const col = mixGrey(p.r,p.g,p.b,cprog);
                const a = 0.25+0.6*appear;
                ctx.fillStyle='rgba('+col[0]+','+col[1]+','+col[2]+','+a+')';
                ctx.fillRect(x-p.size/2,y-p.size/2,p.size,p.size);
            }

            // assignment lines (faint) from a few sample points to their centroid, mid-convergence
            if (conv>0.05 && conv<0.96){
                ctx.lineWidth=0.6;
                for (let i=0;i<pts.length;i+=40){
                    const p=pts[i]; const c=cents[p.cluster];
                    ctx.strokeStyle='rgba('+clusterCols[p.cluster]+',0.10)';
                    ctx.beginPath(); ctx.moveTo(p.tx,p.ty); ctx.lineTo(c.x,c.y); ctx.stroke();
                }
            }

            // draw centroids as ringed markers
            cents.forEach((c)=>{
                ctx.beginPath(); ctx.arc(c.x,c.y,7,0,Math.PI*2);
                ctx.fillStyle='rgba('+clusterCols[c.cluster]+',0.9)'; ctx.fill();
                ctx.strokeStyle='#fff'; ctx.lineWidth=2; ctx.stroke();
                // crosshair
                ctx.strokeStyle='rgba('+clusterCols[c.cluster]+',0.5)'; ctx.lineWidth=1;
                ctx.beginPath(); ctx.moveTo(c.x-12,c.y); ctx.lineTo(c.x+12,c.y);
                ctx.moveTo(c.x,c.y-12); ctx.lineTo(c.x,c.y+12); ctx.stroke();
            });

            // connector lines from each settled centroid to its label (fade in at the end)
            if (conv > 0.8){
                const la = Math.min(1,(conv-0.8)/0.2)*0.55;
                ctx.lineWidth=1; ctx.setLineDash([2,3]);
                cents.forEach((c)=>{
                    const lp = labelPos(c.cluster);
                    const dx=lp.x-c.x, dy=lp.y-c.y, len=Math.hypot(dx,dy)||1;
                    // stop short of the pill
                    const ex=lp.x-(dx/len)*14, ey=lp.y-(dy/len)*8;
                    ctx.strokeStyle='rgba('+clusterCols[c.cluster]+','+la+')';
                    ctx.beginPath(); ctx.moveTo(c.x,c.y); ctx.lineTo(ex,ey); ctx.stroke();
                });
                ctx.setLineDash([]);
            }

            // iteration counter HUD
            const iter = Math.min(8, Math.floor(conv*8)+ (conv>0?1:0));
            ctx.font='600 11px "JetBrains Mono", monospace';
            ctx.fillStyle='rgba(120,125,135,0.8)'; ctx.textBaseline='top';
            ctx.fillText('kmeans · k=5 · iter '+iter+'/8'+(conv>=1?' · converged':''), layout.geo.offX, layout.geo.offY-2);

            // labels appear after convergence
            showClusterLabels(conv>=1);
        }
        function mixGrey(r,g,b,t){
            const G=185;
            return [Math.round(G+(r-G)*t),Math.round(G+(g-G)*t),Math.round(G+(b-G)*t)];
        }

        // ---------- SCENE 2: TOKEN GENERATION (calligram) ----------
        function drawGeneration(st){
            const rect=layout.rect;
            ctx.clearRect(0,0,rect.width,rect.height);
            const cells = layout.cells || [];
            if (!cells.length) return;

            ctx.font = layout.cellFont;
            ctx.textBaseline = 'alphabetic';
            ctx.textAlign = 'left';

            // characters stream in like generated tokens, in reading order.
            // scale per-char delay to the cell count so the full portrait
            // reveals in ~5.4s regardless of density, then holds.
            const lead = 300;
            const revealMs = 5400;
            const perChar = Math.max(0.8, revealMs / cells.length);
            const revealed = Math.max(0, Math.min(cells.length, Math.floor((st-lead)/perChar)));

            for (let i=0; i<revealed; i++){
                const c = cells[i];
                // fade-in over the last chars for a soft generation edge
                const age = revealed - i;
                const a = age > 60 ? 1 : 0.3 + 0.7*(age/60);
                ctx.fillStyle = 'rgba('+c.r+','+c.g+','+c.b+','+a+')';
                ctx.fillText(c.ch, c.x, c.y);
            }

            // blinking cursor at the current generation head
            if (revealed > 0 && revealed < cells.length){
                const head = cells[revealed-1];
                if (Math.floor(st/360)%2===0){
                    ctx.fillStyle='rgba(57,252,155,0.9)';
                    ctx.fillRect(head.x+3, head.y-5, 3, 6);
                }
            }

            // HUD counter
            ctx.font='600 11px "JetBrains Mono", monospace';
            ctx.fillStyle='rgba(120,125,135,0.8)'; ctx.textBaseline='top';
            const done = revealed >= cells.length;
            ctx.fillText((done?'generated · ':'generating · ')+revealed+' tokens',
                layout.geo.offX, layout.geo.offY-2);
        }

        // ---------- MASTER LOOP ----------
        function frame(ts){
            if (last==null) last=ts;
            const dt = ts-last; last=ts;
            if (!paused) clock += dt;

            const st = clock - sceneStart;
            if (scene===0) drawDetection(st);
            else if (scene===1) drawKmeans(st);
            else drawGeneration(st);

            // auto-advance
            if (!paused && st > DUR[scene]) {
                goScene((scene+1)%3, true);
            }
            raf=requestAnimationFrame(frame);
        }

        function goScene(n, auto){
            scene=n; sceneStart=clock;
            if (scene!==1) clearStageLabels();
            if (scene===1) { layout.kmStart=null; } // reseed centroids each time
            if (sceneCapName) sceneCapName.textContent = sceneNames[n];
            if (sceneCapNum)  sceneCapNum.textContent = '0'+(n+1);
        }

        function init(){
            layout();
            clearStageLabels();
            if (PRM){
                // reduced motion: just show colored portrait, no cycling
                const rect=layout.rect; ctx.clearRect(0,0,rect.width,rect.height);
                pts.forEach(p=>{ctx.fillStyle='rgb('+p.r+','+p.g+','+p.b+')';
                    ctx.fillRect(p.tx-p.size/2,p.ty-p.size/2,p.size,p.size);});
                showClusterLabels(true);
                return;
            }
            if (raf) cancelAnimationFrame(raf);
            last=null;
            raf=requestAnimationFrame(frame);
        }

        // mouse
        stage.addEventListener('mousemove',e=>{
            const r=stage.getBoundingClientRect();
            mouse.x=e.clientX-r.left; mouse.y=e.clientY-r.top; mouse.active=true;
        });
        stage.addEventListener('mouseleave',()=>{mouse.active=false;mouse.x=-999;mouse.y=-999;});

        let rz;
        window.addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(()=>{
            const keepScene=scene; layout(); sceneStart=clock; scene=keepScene;
        },200);});

        // pause cycling when hero off-screen (perf)
        const io=new IntersectionObserver(es=>{paused=!es[0].isIntersecting;},{threshold:0.05});
        io.observe(stage);

        setTimeout(init,80);
    })();



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
