import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { getCandidates, initialWords, refine, Word, Response, WORD_ITER, responses, WORD_LEN } from "./wordle";

type BaseState = { set: Word[]; cands: Word[] };
type State =
    | ({ which: "need-word" } & BaseState)
    | ({
          which: "need-response";
          word: string;
          response: (Response | undefined)[];
      } & BaseState);

function App() {
    const init = initialWords;
    const [states, setStates] = useState<State[]>([
        {
            which: "need-word",
            set: initialWords,
            cands: getCandidates(initialWords),
        },
    ]);

    return (
        <div style={{ maxWidth: "50em", margin: "auto", padding: "1em" }}>
            <h1>Wordle Solver</h1>
            {states.map((state, stateIndex) => (
                <div key={stateIndex}>
                    <h4>Iteration {stateIndex + 1}</h4>
                    {state.which === "need-word" ? (
                        <div>
                            Candidates ({state.cands.length}/{state.set.length}):
                            {state.cands.map((c, i) => (
                                <div key={c.word}>
                                    <button
                                        onClick={() => {
                                            states[stateIndex] = {
                                                ...state,
                                                which: "need-response",
                                                word: c.word,
                                                response: [],
                                            };
                                            setStates([...states]);
                                        }}
                                    >
                                        {i + 1}. {c.word} ({c.weight})
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>
                            <div style={{ display: "inline-block", verticalAlign: "middle", paddingRight: "1em" }}>
                                <button
                                    onClick={() => {
                                        setStates([
                                            ...states.slice(0, stateIndex),
                                            {
                                                which: "need-word",
                                                set: state.set,
                                                cands: getCandidates(state.set),
                                            },
                                        ]);
                                    }}
                                >
                                    ↺
                                </button>
                            </div>
                            {WORD_ITER.map((x, i) => (
                                <div style={{ display: "inline-block", verticalAlign: "middle" }} key={i}>
                                    <div>
                                        <input
                                            maxLength={1}
                                            style={{ width: "1em" }}
                                            type="text"
                                            value={state.word[i].toUpperCase()}
                                            readOnly={true}
                                        />
                                    </div>
                                    {responses.map((r, ri) => (
                                        <div key={i + r}>
                                            <label>
                                                <input
                                                    style={{
                                                        verticalAlign: "middle",
                                                    }}
                                                    type="radio"
                                                    name={`state-${stateIndex}-${i}`}
                                                    onChange={(x) => {
                                                        state.response[i] = x.target.value as typeof r;

                                                        if (
                                                            state.response.length === WORD_LEN &&
                                                            state.response.every((x) => x !== undefined)
                                                        ) {
                                                            const response = state.response as Response[];
                                                            const refined = refine(state.set, state.word, response);

                                                            setStates([
                                                                ...states.slice(0, stateIndex + 1),
                                                                {
                                                                    which: "need-word",
                                                                    set: refined,
                                                                    cands: getCandidates(refined),
                                                                },
                                                            ]);
                                                        } else {
                                                            setStates([...states]);
                                                        }
                                                    }}
                                                    value={r}
                                                />
                                                <div
                                                    style={{
                                                        display: "inline-block",
                                                        width: "1em",
                                                        height: "1em",
                                                        verticalAlign: "middle",
                                                        background:
                                                            r === "bad"
                                                                ? "slategrey"
                                                                : r === "maybe"
                                                                ? "yellow"
                                                                : "lime",
                                                    }}
                                                ></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default App;
