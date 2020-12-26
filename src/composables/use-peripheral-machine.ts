import { inspect } from '@xstate/inspect';
import { assign, createMachine } from 'xstate';
import { useMachine } from './use-machine';

inspect({ iframe: false });

export type NoteId = string;

export type Note = {
  id: NoteId;
  markdown: string;
};

export type Position = 'center' | 'topRight' | 'topLeft' | 'bottomLeft' | 'bottomRight';

const peripheralPositions: Position[] = [
  'center',
  'topRight',
  'topLeft',
  'bottomLeft',
  'bottomRight',
];

export type FocusedNotes = Partial<Record<Position, NoteId>>;

type Context = {
  notes: Record<NoteId, Note>;
  focusedNotes: FocusedNotes;
};

const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

const notes = {
  1: {
    id: '1',
    markdown: `# Foo\n${lorem}`,
  },
  2: {
    id: '2',
    markdown: `# Bar\n${lorem}`,
  },
  3: {
    id: '3',
    markdown: `# Baz\n${lorem}`,
  },
  4: {
    id: '4',
    markdown: `# FooBar\n${lorem}`,
  },
  5: {
    id: '5',
    markdown: `# FooBaz\n${lorem}`,
  },
};

const peripheralMachine = createMachine<Context>(
  {
    initial: 'idle',
    context: {
      notes,
      focusedNotes: {},
    },
    states: {
      idle: {
        on: {
          FOCUS: {
            target: 'editting',
            actions: ['setFocusedNotes'],
          },
        },
      },
      editting: {
        on: {
          TYPING: {
            actions: ['updateNoteMarkdown'],
          },
          FOCUS: {
            actions: ['setFocusedNotes'],
          },
        },
      },
    },
  },
  {
    actions: {
      setFocusedNotes: assign({
        focusedNotes({ notes, focusedNotes }, event) {
          const updatedFocusedNotes: FocusedNotes = {
            center: event.id,
          };

          const [position] = Object.entries(focusedNotes).find(([_, id]) => id === event.id) || [];
          if (position !== undefined) {
            updatedFocusedNotes[position as Position] = focusedNotes.center;
          }

          // TODO: Pick contextual notes
          const noteIds = Object.keys(notes).filter(
            (id) => !Object.values(updatedFocusedNotes).includes(id)
          );
          const positions = peripheralPositions.filter(
            (position) => updatedFocusedNotes[position] === undefined
          );

          for (const position of positions) {
            if (noteIds.length > 0) {
              updatedFocusedNotes[position] = noteIds.shift();
            }
          }

          return updatedFocusedNotes;
        },
      }),
      updateNoteMarkdown: assign({
        notes({ notes }, event) {
          notes[event.id].markdown = event.markdown;
          return notes;
        },
      }),
    },
  }
);

const { state, send } = useMachine(peripheralMachine, { devTools: true });

export function usePeripheralMachine() {
  return {
    state,
    send,
  };
}
