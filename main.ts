// One Word for the Boss — make.fun entry.
// A single word describing my boss, written to /output/entry.txt.
// Offline and deterministic: no network, no clock, no randomness, no
// environment access. The program only emits the word.
import * as fs from "node:fs";

// Why this word: the judge weighs, in order, on-subject fit, an instant
// laugh, truth about a real boss habit, a fresh angle, and instant
// readability with no context. "ASAPist" is the boss who treats every
// single request as ASAP — everything is urgent, nothing is ever just
// "when you get to it" — coined with the -ist suffix, as if urgency
// itself were the boss's ideology. It is a habit every worker
// recognises at once, it needs no caption to land, and it is not the
// first word anyone reaches for (not Micromanager, not Helicopter),
// so it stays fresh while still travelling to any workplace.
const WORD = "ASAPist";
const MAX_CHARS = 30;

// Guard the sealed gate ourselves: 1-30 UTF-8 characters, not only
// whitespace, a single word with no spaces. Fail loudly instead of
// ever writing an entry the scorer would reject.
const chars = [...WORD].length;
if (chars < 1 || chars > MAX_CHARS || !WORD.trim() || /\s/.test(WORD)) {
  throw new Error(`boss word violates the 1-30 char single-word gate (${chars} chars)`);
}
// One word means letters only: no hyphen, apostrophe, digit or punctuation
// that would make the judge read it as two things.
if (!/^[A-Za-z]+$/.test(WORD)) {
  throw new Error(`boss word must be a single plain word, got ${JSON.stringify(WORD)}`);
}

fs.mkdirSync("/output", { recursive: true });
fs.writeFileSync("/output/entry.txt", WORD, "utf8");

// Verify the written file round-trips exactly: same bytes, one word,
// and no trailing newline or extra byte the gate would count.
const written = fs.readFileSync("/output/entry.txt", "utf8");
if (written !== WORD) {
  throw new Error("entry.txt does not match the boss word");
}
if (Buffer.byteLength(written, "utf8") !== chars) {
  throw new Error("entry.txt byte length does not match its char count");
}
// Independent re-check of the written file against the sealed scorer's
// own rule (1-30 chars, not only whitespace), in case the constant and
// the file ever drift apart.
const writtenChars = [...written].length;
if (writtenChars < 1 || writtenChars > MAX_CHARS || written.trim().length === 0) {
  throw new Error(`written entry.txt fails the 1-30 char gate (${writtenChars} chars)`);
}

console.log(`wrote ${chars} chars to /output/entry.txt`);
