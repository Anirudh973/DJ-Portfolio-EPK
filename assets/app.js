document.addEventListener('DOMContentLoaded', () => {
    fetch('content.json')
        .then(response => response.json())
        .then(data => initApp(data))
        .catch(err => console.error('Error loading config:', err));
});

function initApp(data) {
    // 1. Initialize Theme Colors
    const root = document.documentElement;
    root.style.setProperty('--accent-color', data.theme.defaultAccent);
    
    // 2. Populate Hero Section
    document.getElementById('hero-title').textContent = data.hero.title;
    
    const subtitleEl = document.getElementById('hero-subtitle');
    if (data.hero.subtitle) {
        subtitleEl.textContent = data.hero.subtitle;
        subtitleEl.style.display = 'inline-block';
    } else {
        subtitleEl.style.display = 'none';
    }

    document.getElementById('hero-video').src = data.hero.video;
    
    // Profile Profile
    document.getElementById('hero-image').src = data.hero.image;
    
    const introEl = document.getElementById('hero-intro');
    if (data.hero.intro) {
        introEl.textContent = data.hero.intro;
        introEl.style.display = 'block';
    } else {
        introEl.style.display = 'none';
    }

    document.getElementById('hero-bio').textContent = data.hero.bio;

    // 2.5 Populate About Section
    if (data.about) {
        document.getElementById('about-heading').textContent = data.about.heading;
        
        const aboutTextContainer = document.getElementById('about-text');
        data.about.paragraphs.forEach(p => {
            const pEl = document.createElement('p');
            pEl.className = "text-lg text-gray-300 mb-6 leading-relaxed font-mono";
            pEl.textContent = p;
            aboutTextContainer.appendChild(pEl);
        });

        const genresList = document.getElementById('about-genres');
        data.about.genres.forEach(g => {
            const li = document.createElement('li');
            li.className = "border-2 border-accent text-accent px-3 py-1 text-sm font-bold uppercase inline-block mr-3 mb-3 hover:bg-accent hover:text-black transition-colors";
            li.textContent = g;
            genresList.appendChild(li);
        });
    }

    // Default SoundCloud to the first mix
    if (data.mixes && data.mixes.length > 0) {
        document.getElementById('hero-sc-player').src = data.mixes[0].soundcloudUrl;
    }

    // 3. Populate Interactive Genre Crate
    const crateGrid = document.getElementById('crate-grid');
    data.mixes.forEach((mix, index) => {
        const card = document.createElement('div');
        
        card.className = "group relative aspect-square border-3 border-zinc-700 hover:border-white p-6 cursor-pointer bg-black overflow-hidden flex flex-col justify-end items-start crate-card";
        // Apply the mix's color initially to a custom property, or directly style hover state
        
        card.innerHTML = `
            <!-- Faux record grooves -->
            <div class="absolute inset-0 bg-[repeating-radial-gradient(circle_at_center,transparent_0,transparent_10px,#111_10px,#111_12px)] opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <!-- Sticker label -->
            <div class="absolute right-4 top-4 border-2 border-black bg-white px-2 py-1 transform rotate-6 z-20 mix-blend-screen opacity-90 group-hover:rotate-12 transition-transform">
                <span class="text-black text-xs font-bold uppercase tracking-widest">VOL.${index + 1}</span>
            </div>
            <!-- Content -->
            <div class="relative z-10 w-full transform group-hover:-translate-y-2 transition-transform">
                <h3 class="text-4xl font-bold uppercase mb-2" style="color: ${mix.color}">${mix.genre}</h3>
            </div>
            <!-- Visual Record outline -->
            <div class="absolute -right-16 -top-16 w-48 h-48 rounded-full border-[16px] border-zinc-800 bg-black group-hover:scale-110 transition-transform duration-500 shadow-[0_0_20px_rgba(0,0,0,1)]">
                <div class="absolute inset-0 m-auto w-12 h-12 rounded-full border-4 border-black" style="background-color: ${mix.color};"></div>
            </div>
        `;

        // Interaction logic
        card.addEventListener('click', () => {
            // Update CSS variable globally
            root.style.setProperty('--accent-color', mix.color);
            // Update iframe
            const iframe = document.getElementById('hero-sc-player');
            iframe.src = mix.soundcloudUrl;
            
            // Highlight active crate visually by resetting others
            document.querySelectorAll('.crate-card').forEach(c => {
                c.style.borderColor = "#3f3f46"; // zinc-700
                c.style.boxShadow = "none";
            });
            card.style.borderColor = mix.color;
            card.style.boxShadow = `8px 8px 0px ${mix.color}`;
        });

        crateGrid.appendChild(card);
    });

    // 4. Populate Gig Timeline
    const timeline = document.getElementById('gig-timeline');
    data.gigs.forEach((gig, index) => {
        const item = document.createElement('div');
        // Alternating layout for timeline
        item.className = "relative mb-24 last:mb-0 flex flex-col md:flex-row items-center md:items-start gap-12 group";
        
        // Dot marker
        const dot = document.createElement('div');
        dot.className = "absolute -left-10 md:-left-18 top-4 w-5 h-5 rounded-none bg-black border-3 border-accent z-10 box-content group-hover:bg-accent group-hover:rotate-45 transition-all duration-300";
        item.appendChild(dot);
        
        // Gig Info Box
        const info = document.createElement('div');
        info.className = `flex-1 w-full bg-black border-3 border-accent p-8 hover:bg-zinc-900 transition-colors shadow-[6px_6px_0px_var(--accent-color)] group-hover:translate-x-2 group-hover:-translate-y-2 duration-300 z-10 ${index % 2 === 1 ? 'md:order-2' : 'md:order-1'}`;
        
        const dateObj = new Date(gig.date);
        const dateString = dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase();
        
        info.innerHTML = `
            <h4 class="text-3xl font-bold text-accent uppercase mb-2 tracking-wider">${dateString}</h4>
            <h5 class="text-2xl font-bold mb-4">${gig.venue}</h5>
            <div class="flex items-center space-x-2 text-gray-400 font-bold uppercase tracking-widest text-sm border-t-2 border-zinc-800 pt-4">
                <span>${gig.location}</span>
            </div>
        `;
        
        // Poster (Polaroid) Box
        const posterContainer = document.createElement('div');
        posterContainer.className = `flex-1 w-full max-w-sm flex justify-center ${index % 2 === 1 ? 'md:order-1' : 'md:order-2'}`;
        posterContainer.innerHTML = `
            <div class="polaroid">
                <!-- Fallback to a data URI svg if image is missing -->
                <img src="${gig.image}" alt="${gig.venue} Poster" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNTMzIiB2aWV3Qm94PSIwIDAgNDAwIDUzMyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzIyMiIvPjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjM4MCIgaGVpZ2h0PSI1MTMiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzQ0NCIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtZGFzaGFycmF5PSIxMCAxMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI0IiBmaWxsPSIjNzcxIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5bIE1JU1NJTkcgQVJUIF08L3RleHQ+PC9zdmc+'">
                <p class="text-black font-bold text-center mt-6 uppercase text-xl tracking-widest">${gig.venue}</p>
                <p class="text-gray-500 font-bold text-center mt-1 uppercase text-sm">${dateString}</p>
            </div>
        `;

        item.appendChild(info);
        item.appendChild(posterContainer);
        timeline.appendChild(item);
    });

    // 5. Populate Media Gallery
    const galleryGrid = document.getElementById('gallery-grid');
    data.gallery.forEach(imgSrc => {
        const item = document.createElement('div');
        // Using inline styling to allow pseudo-elements in CSS to inherit the background image
        item.className = "aspect-[4/3] border-3 border-zinc-700 hover:border-accent hover:scale-[1.02] transition-all duration-300 overflow-hidden bg-zinc-900 cursor-crosshair";
        item.style.backgroundImage = `url('${imgSrc}'), url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTExIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMzMzMiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMjAiPlsgSU1BR0UgRklMRSBdPC90ZXh0Pjwvc3ZnPg==')`;
        item.style.backgroundSize = "cover";
        item.style.backgroundPosition = "center";
        
        galleryGrid.appendChild(item);
    });

    // 8. Populate Contact & Socials
    if (data.contact) {
        const socialLinks = document.getElementById('social-links');
        
        if (data.contact.email) {
            const emailP = document.createElement('p');
            emailP.className = "text-xl font-bold uppercase tracking-widest text-gray-400 mb-4";
            emailP.innerHTML = `MAIL: <a href="mailto:${data.contact.email}" class="text-white hover:text-accent transition-colors">${data.contact.email}</a>`;
            socialLinks.appendChild(emailP);
        }

        if (data.contact.instagramHandle && data.contact.instagramUrl) {
            const igP = document.createElement('p');
            igP.className = "text-xl font-bold uppercase tracking-widest text-gray-400";
            igP.innerHTML = `INSTAGRAM: <a href="${data.contact.instagramUrl}" target="_blank" class="text-white hover:text-accent transition-colors">${data.contact.instagramHandle}</a>`;
            socialLinks.appendChild(igP);
        }
    }
}
