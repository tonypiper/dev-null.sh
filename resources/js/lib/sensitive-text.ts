import type { Secret } from '@sanity-labs/secret-scan';
import { scan } from '@sanity-labs/secret-scan';

// "tru-2" fires on any 26-character run once "tru" (as in "true") appears, and its character range also spans "/" and ":", so it flags ordinary URLs and paths.
const ignoredRules = new Set(['tru-2']);

export function findSecrets(body: string): Secret[] {
    return scan(body).filter((secret) => !ignoredRules.has(secret.rule));
}

export function removeSecrets(body: string): string {
    return findSecrets(body).reduceRight(
        (text, secret) =>
            text.slice(0, secret.start) + '[REDACTED]' + text.slice(secret.end),
        body,
    );
}

export function stashableBody(body: string): string {
    return findSecrets(body).length > 0 ? '' : body;
}
