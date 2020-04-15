import { SessionParticipant } from 'sundae-collab-client';
/**
 * Provides session participants list. This hook assumes presence of
 * sessionContext in React elements tree.
 */
export default function useParticipants(): SessionParticipant[];
