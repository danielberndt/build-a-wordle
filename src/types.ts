export type AnnotadedLetter = {letter: string; type: "notFound" | "found" | "correctPosition"};
export type AnnotatedKeys = {[letter: string]: AnnotadedLetter["type"] | undefined};
export type GameMode = "training" | "challenge";
