import { Mistral } from '@mistralai/mistralai';

function createClient(apiKey: string): Mistral {
	return new Mistral({ apiKey });
}

export async function fixSpelling(text: string, apiKey: string, model: string, systemPrompt: string): Promise<string> {
	const client = createClient(apiKey);
	const response = await client.chat.complete({
		model,
		messages: [
			{ role: 'system', content: systemPrompt },
			{ role: 'user', content: text },
		],
	});
	const content = response.choices?.[0]?.message?.content;
	return typeof content === 'string' ? content : text;
}

export async function verifyApiKey(apiKey: string): Promise<boolean> {
	const client = createClient(apiKey);
	await client.models.list();
	return true;
}

export async function listModels(apiKey: string): Promise<Array<Record<string, unknown>>> {
	const client = createClient(apiKey);
	const response = await client.models.list();
	return response.data ?? [];
}

type ErrorWithDetails = {
	response?: { status?: number; data?: unknown };
	message?: string;
	code?: string;
};

export function formatError(e: unknown): string {
	if (e && typeof e === 'object') {
		const err = e as ErrorWithDetails;
		const parts: string[] = [];
		if (err.response) {
			const status = err.response.status;
			parts.push(`HTTP ${String(status ?? '?')}`);
			const data = err.response.data;
			if (data && typeof data === 'object') {
				const d = data as Record<string, unknown>;
				if (typeof d.message === 'string') parts.push(d.message);
				else if (typeof d.error === 'string') parts.push(d.error);
				else if (typeof d.error_description === 'string') parts.push(d.error_description);
				else parts.push(JSON.stringify(data).slice(0, 200));
			}
		}
		if (typeof err.message === 'string') parts.push(err.message);
		if (typeof err.code === 'string') parts.push(`(${err.code})`);
		if (parts.length > 0) return parts.join(' — ');
	}
	return String(e);
}
