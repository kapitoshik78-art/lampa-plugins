(function () {

    'use strict';

    let enabled = Lampa.Storage.get('country_filter_enabled', true);

    const asianCountries = [
        'India', 'China', 'Japan', 'South Korea', 'Thailand',
        'Hong Kong', 'Taiwan', 'Indonesia', 'Philippines',
        'Vietnam', 'Malaysia', 'Singapore', 'Pakistan', 'Bangladesh'
    ];

    function isBlocked(item) {
        if (!enabled) return false;

        let country = (item.country || item.countries || '').toString();
        let genre = (item.genre || item.genres || '').toString();
        let title = (item.title || '').toLowerCase();

        // перевірка по країнах
        for (let c of asianCountries) {
            if (country.includes(c)) return true;
        }

        // додатковий фільтр по тегах (якщо API повертає азійські маркери)
        const asianTags = ['asian', 'india', 'korea', 'japan', 'china'];
        for (let t of asianTags) {
            if (genre.toLowerCase().includes(t)) return true;
        }

        // optional: ручні ключові слова в назві
        const badKeywords = ['bollywood', 'hindi'];
        for (let k of badKeywords) {
            if (title.includes(k)) return true;
        }

        return false;
    }

    function filterItems(items) {
        if (!enabled) return items;
        if (!Array.isArray(items)) return items;

        return items.filter(item => !isBlocked(item));
    }

    // Перехоплення списків Lampa
    Lampa.Listener.follow('line', function (e) {
        if (e.type === 'append' && e.items) {
            e.items = filterItems(e.items);
        }
    });

    // UI налаштування
    Lampa.SettingsApi.addParam({
        component: 'interface',
        param: {
            name: 'country_filter_enabled',
            type: 'trigger',
            default: true
        },
        field: {
            name: 'Фільтр Індія/Азія',
            description: 'Приховує індійські та азійські фільми'
        },
        onChange: function (value) {
            enabled = value;
            Lampa.Storage.set('country_filter_enabled', value);
        }
    });

    console.log('Country Filter plugin loaded');

})();
