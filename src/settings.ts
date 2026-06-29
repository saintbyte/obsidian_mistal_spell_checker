import { App, Notice, PluginSettingTab, Setting } from 'obsidian';
import MistralSpellCheckerPlugin from './main';
import { verifyApiKey, formatError, listModels } from './mistral';
import { type Locale, t, setLocale } from './i18n';

export interface MistralSpellCheckerPluginSettings {
	apiKey: string;
	model: string;
	systemPrompt: string;
	locale: Locale;
}

export const DEFAULT_SETTINGS: MistralSpellCheckerPluginSettings = {
	apiKey: '',
	model: '',
	systemPrompt: '',
	locale: 'ru',
};

export class MistralSettingTab extends PluginSettingTab {
	plugin: MistralSpellCheckerPlugin;
	private extraSettingsEl?: HTMLDivElement;

	constructor(app: App, plugin: MistralSpellCheckerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName(t('setting-locale-name'))
			.setDesc(t('setting-locale-desc'))
			.addDropdown((dropdown) => {
				dropdown
					.addOption('ru', t('locale-ru'))
					.addOption('en', t('locale-en'))
					.setValue(this.plugin.settings.locale)
					.onChange(async (value) => {
						const newLocale = value as Locale;
						this.plugin.settings.locale = newLocale;
						setLocale(newLocale);
						if (!this.plugin.settings.systemPrompt) {
							this.plugin.settings.systemPrompt = t('default-system-prompt');
						}
						await this.plugin.saveSettings();
						this.display();
					});
			});

		new Setting(containerEl)
			.setName(t('setting-api-key-name'))
			.setDesc(t('setting-api-key-desc'))
			.addText((text) => {
				text
					.setPlaceholder(t('setting-api-key-placeholder'))
					.setValue(this.plugin.settings.apiKey)
					.onChange(async (value) => {
						this.plugin.settings.apiKey = value;
						await this.plugin.saveSettings();
						this.hideExtraSettings();
					});
				text.inputEl.type = 'text';
			})
			.addButton((button) => {
				const btn = button
					.setButtonText(t('setting-api-key-verify-btn'))
					.onClick(async () => {
						const key = this.plugin.settings.apiKey;
						if (!key) {
							new Notice(t('notice-enter-api-key'));
							return;
						}
						btn.setButtonText(t('btn-checking'));
						try {
							const valid = await verifyApiKey(key);
							if (valid) {
								new Notice(t('notice-key-valid'));
								btn.setButtonText(t('btn-verified'));
								await this.showExtraSettings(containerEl);
							} else {
								new Notice(t('notice-key-invalid'));
								this.hideExtraSettings();
							}
						} catch (e) {
							new Notice(formatError(e));
							this.hideExtraSettings();
						} finally {
							if (btn.buttonEl.textContent === t('btn-checking')) {
								btn.setButtonText(t('setting-api-key-verify-btn'));
							}
						}
					});
			});

		if (this.plugin.settings.apiKey) {
			void this.showExtraSettings(containerEl);
		}
	}

	private async showExtraSettings(containerEl: HTMLElement) {
		this.hideExtraSettings();

		const div = containerEl.createDiv();
		this.extraSettingsEl = div;

		div.createEl('p', { text: t('loading-models') });

		let models: Array<Record<string, unknown>> = [];
		try {
			models = await listModels(this.plugin.settings.apiKey);
		} catch {
			div.empty();
			div.createEl('p', { text: t('failed-to-load-models') });
			return;
		}

		div.empty();

		const chatModels = models.filter((m) => {
			const caps = m.capabilities as Record<string, unknown> | undefined;
			return caps?.completionChat === true;
		});

		new Setting(div)
			.setName(t('setting-model-name'))
			.setDesc(t('setting-model-desc'))
			.addDropdown((dropdown) => {
				for (const m of chatModels) {
					const id = m.id as string;
					dropdown.addOption(id, id);
				}
				if (chatModels.length === 0) {
					dropdown.addOption('', t('no-models-available'));
				}
				const current = this.plugin.settings.model;
				if (current && chatModels.some((m) => (m.id as string) === current)) {
					dropdown.setValue(current);
				} else if (chatModels.length > 0) {
					const first = chatModels[0]?.id as string;
					dropdown.setValue(first);
					this.plugin.settings.model = first;
					void this.plugin.saveSettings();
				}
				dropdown.onChange(async (value) => {
					this.plugin.settings.model = value;
					await this.plugin.saveSettings();
				});
			});

		new Setting(div)
			.setName(t('setting-prompt-name'))
			.setDesc(t('setting-prompt-desc'))
			.addTextArea((textarea) => {
				textarea
					.setPlaceholder(t('setting-prompt-placeholder'))
					.setValue(this.plugin.settings.systemPrompt)
					.onChange(async (value) => {
						this.plugin.settings.systemPrompt = value;
						await this.plugin.saveSettings();
					});
				textarea.inputEl.rows = 6;
				textarea.inputEl.cols = 50;
			});
	}

	private hideExtraSettings() {
		if (this.extraSettingsEl) {
			this.extraSettingsEl.remove();
			this.extraSettingsEl = undefined;
		}
	}
}
