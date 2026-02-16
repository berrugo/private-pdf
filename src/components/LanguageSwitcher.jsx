import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    // Get current language, handle cases like 'en-US' -> 'en'
    const currentLang = i18n.language?.split('-')[0] || 'en';

    const nextLang = currentLang === 'en' ? 'es' : 'en';

    return (
        <button
            className="lang-btn"
            onClick={() => changeLanguage(nextLang)}
            aria-label={currentLang === 'en' ? 'Cambiar a Español' : 'Switch to English'}
        >
            {currentLang === 'en' ? '🇺🇸 EN' : '🇪🇸 ES'}
        </button>
    );
};

export default LanguageSwitcher;
