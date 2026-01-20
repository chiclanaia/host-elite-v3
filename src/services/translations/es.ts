import { ui } from './es/ui';
import { booklet } from './es/booklet';
import { tools } from './es/tools';
import { audit } from './es/audit';
import { training } from './es/training';
import { checklists } from './es/checklists';

export const es = {
    ...ui,
    ...booklet,
    ...tools,
    ...audit,
    ...training,
    ...checklists
};
