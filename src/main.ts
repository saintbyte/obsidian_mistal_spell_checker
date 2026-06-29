import {
	Editor,
	MarkdownView,
	MarkdownFileInfo,
	Menu,
	Modal,
	Notice,
	Plugin,
} from 'obsidian';
import {
	DEFAULT_SETTINGS,
	MistralSpellCheckerPluginSettings,
	MistralSettingTab,
} from './settings';
import { fixSpelling, formatError } from './mistral';
import { t, setLocale } from './i18n';

export default class MistralSpellCheckerPlugin extends Plugin {
	settings!: MistralSpellCheckerPluginSettings;

	async onload() {
		await this.loadSettings();
		setLocale(this.settings.locale);

		this.addCommand({
			id: 'open-modal-simple',
			name: t('command-open-modal-simple'),
			callback: () => {
				new MistralSpellCheckModal(this.app).open();
			},
		});

		const fixErrors = async (
			editor: Editor,
			_ctx: MarkdownView | MarkdownFileInfo,
		) => {
			const selected = editor.getSelection();
			if (!selected) {
				new Notice(t('notice-no-text-selected'));
				return;
			}
			if (!this.settings.apiKey) {
				new Notice(t('notice-no-api-key'));
				return;
			}
			try {
				const fixed = await fixSpelling(
					selected,
					this.settings.apiKey,
					this.settings.model,
					this.settings.systemPrompt,
				);
				editor.replaceSelection(fixed);
				new Notice(t('notice-spelling-fixed'));
			} catch (e) {
				new Notice(formatError(e));
			}
		};

		this.addCommand({
			id: 'mistral-fix-spelling-errors',
			name: t('command-fix-spelling'),
			editorCallback: fixErrors,
		});

		this.registerEvent(
			this.app.workspace.on(
				'editor-menu',
				(
					menu: Menu,
					editor: Editor,
					ctx: MarkdownView | MarkdownFileInfo,
				) => {
					if (editor.getSelection()) {
						menu.addItem((item) =>
							item
								.setTitle(t('context-menu-fix-spelling'))
								.setIcon('spellcheck')
								.onClick(() => fixErrors(editor, ctx)),
						);
					}
				},
			),
		);

		this.addCommand({
			id: 'open-modal-complex',
			name: t('command-open-modal-complex'),
			checkCallback: (checking: boolean) => {
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					if (!checking) {
						new MistralSpellCheckModal(this.app).open();
					}
					return true;
				}
				return false;
			},
		});

		this.addSettingTab(new MistralSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		const saved = (await this.loadData()) as Partial<MistralSpellCheckerPluginSettings>;
		this.settings = Object.assign({}, DEFAULT_SETTINGS, saved);
		setLocale(this.settings.locale);
		if (!this.settings.systemPrompt) {
			this.settings.systemPrompt = t('default-system-prompt');
		}
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class MistralSpellCheckModal extends Modal {
	onOpen() {
		const { contentEl } = this;
		contentEl.setText(t('modal-title'));
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
