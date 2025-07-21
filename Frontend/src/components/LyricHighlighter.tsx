import { FC, useState } from "react";
import { motion } from "framer-motion";
import "../styling/SongPage.css";
import { LyricsData, Line, Segment } from "../../../common/interfaces";

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
  color ? { 
    backgroundColor: color, 
    borderRadius: 6, 
    padding: "3px 6px", 
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
    color: "#000000",
    fontWeight: "600"
  } : {
    color: "#000000"
  };

/* ----------  Component --------------------------------------------------- */
interface Props {
  data: LyricsData;
  plainLyrics?: string;
  isAnalyzing?: boolean;
}

interface HoveredSegment {
  color: string;
  section: string;
  text: string;
  position: { x: number; y: number };
}

export const LyricHighlighter: FC<Props> = ({ data, plainLyrics, isAnalyzing }) => {
  const [hoveredSegment, setHoveredSegment] = useState<HoveredSegment | null>(null);

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

  const handleSegmentHover = (event: React.MouseEvent, color: string | null, section: string, text: string) => {
    if (color) {
      setHoveredSegment({
        color,
        section,
        text,
        position: { x: event.clientX, y: event.clientY }
      });
    } else {
      setHoveredSegment(null);
    }
  };

  const getRhymingWords = (color: string, section: string): string[] => {
    const words: string[] = [];
    const analysedVerse = data.sections.find(verse => verse.section === section);
    if (analysedVerse) {
      analysedVerse.lines.forEach((line: Line) => {
        line.forEach((seg: Segment) => {
          if (seg.color === color) {
            let text = seg.text.toLowerCase();
            text = text.replace(/\s/g, '');

            if (text && !words.includes(text)) {
              words.push(text);
            }
          }
        });
      });
    }
    return words;
  };

  return (
    <div className="card">
      <div className="card-content">
        {data.sections.map((analysedVerse, verseIdx) => (
          <motion.div
            key={verseIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <h2 className="section-header">{analysedVerse.section}</h2>

            <div className="verse">
              {analysedVerse.lines.map((line, lineIdx) => (
                <motion.p
                  key={lineIdx}
                  className="line"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {line.map((seg, segIdx) => {
                    const nextText = line[segIdx + 1]?.text;
                    return (
                      <span key={segIdx}
                        style={segmentStyle(seg.color)}
                        onMouseEnter={(e) => handleSegmentHover(e, seg.color, analysedVerse.section, seg.text)}
                        onMouseLeave={() => setHoveredSegment(null)}>
                        {seg.text}
                        {shouldSpace(seg.text, nextText) && " "}
                      </span>
                    );
                  })}
                </motion.p>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {hoveredSegment && (
        <motion.div
          className="rhyme-dialog"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          style={{
            position: 'fixed',
            left: hoveredSegment.position.x + 20,
            top: hoveredSegment.position.y + 20,
            zIndex: 1000
          }}
        >
          <div className="rhyme-dialog-content">
            <h3>Rhyming Words in {hoveredSegment.section}</h3>
            <ul>
              {getRhymingWords(hoveredSegment.color, hoveredSegment.section).map((word, index) => (
                <li key={index}>{word}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
};
