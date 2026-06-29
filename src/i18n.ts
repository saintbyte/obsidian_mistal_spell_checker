export type Locale = 'ru' | 'en';

export type TranslationKey =
	| 'command-open-modal-simple'
	| 'command-open-modal-complex'
	| 'command-fix-spelling'
	| 'notice-no-text-selected'
	| 'notice-no-api-key'
	| 'notice-spelling-fixed'
	| 'setting-api-key-name'
	| 'setting-api-key-desc'
	| 'setting-api-key-placeholder'
	| 'setting-api-key-verify-btn'
	| 'notice-enter-api-key'
	| 'btn-checking'
	| 'notice-key-valid'
	| 'btn-verified'
	| 'notice-key-invalid'
	| 'loading-models'
	| 'failed-to-load-models'
	| 'setting-model-name'
	| 'setting-model-desc'
	| 'no-models-available'
	| 'setting-prompt-name'
	| 'setting-prompt-desc'
	| 'setting-prompt-placeholder'
	| 'default-system-prompt'
	| 'context-menu-fix-spelling'
	| 'modal-title'
	| 'setting-locale-name'
	| 'setting-locale-desc'
	| 'locale-ru'
	| 'locale-en'
	| 'setting-tab-name';

const en: Record<TranslationKey, string> = {
	'command-open-modal-simple': 'Open modal (simple)',
	'command-open-modal-complex': 'Open modal (complex)',
	'command-fix-spelling': 'Fix spelling',
	'notice-no-text-selected': 'No text selected',
	'notice-no-api-key': 'API key not configured',
	'notice-spelling-fixed': 'Spelling corrected',
	'setting-api-key-name': 'API Key',
	'setting-api-key-desc': 'API key for Mistral AI access',
	'setting-api-key-placeholder': 'Enter API key...',
	'setting-api-key-verify-btn': 'Verify',
	'notice-enter-api-key': 'Enter an API key',
	'btn-checking': 'Checking...',
	'notice-key-valid': 'Key is valid',
	'btn-verified': 'Verified',
	'notice-key-invalid': 'Key is invalid',
	'loading-models': 'Loading model list...',
	'failed-to-load-models': 'Failed to load model list',
	'setting-model-name': 'Model',
	'setting-model-desc': 'Mistral AI model for spell checking',
	'no-models-available': 'No models available',
	'setting-prompt-name': 'System prompt',
	'setting-prompt-desc': 'Instruction for the model (defines behavior)',
	'setting-prompt-placeholder': 'Enter system prompt...',
	'default-system-prompt': 'You are a spelling and grammar checking assistant. Fix only spelling and grammar errors. Do not change text style, formatting, or structure. Return only the corrected text without explanations, comments, or extra words.',
	'context-menu-fix-spelling': 'Fix spelling',
	'modal-title': 'Spell Checker',
	'setting-locale-name': 'Language',
	'setting-locale-desc': 'Interface language',
	'locale-ru': 'Русский',
	'locale-en': 'English',
	'setting-tab-name': 'Spell Checker',
};

const ru: Record<TranslationKey, string> = {
	'command-open-modal-simple': 'Открыть модальное окно (простое)',
	'command-open-modal-complex': 'Открыть модальное окно (сложное)',
	'command-fix-spelling': 'Исправить ошибки',
	'notice-no-text-selected': 'Нет выделенного текста',
	'notice-no-api-key': 'Не настроен ключ авторизации',
	'notice-spelling-fixed': 'Орфография исправлена',
	'setting-api-key-name': 'Ключ авторизации',
	'setting-api-key-desc': 'API-ключ для доступа к Mistral AI',
	'setting-api-key-placeholder': 'Введите ключ...',
	'setting-api-key-verify-btn': 'Проверить',
	'notice-enter-api-key': 'Введите ключ авторизации',
	'btn-checking': 'Проверка...',
	'notice-key-valid': 'Ключ действителен',
	'btn-verified': 'Проверено',
	'notice-key-invalid': 'Ключ недействителен',
	'loading-models': 'Загрузка списка моделей...',
	'failed-to-load-models': 'Не удалось загрузить список моделей',
	'setting-model-name': 'Модель',
	'setting-model-desc': 'Модель Mistral AI для проверки',
	'no-models-available': 'Нет доступных моделей',
	'setting-prompt-name': 'Системный промпт',
	'setting-prompt-desc': 'Инструкция для модели (определяет поведение)',
	'setting-prompt-placeholder': 'Введите системный промпт...',
	'default-system-prompt': 'Ты — помощник для проверки орфографии и грамматики. Исправляй только орфографические и грамматические ошибки. Не меняй стиль текста, форматирование и структуру. Возвращай только исправленный текст без объяснений, комментариев и лишних слов.',
	'context-menu-fix-spelling': 'Исправить ошибки',
	'modal-title': 'Spell Checker',
	'setting-locale-name': 'Язык',
	'setting-locale-desc': 'Язык интерфейса',
	'locale-ru': 'Русский',
	'locale-en': 'English',
	'setting-tab-name': 'Spell Checker',
};

const locales: Record<Locale, Record<TranslationKey, string>> = { ru, en };

let currentLocale: Locale = 'ru';

export function setLocale(locale: Locale) {
	currentLocale = locale;
}

export function getLocale(): Locale {
	return currentLocale;
}

export function t(key: TranslationKey): string {
	return locales[currentLocale][key];
}
