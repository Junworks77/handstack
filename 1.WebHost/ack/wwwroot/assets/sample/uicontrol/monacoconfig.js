if (window.require) {
    require.config({
        paths: { 'vs': '/scripts/externallibrary/lib/vs' },
        'vs/nls': {
            availableLanguages: {
                '*': 'ko'
            }
        }
    });
}
else {
    window.require = {
        paths: { 'vs': '/scripts/externallibrary/lib/vs' },
        'vs/nls': {
            availableLanguages: {
                '*': 'ko'
            }
        }
    };
}