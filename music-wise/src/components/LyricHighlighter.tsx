import { FC } from "react";
import { motion } from "framer-motion";
import "../styling/SongPage.css";

/* ----------  Interfaces -------------------------------------------------- */
export interface Segment {
  text: string;
  color: string | null;
}
export type Line       = Segment[];
export type Verse      = Line[];
export type LyricsData = Record<string, Verse>;

/* ----------  Spacing helper --------------------------------------------- */
/**
 * Return true when we should inject a space *after* the current token.
 *
 * Rules:
 * 1.  Never add a space if `next` is undefined (end-of-line).
 * 2.  Never add a space if the current text already ends with whitespace.
 * 3.  Never add a space *before* closing punctuation ) ] } , . ! ? ; :
 * 4.  Otherwise add a space.
 */
const shouldSpace = (curr: string, next?: string) => {
  if (!next) return false;                              // #1
  if (/\s$/.test(curr)) return false;                   // #2
  if (/^[).,!?;:\]]/.test(next)) return false;          // #3
  return true;                                          // #4
};

const segmentStyle = (color: string | null): React.CSSProperties =>
  color ? { backgroundColor: color, borderRadius: 4, padding: "2px 4px" } : {};

/* ----------  Component --------------------------------------------------- */
interface Props { 
  data: LyricsData;
  plainLyrics?: string;
  isAnalyzing?: boolean;
}

export const LyricHighlighter: FC<Props> = ({ data, plainLyrics, isAnalyzing }) => {
  if (isAnalyzing && plainLyrics) {
    return (
      <div className="card">
        <div className="card-content">
          {plainLyrics.split('\n').map((line, idx) => (
            <p key={idx} className="line">
              {line}
            </p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-content">
        {Object.entries(data).map(([section, verse]) => (
          <motion.div
            key={section}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <h2 className="section-header">{section}</h2>

            <div className="verse">
              {verse.map((line, lineIdx) => (
                <p key={lineIdx} className="line">
                  {line.map((seg, segIdx) => {
                    const nextText = line[segIdx + 1]?.text;
                    return (
                      <span key={segIdx} style={segmentStyle(seg.color)}>
                        {seg.text}
                        {shouldSpace(seg.text, nextText) && " "}
                      </span>
                    );
                  })}
                </p>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
