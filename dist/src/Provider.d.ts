import React from 'react';
import { Client } from 'sundae-collab-client';
/**
 * Context with the client class from sundae-collab-client.
 */
export declare const clientContext: React.Context<Client | null>;
declare type Props = {
    identity: any;
    url: string;
    children: any;
};
/**
 * Injects collaboration client to the React context. Takes collaboration
 * server url and user identity to establish web socket connection and
 * authenticate the client.
 */
export default function Provider({ url, identity, children }: Props): JSX.Element;
export {};
