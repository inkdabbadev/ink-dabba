import { useId } from "react";
export const ink = "#6c554f";
export function FlowerArt({
  type = "daisy",
  color,
}: {
  type?: string;
  color?: string;
}) {
  return (
    <g
      stroke="#718166"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M0 0q-5 35 0 90M-1 54q-25-1-25-19 21 0 25 19m0-13q24-2 24-19-20 0-24 19"
        fill="#a8b491"
      />
      <g stroke="#9a7f77" strokeWidth="1">
        {type === "leaf" ? (
          <>
            <path
              d="M0 8q-34-27-33-49 33 3 33 49 34-27 33-49-33 3-33 49Z"
              fill="#9dab8a"
            />
            <path d="M-26-32 0 6l25-38" fill="none" />
          </>
        ) : type === "tulip" ? (
          <>
            <path
              d="M-21-21-19-52-4-40 0-58 8-40 23-50 22-21q-22 31-43 0Z"
              fill={color || "#d3a6b2"}
            />
            <path
              d="M0-10v-38m-15 6q11 5 15 28m17-27q-11 7-17 27"
              fill="none"
              stroke="#b58497"
            />
          </>
        ) : type === "rose" ? (
          <>
            <path
              d="M-24-15q-16-26 7-41 7-13 26-6 27-4 27 25 16 27-9 41-21 12-37-4-14 6-14-15Z"
              fill={color || "#c88595"}
            />
            <path
              d="M-11-15q-23-19 0-29 26-19 36 6 5 22-18 22-15-4-3-18 15-4 15 10m-42 2q15 23 39 11M-17-47q-13 18 4 34"
              fill="none"
              stroke="#a9677d"
            />
          </>
        ) : (
          <>
            {Array.from({ length: type === "cosmos" ? 8 : 11 }, (_, i) => (
              <ellipse
                key={i}
                cx="0"
                cy="-24"
                rx={type === "cosmos" ? 12 : 7}
                ry={type === "cosmos" ? 21 : 20}
                transform={`rotate(${(i * 360) / (type === "cosmos" ? 8 : 11)})`}
                fill={color || (type === "cosmos" ? "#c5b3d1" : "#f6e6bc")}
              />
            ))}
            <circle r={type === "cosmos" ? 9 : 12} fill="#d7ae65" />
            <path
              d="M-6-3h1m7 1h1m-2 7h1m-7-1h1"
              stroke="#aa895b"
              strokeWidth="2"
            />
          </>
        )}
      </g>
    </g>
  );
}
export function Sprite({
  kind,
  lit = true,
  className = "",
}: {
  kind: string;
  lit?: boolean;
  className?: string;
}) {
  const id = useId().replaceAll(":", "");
  return (
    <svg
      className={"object-art " + className}
      viewBox="0 0 200 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={"dots" + id}
          width="7"
          height="7"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r=".5" fill="#7f6259" opacity=".16" />
        </pattern>
      </defs>
      <g
        stroke={ink}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {kind === "penguin" ? (
          <g className="penguin-body">
            <ellipse
              cx="100"
              cy="202"
              rx="54"
              ry="7"
              fill="#74534f"
              opacity=".09"
              stroke="none"
            />
            <path
              d="M59 100q-11-70 41-76 53 5 43 76 37 68 6 93-42 24-88 0-33-20-2-93Z"
              fill="#53616b"
            />
            <path
              d="M65 103q-8-44 19-49l16 14 17-14q29 9 19 49 30 68 4 83-40 18-79-2-17-26 4-81Z"
              fill="#f4ece0"
            />
            <path
              d="M60 108q-40 22-21 59 18-9 24-34m78-26q40 21 21 59-19-10-24-32"
              fill="#53616b"
            />
            <path d="m82 88 18 14 17-14-17-7Z" fill="#d9ad69" />
            <circle cx="80" cy="80" r="3" fill="#3e4249" />
            <circle cx="121" cy="80" r="3" fill="#3e4249" />
            <path
              d="M60 191q-20 3-16 14h42l1-13m27 0 1 13h42q2-12-20-15"
              fill="#d5af79"
            />
            <path d="M70 113q30 15 61 0l-3 22q-27 10-55 0Z" fill="#b76472" />
            <path d="m117 130-7 37h15l8-37" fill="#b76472" />
            <path
              d="M58 118h5m-13 12h5M79 34l2 4m9-6 1 4m35 116v10"
              stroke="#7c8b94"
            />
            <path d="M64 169q1 8 6 11m66-14-3 9" stroke="#e3d2bc" />
          </g>
        ) : kind === "elephant" ? (
          <g className="elephant-body">
            <path
              d="M31 117q-13-56 45-61h40q57-10 62 37l-8 56q-5 31-27 24l-5-12-4 31h-24v-36H69v35H44v-39Z"
              fill="#b5a6bf"
            />
            <path
              d="M122 73q20-18 43-4 27 15 16 43l-4 57q-8 31-30 13-11-12 0-18 9 15 14-1l2-48"
              fill="#b5a6bf"
              className="elephant-trunk"
            />
            <path
              d="M114 71q-49-14-48 39 0 43 37 42 33 1 33-38 1-30-22-43Z"
              fill="#cbbbcf"
            />
            <path
              d="M105 83q-27-5-27 24 1 29 20 31 24-3 24-25"
              fill="#dfc4ca"
              stroke="#c0a7bf"
            />
            <circle cx="159" cy="89" r="3" fill="#594e60" />
            <path d="M29 119 16 109v23" />
            <path d="M48 179v11m10-11v11m57-11v11m10-11v11" stroke="#93809e" />
            <path d="M142 107q11-2 12 4" stroke="#edc4cf" strokeWidth="5" />
            <path d="M45 78q14-10 29-9m77 60-1 13" stroke="#cec0d3" />
          </g>
        ) : kind === "coffee" ? (
          <>
            <ellipse cx="99" cy="167" rx="80" ry="24" fill="#e8d7be" />
            <ellipse
              cx="99"
              cy="164"
              rx="67"
              ry="16"
              fill="#f7ead6"
              stroke="#ccb796"
            />
            <path
              d="M144 78q63-8 32 64-9 13-30 9v-18q22 10 29-23 3-18-28-14"
              fill="#e5c3bf"
            />
            <path d="M40 75h110v60q-3 39-56 39-50-4-54-39Z" fill="#f4e9d8" />
            <ellipse cx="95" cy="75" rx="55" ry="17" fill="#dbbea0" />
            <ellipse cx="95" cy="76" rx="48" ry="12" fill="#8c6752" />
            <path d="M64 105q29 25 61 0" stroke="#b65865" strokeWidth="3" />
            <path
              d="M88 121q-23-17-9-23 8-2 10 6 7-10 13-4 10 8-14 21Z"
              fill="#c27783"
              stroke="none"
            />
            <path
              className="steam steam-one"
              d="M72 48q-17-16-2-31"
              stroke="#b9a69d"
              opacity=".6"
            />
            <path
              className="steam steam-two"
              d="M102 46q-19-17-2-36"
              stroke="#b9a69d"
              opacity=".6"
            />
            <path
              className="steam steam-three"
              d="M124 51q-15-13-1-29"
              stroke="#b9a69d"
              opacity=".6"
            />
          </>
        ) : kind === "cherry" || kind === "cherries" ? (
          <>
            <path
              d="M58 132q4-65 62-109 18 35 19 113M120 23q38-14 53 10-36 27-53-10"
              fill="#a8b38a"
              stroke="#7c895e"
              strokeWidth="3"
            />
            <path d="M122 22q-10 53 13 111" stroke="#7c895e" strokeWidth="3" />
            <path
              d="M20 148q1-39 35-35 39-13 42 32 1 45-39 45-36 4-38-42Z"
              fill="#b84c60"
            />
            <path
              d="M101 158q-1-39 34-42 35-9 41 29 7 48-32 51-39 7-43-38Z"
              fill="#c86b77"
            />
            <path
              d="M36 139q0-10 13-12m64 17q2-11 13-14"
              stroke="#e5a1a5"
              strokeWidth="5"
            />
            <path d="M58 172q13 3 21-10m53 18q14 0 21-8" stroke="#a44052" />
          </>
        ) : kind === "strawberry" ? (
          <>
            <path
              d="M43 79q55-35 111 0 35 40-54 121Q8 125 43 79Z"
              fill="#c46c7f"
            />
            <path
              d="m34 74 31-24 32 13 22-22 20 22 28 12-54 20-15-11-19 10Z"
              fill="#a4b68b"
            />
            <path d="M98 61q-4-28 13-35" stroke="#7d9268" strokeWidth="4" />
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <path
                key={i}
                d={`M${64 + (i % 3) * 30} ${105 + Math.floor(i / 3) * 26}l-2 6`}
                stroke="#f2d59c"
                strokeWidth="3"
              />
            ))}
          </>
        ) : kind === "rose" ? (
          <>
            <ellipse cx="100" cy="192" rx="74" ry="15" fill="#b1997c" />
            <path
              d="M36 181V85q-1-68 64-68 65 0 64 68v96Z"
              fill="#e6edf0"
              fillOpacity=".45"
              stroke="#bac4c7"
              strokeWidth="2"
            />
            <ellipse cx="100" cy="182" rx="64" ry="10" fill="#cfb49b" />
            <path
              d="M97 175q10-51 0-75m5 44q24 0 24-23-19-1-24 23m-2-7q-31-2-30-27 25 0 30 27"
              fill="#9ba985"
              stroke="#79896c"
            />
            <g transform="translate(99 108) scale(.8)">
              <FlowerArt type="rose" />
            </g>
            <path
              d="M48 92q0-43 26-52M47 108v24"
              stroke="#ffffff"
              strokeWidth="6"
              opacity=".55"
            />
            <path
              d="M126 174q-9-11-3-15 13 1 14 8Z"
              fill="#bf7184"
              stroke="none"
            />
          </>
        ) : kind === "robot" ? (
          <>
            <path d="M52 149h96v50H52Z" fill="#b7a372" />
            <rect x="60" y="115" width="80" height="64" rx="9" fill="#c9b582" />
            <path d="M44 157h22v37H42Zm94 0h22v37h-22Z" fill="#77796b" />
            <path
              d="M50 169h11m-12 10h12m83-10h10m-10 10h11"
              stroke="#b6b69f"
              strokeWidth="3"
            />
            <path d="M88 118V93m25 25V93" stroke="#998c70" strokeWidth="8" />
            <g transform="rotate(-9 100 77)">
              <rect
                x="32"
                y="45"
                width="67"
                height="53"
                rx="17"
                fill="#c5c4ae"
              />
              <rect
                x="101"
                y="45"
                width="67"
                height="53"
                rx="17"
                fill="#c5c4ae"
              />
              <circle cx="67" cy="72" r="18" fill="#575e62" />
              <circle cx="133" cy="72" r="18" fill="#575e62" />
              <circle cx="69" cy="69" r="9" fill="#8caaa9" />
              <circle cx="135" cy="69" r="9" fill="#8caaa9" />
              <path d="M57 60h6m62 0h6" stroke="#eef0dc" strokeWidth="4" />
            </g>
            <path
              d="m61 130-24 11m100-11 26 10"
              stroke="#a2916e"
              strokeWidth="9"
            />
            <path d="M81 145h37v23H81Z" fill="#e7d3a0" />
            <path d="M89 151h19" stroke="#a0906d" />
            <path d="m106 160 5-4 5 4-5 6Z" fill="#c07d7e" stroke="none" />
          </>
        ) : kind === "car" ? (
          <>
            <ellipse
              cx="100"
              cy="163"
              rx="88"
              ry="13"
              fill="#82615a"
              opacity=".12"
              stroke="none"
            />
            <path
              d="M22 118q24-16 49-14l23-25h34l19 32 37 11-7 24H22Z"
              fill="#b74f5b"
            />
            <path d="m88 106 13-19h20l12 22Z" fill="#d2ddd8" />
            <path
              d="M22 115v33m144-30v30M38 108h8v44m114-37h8v37"
              stroke="#5b5b58"
              strokeWidth="12"
            />
            <path d="M75 116h62l-4 32H73Z" fill="#cc6c72" />
            <path d="M94 117h14v24H94Z" fill="#efd9b5" stroke="none" />
            <text
              x="101"
              y="135"
              textAnchor="middle"
              fill="#7b4c51"
              stroke="none"
              fontSize="14"
              fontFamily="Georgia"
            >
              1
            </text>
            <path d="M47 130h21m72 2h18" stroke="#f3d1bc" strokeWidth="3" />
            <path d="M18 149h40m91 0h39" stroke="#af5360" strokeWidth="6" />
          </>
        ) : kind === "letter" || kind === "final" ? (
          <>
            <rect
              x="10"
              y="45"
              width="180"
              height="132"
              rx="7"
              fill={kind === "final" ? "#d9c8df" : "#efe0c2"}
            />
            <path
              d="m12 49 89 66 87-66"
              fill={kind === "final" ? "#e4d6e8" : "#f8eccc"}
            />
            <path d="m12 173 63-54m113 54-61-54" stroke="#d0b99c" />
            <circle
              cx="100"
              cy="116"
              r="18"
              fill={kind === "final" ? "#ae8cbe" : "#ae596a"}
              stroke="#be7b88"
            />
            <text
              x="100"
              y="123"
              textAnchor="middle"
              fontFamily="Georgia"
              fontStyle="italic"
              fontSize="19"
              fill="#f1d7da"
              stroke="none"
            >
              jv
            </text>
            <path d="M25 157h40" stroke="#c1a78c" strokeWidth="2" />
            <path
              d="M160 65q-17 2-14 13 11 10 17-2 5 11 12 0 0-12-15-11Z"
              fill="#a6b395"
              stroke="none"
            />
          </>
        ) : kind === "photo" ? (
          <>
            <path d="M15 12h170v190H15Z" fill="#f7edd9" stroke="#c9b99f" />
            <path d="M28 26h144v129H28Z" fill="#c9cec0" stroke="none" />
            <path
              d="m28 128 42-37 35 23 35-41 32 44v38H28Z"
              fill="#a8b8a0"
              stroke="none"
            />
            <circle cx="67" cy="63" r="17" fill="#eddbb3" stroke="none" />
            <path d="M50 179q51-12 100 0" stroke="#c9b49b" />
            <path d="m72 13 3 8m48-8 2 8" stroke="#e9c8b4" strokeWidth="14" />
          </>
        ) : kind === "star" ? (
          <path
            d="m100 28 23 52 56 8-41 40 10 57-48-27-50 27 10-57-42-40 57-8Z"
            fill="#f1d58e"
          />
        ) : kind === "heart" ? (
          <path
            d="M100 183C-8 110 16 26 70 54l30 29 29-29c57-29 86 56-29 129Z"
            fill="#d7a4b3"
          />
        ) : kind === "capsule" ? (
          <>
            <path d="M42 107a58 58 0 0 1 116 0Z" fill="#c9b4d7" />
            <path d="M42 107h116q2 70-58 70-58 1-58-70Z" fill="#f0dfb5" />
            <path d="M48 113h104" stroke="#a591b0" />
            <path d="M87 137h27v20H87Z" fill="#e1c6b7" />
            <path d="M100 140v13m-6-7h12" stroke="#b28c99" />
          </>
        ) : kind === "candle" ? (
          <>
            <rect x="80" y="71" width="40" height="125" rx="6" fill="#f3dfb6" />
            {[0, 1, 2, 3].map((i) => (
              <path
                key={i}
                d={`m81 ${86 + i * 28} 38 17`}
                stroke="#bf9bbd"
                strokeWidth="12"
              />
            ))}
            <path d="M100 70V51" />
            {lit && (
              <path
                className="candle-flame"
                d="M100 51Q66 26 101 2q32 28-1 49Z"
                fill="#f7d57d"
                stroke="#e8b95f"
              />
            )}
          </>
        ) : kind === "flower" ? (
          <g transform="translate(100 105) scale(2.4)">
            <FlowerArt type="daisy" />
          </g>
        ) : (
          <path d="M40 70q60-55 120 0l-10 90H50Z" fill="#cbb6d7" />
        )}
      </g>
    </svg>
  );
}
export function ButterflyArt() {
  return (
    <svg className="care-butterfly" viewBox="0 0 40 28" aria-hidden="true">
      <path
        d="M19 16C1-17-9 11 11 17-8 27 7 40 19 20M21 16C39-17 49 11 29 17c19 10 4 23-8 3"
        fill="#c4afd4"
      />
      <path d="M20 9v14m-1-14-3-6m5 6 3-6" stroke="#80658e" />
      <circle cx="10" cy="11" r="3" fill="#efd58d" />
      <circle cx="30" cy="11" r="3" fill="#efd58d" />
    </svg>
  );
}
