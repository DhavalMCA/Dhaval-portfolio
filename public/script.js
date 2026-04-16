/**
 * PORTFOLIO v3.0 — SPIDER-MAN UNIVERSE
 * Fully optimized, modular, error-free JavaScript
 * Author: Dhaval Prajapati
 */

(function () {
  'use strict';

  /* ============================================================
     UTILITIES
     ============================================================ */
  function qs(selector, parent) {
    return (parent || document).querySelector(selector);
  }

  function qsa(selector, parent) {
    return Array.from((parent || document).querySelectorAll(selector));
  }

  function on(el, event, handler, options) {
    if (el) el.addEventListener(event, handler, options || false);
  }

  function debounce(fn, delay) {
    var timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(fn, delay);
    };
  }

  /* ============================================================
     1. LOADER MODULE
     ============================================================ */
  var Loader = (function () {
    var loader = qs('#loader');
    var counter = qs('.loader__counter');
    var label = qs('.loader__label');
    var labels = [
      'With Great Power...',
      'Comes Great Responsibility!',
      'Loading Portfolio...'
    ];
    var labelIdx = 0;

    function updateLabel() {
      labelIdx = (labelIdx + 1) % labels.length;
      if (label) label.textContent = labels[labelIdx];
    }

    function hide() {
      if (!loader) return;
      loader.classList.add('hidden');
      document.body.classList.remove('loading');
    }

    function init() {
      if (!loader || !counter) {
        document.body.classList.remove('loading');
        return;
      }

      var count = 0;
      var target = 100;
      var duration = 2000;
      var stepTime = duration / target;
      var labelTimer = setInterval(updateLabel, 700);

      var interval = setInterval(function () {
        count = Math.min(count + 1, target);
        counter.textContent = count + '%';

        if (count >= target) {
          clearInterval(interval);
          clearInterval(labelTimer);
          setTimeout(hide, 400);
        }
      }, stepTime);

      // Hard fallback: always hide after 3.5s
      setTimeout(hide, 3500);
    }

    return { init: init };
  }());

  /* ============================================================
     2. CURSOR MODULE (Desktop only)
     ============================================================ */
  var Cursor = (function () {
    var cursor = qs('#cursor');
    var follower = qs('#cursor-follower');
    var mouseX = 0, mouseY = 0;
    var fx = 0, fy = 0;
    var raf;

    function move(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursor) {
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
      }
    }

    function followLoop() {
      fx += (mouseX - fx) * 0.12;
      fy += (mouseY - fy) * 0.12;
      if (follower) {
        follower.style.left = fx + 'px';
        follower.style.top = fy + 'px';
      }
      raf = requestAnimationFrame(followLoop);
    }

    function init() {
      // Only on devices that support hover (desktop)
      if (!window.matchMedia('(hover: hover)').matches) return;
      if (!cursor || !follower) return;

      on(document, 'mousemove', move);
      followLoop();

      var hoverTargets = qsa('a, button, .project-card, .skill-tag, .contact-card, .btn');
      hoverTargets.forEach(function (el) {
        on(el, 'mouseenter', function () {
          cursor.classList.add('active');
          follower.classList.add('active');
        });
        on(el, 'mouseleave', function () {
          cursor.classList.remove('active');
          follower.classList.remove('active');
        });
      });

      on(document, 'mousedown', function () { cursor.style.transform = 'translate(-50%, -50%) scale(0.75)'; });
      on(document, 'mouseup', function () { cursor.style.transform = 'translate(-50%, -50%) scale(1)'; });

      // Hide cursor when leaving window
      on(document, 'mouseleave', function () {
        cursor.style.opacity = '0';
        follower.style.opacity = '0';
      });
      on(document, 'mouseenter', function () {
        cursor.style.opacity = '1';
        follower.style.opacity = '1';
      });
    }

    return { init: init };
  }());

  /* ============================================================
     3. SPIDER-WEB CANVAS BACKGROUND
     ============================================================ */
  var WebCanvas = (function () {
    var canvas = qs('#webCanvas');
    var ctx;
    var W, H;
    var nodes = [];
    var NODE_COUNT = 60;
    var CONNECT_DIST = 160;
    var raf;
    var mouseX = -9999, mouseY = -9999;
    var isMobile = window.matchMedia('(max-width: 768px)').matches;

    function createNodes() {
      nodes = [];
      // Reduce node count on mobile for performance
      var count = isMobile ? 30 : NODE_COUNT;
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 1.5 + 0.5
        });
      }
    }

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Update positions
      nodes.forEach(function (n) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        n.x = Math.max(0, Math.min(W, n.x));
        n.y = Math.max(0, Math.min(H, n.y));
      });

      // Draw web threads between close nodes
      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var dx = nodes[j].x - nodes[i].x;
          var dy = nodes[j].y - nodes[i].y;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECT_DIST) {
            var alpha = (1 - dist / CONNECT_DIST) * 0.25;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = 'rgba(229, 9, 26, ' + alpha + ')';
            ctx.lineWidth = isMobile ? 0.4 : 0.6;
            ctx.stroke();
          }
        }

        // Connect to mouse (only on desktop to save performance)
        if (!isMobile) {
          var mdx = mouseX - nodes[i].x;
          var mdy = mouseY - nodes[i].y;
          var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < CONNECT_DIST * 1.5) {
            var ma = (1 - mdist / (CONNECT_DIST * 1.5)) * 0.4;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(mouseX, mouseY);
            ctx.strokeStyle = 'rgba(229, 9, 26, ' + ma + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach(function (n) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(229, 9, 26, 0.4)';
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    }

    function init() {
      if (!canvas) return;
      ctx = canvas.getContext('2d');
      resize();
      createNodes();
      draw();

      on(window, 'resize', debounce(function () {
        resize();
        createNodes();
      }, 250));

      on(window, 'mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });

      on(window, 'touchmove', function (e) {
        if (e.touches.length) {
          mouseX = e.touches[0].clientX;
          mouseY = e.touches[0].clientY;
        }
      }, { passive: true });
    }

    return { init: init };
  }());

  /* ============================================================
     3B. ENHANCED PARTICLE BACKGROUND
     ============================================================ */
  var ParticleBG = (function () {
    var canvas = qs('#particleCanvas');
    var ctx;
    var W, H;
    var particles = [];
    var shootingLines = [];
    var mouseX = -9999, mouseY = -9999;
    var raf;
    var time = 0;
    var isMobile = window.matchMedia('(max-width: 768px)').matches;

    function createParticles() {
      particles = [];
      // Reduce particles on mobile
      var count = isMobile ? 30 : 60;
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          r: Math.random() * 1.2 + 0.3,
          alpha: Math.random() * 0.3 + 0.1,
          pulse: Math.random() * Math.PI * 2
        });
      }
    }

    function shootLine() {
      // Fewer shooting lines on mobile
      if (Math.random() > (isMobile ? 0.995 : 0.985)) {
        var angle = Math.random() * Math.PI * 2;
        var startX = Math.random() * W;
        var startY = Math.random() * H;
        shootingLines.push({
          x: startX,
          y: startY,
          angle: angle,
          length: 0,
          maxLength: Math.random() * (isMobile ? 100 : 180) + 60,
          speed: Math.random() * 4 + 3,
          alpha: 0.6
        });
      }
    }

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      time += 0.006;

      // Draw gradient ambient orbs (fewer on mobile)
      var orbCount = isMobile ? 3 : 5;
      for (var i = 0; i < orbCount; i++) {
        var orbX = (W * 0.2) + (W * 0.6 * Math.sin(time * 0.25 + i));
        var orbY = (H * 0.3) + (H * 0.4 * Math.cos(time * 0.15 + i * 0.7));
        var orbR = 100 + Math.sin(time * 0.5 + i) * 30;
        var grad = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, orbR);
        grad.addColorStop(0, 'rgba(229, 9, 26, 0.02)');
        grad.addColorStop(0.5, 'rgba(229, 9, 26, 0.008)');
        grad.addColorStop(1, 'rgba(229, 9, 26, 0)');
        ctx.beginPath();
        ctx.arc(orbX, orbY, orbR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Update and draw particles
      particles.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.02;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        var pa = p.alpha + Math.sin(p.pulse) * 0.08;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(245, 166, 35, ' + pa + ')';
        ctx.fill();
      });

      // Update and draw shooting web lines (already filtered based on mobile in shootLine)
      shootLine();
      shootingLines = shootingLines.filter(function (sl) {
        sl.length += sl.speed;
        sl.alpha -= 0.01;
        if (sl.alpha <= 0 || sl.length >= sl.maxLength) return false;
        var endX = sl.x + Math.cos(sl.angle) * sl.length;
        var endY = sl.y + Math.sin(sl.angle) * sl.length;
        var grad = ctx.createLinearGradient(sl.x, sl.y, endX, endY);
        grad.addColorStop(0, 'rgba(229, 9, 26, ' + sl.alpha + ')');
        grad.addColorStop(1, 'rgba(229, 9, 26, 0)');
        ctx.beginPath();
        ctx.moveTo(sl.x, sl.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = isMobile ? 0.8 : 1.2;
        ctx.stroke();
        return true;
      });

      raf = requestAnimationFrame(draw);
    }

    function init() {
      if (!canvas) return;
      ctx = canvas.getContext('2d');
      resize();
      createParticles();
      draw();

      on(window, 'resize', debounce(function () {
        resize();
        createParticles();
      }, 300));

      on(window, 'mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });

      on(window, 'touchmove', function (e) {
        if (e.touches.length) {
          mouseX = e.touches[0].clientX;
          mouseY = e.touches[0].clientY;
        }
      }, { passive: true });
    }

    return { init: init };
  }());

  /* ============================================================
     4. NAVIGATION MODULE
     ============================================================ */
  var Nav = (function () {
    var nav = qs('#nav');
    var menuToggle = qs('#menuToggle');
    var mobileMenu = qs('#mobileMenu');
    var mobileLinks = qsa('.mobile-menu__link');
    var navLinks = qsa('.nav__link');
    var sections = qsa('section[id]');
    var isOpen = false;

    function setScrolled() {
      if (!nav) return;
      if (window.scrollY > 60) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }

    function updateActiveLink() {
      var scrollY = window.scrollY + 120;
      sections.forEach(function (section) {
        var top = section.offsetTop;
        var bottom = top + section.offsetHeight;
        var id = section.getAttribute('id');
        var link = qs('.nav__link[href="#' + id + '"]');
        if (link) {
          if (scrollY >= top && scrollY < bottom) {
            navLinks.forEach(function (l) { l.classList.remove('active'); });
            link.classList.add('active');
          }
        }
      });
    }

    function openMenu() {
      isOpen = true;
      mobileMenu.classList.add('open');
      mobileMenu.setAttribute('aria-hidden', 'false');
      menuToggle.classList.add('open');
      menuToggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
    }

    function closeMenu() {
      isOpen = false;
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    }

    function smoothScrollTo(href) {
      var target = qs(href);
      if (!target) return;
      var offset = nav ? nav.offsetHeight : 0;
      window.scrollTo({
        top: target.offsetTop - offset - 10,
        behavior: 'smooth'
      });
    }

    function init() {
      setScrolled();
      on(window, 'scroll', setScrolled, { passive: true });
      on(window, 'scroll', updateActiveLink, { passive: true });

      // Hamburger toggle
      on(menuToggle, 'click', function () {
        isOpen ? closeMenu() : openMenu();
      });

      // Close menu on link click
      mobileLinks.forEach(function (link) {
        on(link, 'click', function (e) {
          e.preventDefault();
          var href = link.getAttribute('href');
          closeMenu();
          setTimeout(function () { smoothScrollTo(href); }, 350);
        });
      });

      // Close on Escape key
      on(document, 'keydown', function (e) {
        if (e.key === 'Escape' && isOpen) closeMenu();
      });

      // Close on outside click
      on(mobileMenu, 'click', function (e) {
        if (e.target === mobileMenu) closeMenu();
      });

      // Smooth scroll for desktop nav & hero CTAs
      qsa('a[href^="#"]').forEach(function (anchor) {
        on(anchor, 'click', function (e) {
          var href = anchor.getAttribute('href');
          if (href === '#') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }
          var target = qs(href);
          if (target) {
            e.preventDefault();
            smoothScrollTo(href);
          }
        });
      });
    }

    return { init: init };
  }());

  /* ============================================================
     5. HERO ROLE CYCLER
     ============================================================ */
  var HeroTyper = (function () {
    var roles = [
      'Full Stack Developer',
      'AI Based Web Developer',
      'MCA Graduate',
      'Problem Solver',
      'Digital Marketer'
    ];
    var idx = 0;
    var roleEl = qs('#roleText');
    var cursor = qs('.hero__role-cursor');

    function typeText(text, callback) {
      if (!roleEl) return;
      roleEl.textContent = '';
      var i = 0;
      var interval = setInterval(function () {
        roleEl.textContent += text[i];
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          if (callback) setTimeout(callback, 2000);
        }
      }, 60);
    }

    function eraseText(callback) {
      if (!roleEl) return;
      var text = roleEl.textContent;
      var i = text.length;
      var interval = setInterval(function () {
        i--;
        roleEl.textContent = text.slice(0, i);
        if (i <= 0) {
          clearInterval(interval);
          if (callback) setTimeout(callback, 200);
        }
      }, 40);
    }

    function cycle() {
      eraseText(function () {
        idx = (idx + 1) % roles.length;
        typeText(roles[idx], cycle);
      });
    }

    function init() {
      if (!roleEl) return;
      // Start first role then begin cycle
      typeText(roles[0], cycle);
    }

    return { init: init };
  }());

  /* ============================================================
     6. STAT COUNTERS
     ============================================================ */
  var Counters = (function () {
    function animateNum(el, target) {
      var start = 0;
      var duration = 1800;
      var step = target / (duration / 16);
      var suffix = el.dataset.suffix || '+';

      function update() {
        start = Math.min(start + step, target);
        el.textContent = Math.floor(start) + (start >= target ? suffix : '');
        if (start < target) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
    }

    function init() {
      var counters = qsa('.about__stat-number[data-target]');
      if (!counters.length) return;

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var target = parseInt(entry.target.dataset.target, 10);
            animateNum(entry.target, target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      counters.forEach(function (c) { observer.observe(c); });
    }

    return { init: init };
  }());

  /* ============================================================
     7. SCROLL FADE-IN ANIMATIONS
     ============================================================ */
  var FadeIn = (function () {
    function init() {
      var elements = qsa('.fade-up');
      if (!elements.length) return;

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      });

      elements.forEach(function (el) { observer.observe(el); });
    }

    return { init: init };
  }());

  /* ============================================================
     8. BACK TO TOP BUTTON
     ============================================================ */
  var BackToTop = (function () {
    var btn = qs('#backToTop');

    function init() {
      if (!btn) return;
      on(window, 'scroll', function () {
        if (window.scrollY > 400) {
          btn.classList.add('visible');
        } else {
          btn.classList.remove('visible');
        }
      }, { passive: true });

      on(btn, 'click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    return { init: init };
  }());

  /* ============================================================
     9. CONTACT FORM
     ============================================================ */
  var ContactForm = (function () {
    var form = qs('#contactForm');
    var submitBtn = qs('#submitBtn');

    function addRipple(e) {
      var btn = e.currentTarget;
      var ripple = document.createElement('span');
      var rect = btn.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height);
      var x = e.clientX - rect.left - size / 2;
      var y = e.clientY - rect.top - size / 2;
      var style = 'position:absolute;width:' + size + 'px;height:' + size + 'px;border-radius:50%;background:rgba(255,255,255,0.2);transform:scale(0);animation:ripple-anim 0.6s ease-out;left:' + x + 'px;top:' + y + 'px;pointer-events:none;';
      ripple.setAttribute('style', style);

      // Add animation keyframe once
      if (!qs('#ripple-style')) {
        var s = document.createElement('style');
        s.id = 'ripple-style';
        s.textContent = '@keyframes ripple-anim{to{transform:scale(4);opacity:0;}}';
        document.head.appendChild(s);
      }

      btn.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 600);
    }

    function init() {
      if (!form || !submitBtn) return;
      on(submitBtn, 'click', addRipple);

      // AJAX form submission
      on(form, 'submit', function (e) {
        e.preventDefault();
        var inputs = qsa('input[required], textarea[required]', form);
        var valid = true;
        inputs.forEach(function (input) {
          if (!input.value.trim()) {
            valid = false;
            input.style.borderColor = 'var(--red)';
          } else {
            input.style.borderColor = '';
          }
        });
        if (!valid) {
          submitBtn.textContent = 'Please fill all fields!';
          setTimeout(function () {
            var span = document.createElement('span');
            span.className = 'btn__text';
            span.textContent = 'Send Message';
            submitBtn.innerHTML = '';
            submitBtn.appendChild(span);
            var icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            icon.setAttribute('class', 'btn__icon');
            icon.setAttribute('viewBox', '0 0 24 24');
            icon.setAttribute('fill', 'none');
            icon.setAttribute('stroke', 'currentColor');
            icon.setAttribute('stroke-width', '2.5');
            icon.innerHTML = '<path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>';
            submitBtn.appendChild(icon);
          }, 2000);
          return;
        }

        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Collect form data
        var formData = {
          name: qs('#name').value.trim(),
          email: qs('#email').value.trim(),
          subject: qs('#subject').value.trim(),
          message: qs('#message').value.trim()
        };

        // Send via backend API
        fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })
        .then(function(response) {
          if (!response.ok) {
            return response.json().then(function(errorData) {
              throw new Error(errorData.error || 'Server error');
            });
          }
          return response.json();
        })
        .then(function(data) {
          // Success
          submitBtn.textContent = 'Message Sent!';
          submitBtn.style.background = 'var(--green, #00c853)';
          form.reset();
          console.log('✅ Contact form submitted successfully');
          
          setTimeout(function () {
            var span = document.createElement('span');
            span.className = 'btn__text';
            span.textContent = 'Send Message';
            submitBtn.innerHTML = '';
            submitBtn.appendChild(span);
            var icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            icon.setAttribute('class', 'btn__icon');
            icon.setAttribute('viewBox', '0 0 24 24');
            icon.setAttribute('fill', 'none');
            icon.setAttribute('stroke', 'currentColor');
            icon.setAttribute('stroke-width', '2.5');
            icon.innerHTML = '<path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>';
            submitBtn.appendChild(icon);
            submitBtn.style.background = '';
            submitBtn.disabled = false;
          }, 3000);
        })
        .catch(function(error) {
          console.error('❌ Contact form error:', error);
          submitBtn.textContent = 'Error! Try Again';
          submitBtn.style.background = 'var(--red, #e5091a)';
          
          setTimeout(function () {
            var span = document.createElement('span');
            span.className = 'btn__text';
            span.textContent = 'Send Message';
            submitBtn.innerHTML = '';
            submitBtn.appendChild(span);
            var icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            icon.setAttribute('class', 'btn__icon');
            icon.setAttribute('viewBox', '0 0 24 24');
            icon.setAttribute('fill', 'none');
            icon.setAttribute('stroke', 'currentColor');
            icon.setAttribute('stroke-width', '2.5');
            icon.innerHTML = '<path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>';
            submitBtn.appendChild(icon);
            submitBtn.style.background = '';
            submitBtn.disabled = false;
          }, 3000);
        });
      });
    }

    return { init: init };
  }());

  /* ============================================================
     10. FOOTER YEAR
     ============================================================ */
  function setFooterYear() {
    var el = qs('#footerYear');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ============================================================
     11. SKILL TAGS INTERACTIVE GLOW
     ============================================================ */
  var SkillsGlow = (function () {
    function init() {
      var grid = qs('.skills__grid');
      if (!grid) return;

      on(grid, 'mousemove', function (e) {
        var tags = qsa('.skill-tag', grid);
        tags.forEach(function (tag) {
          var rect = tag.getBoundingClientRect();
          var cx = rect.left + rect.width / 2;
          var cy = rect.top + rect.height / 2;
          var dist = Math.sqrt(Math.pow(e.clientX - cx, 2) + Math.pow(e.clientY - cy, 2));
          if (dist < 120) {
            var intensity = (1 - dist / 120);
            tag.style.boxShadow = '0 0 ' + (intensity * 16) + 'px rgba(229,9,26,' + (intensity * 0.5) + ')';
          } else {
            tag.style.boxShadow = '';
          }
        });
      });

      on(grid, 'mouseleave', function () {
        qsa('.skill-tag', grid).forEach(function (tag) {
          tag.style.boxShadow = '';
        });
      });
    }

    return { init: init };
  }());

  /* ============================================================
     12. PROJECT CARD TILT EFFECT
     ============================================================ */
  var CardTilt = (function () {
    function init() {
      // Only enable on desktop with hover capability
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
      var cards = qsa('.project-card, .dm-card');

      cards.forEach(function (card) {
        on(card, 'mousemove', function (e) {
          var rect = card.getBoundingClientRect();
          var x = e.clientX - rect.left;
          var y = e.clientY - rect.top;
          var cx = rect.width / 2;
          var cy = rect.height / 2;
          var rx = ((y - cy) / cy) * 3;
          var ry = ((cx - x) / cx) * 3;
          card.style.transform = 'perspective(800px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-6px)';
        });

        on(card, 'mouseleave', function () {
          card.style.transform = '';
        });
      });
    }

    return { init: init };
  }());

  /* ============================================================
     INIT — When DOM is ready
     ============================================================ */
  function bootstrap() {
    Loader.init();
    Cursor.init();
    WebCanvas.init();
    ParticleBG.init();
    Nav.init();
    HeroTyper.init();
    Counters.init();
    FadeIn.init();
    BackToTop.init();
    ContactForm.init();
    SkillsGlow.init();
    CardTilt.init();
    setFooterYear();

    // Console Easter Egg
    var styles = [
      ['%c🕷️ Hey there, Spidey sense tingling?', 'color:#e5091a;font-size:22px;font-weight:bold;'],
      ['%cBuilt by Dhaval Prajapati — MCA Graduate · Full Stack Dev · AI Based Web Developer', 'color:#7eb3ff;font-size:12px;'],
      ['%c📧 dhavalprajapati4518@gmail.com', 'color:#f5a623;font-size:12px;'],
      ['%c🐙 github.com/DhavalMCA', 'color:#00e676;font-size:12px;']
    ];
    styles.forEach(function (s) { console.log(s[0], s[1]); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }

}());