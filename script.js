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
        const filteredChannels = allContent.filter(channel => 
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
                playContent(channel);
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

    // Update the specificChannels definition to include a type property
    const specificChannels = [
        {
    id: 1,
    name: "Sony Novelas",
    logo: "https://www.cxtv.com.br/img/Tvs/Logo/webp-m/a3bd552eca6645942a60a053fe61fafb.webp",
    country: "Series",
    genre: "Series",
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
    genre: "Noticias",
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
    genre: "Deportes",
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
    genre: "Infantil",
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
    genre: "Deportes",
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
    name: "Televen",
    logo: "https://i.ytimg.com/vi/1o4f2pI-vps/maxresdefault.jpg",
    country: "Variedades",
    genre: "Variedades",
    currentShow: "Venezuela",
    language: "Español",
    streamUrl: "https://d39cdj6x0ssnqk.cloudfront.net/out/v1/ae3f5ad3ac9d4bcfbedc1894a62782b4/index.m3u8",
    isLive: true
  },
  {
    id: 22,
    name: "Canal 21",
    logo: "https://megavision.univtec.com/_next/image?url=https%3A%2F%2Fkki5auiqw9.execute-api.us-east-1.amazonaws.com%2Fstg%2Fresize%3Furl%3Dhttps%3A%2F%2Ffrankly-vod.akamaized.net%2Fmegavision%2Fuploaded%2F754bd760-78d6-48db-90ad-88b97e502ed8.jpeg&w=3840&q=90",
    country: "Variedades",
    genre: "Variedades",
    currentShow: "Salvador",
    language: "Español",
    streamUrl: "https://mgv-channel21.akamaized.net/hls/live/2093191/MGV_CHANNEL21/master.m3u8",
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
    logo: "https://cdn.rudo.video/assets/ecuavisa/live/live_331386e7141731773c4c84caa3a273c11696295901.jpg",
    country: "Variedades",
    genre: "Variedades",
    currentShow: "Ecuador",
    language: "Español",
    streamUrl: "https://redirector.rudo.video/hls-video/c54ac2799874375c81c1672abb700870537c5223/ecuavisa/ecuavisa.smil/playlist_dvr.m3u8?did=b2153323358367ca6f02b283e",
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
  },
  {
    id: 29,
    name: "Venevision",
    logo: "https://cisneros-vod.akamaized.net/venevision/uploaded/a833ecf3-a21c-49e3-a2eb-8e67dfc916e5.jpeg",
    country: "Variedades",
    genre: "Variedades",
    currentShow: "Venezuela",
    language: "Español",
    streamUrl: "https://pubads.g.doubleclick.net/ssai/event/4EZVJznARm6vHvBUVjnYsw/master.m3u8",
    isLive: true
  },
  {
    id: 30,
    name: "Telepacifico",
    logo: "https://cloudfront-us-east-1.images.arcpublishing.com/elespectador/KLUEITR5YFF7HFWXJAVMLGKLX4.jpg",
    country: "Variedades",
    genre: "Variedades",
    currentShow: "Colombia",
    language: "Español",
    streamUrl: "https://live-edge-eu-1.cdn.enetres.net/6E5C615AA5FF4123ACAF0DAB57B7B8DC021/live-telepacifico/index.m3u8",
    isLive: true
  },
  {
    id: 31,
    name: "La red",
    logo: "https://puranoticia.pnt.cl/cms/site/artic/20220610/imag/foto_0000000420220610182433/La-Red.png",
    country: "Variedades",
    genre: "Variedades",
    currentShow: "Chile",
    language: "Español",
    streamUrl: "https://alba-cl-lared-lared.stream.mediatiquestream.com/index.m3u8",
    isLive: true
  },
  {
    id: 32,
    name: "Deportes13 TV",
    logo: "https://s.t13.cl/sites/default/files/styles/manualcrop_850x475/public/t13/field-imagen/2023-05/whatsapp_image_2023-05-19_at_11.24.45.jpeg?itok=q-iMMPw5",
    country: "Deportes",
    genre: "Deportes",
    currentShow: "Chile",
    language: "Español",
    streamUrl: "https://dai.google.com/linear/hls/event/uFiYkh4CQPCPgbs7WPKhXw/master.m3u8",
    isLive: true
  },
  {
    id: 33,
    name: "Caracol",
    logo: "https://caracoltv.brightspotcdn.com/dims4/default/9b9a483/2147483647/strip/false/crop/1200x630+0+0/resize/1200x630!/format/webp/quality/75/?url=http%3A%2F%2Fcaracol-brightspot.s3.us-west-2.amazonaws.com%2Fe7%2F47%2F8e11490445fa970f4e73f7757615%2Fcaracoltv.jpg",
    country: "Variedades",
    genre: "Variedades",
    currentShow: "Ecuador",
    language: "Español",
    streamUrl: "https://mdstrm.com/live-stream-playlist/632391734be92a791e2750e6.m3u8",
    isLive: true
  },
  {
    id: 34,
    name: "Caracol TV",
    logo: "https://caracoltv.brightspotcdn.com/dims4/default/74aa598/2147483647/strip/true/crop/1200x800+0+0/resize/1200x800!/quality/90/?url=http%3A%2F%2Fcaracol-brightspot.s3.amazonaws.com%2Ff4%2F7a%2F3680a8734c6182c42d2c10c76c7f%2Fcaracol-television-logo.jpg",
    country: "Variedades",
    genre: "Variedades",
    currentShow: "Colombia",
    language: "Español",
    streamUrl: "https://mdstrm.com/live-stream-playlist/574463697b9817cf0886fc17.m3u8",
    isLive: true
  },
  {
    id: 35,
    name: "RCN",
    logo: "https://www.canalrcn.com/sites/default/files/styles/imagen_700x700/public/2018-03/logo%20canal%20RCN.png?itok=xouFGYoG",
    country: "Variedades",
    genre: "Variedades",
    currentShow: "Colombia",
    language: "Español",
    streamUrl: "https://rcnhd.cdn.net.co/live01/rcnhd.m3u8",
    isLive: true
  },
  {
    id: 36,
    name: "City TV",
    logo: "https://citytv.com.co/wp-content/themes/citytv/images/logo.png",
    country: "Variedades",
    genre: "Variedades",
    currentShow: "Colombia",
    language: "Español",
    streamUrl: "https://citytv-live.cdn.vustreams.com/live/citytv/playlist.m3u8",
    isLive: true
  },
  {
    id: 37,
    name: "Teleantioquia",
    logo: "https://www.teleantioquia.co/wp-content/uploads/2023/01/logo-teleantioquia-2023.svg",
    country: "Variedades",
    genre: "Variedades",
    currentShow: "Colombia",
    language: "Español",
    streamUrl: "https://liveingesta118.cdnmedia.tv/teleantioquialive/smil:dvrlive.smil/playlist.m3u8",
    isLive: true
  },
  {
    id: 38,
    name: "Telepacífico",
    logo: "https://www.telepacifico.com/wp-content/uploads/2020/11/logo-footer.png",
    country: "Variedades",
    genre: "Variedades",
    currentShow: "Colombia",
    language: "Español",
    streamUrl: "https://stream.logicideas.media/telepacifico-live/smil:live.smil/playlist.m3u8",
    isLive: true
  },
  {
    id: 39,
    name: "Canal TRO",
    logo: "https://canaltro.com/wp-content/uploads/2019/10/logo-tro.png",
    country: "Variedades",
    genre: "Variedades",
    currentShow: "Colombia",
    language: "Español",
    streamUrl: "https://liveingesta118.cdnmedia.tv/canaltro2live/smil:live.smil/playlist.m3u8",
    isLive: true
  },
  {
    id: 40,
    name: "Telemedellín",
    logo: "https://telemedellin.tv/wp-content/uploads/2023/03/cropped-logo-telemedellin-2023.png",
    country: "Variedades",
    genre: "Variedades",
    currentShow: "Colombia",
    language: "Español",
    streamUrl: "https://liveingesta118.cdnmedia.tv/telemedellintvlive/smil:dvrlive.smil/playlist.m3u8",
    isLive: true
  }
    ];

    // Add some sample movies
    const movies = [
        {
            id: 101,
            name: "Película de Muestra 1",
            logo: "https://i.ibb.co/1RW9vqg/poster.jpg",
            genre: "Action",
            viewers: "50K",
            language: "Español",
            streamUrl: "#",
            isLive: false,
            type: "movie"
        }
    ];

    // Combine all content for the home section
    const allContent = [...specificChannels, ...movies];

    // Initialize favorites array
    let favorites = [];

    // Function to toggle favorite
    function toggleFavorite(item) {
        const index = favorites.findIndex(f => f.id === item.id && f.type === item.type);
        if (index === -1) {
            favorites.push(item);
        } else {
            favorites.splice(index, 1);
        }
        // Save to localStorage
        localStorage.setItem('favorites', JSON.stringify(favorites));
        // Update UI
        displayFavorites();
    }

    // Function to display content in grid
    function displayContent(content, container) {
        container.innerHTML = '';
        
        if (content.length === 0) {
            container.innerHTML = '<div class="no-content">No hay contenido disponible</div>';
            return;
        }

        content.forEach(item => {
            const card = document.createElement('div');
            card.className = 'channel-card';
            const isFavorite = favorites.some(f => f.id === item.id && f.type === item.type);
            
            card.innerHTML = `
                <div class="channel-preview" style="background-image: url('${item.logo}')">
                    ${item.isLive ? '<div class="live-badge">EN VIVO</div>' : ''}
                    <div class="favorite-btn ${isFavorite ? 'active' : ''}" onclick="toggleFavorite(${JSON.stringify(item)})">
                        <svg viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
                        </svg>
                    </div>
                    <div class="channel-info">
                        <h3>${item.name}</h3>
                        <p>${item.type === 'channel' ? 'Transmitiendo desde: ' + item.country : item.genre}</p>
                        <p>${item.viewers} viendo</p>
                        <p class="channel-country">${item.language}</p>
                    </div>
                </div>
            `;
            
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.favorite-btn')) {
                    playContent(item);
                }
            });
            
            container.appendChild(card);
        });
    }

    // Function to display favorites
    function displayFavorites() {
        const favoritesContainer = document.querySelector('#favorites-section .favorites-grid');
        displayContent(favorites, favoritesContainer);
    }

    // Update section switching
    function switchSection(sectionId) {
        const sections = document.querySelectorAll('.section-content');
        const navItems = document.querySelectorAll('.nav-item');
        
        sections.forEach(section => section.classList.remove('active'));
        navItems.forEach(item => item.classList.remove('active'));
        
        const activeSection = document.getElementById(sectionId);
        const activeNav = document.querySelector(`[data-section="${sectionId}"]`);
        
        if (activeSection) {
            activeSection.classList.add('active');
            
            switch(sectionId) {
                case 'home-section':
                    const channelsInHome = allContent.filter(item => item.type === 'channel');
                    displayContent(channelsInHome, document.querySelector('#home-section .channel-grid'));
                    
                    const moviesInHome = allContent.filter(item => item.type === 'movie');
                    displayContent(moviesInHome, document.querySelector('#home-section .movies-grid'));
                    break;
                case 'live-section':
                    displayContent(specificChannels, document.querySelector('#live-section .channel-grid'));
                    break;
                case 'movies-section':
                    displayContent(movies, document.querySelector('#movies-section .movies-grid'));
                    break;
                case 'favorites-section':
                    displayFavorites();
                    break;
            }
        }
        if (activeNav) activeNav.classList.add('active');
    }

    // Initialize content on load
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
        favorites = JSON.parse(savedFavorites);
    }
    
    switchSection('home-section');

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

    player.addClass('vjs-custom-theme');

    player.on('dblclick', function() {
        if (!this.isFullscreen()) {
            this.requestFullscreen();
        } else {
            this.exitFullscreen();
        }
    });

    player.on('keydown', function(e) {
        switch(e.keyCode) {
            case 32: 
                if (this.paused()) {
                    this.play();
                } else {
                    this.pause();
                }
                e.preventDefault();
                break;
            case 37: 
                this.currentTime(Math.max(0, this.currentTime() - 10));
                e.preventDefault();
                break;
            case 39: 
                this.volume(Math.min(this.duration(), this.currentTime() + 10));
                e.preventDefault();
                break;
            case 38: 
                this.volume(Math.min(1, this.volume() + 0.1));
                e.preventDefault();
                break;
            case 40: 
                this.volume(Math.max(0, this.volume() - 0.1));
                e.preventDefault();
                break;
        }
    });

    function playContent(item) {
        if (item.type === "channel") {
            player.poster(''); 
            player.src({
                src: item.streamUrl,
                type: 'application/x-mpegURL'
            });
            player.play();
            updateCurrentChannel(item);
        } else {
            alert("Pelicula seleccionada no disponible para reproducción");
        }

        player.on('ended', () => {
            player.poster('https://i.ibb.co/1RW9vqg/poster.jpg');
        });
        
        player.on('error', () => {
            player.poster('https://i.ibb.co/1RW9vqg/poster.jpg');
        });
    }

    function updateCurrentChannel(channel) {
        document.getElementById('current-channel-name').textContent = channel.name;
        document.getElementById('current-show').textContent = `Transmitiendo desde: ${channel.country}`;
    }

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

    const mobileNavItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section-content');

    mobileNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = item.getAttribute('data-section');
            switchSection(sectionId);
        });
    });

    switchSection('home-section');
});