document.addEventListener('DOMContentLoaded', () => {
    // Add search overlay HTML to the body
    const searchOverlay = document.createElement('div');
    searchOverlay.className = 'search-overlay';
    searchOverlay.innerHTML = `
        <div class="search-container">
            <div class="search-input-container">
                <input type="text" class="search-input" placeholder="Search channels...">
                <button class="close-search">
                    <svg viewBox="0 0 24 24">
                        <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                    </svg>
                </button>
            </div>
            <div class="search-results">
                <div class="channel-grid">
                    <!-- Search results will be displayed here -->
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(searchOverlay);

    // Update search button click handler
    const searchBtn = document.querySelector('.search-channel-btn');
    const searchInput = document.querySelector('.search-input');
    const closeSearchBtn = document.querySelector('.close-search');

    function toggleSearch(show) {
        const overlay = document.querySelector('.search-overlay');
        if (show) {
            overlay.classList.add('active');
            searchInput.focus();
        } else {
            overlay.classList.remove('active');
            searchInput.value = '';
            displaySearchResults('');
        }
    }

    searchBtn.addEventListener('click', () => toggleSearch(true));
    closeSearchBtn.addEventListener('click', () => toggleSearch(false));

    function displaySearchResults(query) {
        const resultsGrid = document.querySelector('.search-overlay .channel-grid');
        const filteredChannels = channels.filter(channel => 
            channel.name.toLowerCase().includes(query.toLowerCase()) ||
            channel.country.toLowerCase().includes(query.toLowerCase()) ||
            channel.genre.toLowerCase().includes(query.toLowerCase())
        );

        resultsGrid.innerHTML = '';

        if (query.trim() === '') {
            resultsGrid.innerHTML = '<div class="no-results">Empieza a escribir para buscar canales...</div>';
            return;
        }

        if (filteredChannels.length === 0) {
            resultsGrid.innerHTML = '<div class="no-results">No se encontraron canales</div>';
            return;
        }

        filteredChannels.forEach(channel => {
            const channelCard = document.createElement('div');
            channelCard.className = 'channel-card';
            channelCard.innerHTML = `
                <div class="channel-preview" style="background-image: url('${channel.logo}')">
                    ${channel.isLive ? '<div class="live-badge">EN VIVO</div>' : ''}
                    <div class="channel-info">
                        <h3>${channel.name}</h3>
                        <p>Transmitiendo desde: ${channel.country}</p>
                        <p>${channel.viewers} viendo</p>
                        <p class="channel-country">${channel.country} | ${channel.language}</p>
                    </div>
                </div>
            `;
            
            channelCard.addEventListener('click', () => {
                playChannel(channel);
                toggleSearch(false);
            });
            resultsGrid.appendChild(channelCard);
        });
    }

    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            displaySearchResults(e.target.value);
        }, 300);
    });

    // Close search on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            toggleSearch(false);
        }
    });

    // Initialize video.js player
    const player = videojs('stellar-player', {
        fluid: true,
        responsive: true,
        controls: true,
        preload: 'auto',
        poster: 'https://i.ibb.co/1RW9vqg/poster.jpg',
        playbackRates: [0.5, 1, 1.5, 2],
        controlBar: {
            children: [
                'playToggle',
                'volumePanel',
                'currentTimeDisplay',
                'timeDivider',
                'durationDisplay',
                'progressControl',
                'remainingTimeDisplay',
                'playbackRateMenuButton',
                'fullscreenToggle'
            ],
            volumePanel: {
                inline: false,
                volumeControl: {
                    vertical: true
                }
            }
        }
    });

    // Add custom class for styling
    player.addClass('vjs-custom-theme');

    // Add double-click to toggle fullscreen
    player.on('dblclick', function() {
        if (!this.isFullscreen()) {
            this.requestFullscreen();
        } else {
            this.exitFullscreen();
        }
    });

    // Add keyboard shortcuts
    player.on('keydown', function(e) {
        switch(e.keyCode) {
            case 32: // Space bar
                if (this.paused()) {
                    this.play();
                } else {
                    this.pause();
                }
                e.preventDefault();
                break;
            case 37: // Left arrow
                this.currentTime(Math.max(0, this.currentTime() - 10));
                e.preventDefault();
                break;
            case 39: // Right arrow
                this.currentTime(Math.min(this.duration(), this.currentTime() + 10));
                e.preventDefault();
                break;
            case 38: // Up arrow
                this.volume(Math.min(1, this.volume() + 0.1));
                e.preventDefault();
                break;
            case 40: // Down arrow
                this.volume(Math.max(0, this.volume() - 0.1));
                e.preventDefault();
                break;
        }
    });

    // Define the specific channels only
    const specificChannels = [
         {
            id: 1,
            name: "Sony Novelas",
            logo: "https://www.cxtv.com.br/img/Tvs/Logo/webp-m/a3bd552eca6645942a60a053fe61fafb.webp",
            country: "Series",
            genre: "Entertainment",
            currentShow: "Estados Unidos",
            
            language: "Español",
            streamUrl: "https://a89829b8dca2471ab52ea9a57bc28a35.mediatailor.us-east-1.amazonaws.com/v1/master/0fb304b2320b25f067414d481a779b77db81760d/CanelaTV_SonyCanalNovelas/playlist.m3u8",
            isLive: true
        },
        {
            id: 2,
            name: "Telemundo Miami",
            logo: "https://www.cxtv.com.br/img/Tvs/Logo/webp-m/70ef4b19ce0f5b973ff48dffd540d3d8.webp",
            country: "Noticias",
            genre: "News",
            currentShow: "Estados Unidos",
            
            language: "Español",
            streamUrl: "https://d2kowtvrzzi7ps.cloudfront.net/manifest/3fec3e5cac39a52b2132f9c66c83dae043dc17d4/prod_default_nbc/5a817dba-a6f1-4dac-9871-91e9e76e1762/2.m3u8",
            isLive: true
        },
        {
            id: 3,
            name: "Canela Deportes",
            logo: "https://www.cxtv.com.br/img/Tvs/Logo/webp-m/3a49e44efce01bea59de8af9e253695f.webp",
            country: "Deportes",
            genre: "Sports",
            currentShow: "Estados Unidos",
            
            language: "Español",
            streamUrl: "https://playertest.longtailvideo.com/adaptive/wowzaid3/playlist.m3u8",
            isLive: true
        },
        {
            id: 4,
            name: "3ABN KIDS",
            logo: "https://www.cxtv.com.br/img/Tvs/Logo/webp-m/42de800d69d78117b03852bac7ae3818.webp",
            country: "Infantil",
            genre: "Kids",
            currentShow: "Estados Unidos",
           
            language: "English",
            streamUrl: "https://3abn.bozztv.com/3abn2/Kids_live/smil:Kids_live.smil/playlist.m3u8",
            isLive: true
        },
        {
            id: 5,
            name: "FOX Sports",
            logo: "https://www.cxtv.com.br/img/Tvs/Logo/webp-m/5c2f33d5ee4ec2d82edb58610f2b0ff7.webp",
            country: "Deportes",
            genre: "Sports",
            currentShow: "Estados Unidos",
            
            language: "Español",
            streamUrl: "https://live-news-manifest.tubi.video/live-news-manifest/csm/extlive/tubiprd01,Fox-Sports-Espanol2.m3u8",
            isLive: true
        },
        {
            id: 6,
            name: "DW Español",
            logo: "https://static.dw.com/image/69105274_6.jpg",
            country: "Noticias",
            genre: "Noticias",
            currentShow: "Alemania",
           
            language: "Español",
            streamUrl: "https://dwamdstream104.akamaized.net/hls/live/2015530/dwstream104/index.m3u8",
            isLive: true
        },
        {
            id: 7,
            name: "RT en Español",
            logo: "https://st1-fs.cdn01.net/channels/0000026/0026353/thumb/0026353xl.jpg?v2",
            country: "Noticias",
            genre: "Noticias",
            currentShow: "Rusia",
            
            language: "Español",
            streamUrl: "https://rt-esp.rttv.com/live/rtesp/playlist.m3u8",
            isLive: true
        },
        {
            id: 8,
            name: "ZAZ TV",
            logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjAKZlLMfvYZrR0A8eiR1UHmgo6EFjBYJuvTi-4p0gPUeRnBRxQqGpun0tsolopOEzefwuNHPWGZ-inAdz6V9eke12-7NB93hkRkrvX7FDxv6zEVygWZ1gZ4X0Ib2TErnG00eXPS04e4hBPBDKuLIDY0TnzDnMs6XMcFEvpKDQq_68Fli1_X2kf72dj/w640-h360-rw/thumbh_20220411_193252.png",
            country: "Infantil",
            genre: "Infantil",
            currentShow: "España",
           
            language: "Español",
            streamUrl: "https://stream.ads.ottera.tv/playlist.m3u8?network_id=1972",
            isLive: true
        },
        {
            id: 9,
            name: "AZTV Anime Zone TV",
            logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxaEfaLlTAOnutjTUy8_3j6X2DYViO-KpnBQ&s",
            country: "Infantil",
            genre: "Infantil",
            currentShow: "España",
            
            language: "Español",
            streamUrl: "https://stmv1.srvif.com/loadingtv/loadingtv/playlist.m3u8",
            isLive: true
        },
        {
            id: 10,
            name: "Toonz Kids",
            logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE5rxS63ltO6P3_jGi4sJG3aS8KRf1rUVejg&s",
            country: "Infantil",
            genre: "Infantil",
            currentShow: "España",
           
            language: "Español",
            streamUrl: "https://d35j504z0x2vu2.cloudfront.net/v1/master/0bc8e8376bd8417a1b6761138aa41c26c7309312/toonzkids-spanish/master.m3u8",
            isLive: true
        },
                {
            id: 11,
            name: "Pitufo TV",
            logo: "https://images.plex.tv/photo?size=large-1920&scale=1&url=https%3A%2F%2Fprovider-static.plex.tv%2Fepg%2Fcms%2Fproduction%2F425ebc35-6dda-4d18-a271-38c957058769%2Fpitufotv_1920x1080_-_Jordan_Warkol.jpg",
            country: "Infantil",
            genre: "Infantil",
            currentShow: "España",
           
            language: "Español",
            streamUrl: "https://stream.ads.ottera.tv/playlist.m3u8?network_id=4211",
            isLive: true
        },
                {
            id: 12,
            name: "News 24",
            logo: "https://elements-resized.envatousercontent.com/elements-video-cover-images/1c0ebcb3-d620-477f-b8af-8058ddfec8cd/video_preview/video_preview_0001.jpg?w=500&cf_fit=cover&q=85&format=auto&s=58716a6d2c56cf314bae13127cea899470df08c38d5b12b61bfd49ac61819cdd",
            country: "Noticias",
            genre: "Noticias",
            currentShow: "Italia",
           
            language: "Español",
            streamUrl: "https://tv.balkanweb.com/news24/livestream/playlist.m3u8",
            isLive: true
        },
                {
            id: 13,
            name: "Deluxe Music Tv",
            logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM9bXagR1EfssmHvwooOQo_ay-D7fZqxbo5Q&s",
            country: "Musica",
            genre: "Musica",
            currentShow: "Alemania",
           
            language: "Español",
            streamUrl: "https://d35j504z0x2vu2.cloudfront.net/v1/master/0bc8e8376bd8417a1b6761138aa41c26c7309312/toonzkids-spanish/master.m3u8",
            isLive: true
        },
                {
            id: 14,
            name: "Azteca Deportes",
            logo: "https://tvazteca.brightspotcdn.com/6d/1e/76b6488b472db5c2a135f47ee773/azteca-deportes-1920x1080.jpg",
            country: "Deportes",
            genre: "Deportes",
            currentShow: "Mexico",
           
            language: "Español",
            streamUrl: "https://azt-mun.otteravision.com/azt/mun/mun.m3u8",
            isLive: true
        },
                {
            id: 15,
            name: "Las Estrellas",
            logo: "https://www.lasestrellas.tv/api/image/x/us/en-vivo",
            country: "Variedades",
            genre: "Variedades",
            currentShow: "Mexico",
           
            language: "Español",
            streamUrl: "https://channel01-onlymex.akamaized.net/hls/live/2022749/event01/index_1.m3u8",
            isLive: true
        },
                   {
            id: 16,
            name: "Canal Once",
            logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_KPaYCmXxePMm40h2tiq32D9S6VKZ2U4wSw&s",
            country: "Variedades",
            genre: "Variedades",
            currentShow: "Mexico",
           
            language: "Español",
            streamUrl: "https://vivo.canaloncelive.tv/oncedos/ngrp:pruebachunks_all/playlist.m3u8",
            isLive: true
        },
                   {
            id: 17,
            name: "Corazón",
            logo: "https://provider-static.plex.tv/epg/cms/production/9eca3c59-10f2-4311-b979-866063b819f2/Corizon_Hor_image.jpg",
            country: "Series",
            genre: "Series",
            currentShow: "Mexico",
           
            language: "Español",
            streamUrl: "https://amg00658-amg00658c57-canelatv-international-5437.playouts.now.amagi.tv/playlist/amg00658-canelamediafast-corazontvaztecaappta-canelatvinternational/playlist.m3u8",
            isLive: true
        },
                   {
            id: 18,
            name: "Cinema",
            logo: "https://tvazteca.brightspotcdn.com/dims4/default/e5b3709/2147483647/strip/true/crop/1920x1080+0+0/resize/928x522!/format/webp/quality/90/?url=http%3A%2F%2Ftv-azteca-brightspot.s3.amazonaws.com%2F24%2Ff8%2F6b61a723433b85fa4ef6af15553e%2Fcinema-1920x1080-1.jpg",
            country: "Cine",
            genre: "Cine",
            currentShow: "Mexico",
           
            language: "Español",
            streamUrl: "https://stream.ads.ottera.tv/playlist.m3u8?network_id=5400",
            isLive: true
        },
                   {
            id: 19,
            name: "RTQ",
            logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ_4AaY4BqqAnNGTBqLjQyREY7RjWnOupAtA&s",
            country: "Variedades",
            genre: "Variedades",
            currentShow: "Mexico",
           
            language: "Español",
            streamUrl: "https://59d39900ebfb8.streamlock.net/rytqrolive/rytqrolive/playlist.m3u8",
            isLive: true
        },
                   {
            id: 20,
            name: "Pelimex",
            logo: "https://www.freecast.com/_next/image?url=https%3A%2F%2Fd3e3bui7xn67l.cloudfront.net%2Fcms_media%2Fmedia%2Flive%2Fchannel%2F864eb71d-3224-4116-838f-a7923c3d4134-1716930828.157177.256x256.jpg&w=256&q=75",
            country: "Cine",
            genre: "Cine",
            currentShow: "Cine",
           
            language: "Español",
            streamUrl: "https://amg00658-amg00658c95-canelatv-international-6696.playouts.now.amagi.tv/playlist/amg00658-canelamediafast-pelimexta-canelatvinternational/playlist.m3u8",
            isLive: true
        },
         {
            id: 21,
            name: "Venevision",
            logo: "https://cisneros-vod.akamaized.net/venevision/uploaded/a833ecf3-a21c-49e3-a2eb-8e67dfc916e5.jpeg",
            country: "Variedades",
            genre: "Variedades",
            currentShow: "Venezuela",
           
            language: "Español",
            streamUrl: "https://venevision.akamaized.net/hls/live/2098814/VENEVISION/master.m3u8",
            isLive: true
        },
         {
            id: 22,
            name: "Canal i",
            logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbRx9uc2LL4fw5nZQl2at-j00zFqIycyBkWoZlrfrD_6JjhscnUkBqo2b7_SXgwRY7Btg&usqp=CAU",
            country: "Variedades",
            genre: "Variedades",
            currentShow: "Venezuela",
           
            language: "Español",
            streamUrl: "https://canali-live.akamaized.net/hls/live/2112725/CANALI_LIVE/master.m3u8",
            isLive: true
        },
         {
            id: 23,
            name: "Telesur",
            logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3JgmI2JOksiDcQSRqk155dLecH8bwG0_Wmwtk3oEM-4fRNbcWluA-BQ2GQqXcpEOR5Xk&usqp=CAU",
            country: "Noticias",
            genre: "Noticias",
            currentShow: "Venezuela",
           
            language: "Español",
            streamUrl: "https://cdnesmain.telesur.ultrabase.net/mbliveMain/hd/.m3u8",
            isLive: true
        },
         {
            id: 24,
            name: "Latina",
            logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKctFHq8Ii2aEPHziheR5wXUM44uat34kGwA&s",
            country: "Variedades",
            genre: "Variedades",
            currentShow: "Peru",
           
            language: "Español",
            streamUrl: "https://redirector.rudo.video/hls-video/567ffde3fa319fadf3419efda25619456231dfea/latina/latina/.m3u8",
            isLive: true
        },
         {
            id: 25,
            name: "Ecuavisa",
            logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOYxCE_PHTv9LIQqbcQesSX20qKJwsnv7fHg&s",
            country: "Variedades",
            genre: "Variedades",
            currentShow: "Ecuador",
           
            language: "Español",
            streamUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKctFHq8Ii2aEPHziheR5wXUM44uat34kGwA&s",
            isLive: true
        },
         {
            id: 26,
            name: "Teleamazona",
            logo: "https://i.ytimg.com/vi/oZFsXMgkpQ0/hq720.jpg?sqp=-oaymwE7CK4FEIIDSFryq4qpAy0IARUAAAAAGAElAADIQj0AgKJD8AEB-AH-CYAC0AWKAgwIABABGH8gJigTMA8=&rs=AOn4CLC5zSqmBx34uw0TgUSMGTYkXbMFYg",
            country: "Variedades",
            genre: "Variedades",
            currentShow: "Ecuador",
           
            language: "Español",
            streamUrl: "https://teleamazonas-live.cdn.vustreams.com/live/fd4ab346-b4e3-4628-abf0-b5a1bc192428/live.isml/fd4ab346-b4e3-4628-abf0-b5a1bc192428.m3u8",
            isLive: true
        },
         {
            id: 27,
            name: "Rts",
            logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6Sq9WvVgfzOF7v4iB3NHxT5cWRSOUzDoQeA&s",
            country: "Variedades",
            genre: "Variedades",
            currentShow: "Ecuador",
           
            language: "Español",
            streamUrl: "https://alba-ec-rts-rts.stream.mediatiquestream.com/index.m3u8",
            isLive: true
        },
         {
            id: 28,
            name: "Cali TV",
            logo: "https://image.roku.com/developer_channels/prod/5c8001a2b29bd6e02113870b26f1abaf38d428f3bf2ef15d93539b5b7730c1dd.png",
            country: "Variedades",
            genre: "Variedades",
            currentShow: "Colombia",
           
            language: "Español",
            streamUrl: "https://5ab772334c39c.streamlock.net/live-calitv/_definst_/calitv1/playlist.m3u8",
            isLive: true
        }
    ];

    const channels = specificChannels;

    // Update the category list creation
    function createCountryCategories() {
        const categoryList = document.querySelector('.category-list');
        const uniqueCountries = [...new Set(specificChannels.map(ch => ch.country))];
        
        categoryList.innerHTML = '<button class="category-btn active">Todos</button>';
        
        uniqueCountries.forEach(country => {
            const countryChannels = specificChannels.filter(ch => ch.country === country);
            const button = document.createElement('button');
            button.className = 'category-btn';
            button.textContent = `${country} (${countryChannels.length})`;
            button.dataset.country = country;
            categoryList.appendChild(button);
        });
    }

    // Update channel display function
    function displayChannels(filterCountry = null) {
        const channelGrid = document.querySelector('.live-channels .channel-grid');
        channelGrid.innerHTML = '';
        
        const filteredChannels = filterCountry ? 
            channels.filter(ch => ch.country === filterCountry) : 
            channels;

        filteredChannels.forEach(channel => {
            const channelCard = document.createElement('div');
            channelCard.className = 'channel-card';
            channelCard.innerHTML = `
                <div class="channel-preview" style="background-image: url('${channel.logo}')">
                    ${channel.isLive ? '<div class="live-badge">EN VIVO</div>' : ''}
                    <div class="channel-info">
                        <h3>${channel.name}</h3>
                        <p>Transmitiendo desde: ${channel.country}</p>
                        <p>${channel.viewers} viendo</p>
                        <p class="channel-country">${channel.country} | ${channel.language}</p>
                    </div>
                </div>
            `;
            
            channelCard.addEventListener('click', () => playChannel(channel));
            channelGrid.appendChild(channelCard);
        });
    }

    // Update category filter functionality
    function initializeCategoryFilters() {
        createCountryCategories();
        
        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const country = button.dataset.country;
                displayChannels(country === undefined ? null : country);
            });
        });
    }

    // Function to update current channel info
    function updateCurrentChannel(channel) {
        document.getElementById('current-channel-name').textContent = channel.name;
        document.getElementById('current-show').textContent = `Transmitiendo desde: ${channel.country}`;
    }

    // Function to play channel
    function playChannel(channel) {
        player.src({
            src: channel.streamUrl,
            type: 'application/x-mpegURL'
        });
        player.play();
        updateCurrentChannel(channel);
    }

    // Initialize functionality
    initializeCategoryFilters();
    displayChannels();

    // Update touch handling for better mobile experience
    function initializeTouchHandling() {
        const player = videojs('stellar-player');
        
        // Improved double tap handling
        let lastTapTime = 0;
        let touchTimeout;
        let touchStartX = 0;
        let touchStartY = 0;
        const doubleTapThreshold = 300;
        
        player.on('touchstart', (e) => {
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTapTime;
            
            if (tapLength < doubleTapThreshold && tapLength > 0) {
                clearTimeout(touchTimeout);
                
                const playerRect = player.el().getBoundingClientRect();
                const tapX = touchStartX - playerRect.left;
                const tapPosition = tapX / playerRect.width;
                
                if (tapPosition < 0.4) {
                    player.currentTime(Math.max(0, player.currentTime() - 10));
                } else if (tapPosition > 0.6) {
                    player.currentTime(Math.min(player.duration(), player.currentTime() + 10));
                }
                
                e.preventDefault();
            } else {
                touchTimeout = setTimeout(() => {
                    // Single tap handling
                }, doubleTapThreshold);
            }
            
            lastTapTime = currentTime;
        });
        
        // Prevent default scroll when swiping on video
        player.on('touchmove', (e) => {
            const touch = e.touches[0];
            const deltaY = Math.abs(touch.clientY - touchStartY);
            const deltaX = Math.abs(touch.clientX - touchStartX);
            
            if (deltaY < 30 && deltaX < 30) {
                e.preventDefault();
            }
    ];

    const channels = specificChannels;

    // Update the category list creation
    function createCountryCategories() {
        const categoryList = document.querySelector('.category-list');
        const uniqueCountries = [...new Set(specificChannels.map(ch => ch.country))];
        
        categoryList.innerHTML = '<button class="category-btn active">Todos los Países</button>';
        
        uniqueCountries.forEach(country => {
            const countryChannels = specificChannels.filter(ch => ch.country === country);
            const button = document.createElement('button');
            button.className = 'category-btn';
            button.textContent = `${country} (${countryChannels.length})`;
            button.dataset.country = country;
            categoryList.appendChild(button);
        });
    }

    // Update channel display function
    function displayChannels(filterCountry = null) {
        const channelGrid = document.querySelector('.live-channels .channel-grid');
        channelGrid.innerHTML = '';
        
        const filteredChannels = filterCountry ? 
            channels.filter(ch => ch.country === filterCountry) : 
            channels;

        filteredChannels.forEach(channel => {
            const channelCard = document.createElement('div');
            channelCard.className = 'channel-card';
            channelCard.innerHTML = `
                <div class="channel-preview" style="background-image: url('${channel.logo}')">
                    ${channel.isLive ? '<div class="live-badge">EN VIVO</div>' : ''}
                    <div class="channel-info">
                        <h3>${channel.name}</h3>
                        <p>Transmitiendo desde: ${channel.country}</p>
                        <p>${channel.viewers} viendo</p>
                        <p class="channel-country">${channel.country} | ${channel.language}</p>
                    </div>
                </div>
            `;
            
            channelCard.addEventListener('click', () => playChannel(channel));
            channelGrid.appendChild(channelCard);
        });
    }

    // Update category filter functionality
    function initializeCategoryFilters() {
        createCountryCategories();
        
        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const country = button.dataset.country;
                displayChannels(country === undefined ? null : country);
            });
        });
    }

    // Function to update current channel info
    function updateCurrentChannel(channel) {
        document.getElementById('current-channel-name').textContent = channel.name;
        document.getElementById('current-show').textContent = `Transmitiendo desde: ${channel.country}`;
    }

    // Function to play channel
    function playChannel(channel) {
        player.poster(''); 
        player.src({
            src: channel.streamUrl,
            type: 'application/x-mpegURL'
        });
        player.play();
        updateCurrentChannel(channel);

        player.on('ended', () => {
            player.poster('https://i.ibb.co/1RW9vqg/poster.jpg');
        });
        
        player.on('error', () => {
            player.poster('https://i.ibb.co/1RW9vqg/poster.jpg');
        });
    }

    // Initialize functionality
    initializeCategoryFilters();
    displayChannels();

    // Update touch handling for better mobile experience
    function initializeTouchHandling() {
        const player = videojs('stellar-player');
        
        let lastTapTime = 0;
        let touchTimeout;
        let touchStartX = 0;
        let touchStartY = 0;
        const doubleTapThreshold = 300;
        
        player.on('touchstart', (e) => {
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTapTime;
            
            if (tapLength < doubleTapThreshold && tapLength > 0) {
                clearTimeout(touchTimeout);
                
                const playerRect = player.el().getBoundingClientRect();
                const tapX = touchStartX - playerRect.left;
                const tapPosition = tapX / playerRect.width;
                
                if (tapPosition < 0.4) {
                    player.currentTime(Math.max(0, player.currentTime() - 10));
                } else if (tapPosition > 0.6) {
                    player.currentTime(Math.min(player.duration(), player.currentTime() + 10));
                }
                
                e.preventDefault();
            } else {
                touchTimeout = setTimeout(() => {
                }, doubleTapThreshold);
            }
            
            lastTapTime = currentTime;
        });
        
        player.on('touchmove', (e) => {
            const touch = e.touches[0];
            const deltaY = Math.abs(touch.clientY - touchStartY);
            const deltaX = Math.abs(touch.clientX - touchStartX);
            
            if (deltaY < 30 && deltaX < 30) {
                e.preventDefault();
            }
        });
    }

    // Update category list touch scrolling
    function initializeCategoryScroll() {
        const categoryList = document.querySelector('.category-list');
        let isScrolling = false;
        let startX;
        let scrollLeft;
        let momentumID;
        let velocity = 0;
        
        categoryList.addEventListener('touchstart', (e) => {
            isScrolling = true;
            startX = e.touches[0].pageX - categoryList.offsetLeft;
            scrollLeft = categoryList.scrollLeft;
            cancelAnimationFrame(momentumID);
        }, { passive: true });
        
        categoryList.addEventListener('touchmove', (e) => {
            if (!isScrolling) return;
            
            const x = e.touches[0].pageX - categoryList.offsetLeft;
            const walk = (x - startX) * 1.5;
            const newScrollLeft = scrollLeft - walk;
            
            velocity = walk;
            categoryList.scrollLeft = newScrollLeft;
        }, { passive: true });
        
        categoryList.addEventListener('touchend', () => {
            isScrolling = false;
            
            const momentumScroll = () => {
                velocity *= 0.95;
                categoryList.scrollLeft -= velocity;
                
                if (Math.abs(velocity) > 0.5) {
                    momentumID = requestAnimationFrame(momentumScroll);
                }
            };
            
            momentumID = requestAnimationFrame(momentumScroll);
        }, { passive: true });
    }

    initializeTouchHandling();
    initializeCategoryScroll();

    function setVH() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setVH();
    window.addEventListener('resize', setVH);

    document.querySelector('.notifications').addEventListener('click', () => {
        alert('¡Notificaciones próximamente!');
    });

    document.querySelector('.profile').addEventListener('click', () => {
        alert('¡Configuración de perfil próximamente!');
    });
});