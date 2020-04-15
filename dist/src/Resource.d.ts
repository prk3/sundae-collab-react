import React from 'react';
import { Session } from 'sundae-collab-client';
declare type Props = {
    id: string;
    type: string;
    value: any;
    children?: any;
    fallback?: any;
};
/**
 * Context with session instance from sundae-collab-client.
 */
export declare const sessionContext: React.Context<Session | null>;
/**
 * Injects session to the React context. Takes resource data and initial value
 * to start/join a collaboration session.
 */
export default function Resource({ id, type, value, children, fallback, }: Props): any;
export {};
