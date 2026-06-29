# Gigachat Spell Checker Plugin

Плагин для [Obsidian](https://obsidian.md), который проверяет и исправляет орфографию в тексте с помощью GigaChat — нейросетевой модели от Сбера.

> ⚠️ **Статус: активная разработка.** На данный момент реализован каркас плагина, интеграция с GigaChat API находится в процессе.

## Возможности

- Исправление орфографических ошибок в выделенном тексте через контекстное меню или палитру команд
- Поддержка мобильных устройств (`isDesktopOnly: false`)
- Страница настроек в Obsidian

## Команды

| Команда | ID | Где доступна |
|---|---|---|
| Исправить ошибки | `gigachat-fix-spelling-errors` | Палитра команд, контекстное меню редактора |
| Open modal (simple) | `open-modal-simple` | Палитра команд (демо) |
| Open modal (complex) | `open-modal-complex` | Палитра команд (демо, только в режиме просмотра Markdown) |

## Установка

### Вручную

1. Скачайте `main.js`, `manifest.json`, `styles.css` из [релизов](https://github.com/saintbyte/gigachat-spell-checker/releases)
2. Скопируйте файлы в `<Ваш_хранилище>/.obsidian/plugins/gigachat-spell-checker-plugin/`
3. В Obsidian перейдите в **Настройки → Community plugins**, включите плагин

### Разработка

```bash
git clone https://github.com/saintbyte/gigachat-spell-checker
cd gigachat-spell-checker
npm install
npm run dev    # разработка с автопересборкой
npm run build  # production-сборка
npm run lint   # проверка кода ESLint
```

Собранный `main.js` появится в корне проекта. Для тестирования скопируйте `main.js`, `manifest.json`, `styles.css` в `<хранилище>/.obsidian/plugins/gigachat-spell-checker-plugin/` и перезагрузите Obsidian.

## Архитектура

```
src/
├── main.ts          # Точка входа: lifecycle, команды, контекстное меню
└── settings.ts      # Интерфейс настроек, дефолты, вкладка настроек
```

Сборка: esbuild → единый `main.js` (CommonJS). Obsidian и CodeMirror — внешние зависимости, предоставляются средой.

## Технологии

- **TypeScript** (strict mode, ES2021)
- **Obsidian API** (типы `obsidian`)
- **esbuild** — сборщик
- **ESLint** с `eslint-plugin-obsidianmd` — статический анализ

## Лицензия

0-BSD — см. [LICENSE](LICENSE).
