declare type Range = {
    start: number;
    end: number;
};
/**
 * Provides selections in a document field pointed by path. This hook assumes
 * presence of sessionContext in React elements tree.
 */
export default function useSelections(path: string): {
    [id: string]: Range;
};
export {};
