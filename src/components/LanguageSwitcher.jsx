import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    // Get current language, handle cases like 'en-US' -> 'en'
    const currentLang = i18n.language?.split('-')[0] || 'en';

    return (
        <div className="language-switcher">
            <button
                className={`lang-btn ${currentLang === 'en' ? 'active' : ''}`}
                onClick={() => changeLanguage('en')}
                aria-label="Switch to English"
            >
                EN
            </button>
            <button
                className={`lang-btn ${currentLang === 'es' ? 'active' : ''}`}
                onClick={() => changeLanguage('es')}
                aria-label="Cambiar a Español"
            >
                ES
            </button>
        </div>
    );
};

export default LanguageSwitcher;
