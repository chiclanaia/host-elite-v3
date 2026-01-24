import { ui } from './es/ui';
import { booklet } from './es/booklet';
import { tools } from './es/tools';
import { audit } from './es/audit';
import { training } from './es/training';
import { checklists } from './es/checklists';
import { profitability } from './es/profitability';
import events from './es/events';
import { visibility } from './es/visibility';
import { listing } from './es/listing';
import { assistant } from './es/assistant';
import { calendar } from './es/calendar';

export const es = {
    ...ui,
    ...booklet,
    ...tools,
    ...audit,
    ...training,
    ...checklists,
    ...profitability,
    ...events,
    ...visibility,
    ...listing,
    ...assistant,
    ...calendar
};
