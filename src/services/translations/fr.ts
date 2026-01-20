import { ui } from './fr/ui';
import { booklet } from './fr/booklet';
import { tools } from './fr/tools';
import { audit } from './fr/audit';
import { training } from './fr/training';
import { checklists } from './fr/checklists';
import { profitability } from './fr/profitability';
import events from './fr/events';

export const fr = {
    ...ui,
    ...booklet,
    ...tools,
    ...audit,
    ...training,
    ...checklists,
    ...profitability,
    ...events
};
