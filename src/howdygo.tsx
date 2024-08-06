export interface HowdyGoOEmbed {
    type: 'rich';
    title: string;
    width: number;
    height: number;
    html: string;
}

/**
 * Fetch the HowdyGo oembed data.
 */
export async function fetchHowdyGoOEmbedData(userUrl: string): Promise<HowdyGoOEmbed> {
    const url = new URL(`https://app.howdygo.com/api/v2/oembed`);
    url.searchParams.append('url', userUrl);

    const response = await fetch(url.toString());

    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }

    const result = await response.json<HowdyGoOEmbed>();

    return result;
}

export const parseEmbedHtml = (html: string): { embedUrl: string; scriptUrl: string } => {
    const embedUrlMatch = html.match(/<iframe[^>]+src="([^"]+)"/);
    const scriptUrlMatch = html.match(/<script[^>]+src="([^"]+)"><\/script>/);

    const embedUrl = embedUrlMatch ? embedUrlMatch[1] : '';
    const scriptUrl = scriptUrlMatch ? scriptUrlMatch[1] : '';
    return { embedUrl, scriptUrl };
};