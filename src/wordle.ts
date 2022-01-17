import { words } from "./corncob";

export const WORD_LEN = 5;
export const WORD_ITER = [...Array(WORD_LEN).keys()];

const validWords = words
    .split("\n")
    .filter((x) => x.length === WORD_LEN)
    .filter((x, xi) => {
        const chars = x.split("");
        return chars.every((x, xi) => chars.every((y, yi) => yi === xi || y !== x));
    });

const freq = validWords.reduce((acc, cur) => {
    return cur.split("").reduce((acc, cur) => {
        acc[cur] ??= 0;
        acc[cur]++;

        return acc;
    }, acc);
}, {} as Record<string, number>);

export const initialWords = validWords
    .map((x) => ({
        word: x,
        weight: x.split("").reduce((acc, cur) => acc + freq[cur], 0),
    }))
    .sort((a, b) => b.weight - a.weight);

export const responses = ["bad", "maybe", "good"] as const;

export type Response = typeof responses[number];

export const refine = (state: typeof initialWords, word: string, response: Response[]) =>
    state.filter((x) =>
        // (() => {
        //     if (x.word === "shire") debugger;
        //     return true;
        // })() &&
        response.every((r, i) =>
            r === "bad"
                ? x.word.indexOf(word[i]) === -1
                : r === "maybe"
                ? word[i] !== x.word[i] && x.word.indexOf(word[i]) !== -1
                : r === "good"
                ? word[i] === x.word[i]
                : () => {
                      throw new Error("unreachable");
                  }
        )
    );

export const getCandidates = (state: typeof initialWords) => state.filter((x, i) => i < 10);

export type Word = typeof initialWords[number];
