(function () {

    'use strict';

    console.log('Country filter (always ON) loaded');

    const blockedCountries = [
        'india', 'indian',
        'china', 'chinese',
        'japan', 'japanese',
        'south korea', 'korea', 'korean',
        'thailand',
        'hong kong',
        'taiwan',
        'indonesia',
        'philippines',
        'vietnam',
        'malaysia',
        'singapore',
        'pakistan',
        'bangladesh'
    ];

    function normalize(text) {
        if (!text) return '';
        return text.toString().toLowerCase();
    }

    function isBlocked(item) {

        if (!item) return false;

        let country = normalize(item.country || item.countries || item.origin || item.origins);
        let genre = normalize(item.genre || item.genres || '');
        let title = normalize(item.title || item.name || '');

        // 1. перевірка по країні / походженню
        for (let c of blockedCountries) {
            if (country.includes(c)) return true;
        }

        // 2. деякі API кладуть країну в текст жанру/тегів
        for (let c of blockedCountries) {
            if (genre.includes(c)) return true;
        }

        // 3. додаткові ключові слова
        if (title.includes('bollywood')) return true;
        if (title.includes('hindi')) return true;

        return false;
    }

    function filterList(list) {
        if (!Array.isArray(list)) return list;
        return list.filter(item => !isBlocked(item));
    }

    // Основний перехоплювач списків Lampa
    Lampa.Listener.follow('line', function (e) {

        if (!e || !e.items) return;

        if (e.type === 'append' || e.type === 'more') {
            e.items = filterList(e.items);
        }

    });

    // Додатковий фільтр для деяких оновлень UI
    Lampa.Listener.follow('content', function (e) {
        if (e && e.data && e.data.items) {
            e.data.items = filterList(e.data.items);
        }
    });

})();
