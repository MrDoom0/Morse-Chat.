/**
 * Morse Chat - Main Application Logic
 */

// --- Dictionaries ---
const MORSE_EN = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..',
    '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
    '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
    '.': '.-.-.-', ',': '--..--', '?': '..--..', '!': '-.-.--', '-': '-....-',
    '/': '-..-.', '@': '.--.-.', '(': '-.--.', ')': '-.--.-'
};

const MORSE_AR = {
    'ا': '.-', 'ب': '-...', 'ت': '-', 'ث': '-.-.', 'ج': '.---', 'ح': '....',
    'خ': '---', 'د': '-..', 'ذ': '--..', 'ر': '.-.', 'ز': '---.', 'س': '...',
    'ش': '----', 'ص': '-..-', 'ض': '..-', 'ط': '..-..', 'ظ': '-.--', 'ع': '.-.-',
    'غ': '--.', 'ف': '..-.', 'ق': '--.-', 'ك': '-.-', 'ل': '.-..', 'م': '--',
    'ن': '-.', 'ه': '..-.-', 'و': '.--', 'ي': '..',
    '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
    '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
    '.': '.-.-.-', '،': '--..--', '؟': '..--..'
};

// Compute Reverses
const REV_EN = {}; Object.entries(MORSE_EN).forEach(([k, v]) => REV_EN[v] = k);
const REV_AR = {}; Object.entries(MORSE_AR).forEach(([k, v]) => REV_AR[v] = k);

const LOCALES = {
    en: {
        app_title: 'Morse Chat', nav_lobby: 'Lobby', nav_chat: 'Active Chat',
        nav_catalog: 'Catalog', nav_profile: 'Profile', status_offline: 'Offline',
        host_title: 'Host a Room', host_label_name: 'Channel Name',
        host_label_lang: 'Language Option', opt_en: 'English Only',
        opt_ar: 'Arabic Only', opt_multi: 'Multilingual', btn_create: 'Create Room',
        join_title: 'Join a Room', join_label_id: 'Host Peer ID',
        join_label_key: '6-Digit Key', btn_connect: 'Connect',
        active_rooms: 'Active Rooms', no_rooms: 'No active rooms right now.',
        not_in_room: 'Not in a room', chat_placeholder: 'Join or Host a room from the Lobby',
        mode_std: 'Standard (Mode 1)', mode_real: 'Realistic (Mode 2)',
        mode_text: 'Text (Native)', btn_send: 'Send', btn_tap_hold: 'TAP / HOLD',
        btn_space: 'Space', btn_cheatsheet: 'Cheat Sheet', btn_cat_en: 'English Symbols', btn_cat_ar: 'Arabic Symbols',
        profile_id_title: 'Identity', profile_nickname: 'Nickname',
        profile_network_id: 'Your Network ID', profile_settings_title: 'Settings',
        profile_theme: 'Theme', btn_theme: 'Switch to Light Mode',
        profile_ui_lang: 'UI Translation Language', btn_uilang: 'Current: English',
        profile_morse_lang: 'Morse Writing System', btn_morselang: 'Current: English'
    },
    ar: {
        app_title: 'مورس شات', nav_lobby: 'الردهة', nav_chat: 'الدردشة',
        nav_catalog: 'الكتالوج', nav_profile: 'الملف الشخصي', status_offline: 'غير متصل',
        host_title: 'استضافة الغرفة', host_label_name: 'اسم القناة',
        host_label_lang: 'خيار اللغة', opt_en: 'إنجليزي فقط',
        opt_ar: 'عربي فقط', opt_multi: 'متعدد اللغات', btn_create: 'إنشاء غرفة',
        join_title: 'الانضمام', join_label_id: 'هوية المضيف',
        join_label_key: 'رمز من 6 أرقام', btn_connect: 'اتصال',
        active_rooms: 'الغرف النشطة', no_rooms: 'لا توجد غرف نشطة الآن.',
        not_in_room: 'لست في غرفة', chat_placeholder: 'قم بالانضمام أو استضافة غرفة',
        mode_std: 'عادي (نمط 1)', mode_real: 'واقعي (نمط 2)',
        mode_text: 'نص (لوحة مفاتيح)', btn_send: 'إرسال', btn_space: 'مسافة', btn_cheatsheet: 'دليل مورس', btn_tap_hold: 'انقر / استمر',
        btn_cat_en: 'الرموز الإنجليزية', btn_cat_ar: 'الرموز العربية',
        profile_id_title: 'الهوية', profile_nickname: 'الاسم المستعار',
        profile_network_id: 'هويتك في الشبكة', profile_settings_title: 'الإعدادات',
        profile_theme: 'المظهر', btn_theme: 'التبديل للوضع الفاتح',
        profile_ui_lang: 'لغة ترجمة الواجهة', btn_uilang: 'الحالي: الإنجليزية',
        profile_morse_lang: 'لغة نظام مورس', btn_morselang: 'الحالي: الإنجليزية'
    }
};

// --- State ---
window.AppState = {
    wpm: 20,
    theme: 'dark',
    uiLang: 'en', // 'en' or 'ar'
    appLang: 'english', // 'english' or 'arabic' (Morse system)
    nickname: localStorage.getItem('nickname') || 'Anonymous',
    
    // Auth & Network
    peer: null,
    myPeerId: null,
    hostedRooms: {}, // { roomKey: { config: {}, connections: [] } }
    joinedRoom: null, // { hostId, roomKey, activeLang, conn }
    
    // UI State
    activeChannel: 'lobby',
    keyboardMode: 'standard', // 'standard', 'realistic', 'text'
    
    // Input Buffers
    currentMorseWord: '',
    previewMorse: '',
    previewText: '',
    autoSpaceTimeout: null,
    wordSpaceTimeout: null,
    adaptiveThreshold: null,

    getDict() {
        if (this.joinedRoom && this.joinedRoom.activeLang) {
            return this.joinedRoom.activeLang === 'arabic' ? MORSE_AR : MORSE_EN;
        }
        return this.appLang === 'arabic' ? MORSE_AR : MORSE_EN;
    },
    getReverse() {
        if (this.joinedRoom && this.joinedRoom.activeLang) {
            return this.joinedRoom.activeLang === 'arabic' ? REV_AR : REV_EN;
        }
        return this.appLang === 'arabic' ? REV_AR : REV_EN;
    }
};

// --- DOM Nodes ---
const DOM = {
    splash: document.getElementById('splashScreen'),
    appShell: document.getElementById('appShell'),
    navBtns: document.querySelectorAll('.nav-btn'),
    channels: document.querySelectorAll('.channel'),
    
    // Profile
    profileNickname: document.getElementById('profileNickname'),
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    uiLangToggleBtn: document.getElementById('uiLangToggleBtn'),
    langToggleBtn: document.getElementById('langToggleBtn'),
    myNetworkId: document.getElementById('myNetworkId'),
    peerStatus: document.getElementById('peerStatus'),
    
    // Lobby
    hostChannelName: document.getElementById('hostChannelName'),
    hostLanguage: document.getElementById('hostLanguage'),
    btnCreateRoom: document.getElementById('btnCreateRoom'),
    hostFeedback: document.getElementById('hostFeedback'),
    
    joinHostId: document.getElementById('joinHostId'),
    joinRoomKey: document.getElementById('joinRoomKey'),
    btnJoinRoom: document.getElementById('btnJoinRoom'),
    joinFeedback: document.getElementById('joinFeedback'),
    activeRoomsList: document.getElementById('activeRoomsList'),
    
    // Chat
    currentChatTitle: document.getElementById('currentChatTitle'),
    currentChatLang: document.getElementById('currentChatLang'),
    chatMessages: document.getElementById('chatMessages'),
    previewMorse: document.getElementById('previewMorse'),
    previewText: document.getElementById('previewText'),
    chatWpmSlider: document.getElementById('chatWpmSlider'),
    wpmLabel: document.getElementById('wpmLabel'),
    keyboardModeSelector: document.getElementById('keyboardModeSelector'),
    btnCheatSheet: document.getElementById('btnCheatSheet'),
    chatCheatSheet: document.getElementById('chatCheatSheet'),
    
    kb1Dot: document.getElementById('kb1Dot'),
    kb1Dash: document.getElementById('kb1Dash'),
    kb1Space: document.getElementById('kb1Space'),
    kb1Backspace: document.getElementById('kb1Backspace'),
    kb1Send: document.getElementById('kb1Send'),
    kb2Tap: document.getElementById('kb2Tap'),
    kb2ProgressBar: document.getElementById('kb2ProgressBar'),
    kb2Backspace: document.getElementById('kb2Backspace'),
    kb2Send: document.getElementById('kb2Send'),
    nativeChatInput: document.getElementById('nativeChatInput'),
    
    modes: [
        document.getElementById('kbMode1'),
        document.getElementById('kbMode2'),
        document.getElementById('kbMode3')
    ],

    // Catalog
    catFilterEn: document.getElementById('catFilterEn'),
    catFilterAr: document.getElementById('catFilterAr'),
    catalogGrid: document.getElementById('catalogGrid')
};

// --- Initialization & Flow ---

function triggerSplashAnimation() {
    DOM.splash.classList.add('slide-in');
    
    // Fire the Ting when we expect it hits center (animation is 1s, hits center logic ~1s)
    setTimeout(() => {
        AudioEngine.playTing();
    }, 1000);

    // Slide out after a delay
    setTimeout(() => {
        DOM.splash.classList.replace('slide-in', 'slide-out');
        DOM.appShell.classList.remove('hidden');
        initNetwork();
    }, 2500);

    setTimeout(() => {
        DOM.splash.style.display = 'none';
        AudioEngine.init();
    }, 3500);
}

document.addEventListener('DOMContentLoaded', () => {
    DOM.profileNickname.value = AppState.nickname;
    triggerSplashAnimation();
    renderCatalog('en');
});

// Click wrapper to assure AudioContext wakes up
document.body.addEventListener('click', () => {
    AudioEngine.resume();
});

// Sound clicking globally
document.querySelectorAll('button, select').forEach(el => {
    el.addEventListener('mousedown', () => {
        if (!el.id.includes('kb1') && !el.id.includes('kb2')) {
            AudioEngine.playClick();
        }
    });
});

// --- Settings & Profile ---
DOM.profileNickname.addEventListener('input', (e) => {
    AppState.nickname = e.target.value.trim() || 'Anonymous';
    localStorage.setItem('nickname', AppState.nickname);
});

DOM.themeToggleBtn.addEventListener('click', () => {
    const root = document.documentElement;
    if (AppState.theme === 'dark') {
        AppState.theme = 'light';
        root.setAttribute('data-theme', 'light');
        DOM.themeToggleBtn.textContent = AppState.uiLang === 'ar' ? 'التبديل للوضع الفاتح' : 'Switch to Light Mode';
    } else {
        AppState.theme = 'dark';
        root.setAttribute('data-theme', 'dark');
        DOM.themeToggleBtn.textContent = AppState.uiLang === 'ar' ? 'التبديل للوضع الداكن' : 'Switch to Dark Mode';
    }
});

function updateAppTranslation() {
    const dict = LOCALES[AppState.uiLang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
            el.textContent = dict[key];
        }
    });

    // Update document direction
    document.body.dir = AppState.uiLang === 'ar' ? 'rtl' : 'ltr';

    // Refresh dynamic string states
    DOM.themeToggleBtn.textContent = AppState.theme === 'dark' 
        ? (AppState.uiLang === 'ar' ? 'التبديل للوضع الفاتح' : 'Switch to Light Mode')
        : (AppState.uiLang === 'ar' ? 'التبديل للوضع الداكن' : 'Switch to Dark Mode');

    DOM.uiLangToggleBtn.textContent = AppState.uiLang === 'ar' ? 'التطبيق مترجم: بالعربية' : 'Current: English';
    
    DOM.langToggleBtn.textContent = AppState.uiLang === 'ar' 
        ? (AppState.appLang === 'arabic' ? 'مورس: عربي' : 'مورس: إنجليزي') 
        : (AppState.appLang === 'arabic' ? 'Current: Arabic' : 'Current: English');

    // Handle Room Title (it doesn't have a data-i18n now because it's dynamic)
    if (AppState.joinedRoom) {
        DOM.currentChatTitle.textContent = AppState.joinedRoom.config.name;
        DOM.currentChatLang.textContent = AppState.joinedRoom.config.lang.toUpperCase();
    } else {
        DOM.currentChatTitle.textContent = dict.not_in_room;
        DOM.currentChatLang.textContent = '--';
    }
}

DOM.uiLangToggleBtn.addEventListener('click', () => {
    AppState.uiLang = AppState.uiLang === 'en' ? 'ar' : 'en';
    updateAppTranslation();
});

DOM.langToggleBtn.addEventListener('click', () => {
    if (AppState.appLang === 'english') {
        AppState.appLang = 'arabic';
        renderCatalog('ar');
    } else {
        AppState.appLang = 'english';
        renderCatalog('en');
    }
    
    // Update labels immediately
    DOM.langToggleBtn.textContent = AppState.uiLang === 'ar' 
        ? (AppState.appLang === 'arabic' ? 'مورس: عربي' : 'مورس: إنجليزي') 
        : (AppState.appLang === 'arabic' ? 'Current: Arabic' : 'Current: English');

    // Sync active room if it's multilingual
    if (AppState.joinedRoom && AppState.joinedRoom.config.lang === 'multilingual') {
        AppState.joinedRoom.activeLang = AppState.appLang;
        appendChatMessage('System', `Morse Language switched to ${AppState.appLang.toUpperCase()}`, '', true, true);
    }
    
    processModeCommit(); // Re-translate current buffers
});

// --- Nav ---
DOM.navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        DOM.navBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const target = btn.dataset.target;
        AppState.activeChannel = target;
        
        DOM.channels.forEach(c => {
            if (c.id === target) {
                c.classList.remove('hidden');
                c.classList.add('active-channel');
            } else {
                c.classList.add('hidden');
                c.classList.remove('active-channel');
            }
        });
    });
});

// --- Catalog Rendering ---
DOM.catFilterEn.addEventListener('click', () => renderCatalog('en'));
DOM.catFilterAr.addEventListener('click', () => renderCatalog('ar'));

function renderCatalog(lang) {
    DOM.catalogGrid.innerHTML = '';
    const dict = lang === 'ar' ? MORSE_AR : MORSE_EN;
    
    for (const [char, code] of Object.entries(dict)) {
        const btn = document.createElement('div');
        btn.className = 'cat-btn glass-panel';
        btn.innerHTML = `<span class="cat-char">${char}</span><span class="cat-morse">${code}</span>`;
        btn.addEventListener('click', () => {
            AudioEngine.enqueue(code);
        });
        DOM.catalogGrid.appendChild(btn);
    }
}

// --- WebRTC (PeerJS) Logic ---
function initNetwork() {
    DOM.peerStatus.textContent = 'Connecting...';
    DOM.peerStatus.className = 'global-status connecting';
    
    // Use an explicit random peer ID so we acts as host natively
    const randomId = 'morsechat-' + Math.random().toString(36).substr(2, 6);
    AppState.peer = new Peer(randomId);

    AppState.peer.on('open', (id) => {
        AppState.myPeerId = id;
        DOM.myNetworkId.textContent = id;
        DOM.peerStatus.textContent = 'Online';
        DOM.peerStatus.className = 'global-status connected';
        
        // Auto-join via Link verification
        const urlParams = new URLSearchParams(window.location.search);
        const pHost = urlParams.get('h');
        const pKey = urlParams.get('k');
        if (pHost && pKey) {
            joinRoom(pHost, pKey);
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    });

    AppState.peer.on('connection', (conn) => {
        setupIncomingConnection(conn);
    });

    AppState.peer.on('error', (err) => {
        console.error(err);
        DOM.peerStatus.textContent = 'Network Error';
        DOM.peerStatus.className = 'global-status disconnected';
    });
}

function processRoomAuth(conn, data) {
    // data: { type: 'auth', key: '123456', nickname: 'User' }
    const key = data.key;
    if (AppState.hostedRooms[key]) {
        // Auth success
        AppState.hostedRooms[key].connections.push(conn);
        conn.send({ type: 'auth_ok', roomConfig: AppState.hostedRooms[key].config, key: key });
        
        // Notify others
        broadcastToRoom(key, { 
            type: 'sys', 
            msg: `${data.nickname} joined the room.` 
        }, conn.peer);
        
        updateActiveRoomsUI();
    } else {
        conn.send({ type: 'auth_fail', msg: 'Invalid Room Key' });
        setTimeout(() => conn.close(), 500);
    }
}

function setupIncomingConnection(conn) {
    conn.on('data', (data) => {
        if (data.type === 'auth') {
            processRoomAuth(conn, data);
            return;
        }
        
        // For standard messages wrapped for a room
        if (data.roomKey && AppState.hostedRooms[data.roomKey]) {
            // Re-broadcast sequentially to everyone else
            broadcastToRoom(data.roomKey, data, conn.peer);
            
            // If I am looking at this room, display it!
            if (AppState.joinedRoom && AppState.joinedRoom.roomKey === data.roomKey) {
                appendChatMessage(data.nickname, data.textMsg, data.morseMsg, false);
            }
        }
    });

    conn.on('close', () => {
        // Cleanup connections
        for (let key in AppState.hostedRooms) {
            const ind = AppState.hostedRooms[key].connections.findIndex(c => c.peer === conn.peer);
            if (ind > -1) {
                AppState.hostedRooms[key].connections.splice(ind, 1);
                broadcastToRoom(key, { type: 'sys', msg: 'Someone left the room.' }, conn.peer);
            }
        }
    });
}

function broadcastToRoom(roomKey, payload, excludePeer = null) {
    if (AppState.hostedRooms[roomKey]) {
        AppState.hostedRooms[roomKey].connections.forEach(c => {
            if (c.peer !== excludePeer) {
                c.send({ ...payload, roomKey });
            }
        });
    }
}

// --- Lobby Actions ---
DOM.btnCreateRoom.addEventListener('click', () => {
    const name = DOM.hostChannelName.value.trim() || 'Untitled Room';
    const lang = DOM.hostLanguage.value;
    const roomKey = Math.floor(100000 + Math.random() * 900000).toString();
    
    AppState.hostedRooms[roomKey] = {
        config: { name, lang },
        connections: [] // peers will go here
    };
    
    DOM.hostFeedback.textContent = `Room created! Key: ${roomKey}. Provide your Host ID and this key to friends.`;
    DOM.hostFeedback.style.color = 'var(--success)';
    updateActiveRoomsUI();
    
    // Auto-join ourselves
    joinRoom(AppState.myPeerId, roomKey);
});

DOM.btnJoinRoom.addEventListener('click', () => {
    const hostId = DOM.joinHostId.value.trim();
    const key = DOM.joinRoomKey.value.trim();
    if (!hostId || key.length !== 6) {
        DOM.joinFeedback.textContent = 'Invalid ID or 6-digit key';
        return;
    }
    DOM.joinFeedback.textContent = 'Connecting...';
    joinRoom(hostId, key);
});

function joinRoom(hostId, key) {
    if (AppState.joinedRoom && AppState.joinedRoom.conn) {
        if (typeof AppState.joinedRoom.conn !== 'string') AppState.joinedRoom.conn.close();
    }
    
    DOM.chatMessages.innerHTML = ''; // clear chat
    
    // Self-join logic for Hosts to prevent fatal loopback error
    if (hostId === AppState.myPeerId) {
        if (AppState.hostedRooms[key]) {
            let roomConfig = AppState.hostedRooms[key].config;
            AppState.joinedRoom = {
                hostId,
                roomKey: key,
                config: roomConfig,
                activeLang: roomConfig.lang === 'multilingual' ? AppState.appLang : roomConfig.lang,
                conn: 'HOST_SELF'
            };
            DOM.joinFeedback.textContent = '';
            DOM.currentChatTitle.textContent = roomConfig.name;
            DOM.currentChatLang.textContent = roomConfig.lang.toUpperCase();
            document.querySelector('.nav-btn[data-target="chat"]').click();
            appendChatMessage('System', `Successfully joined hosted room ${roomConfig.name} (${roomConfig.lang})`, '', true, true);
        }
        return;
    }

    const conn = AppState.peer.connect(hostId);
    conn.on('open', () => {
        conn.send({ type: 'auth', key: key, nickname: AppState.nickname });
        DOM.joinFeedback.textContent = 'Authenticating...';
    });
    
    conn.on('data', (data) => {
        if (data.type === 'auth_ok') {
            AppState.joinedRoom = {
                hostId,
                roomKey: data.key,
                config: data.roomConfig,
                activeLang: data.roomConfig.lang === 'multilingual' ? AppState.appLang : data.roomConfig.lang,
                conn: conn
            };
            DOM.joinFeedback.textContent = 'Joined!';
            DOM.joinFeedback.style.color = 'var(--success)';
            
            // Switch to chat layout
            DOM.currentChatTitle.textContent = data.roomConfig.name;
            DOM.currentChatLang.textContent = data.roomConfig.lang.toUpperCase();
            document.querySelector('.nav-btn[data-target="chat"]').click();
            appendChatMessage('System', `Successfully joined ${data.roomConfig.name} (${data.roomConfig.lang})`, '', true, true);
        } else if (data.type === 'auth_fail') {
            DOM.joinFeedback.textContent = 'Auth failed: ' + data.msg;
        } else if (data.type === 'msg') {
            appendChatMessage(data.nickname, data.textMsg, data.morseMsg, false);
        } else if (data.type === 'sys') {
            appendChatMessage('System', data.msg, '', false, true);
        }
    });

    conn.on('close', () => {
        appendChatMessage('System', 'Connection to host lost.', '', true, true);
        AppState.joinedRoom = null;
    });
    
    conn.on('error', (err) => {
        DOM.joinFeedback.textContent = 'Connection error.';
    });
}

function updateActiveRoomsUI() {
    DOM.activeRoomsList.innerHTML = '';
    const keys = Object.keys(AppState.hostedRooms);
    if (keys.length === 0) {
        DOM.activeRoomsList.innerHTML = '<li class="empty-list">No active rooms right now.</li>';
        return;
    }
    
    keys.forEach(k => {
        const li = document.createElement('li');
        li.className = 'room-item';
        
        const btnGroup = document.createElement('div');
        btnGroup.style.display = 'flex';
        btnGroup.style.gap = '5px';
        
        const btnEnter = document.createElement('button');
        btnEnter.className = 'btn-primary';
        btnEnter.style = 'width:auto; padding:5px 10px;';
        btnEnter.textContent = 'Enter';
        btnEnter.addEventListener('click', () => joinRoom(AppState.myPeerId, k));
        
        const btnLink = document.createElement('button');
        btnLink.className = 'btn-primary';
        btnLink.style = 'width:auto; padding:5px 10px; background:var(--accent-glow); color:var(--accent-neon); border:1px solid var(--accent-neon);';
        btnLink.textContent = 'Copy Link';
        btnLink.addEventListener('click', (e) => {
            e.stopPropagation();
            const url = window.location.origin + window.location.pathname + `?h=${AppState.myPeerId}&k=${k}`;
            navigator.clipboard.writeText(url).then(() => {
                btnLink.textContent = 'Copied!';
                setTimeout(() => btnLink.textContent = 'Copy Link', 2000);
            });
        });

        const btnClose = document.createElement('button');
        btnClose.className = 'btn-primary bg-danger';
        btnClose.style = 'width:auto; padding:5px 10px;';
        btnClose.textContent = 'Close';
        btnClose.addEventListener('click', (e) => {
            e.stopPropagation();
            closeRoom(k);
        });

        btnGroup.appendChild(btnEnter);
        btnGroup.appendChild(btnLink);
        btnGroup.appendChild(btnClose);

        li.innerHTML = `<span><strong style="color:var(--accent-neon)">${AppState.hostedRooms[k].config.name}</strong> (Key: ${k}) - Clients: ${AppState.hostedRooms[k].connections.length}</span>`;
        li.appendChild(btnGroup);
        
        DOM.activeRoomsList.appendChild(li);
    });
}

function closeRoom(roomKey) {
    if (!AppState.hostedRooms[roomKey]) return;

    // Notify peers
    broadcastToRoom(roomKey, { type: 'sys', msg: 'The host has closed this room.' });

    // Disconnect all peers
    AppState.hostedRooms[roomKey].connections.forEach(conn => {
        conn.close();
    });

    // Remove from local state
    delete AppState.hostedRooms[roomKey];

    // If we are currently "in" this room as a participant
    if (AppState.joinedRoom && AppState.joinedRoom.roomKey === roomKey) {
        AppState.joinedRoom = null;
        updateAppTranslation(); // Reset header to 'Not in room'
        
        // Switch to lobby channel
        document.querySelector('.nav-btn[data-target="lobby"]').click();
        appendChatMessage('System', 'Your hosted room was closed.', '', true, true);
    }

    updateActiveRoomsUI();
    appendChatMessage('System', 'Room destroyed successfully.', '', true, true);
}

// --- Chat Messages UI ---
function appendChatMessage(name, textMsg, morseMsg, isSelf, isSys = false) {
    const div = document.createElement('div');
    if (isSys) {
        div.className = 'msg sys';
        div.textContent = textMsg;
    } else {
        div.className = `msg ${isSelf ? 'self' : 'peer'}`;
        div.innerHTML = `<strong>${name}</strong><br/>${textMsg} <div class="msg-morse">${morseMsg}</div>`;
        if (!isSelf && morseMsg) AudioEngine.enqueue(morseMsg);
    }
    DOM.chatMessages.appendChild(div);
    DOM.chatMessages.scrollTop = DOM.chatMessages.scrollHeight;
}

function dispatchChatMessage(text, morse) {
    if (!AppState.joinedRoom || !AppState.joinedRoom.conn) return;
    
    // Always dispatch localized text + translated morse.
    const payload = {
        type: 'msg',
        nickname: AppState.nickname,
        textMsg: text,
        morseMsg: morse,
        roomKey: AppState.joinedRoom.roomKey
    };

    if (AppState.joinedRoom.conn === 'HOST_SELF') {
        broadcastToRoom(AppState.joinedRoom.roomKey, payload);
    } else {
        AppState.joinedRoom.conn.send(payload);
    }
    
    appendChatMessage(AppState.nickname, text, morse, true);
}


// --- Keyboard Input Systems ---

// Common Buffer updates
function updateKeyboardPreview() {
    DOM.previewMorse.textContent = AppState.previewMorse;
    DOM.previewText.textContent = AppState.previewText;
    // Auto-scroll
    DOM.previewMorse.scrollLeft = DOM.previewMorse.scrollWidth;
}

function processModeCommit() {
    let raw = AppState.previewMorse;
    let revDict = AppState.getReverse();
    
    let words = raw.split(' / ');
    let outText = '';
    
    for (let i = 0; i < words.length; i++) {
        let chars = words[i].split(' ');
        for (let j = 0; j < chars.length; j++) {
            if (chars[j]) outText += (revDict[chars[j]] || '?');
        }
        if (i < words.length - 1) outText += ' ';
    }
    
    AppState.previewText = outText;
    updateKeyboardPreview();
}

function doInput(char) { // '.' or '-'
    AppState.currentMorseWord += char;
    AppState.previewMorse += char;
    processModeCommit(); // Instant feedback
    updateKeyboardPreview();
}

function doSpace() {
    // Commits the current `. -` stack as a localized letter space
    if (AppState.currentMorseWord) {
        // letter committed
        AppState.currentMorseWord = '';
        AppState.previewMorse += ' ';
    } else {
        // Word gap
        if (!AppState.previewMorse.endsWith(' / ') && AppState.previewMorse.length > 0) {
            AppState.previewMorse += '/ ';
        }
    }
    processModeCommit();
}

function doBackspace() {
    clearTimeout(AppState.autoSpaceTimeout);
    clearTimeout(AppState.wordSpaceTimeout);

    if (AppState.previewMorse.length > 0) {
        if (AppState.previewMorse.endsWith('/ ')) {
            AppState.previewMorse = AppState.previewMorse.slice(0, -2);
        } else if (AppState.previewMorse.endsWith(' ')) {
            AppState.previewMorse = AppState.previewMorse.slice(0, -1);
            let lastS = AppState.previewMorse.lastIndexOf(' ');
            let lastSlash = AppState.previewMorse.lastIndexOf('/ ');
            let cut = Math.max(lastS, lastSlash > -1 ? lastSlash + 1 : -1);
            AppState.currentMorseWord = AppState.previewMorse.slice(cut + 1);
        } else {
            AppState.previewMorse = AppState.previewMorse.slice(0, -1);
            AppState.currentMorseWord = AppState.currentMorseWord.slice(0, -1);
        }
        processModeCommit();
    }
    
    if (AppState.keyboardMode === 'realistic') {
        resetMode2Timers();
    }
}

function doSend() {
    if (AppState.currentMorseWord) doSpace(); // finalize letter
    
    // Trim trailing slashes or spaces
    let m = AppState.previewMorse.replace(/\s*\/\s*$/, '').trim();
    let t = AppState.previewText.trim();
    
    if (m && t) {
        dispatchChatMessage(t, m);
    }
    
    AppState.previewMorse = '';
    AppState.previewText = '';
    AppState.currentMorseWord = '';
    updateKeyboardPreview();
}

// Mode Selection
DOM.keyboardModeSelector.addEventListener('change', (e) => {
    AppState.keyboardMode = e.target.value;
    
    // Manage Focus: if we leave text mode, we must blur the hidden input 
    // or else page-level hotkeys ('O', 'P') will be blocked by the e.target check.
    DOM.nativeChatInput.blur();
    
    DOM.modes.forEach(m => m.classList.add('hidden'));
    
    if (AppState.keyboardMode === 'standard') {
        DOM.modes[0].classList.remove('hidden');
    } else if (AppState.keyboardMode === 'realistic') {
        DOM.modes[1].classList.remove('hidden');
        resetMode2Timers();
    } else if (AppState.keyboardMode === 'text') {
        DOM.modes[2].classList.remove('hidden');
        DOM.nativeChatInput.focus();
    }

    // Optional: Clear buffers on mode switch for a cleaner "fresh start" 
    // in the new keyboard logic (recommended to prevent timing sync errors)
    AppState.previewMorse = '';
    AppState.previewText = '';
    AppState.currentMorseWord = '';
    updateKeyboardPreview();
});

DOM.chatWpmSlider.addEventListener('input', (e) => {
    AppState.wpm = parseInt(e.target.value);
    DOM.wpmLabel.textContent = AppState.wpm;
    AppState.adaptiveThreshold = null; // Math constraint wipe
});

// Cheat Sheet Toggler
DOM.btnCheatSheet.addEventListener('click', () => {
    DOM.chatCheatSheet.classList.toggle('hidden');
    if (!DOM.chatCheatSheet.classList.contains('hidden')) {
        DOM.chatCheatSheet.classList.add('visible');
        renderCheatSheet();
    } else {
        DOM.chatCheatSheet.classList.remove('visible');
    }
});

function renderCheatSheet() {
    DOM.chatCheatSheet.innerHTML = '';
    const dict = AppState.getDict();
    for (const [char, code] of Object.entries(dict)) {
        const btn = document.createElement('div');
        btn.className = 'mini-cat-btn';
        btn.innerHTML = `<span class="mini-cat-char">${char}</span><span class="mini-cat-morse">${code}</span>`;
        DOM.chatCheatSheet.appendChild(btn);
    }
}

// Mode 1: Connectors
DOM.kb1Dot.addEventListener('click', () => { doInput('.'); AudioEngine.startTone(); setTimeout(() => AudioEngine.stopTone(), AudioEngine.T_ms); });
DOM.kb1Dash.addEventListener('click', () => { doInput('-'); AudioEngine.startTone(); setTimeout(() => AudioEngine.stopTone(), AudioEngine.T_ms * 3); });
DOM.kb1Space.addEventListener('click', () => { doSpace(); AudioEngine.playClick(); });
DOM.kb1Backspace.addEventListener('click', () => { doBackspace(); AudioEngine.playClick(); });
DOM.kb1Send.addEventListener('click', () => { doSend(); AudioEngine.playClick(); });

// Capture Physical keys for Send and precise timings
let realisticSpacePressed = false;

document.addEventListener('keydown', (e) => {
    // Ignore physical logic if an explicit input is being actively typed down
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        return; 
    }

    if (AppState.activeChannel === 'chat') {
        const k = e.key.toLowerCase();
        
        if (AppState.keyboardMode === 'standard') {
            if (k === 'enter') { e.preventDefault(); doSend(); }
            else if (k === 'backspace') doBackspace();
            else if (k === ' ' && !e.repeat) { e.preventDefault(); doSpace(); AudioEngine.playClick(); }
            else if (k === 'o' && !e.repeat) { 
                doInput('.'); AudioEngine.startTone(); setTimeout(() => AudioEngine.stopTone(), AudioEngine.T_ms);
            }
            else if (k === 'p' && !e.repeat) { 
                doInput('-'); AudioEngine.startTone(); setTimeout(() => AudioEngine.stopTone(), AudioEngine.T_ms * 3);
            }
        } 
        else if (AppState.keyboardMode === 'realistic') {
            if (k === 'o' && !e.repeat) {
                e.preventDefault();
                if (!realisticSpacePressed) {
                    realisticSpacePressed = true;
                    clearTimeout(AppState.autoSpaceTimeout);
                    clearTimeout(AppState.wordSpaceTimeout);
                    
                    if (DOM.kb2ProgressBar) {
                        DOM.kb2ProgressBar.style.transition = 'none';
                        DOM.kb2ProgressBar.style.width = '0%';
                    }
                    
                    DOM.kb2Tap.classList.add('active-press');
                    AudioEngine.startTone();
                    k2PressStart = performance.now();
                }
            } else if (k === 'enter') {
                e.preventDefault(); doSend();
            } else if (k === 'backspace') {
                e.preventDefault(); doBackspace();
            }
        }
    }
});

document.addEventListener('keyup', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return; 

    if (AppState.activeChannel === 'chat' && AppState.keyboardMode === 'realistic') {
        if (e.key.toLowerCase() === 'o') {
            e.preventDefault();
            if (realisticSpacePressed) {
                realisticSpacePressed = false;
                handleKb2Up();
            }
        }
    }
});

// Mode 2: Realistic Timings
function resetMode2Timers() {
    clearTimeout(AppState.autoSpaceTimeout);
    clearTimeout(AppState.wordSpaceTimeout);
    
    if (!DOM.kb2ProgressBar) return;

    // Reset visually
    DOM.kb2ProgressBar.style.transition = 'none';
    DOM.kb2ProgressBar.style.width = '0%';
    
    const T = AudioEngine.T_ms;
    
    let spaceDelay = Math.max(T * 4, 600);
    let wordDelay = Math.max(T * 8, 1200);
    
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            if (DOM.kb2ProgressBar) {
                DOM.kb2ProgressBar.style.transition = `width ${spaceDelay}ms linear`;
                DOM.kb2ProgressBar.style.width = '100%';
            }
        });
    });
    
    AppState.autoSpaceTimeout = setTimeout(() => {
        if (AppState.currentMorseWord) doSpace();
        
        if (DOM.kb2ProgressBar) {
            DOM.kb2ProgressBar.style.transition = 'none';
            DOM.kb2ProgressBar.style.width = '0%';
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (DOM.kb2ProgressBar) {
                        DOM.kb2ProgressBar.style.transition = `width ${wordDelay}ms linear`;
                        DOM.kb2ProgressBar.style.width = '100%';
                    }
                });
            });
        }
        
        AppState.wordSpaceTimeout = setTimeout(() => {
            doSpace(); // push word space
            if (DOM.kb2ProgressBar) {
                DOM.kb2ProgressBar.style.transition = 'none';
                DOM.kb2ProgressBar.style.width = '0%';
            }
        }, wordDelay);
        
    }, spaceDelay);
}

let k2PressStart = 0;
DOM.kb2Tap.addEventListener('pointerdown', () => {
    clearTimeout(AppState.autoSpaceTimeout);
    clearTimeout(AppState.wordSpaceTimeout);
    
    if (DOM.kb2ProgressBar) {
        DOM.kb2ProgressBar.style.transition = 'none';
        DOM.kb2ProgressBar.style.width = '0%';
    }
    
    DOM.kb2Tap.classList.add('active-press');
    AudioEngine.startTone();
    k2PressStart = performance.now();
});

function handleKb2Up() {
    DOM.kb2Tap.classList.remove('active-press');
    AudioEngine.stopTone();
    
    const dur = performance.now() - k2PressStart;
    const T = AudioEngine.T_ms;
    
    // Increase threshold to 300ms floor instead of 180ms to catch slower key releases as dots
    let thresh = Math.max(300, T * 2.5);
    
    if (dur < thresh) {
        doInput('.');
    } else {
        doInput('-');
    }
    
    resetMode2Timers();
}

DOM.kb2Tap.addEventListener('pointerup', handleKb2Up);
DOM.kb2Tap.addEventListener('pointerleave', () => {
    if (DOM.kb2Tap.classList.contains('active-press')) handleKb2Up();
});
DOM.kb2Backspace.addEventListener('click', () => { 
    doBackspace(); 
    AudioEngine.playClick(); 
});
DOM.kb2Send.addEventListener('click', () => {
    doSend();
    AudioEngine.playClick();
});


// Mode 3: Native Text Keyboard Reverse mapping
DOM.nativeChatInput.addEventListener('input', (e) => {
    e.preventDefault();
    const char = e.data?.toUpperCase();
    DOM.nativeChatInput.value = ''; // keep visually empty
    if (!char) return;
    
    let dict = AppState.getDict();
    let morse = dict[char];
    
    if (morse) {
        AppState.previewText += char;
        AppState.previewMorse += morse + ' ';
    } else if (char === ' ') {
        AppState.previewText += ' ';
        AppState.previewMorse += '/ ';
    }
    updateKeyboardPreview();
});

DOM.nativeChatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace') {
        doBackspace();
    } else if (e.key === 'Enter') {
        doSend();
    }
});
