import { FC } from "react";
import { motion } from "framer-motion";
import "../styling/SongPage.css";

/**
 * Data structures ----------------------------------------------------------------
 */
interface Segment {
  text: string;
  color: string | null;
}

// A line is an array of segments; a verse is an array of lines.
// The top‑level object maps the section header (e.g. "[Verse 1]") to a verse.
export type LyricsData = Record<string, Segment[][]>;

/**
 * The highlighted‑lyrics JSON -----------------------------------------------------
 * (In a real project you might fetch/import this from a separate file or API.)
 */
export const lyricsData: LyricsData = {
  // ... (same JSON as before – truncated here for brevity)
  
    "[Intro]": [
      [
        {"text":"(And they ","color":null},
        {"text":"say","color":"#ff595e"},
        {"text":", and they ","color":null},
        {"text":"say","color":"#ff595e"},
        {"text":", and they ","color":null},
        {"text":"say","color":"#ff595e"},
        {"text":", ","color":null},
        {"text":"say","color":"#ff595e"},
        {"text":")","color":null}
      ],
      [
        {"text":"What they ","color":null},
        {"text":"say","color":"#ff595e"},
        {"text":", what they ","color":null},
        {"text":"say","color":"#ff595e"},
        {"text":" now? (They ","color":null},
        {"text":"say","color":"#ff595e"},
        {"text":", they ","color":null},
        {"text":"say","color":"#ff595e"},
        {"text":")","color":null}
      ],
      [
        {"text":"Uh‑huh, uh‑huh (They ","color":null},
        {"text":"say","color":"#ff595e"},
        {"text":", they ","color":null},
        {"text":"say","color":"#ff595e"},
        {"text":", they ","color":null},
        {"text":"say‑ay‑ay‑ay","color":"#ff595e"},
        {"text":")","color":null}
      ],
      [
        {"text":"I'd like to welcome everybody out to the ","color":null},
        {"text":"Samurai","color":"#8ac926"}
      ],
      [
        {"text":"(","color":null},
        {"text":"They ","color":null},
        {"text":"say","color":"#ff595e"},
        {"text":", they ","color":null},
        {"text":"say","color":"#ff595e"},
        {"text":", they ","color":null},
        {"text":"say","color":"#ff595e"},
        {"text":")","color":null}
      ],
      [
        {"text":"Indeed","color":"#1982c4"},
        {"text":", ","color":null},
        {"text":"indeed","color":"#1982c4"},
        {"text":", ","color":null},
        {"text":"indeed","color":"#1982c4"},
        {"text":", ","color":null},
        {"text":"indeed","color":"#1982c4"},
        {"text":", baby","color":null}
      ],
      [
        {"text":"Here we go, one time, yeah","color":null}
      ]
    ],
  
    "[Chorus 1]": [
      [
        {"text":"I got these, really ","color":null},
        {"text":"neat","color":"#ff595e"},
        {"text":" (Really ","color":null},
        {"text":"neat","color":"#ff595e"},
        {"text":", really ","color":null},
        {"text":"neat","color":"#ff595e"},
        {"text":")","color":null}
      ],
      [
        {"text":"Very beautifully ","color":null},
        {"text":"alliterated","color":"#1982c4"},
        {"text":" (Very beautiful, uh)","color":null}
      ],
      [
        {"text":"Little battle ","color":null},
        {"text":"raps","color":"#8ac926"},
        {"text":" for you (Little battle ","color":null},
        {"text":"rap","color":"#8ac926"},
        {"text":", little battle ","color":null},
        {"text":"rap","color":"#8ac926"},
        {"text":", yeah)","color":null}
      ],
      [
        {"text":"I got these, really ","color":null},
        {"text":"neat","color":"#ff595e"},
        {"text":" (What you got? Huh, uh)","color":null}
      ],
      [
        {"text":"Very beautifully ","color":null},
        {"text":"alliterated","color":"#1982c4"},
        {"text":" (Yeah, yeah, yeah)","color":null}
      ],
      [
        {"text":"Little battle ","color":null},
        {"text":"raps","color":"#8ac926"},
        {"text":" for you (Talk to 'em like, c'mon)","color":null}
      ],
      [
        {"text":"So come on through","color":null}
      ]
    ],
  
    "[Verse 1]": [
      [
        {"text":"Big ","color":null},
        {"text":"eyes","color":"#ff595e"},
        {"text":" looking like ","color":null},
        {"text":"skies","color":"#ff595e"},
        {"text":" in binoculars","color":null}
      ],
      [
        {"text":"Two nights live, singing ","color":null},
        {"text":"by","color":"#8ac926"},
        {"text":" the opera house","color":null}
      ],
      [
        {"text":"But not in it, just ","color":null},
        {"text":"by","color":"#8ac926"},
        {"text":" it","color":null}
      ],
      [
        {"text":"Someone alongside it, a long silence","color":null}
      ],
      [
        {"text":"A strong, vibrant meditative song of guidance","color":null}
      ],
      [
        {"text":"Designed to raise eyelids of blind men, saved assignments","color":null}
      ],
      [
        {"text":"With warm regards and age kindness for today's climate","color":null}
      ],
      [
        {"text":"And the vain of gang violence meets the gangs's demises","color":null}
      ],
      [
        {"text":"And it— bangs! ","color":null},
        {"text":"Rises","color":"#ff595e"},
        {"text":" like wings on a plane","color":null}
      ],
      [
        {"text":"Plus a pilot who can ","color":null},
        {"text":"fly","color":"#8ac926"},
        {"text":" it into the ","color":null},
        {"text":"eye","color":"#8ac926"},
        {"text":" of Hurricane Iris","color":null}
      ],
      [
        {"text":"Stylish, same shoe in different ","color":null},
        {"text":"sizes","color":"#ff595e"}
      ],
      [
        {"text":"With evidences of the mileage and the growth","color":null}
      ],
      [
        {"text":"Top hats and ","color":null},
        {"text":"coats","color":"#1982c4"}
      ],
      [
        {"text":"Tuxedos and ","color":null},
        {"text":"throats","color":"#1982c4"},
        {"text":", where the ","color":null},
        {"text":"bowties","color":"#ff595e"},
        {"text":" posts","color":null}
      ],
      [
        {"text":"Folks look past the lower-class blower of the ","color":null},
        {"text":"notes","color":"#1982c4"}
      ],
      [
        {"text":"And tell unspoke ","color":null},
        {"text":"jokes","color":"#1982c4"},
        {"text":" as they approach","color":null}
      ],
      [
        {"text":"Which she'd never be inside, but she ","color":null},
        {"text":"hopes","color":"#1982c4"}
      ]
    ],
  
    "[Chorus 2]": [
      [
        {"text":"I got these (Yeah) really ","color":null},
        {"text":"neat","color":"#ff595e"},
        {"text":" (Really ","color":null},
        {"text":"neat","color":"#ff595e"},
        {"text":", really ","color":null},
        {"text":"neat","color":"#ff595e"},
        {"text":")","color":null}
      ],
      [
        {"text":"Very beautifully ","color":null},
        {"text":"alliterated","color":"#1982c4"},
        {"text":" (Very beautiful, uh)","color":null}
      ],
      [
        {"text":"Little battle ","color":null},
        {"text":"raps","color":"#8ac926"},
        {"text":" for you (Little battle ","color":null},
        {"text":"rap","color":"#8ac926"},
        {"text":", little battle ","color":null},
        {"text":"rap","color":"#8ac926"},
        {"text":", yeah)","color":null}
      ],
      [
        {"text":"I got these, really ","color":null},
        {"text":"neat","color":"#ff595e"},
        {"text":" (Really neat, huh)","color":null}
      ],
      [
        {"text":"Very beautifully ","color":null},
        {"text":"alliterated","color":"#1982c4"},
        {"text":" (Wassup, wassup)","color":null}
      ],
      [
        {"text":"Little battle ","color":null},
        {"text":"raps","color":"#8ac926"},
        {"text":" for you (Yeah, uh, uh)","color":null}
      ],
      [
        {"text":"So come on through","color":null}
      ]
    ],
  
    "[Verse 2]": [
      [
        {"text":"The unamplified, ","color":null},
        {"text":"fantasize","color":"#ff595e"},
        {"text":" land","color":null}
      ],
      [
        {"text":"Of the soon‑to‑be fans of the samurai","color":null}
      ],
      [
        {"text":"Smile wide, got the panorama camera vibe","color":null}
      ],
      [
        {"text":"If you ","color":null},
        {"text":"analyze","color":"#ff595e"},
        {"text":", she's a one‑woman gala, ","color":null},
        {"text":"glamorized","color":"#ff595e"}
      ],
      [
        {"text":"Just without the glamor or the gala ","color":null},
        {"text":"ties","color":"#ff595e"}
      ],
      [
        {"text":"Met 'em all live with the jazz ","color":null},
        {"text":"guys","color":"#ff595e"}
      ],
      [
        {"text":"Eating piano ","color":null},
        {"text":"pies","color":"#ff595e"},
        {"text":" at the Vanguard","color":null}
      ],
      [
        {"text":"She's a artist and starved","color":null}
      ],
      [
        {"text":"A couple dollars in the band jar ","color":null},
        {"text":"buys","color":"#ff595e"},
        {"text":" a half a turkey sam","color":null}
      ],
      [
        {"text":"Organic and it's hand‑carved and ours","color":null}
      ],
      [
        {"text":"If you ask for a piece, freshly ","color":null},
        {"text":"laugh","color":"#1982c4"},
        {"text":" for singing jazz in the streets","color":null}
      ],
      [
        {"text":"And the ","color":null},
        {"text":"staff","color":"#1982c4"},
        {"text":" ask for police (Damn)","color":null}
      ],
      [
        {"text":"Crashed at a friend's flat for a ","color":null},
        {"text":"week","color":"#8ac926"},
        {"text":" (For a ","color":null},
        {"text":"week","color":"#8ac926"},
        {"text":")","color":null}
      ],
      [
        {"text":"Felt as home as a ","color":null},
        {"text":"raft","color":"#1982c4"},
        {"text":" on the beach (On the beach)","color":null}
      ],
      [
        {"text":"Lit a fag, took a ","color":null},
        {"text":"drag","color":"#1982c4"},
        {"text":", took a tea (Took a tea)","color":null}
      ],
      [
        {"text":"Read a book, took a bath, went to ","color":null},
        {"text":"sleep","color":"#8ac926"}
      ]
    ],
  
    "[Chorus 3]": [
      [
        {"text":"I got these, really ","color":null},
        {"text":"neat","color":"#ff595e"},
        {"text":" (Really neat, really neat, ay)","color":null}
      ],
      [
        {"text":"Very beautifully ","color":null},
        {"text":"alliterated","color":"#1982c4"},
        {"text":" (Very beautiful, yeah)","color":null}
      ],
      [
        {"text":"Little battle ","color":null},
        {"text":"raps","color":"#8ac926"},
        {"text":" for you (Little battle ra‑a‑a‑a‑a‑ap)","color":null}
      ],
      [
        {"text":"So come on through","color":null}
      ]
    ],
  
    "[Outro]": [
      [
        {"text":"I'd like to welcome everybody out","color":null}
      ],
      [
        {"text":"Yeah, to the ","color":null},
        {"text":"Samurai","color":"#ff595e"},
        {"text":", ","color":null},
        {"text":"Samurai","color":"#ff595e"}
      ],
      [
        {"text":"Uh‑huh, to the ","color":null},
        {"text":"Samurai","color":"#ff595e"},
        {"text":", uh","color":null}
      ]
    ]
  }
  
/**
 * Helper: returns style props for a segment.
 */
const segmentStyle = (color: string | null): React.CSSProperties =>
  color
    ? {
        backgroundColor: color,
        borderRadius: 4,
        padding: "2px 4px",
        whiteSpace: "pre-wrap"
      }
    : { whiteSpace: "pre-wrap" };

/**
 * LyricHighlighter component ------------------------------------------------------
 */
const LyricHighlighter: FC<{ data?: LyricsData }> = ({ data = lyricsData }) => {
  return (
    <div className="card">
      <div className="card-content">
        {Object.entries(data).map(([section, verse]) => (
          <motion.div
            key={section}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Section header -------------------------------------------------- */}
            <h2 className="section-header">{section}</h2>

            {/* Verse lines ----------------------------------------------------- */}
            <div className="verse">
              {verse.map((line, lineIdx) => (
                <p key={lineIdx} className="line">
                  {line.map((seg, segIdx) => (
                    <span key={segIdx} style={segmentStyle(seg.color)}>
                      {seg.text}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LyricHighlighter;