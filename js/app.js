// ── SERVICE WORKER CLEANUP ──
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (regs) {
        regs.forEach(function (r) { r.unregister(); });
    });
}

// ── BURGER ──
window.toggleBurger = function () {
    document.getElementById('burger').classList.toggle('active');
    document.getElementById('mobile-nav').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('active');
};
window.closeBurger = function () {
    document.getElementById('burger').classList.remove('active');
    document.getElementById('mobile-nav').classList.remove('open');
    document.getElementById('overlay').classList.remove('active');
};

// ── CART ──
var cart = [];

window.buy = function (n, p) {
    cart.push({ n: n, p: p });
    updateCart();
    toast(n + ' \u2014 added');
};

window.toggleCart = function () {
    closeBurger();
    document.getElementById('side-cart').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('active');
};

window.toggleAuth = function () {
    closeBurger();
    document.getElementById('auth-modal').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('active');
};

window.toggleSpecs = function () {
    closeBurger();
    document.getElementById('spec-modal').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('active');
};

window.toggleNight = function () {
    document.body.classList.toggle('night-mode');
};

window.closeAll = function () {
    closeBurger();
    ['side-cart', 'auth-modal', 'spec-modal'].forEach(function (id) {
        document.getElementById(id).classList.remove('open');
    });
    document.getElementById('overlay').classList.remove('active');
};

window.login = function () {
    var email = document.getElementById('login-field').value.trim();
    if (!email) { toast('Enter email'); return; }
    var name = email.indexOf('stepan') !== -1 ? 'Evsin Stepan' : email.split('@')[0];
    document.getElementById('id-label').innerText = name;
    document.getElementById('club-lock').classList.add('unlocked');
    var inner = document.getElementById('club-inner');
    inner.style.opacity = '1';
    inner.style.filter = 'blur(0)';
    toast('Welcome, ' + name);
    toggleAuth();
};

function updateCart() {
    var total = cart.reduce(function (s, i) { return s + i.p; }, 0);
    document.getElementById('cart-q').innerText = cart.length;
    document.getElementById('cart-total').innerText = total.toLocaleString() + ' \u20BD';
    var list = document.getElementById('cart-list');
    if (cart.length === 0) {
        list.innerHTML = '<p style="opacity:0.3; font-size:12px; text-align:center; margin-top:100px;">Empty</p>';
    } else {
        list.innerHTML = cart.map(function (i, idx) {
            return '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; font-size:12px; padding:10px; border:1px solid var(--border); border-radius:10px;"><span>' + i.n + '</span><span style="display:flex; align-items:center; gap:10px;">' + i.p.toLocaleString() + ' \u20BD <span style="cursor:pointer; opacity:0.3; font-size:14px;" onclick="removeItem(' + idx + ')">&times;</span></span></div>';
        }).join('');
    }
}

window.removeItem = function (idx) {
    cart.splice(idx, 1);
    updateCart();
    toast('Removed');
};

window.checkout = function () {
    if (cart.length === 0) { toast('Bag is empty'); return; }
    toast('Order placed. Confirmation sent.');
    cart = [];
    updateCart();
    toggleCart();
};

window.toast = function (m) {
    var t = document.getElementById('toast');
    t.innerText = m;
    t.classList.add('show');
    clearTimeout(t._timeout);
    t._timeout = setTimeout(function () { t.classList.remove('show'); }, 2500);
};

window.selectSize = function (el) {
    var btns = el.parentElement.querySelectorAll('.size-btn');
    for (var i = 0; i < btns.length; i++) btns[i].classList.remove('active');
    el.classList.add('active');
};

// ── ENZO ──
var isMax = false;

window.enzoLog = function (msg, type) {
    var feed = document.getElementById('enzo-feed');
    if (!feed) return;
    type = type || '';
    var div = document.createElement('div');
    div.className = 'enzo-msg' + (type ? ' ' + type : '');
    div.innerHTML = '<div class="enzo-msg-text">' + msg + '</div>';
    feed.appendChild(div);
    feed.scrollTop = feed.scrollHeight;
    return div;
};

window.loadMax = function () {
    if (isMax) { enzoLog('\u041f\u0440\u043e\u0442\u043e\u0442\u0438\u043f \u0443\u0436\u0435 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043d.'); return; }

    var img = document.getElementById('v-port');
    img.style.opacity = '0.15';

    // ── 7-8 sec loading sequence ──
    var seq = [
        { t: 0,    m: '\u0410\u043d\u0430\u043b\u0438\u0437\u0438\u0440\u0443\u044e \u043f\u0430\u043b\u0438\u0442\u0440\u0443...', type: 'processing' },
        { t: 1400, m: '\u041f\u043e\u0434\u0431\u0438\u0440\u0430\u044e \u043e\u0442\u0442\u0435\u043d\u043a\u0438 \u0438 \u043a\u043e\u043d\u0442\u0440\u0430\u0441\u0442...', type: 'processing' },
        { t: 2800, m: '\u041a\u0430\u043b\u0438\u0431\u0440\u0443\u044e \u0441\u0432\u0435\u0442\u043e\u0432\u0443\u044e \u0442\u0435\u043c\u043f\u0435\u0440\u0430\u0442\u0443\u0440\u0443...', type: 'processing' },
        { t: 4200, m: '\u0420\u0435\u043d\u0434\u0435\u0440\u044e \u0441\u0438\u043b\u0443\u044d\u0442 \u0438 \u043f\u0440\u043e\u043f\u043e\u0440\u0446\u0438\u0438...', type: 'processing' },
        { t: 5600, m: '\u041e\u043f\u0442\u0438\u043c\u0438\u0437\u0438\u0440\u0443\u044e \u0442\u0435\u043a\u0441\u0442\u0443\u0440\u044b...', type: 'processing' },
    ];

    seq.forEach(function (s) {
        setTimeout(function () {
            enzoLog(s.m, s.type);
        }, s.t);
    });

    setTimeout(function () {
        img.src = 'max1.jpeg';
        img.style.opacity = '0.9';
        isMax = true;
        enzoLog('\u041f\u0440\u043e\u0442\u043e\u0442\u0438\u043f \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043d. \u0413\u043e\u0442\u043e\u0432 \u043a \u0441\u043a\u0430\u043d\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044e.', 'done');
        toast('Photo Loaded');
    }, 7000);
};

window.changeLight = function (mode) {
    if (!isMax) { toast('\u0421\u043d\u0430\u0447\u0430\u043b\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u0435 \u0444\u043e\u0442\u043e'); return; }
    var l = document.getElementById('ai-loader');
    var img = document.getElementById('v-port');
    l.style.display = 'block';
    img.style.opacity = '0.2';
    var label = mode === 'night' ? '\u043d\u043e\u0447\u043d\u043e\u043c' : '\u0434\u043d\u0435\u0432\u043d\u043e\u043c';
    enzoLog('\u0421\u043a\u0430\u043d\u0438\u0440\u0443\u044e \u0432 ' + label + ' \u0441\u043f\u0435\u043a\u0442\u0440\u0435...', 'processing');
    setTimeout(function () {
        img.src = (mode === 'night') ? 'max2.jpeg' : 'max1.jpeg';
        img.style.opacity = '0.9';
        l.style.display = 'none';
        enzoLog('\u0421\u043a\u0430\u043d\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u043e.', 'done');
    }, 2500);
};

window.enzoDeepAnalysis = function () {
    enzoLog('\u0417\u0430\u043f\u0443\u0441\u043a Deep AI \u0430\u043d\u0430\u043b\u0438\u0437\u0430...', 'processing');
    var weatherEl = document.getElementById('w-temp');
    var tempText = weatherEl ? weatherEl.innerText : '\u043d\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043d\u043e';
    var cartItems = cart.map(function (i) { return i.n; }).join(', ') || '\u043d\u0438\u0447\u0435\u0433\u043e';

    var prompt = '<s>[INST] \u0422\u044b \u2014 ENZO, \u0418\u0418-\u0441\u0442\u0438\u043b\u0438\u0441\u0442 Palermo Studio (\u0419\u043e\u0448\u043a\u0430\u0440-\u041e\u043b\u0430). \u0422\u0435\u043c\u043f\u0435\u0440\u0430\u0442\u0443\u0440\u0430: ' + tempText + '. \u0412 \u043a\u043e\u0440\u0437\u0438\u043d\u0435: ' + cartItems + '. \u0414\u0430\u0439 \u043a\u043e\u0440\u043e\u0442\u043a\u0438\u0439 (2-3 \u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u044f) \u0441\u0442\u0438\u043b\u044c\u043d\u044b\u0439 \u0441\u043e\u0432\u0435\u0442 \u043f\u043e \u044d\u043a\u0438\u043f\u0438\u0440\u043e\u0432\u043a\u0435 \u0434\u043b\u044f \u043c\u043e\u0442\u043e\u0446\u0438\u043a\u043b\u0438\u0441\u0442\u0430. \u0420\u0443\u0441\u0441\u043a\u0438\u0439, \u0443\u0432\u0435\u0440\u0435\u043d\u043d\u043e, \u0431\u0435\u0437 \u043c\u0430\u0440\u043a\u0434\u0430\u0443\u043d\u0430. [/INST]';

    var HF_TOKEN = localStorage.getItem('hf_token') || '';
    if (HF_TOKEN) {
        enzoLog('\u0417\u0430\u043f\u0440\u043e\u0441 \u043a HuggingFace API...', 'processing');
        fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + HF_TOKEN, 'Content-Type': 'application/json' },
            body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 150, temperature: 0.8 } })
        })
        .then(function (r) { return r.json(); })
        .then(function (data) {
            if (data.error) throw new Error(typeof data.error === 'string' ? data.error : data.error.message || 'API error');
            var text = Array.isArray(data) ? (data[0] && data[0].generated_text) || '' : data.generated_text || '';
            var idx = text.lastIndexOf('[/INST]');
            if (idx !== -1) text = text.slice(idx + 7).trim();
            enzoLog(text, 'done');
        })
        .catch(function () { localFallback(); });
    } else {
        localFallback();
    }

    function localFallback() {
        enzoLog('\u26a0\ufe0f \u041b\u043e\u043a\u0430\u043b\u044c\u043d\u044b\u0439 \u0430\u043d\u0430\u043b\u0438\u0437:', 'processing');
        var temp = parseInt(tempText);
        var advice = !isNaN(temp)
            ? (temp < 0 ? '\u041c\u043e\u0440\u043e\u0437 \u2014 Aero Jacket + Electric Cyan.' : temp < 10 ? '\u041f\u0440\u043e\u0445\u043b\u0430\u0434\u043d\u043e \u2014 Armor v1 + Glovo Gloves.' : temp < 20 ? '\u041a\u043e\u043c\u0444\u043e\u0440\u0442 \u2014 Studio Shirt + Leather Bag.' : '\u0422\u0435\u043f\u043b\u043e \u2014 \u043e\u0431\u043b\u0435\u0433\u0447\u0451\u043d\u043d\u044b\u0439 \u043a\u043e\u043c\u043f\u043b\u0435\u043a\u0442.')
            : 'Armor v2 \u2014 \u0443\u043d\u0438\u0432\u0435\u0440\u0441\u0430\u043b\u044c\u043d\u043e\u0435 \u0440\u0435\u0448\u0435\u043d\u0438\u0435.';
        setTimeout(function () { enzoLog(advice, 'done'); }, 1200);
    }
};

// ── LOOK BUILDER ──
var sItems = [];

window.sel = function (name, el) {
    el.classList.toggle('selected');
    var idx = sItems.indexOf(name);
    if (idx !== -1) {
        sItems.splice(idx, 1);
    } else {
        sItems.push(name);
    }
    var msg = document.getElementById('l-msg');
    var total = document.getElementById('l-total');
    if (sItems.length > 0) {
        msg.innerHTML = '<b>ENZO:</b> \u0410\u043d\u0430\u043b\u0438\u0437 \u0441\u043e\u0447\u0435\u0442\u0430\u043d\u0438\u044f...';
        msg.style.opacity = '1';
        total.style.display = 'block';
        var sum = sItems.reduce(function (acc, i) {
            var digits = i.match(/\d+/g);
            return acc + parseInt(digits[digits.length - 1]);
        }, 0);
        total.innerText = '\u2248 ' + sum.toLocaleString() + ' \u20BD';
    } else {
        msg.innerHTML = '\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u044d\u043b\u0435\u043c\u0435\u043d\u0442\u044b...';
        msg.style.opacity = '0.5';
        total.style.display = 'none';
    }
};

// ── WEATHER VIDEO ──
function setWeatherVideo(label, localtime) {
    var video = document.getElementById('weather-video');
    if (!video) return;
    var hour = localtime ? parseInt(localtime.split(' ')[1].split(':')[0]) : new Date().getUTCHours() + 3;
    var src;
    if (hour >= 21 || hour < 6) {
        src = 'moon.mp4';
    } else {
        var l = label.toLowerCase();
        if (l.indexOf('\u044f\u0441\u043d\u043e') !== -1 || l.indexOf('\u0441\u043e\u043b\u043d\u0435\u0447\u043d\u043e') !== -1 || l.indexOf('sunny') !== -1 || l.indexOf('clear') !== -1) {
            src = 'fun-sun.mp4';
        } else if (l.indexOf('\u0434\u043e\u0436\u0434') !== -1 || l.indexOf('\u043b\u0438\u0432\u0435\u043d\u044c') !== -1 || l.indexOf('\u0433\u0440\u043e\u0437') !== -1 || l.indexOf('rain') !== -1 || l.indexOf('drizzle') !== -1 || l.indexOf('storm') !== -1) {
            src = 'rain.mp4';
        } else {
            src = 'sun.mp4';
        }
    }
    if (video.dataset.src !== src) {
        video.dataset.src = src;
        video.style.opacity = '0';
        setTimeout(function () {
            video.src = src;
            video.play().catch(function () {});
            video.style.opacity = '1';
        }, 400);
    }
}

// ── WEATHER API ──
function fetchWeather() {
    var WAPI_KEY = '0426384116734bb4a94183926263007';
    fetch('https://api.weatherapi.com/v1/current.json?key=' + WAPI_KEY + '&q=Yoshkar-Ola&lang=ru&aqi=no')
        .then(function (r) { return r.json(); })
        .then(function (data) {
            if (data.error) throw new Error(data.error.message);
            var c = data.current;
            var temp = Math.round(c.temp_c);
            var feels = Math.round(c.feelslike_c);
            var humidity = c.humidity;
            var wind = Math.round(c.wind_kph / 3.6);
            var label = c.condition.text;
            document.getElementById('w-temp').innerHTML = (temp > 0 ? '+' : '') + temp + '\u00b0C';
            document.getElementById('w-details').innerHTML = label + ' \u00b7 \u041e\u0449\u0443\u0449\u0430\u0435\u0442\u0441\u044f ' + (feels > 0 ? '+' : '') + feels + '\u00b0C \u00b7 \u0412\u043b\u0430\u0436\u043d\u043e\u0441\u0442\u044c ' + humidity + '% \u00b7 \u0412\u0435\u0442\u0435\u0440 ' + wind + ' \u043c/\u0441';
            var advice = '';
            if (temp <= -10) advice = '\u042d\u043a\u0441\u0442\u0440\u0435\u043c\u0430\u043b\u044c\u043d\u044b\u0439 \u0445\u043e\u043b\u043e\u0434. Aero Jacket + Armor v2.';
            else if (temp <= 0) advice = '\u041c\u043e\u0440\u043e\u0437\u043d\u043e. Aero Jacket + Glovo Gloves.';
            else if (temp <= 10) advice = '\u041f\u0440\u043e\u0445\u043b\u0430\u0434\u043d\u043e. Armor v1.';
            else if (temp <= 20) advice = '\u041a\u043e\u043c\u0444\u043e\u0440\u0442. Studio Shirt + Leather Bag.';
            else if (temp <= 30) advice = '\u0422\u0435\u043f\u043b\u043e. \u041e\u0431\u043b\u0435\u0433\u0447\u0451\u043d\u043d\u044b\u0439 \u0441\u0438\u043b\u0443\u044d\u0442.';
            else advice = '\u0416\u0430\u0440\u043a\u043e. \u041c\u0438\u043d\u0438\u043c\u0443\u043c \u0441\u043b\u043e\u0451\u0432.';
            if (label.toLowerCase().indexOf('\u0434\u043e\u0436\u0434') !== -1 || label.toLowerCase().indexOf('\u043b\u0438\u0432\u0435\u043d\u044c') !== -1) advice += ' \u041e\u0441\u0430\u0434\u043a\u0438 \u2014 \u0432\u043e\u0434\u043e\u043e\u0442\u0442\u0430\u043b\u043a\u0438\u0432\u0430\u044e\u0449\u0430\u044f \u043f\u0440\u043e\u043f\u0438\u0442\u043a\u0430.';
            if (wind >= 10) advice += ' \u0412\u0435\u0442\u0435\u0440 \u2014 \u0430\u044d\u0440\u043e\u0434\u0438\u043d\u0430\u043c\u0438\u043a\u0430 \u043a\u0440\u0438\u0442\u0438\u0447\u043d\u0430.';
            document.getElementById('w-advice').innerHTML = '<b>ENZO:</b> ' + advice;
            enzoLog(label + ', ' + temp + '\u00b0C (\u043e\u0449\u0443\u0449\u0430\u0435\u0442\u0441\u044f ' + feels + '\u00b0C), \u0432\u0435\u0442\u0435\u0440 ' + wind + ' \u043c/\u0441.', 'done');
            setWeatherVideo(label, data.location.localtime);
        })
        .catch(function () {
            document.getElementById('w-details').innerText = 'WeatherAPI \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u0435\u043d.';
            document.getElementById('w-advice').innerHTML = '<b>ENZO:</b> \u0421\u0435\u043d\u0441\u043e\u0440\u044b \u043e\u0442\u043a\u043b\u044e\u0447\u0435\u043d\u044b.';
        });
}

// ── CUSTOM DOT MAP ──
function initMap() {
    var mapEl = document.getElementById('russia-map');
    if (!mapEl) return;
    var isNight = document.body.classList.contains('night-mode');

    var map = L.map('russia-map', {
        zoomControl: false,
        scrollWheelZoom: true,
        attributionControl: false,
        dragging: true,
        doubleClickZoom: false
    }).setView([56.5, 52], 4);

    L.tileLayer(isNight
        ? 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
        maxZoom: 10,
        minZoom: 3
    }).addTo(map);

    var cities = [
        { name: 'Москва', lat: 55.75, lng: 37.62, region: 'center' },
        { name: 'Санкт-Петербург', lat: 59.93, lng: 30.34, region: 'nw' },
        { name: 'Нижний Новгород', lat: 56.33, lng: 44.00, region: 'volga' },
        { name: 'Казань', lat: 55.79, lng: 49.12, region: 'volga' },
        { name: 'Самара', lat: 53.20, lng: 50.15, region: 'volga' },
        { name: 'Воронеж', lat: 51.67, lng: 39.18, region: 'south' },
        { name: 'Ростов-на-Дону', lat: 47.23, lng: 39.72, region: 'south' },
        { name: 'Краснодар', lat: 45.04, lng: 38.98, region: 'south' },
        { name: 'Волгоград', lat: 48.71, lng: 44.51, region: 'south' },
        { name: 'Уфа', lat: 54.74, lng: 55.97, region: 'ural' },
        { name: 'Пермь', lat: 58.01, lng: 56.25, region: 'ural' },
        { name: 'Челябинск', lat: 55.16, lng: 61.44, region: 'ural' },
        { name: 'Йошкар-Ола', lat: 56.63, lng: 47.89, region: 'hq' },
        { name: 'Тула', lat: 54.20, lng: 37.62, region: 'center' },
        { name: 'Ярославль', lat: 57.63, lng: 39.87, region: 'center' },
        { name: 'Рязань', lat: 54.63, lng: 39.69, region: 'center' },
        { name: 'Тверь', lat: 56.86, lng: 35.92, region: 'center' },
        { name: 'Калуга', lat: 54.53, lng: 36.28, region: 'center' },
        { name: 'Владимир', lat: 56.14, lng: 40.40, region: 'center' },
        { name: 'Сочи', lat: 43.59, lng: 39.73, region: 'south' },
        { name: 'Palermo, Italia', lat: 38.12, lng: 13.36, region: 'italy' },
        { name: 'Catania, Italia', lat: 37.50, lng: 15.09, region: 'italy' },
    ];

    cities.forEach(function (c) {
        var isHQ = c.region === 'hq';
        var isItaly = c.region === 'italy';
        var size = isHQ ? 14 : isItaly ? 9 : 10;
        var color = isHQ ? 'var(--electric-cyan)' : isItaly ? 'var(--beige)' : 'var(--text)';
        var shadow = isHQ ? '0 0 16px var(--electric-cyan), 0 0 32px rgba(0,242,255,0.3)' : '0 0 6px rgba(0,0,0,0.2)';
        var html = '<div style="width:' + size + 'px;height:' + size + 'px;background:' + color + ';border-radius:50%;box-shadow:' + shadow + ';transition:transform 0.3s;"></div>';

        var icon = L.divIcon({
            className: 'pdot',
            html: html,
            iconSize: [size, size],
            iconAnchor: [size/2, size/2]
        });

        var marker = L.marker([c.lat, c.lng], { icon: icon }).addTo(map);
        if (!isItaly) {
            marker.bindTooltip(c.name, {
                permanent: false,
                direction: 'top',
                offset: [0, -size],
                className: 'pdot-label',
                opacity: 0.9
            });
        }
    });
}

// Reload map on theme change
var _origToggleNight = window.toggleNight;
window.toggleNight = function () {
    _origToggleNight();
    setTimeout(function () {
        var mapEl = document.getElementById('russia-map');
        if (mapEl && mapEl._leaflet_id) {
            mapEl._leaflet_map.remove();
            delete mapEl._leaflet_id;
            delete mapEl._leaflet_map;
        }
        initMap();
    }, 100);
};

// ── INIT ──
var savedToken = localStorage.getItem('hf_token');
if (savedToken) {
    var tokInput = document.getElementById('hf-token-input');
    if (tokInput) tokInput.value = savedToken;
}
setTimeout(function () {
    enzoLog('\u0421\u0435\u043d\u0441\u043e\u0440\u044b \u0430\u043a\u0442\u0438\u0432\u043d\u044b. WeatherAPI.com.', 'done');
    if (savedToken) enzoLog('\u0422\u043e\u043a\u0435\u043d HuggingFace \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043d. Deep AI \u0434\u043e\u0441\u0442\u0443\u043f\u0435\u043d.', 'done');
}, 400);

fetchWeather();
initMap();
loadDummyProducts();

// ── DUMMYJSON PRODUCTS ──
function loadDummyProducts() {
    var catUrl = 'https://dummyjson.com/products/category/';
    var cats = ['mens-shirts', 'mens-shoes', 'womens-dresses', 'womens-bags', 'sunglasses', 'motorcycle'];
    var all = [];
    var done = 0;

    cats.forEach(function (cat) {
        fetch(catUrl + cat)
            .then(function (r) { return r.json(); })
            .then(function (data) {
                var items = (data.products || []).slice(0, 2);
                items.forEach(function (p) { p._cat = cat; });
                all = all.concat(items);
                done++;
                if (done === cats.length) renderDummy(all.slice(0, 9));
            })
            .catch(function () {
                done++;
                if (done === cats.length) renderDummy(all.slice(0, 9));
            });
    });
}

function renderDummy(products) {
    var container = document.getElementById('dummy-catalog');
    if (!container) return;
    if (products.length === 0) {
        container.innerHTML = '<p style="grid-column:1/-1; text-align:center; opacity:0.3;">Нет товаров</p>';
        return;
    }
    container.innerHTML = products.map(function (p) {
        var price = Math.round(p.price * 100);
        var desc = p.description || '';
        if (desc.length > 100) desc = desc.slice(0, 97) + '...';
        return '<div class="card">' +
            '<div class="img-wrap"><img src="' + p.thumbnail + '" class="gear-img" alt="' + p.title + '" loading="lazy" decoding="async"></div>' +
            '<div class="card-body">' +
            '<div class="price-tag">' + p.title + '</div>' +
            '<p style="font-size:9px; opacity:0.35; line-height:1.4; margin-bottom:8px; padding:0 5px;">' + desc + '</p>' +
            '<div class="price-tag" style="margin:0 0 10px;">' + price.toLocaleString() + ' ₽</div>' +
            '</div>' +
            '<div class="card-actions"><button class="btn-lux" onclick="buy(\'' + p.title.replace(/'/g, "\\'") + '\', ' + price + ')">Add to bag</button></div>' +
            '</div>';
    }).join('');
}

// Scroll reveal
var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(function (el) { observer.observe(el); });

// Auto-colorize grayscale images on scroll
var colorObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add('colored');
    });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.f-img-box img, .fob-showcase img, .partner-img-box img').forEach(function (el) {
    colorObserver.observe(el);
});

document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });
window.onload = function () { window.scrollTo(0, 0); };
