export const GENRES_DATA = [
  {
    id: "blues",
    name: "Blues",
    category: "Roots & Soul",
    color: "#2563EB",
    gradient: "from-blue-600 to-indigo-900",
    description: "Deep, emotional music with expressive guitar bends, soulful vocals, and warm acoustic rhythm. Perfect for feeling the groove.",
    characteristics: ["12-bar harmonic structure", "Blue notes & string bends", "Shuffle rhythms", "Soulful storytelling"],
    exampleTracks: [
      { title: "The Thrill Is Gone", artist: "B.B. King", year: "1969" },
      { title: "Sweet Home Chicago", artist: "Buddy Guy", year: "1991" },
      { title: "Cross Road Blues", artist: "Robert Johnson", year: "1936" },
      { title: "Pride and Joy", artist: "Stevie Ray Vaughan", year: "1983" },
      { title: "Mannish Boy", artist: "Muddy Waters", year: "1955" }
    ]
  },
  {
    id: "classical",
    name: "Classical",
    category: "Orchestral & Acoustic",
    color: "#D97706",
    gradient: "from-amber-600 to-stone-900",
    description: "Centuries of timeless instrumental art featuring pianos, violins, and rich symphonies that range from calm peaceful melodies to massive orchestral builds.",
    characteristics: ["Complex piano & string counterpoint", "Rich dynamic contrasts", "Acoustic orchestral harmony", "Expressive tempo movements"],
    exampleTracks: [
      { title: "Nocturne Op. 9 No. 2", artist: "Frédéric Chopin", year: "1832" },
      { title: "Clair de Lune", artist: "Claude Debussy", year: "1905" },
      { title: "Symphony No. 5 in C Minor", artist: "Ludwig van Beethoven", year: "1808" },
      { title: "Canon in D", artist: "Johann Pachelbel", year: "1680" },
      { title: "Four Seasons (Spring)", artist: "Antonio Vivaldi", year: "1723" }
    ]
  },
  {
    id: "country",
    name: "Country",
    category: "Roots & Acoustic",
    color: "#CA8A04",
    gradient: "from-yellow-600 to-amber-950",
    description: "Warm storytelling songs driven by acoustic guitars, fiddles, and twangy vocals talking about life, love, and the open road.",
    characteristics: ["Acoustic & pedal steel guitars", "Heartfelt vocal harmonies", "Two-step rhythm", "Story-driven lyrics"],
    exampleTracks: [
      { title: "Take Me Home, Country Roads", artist: "John Denver", year: "1971" },
      { title: "Ring of Fire", artist: "Johnny Cash", year: "1963" },
      { title: "Jolene", artist: "Dolly Parton", year: "1973" },
      { title: "Tennessee Whiskey", artist: "Chris Stapleton", year: "2015" },
      { title: "Before He Cheats", artist: "Carrie Underwood", year: "2005" }
    ]
  },
  {
    id: "disco",
    name: "Disco",
    category: "Club & Dance",
    color: "#C026D3",
    gradient: "from-fuchsia-600 to-purple-900",
    description: "High-energy retro dance music with groovy bouncy basslines, four-on-the-floor drum kicks, and dazzling strings designed to make you move.",
    characteristics: ["Four-on-the-floor beat (120-128 BPM)", "Bouncy funky basslines", "Catchy horns & string sweeps", "Vibrant party vocals"],
    exampleTracks: [
      { title: "Stayin' Alive", artist: "Bee Gees", year: "1977" },
      { title: "Le Freak", artist: "CHIC", year: "1978" },
      { title: "I Will Survive", artist: "Gloria Gaynor", year: "1978" },
      { title: "September", artist: "Earth, Wind & Fire", year: "1978" },
      { title: "Don't Stop 'Til You Get Enough", artist: "Michael Jackson", year: "1979" }
    ]
  },
  {
    id: "hiphop",
    name: "Hip-Hop",
    category: "Urban & Beats",
    color: "#EA580C",
    gradient: "from-orange-600 to-red-950",
    description: "Rhythm-heavy urban beats powered by deep bass kicks, crisp snares, catchy loops, and rhythmic lyrical rhymes and flow.",
    characteristics: ["Heavy 808 sub-bass kicks", "Chopped vocal & instrument loops", "Rhythmic vocal flows", "Punchy modern beats"],
    exampleTracks: [
      { title: "Juicy", artist: "The Notorious B.I.G.", year: "1994" },
      { title: "Lose Yourself", artist: "Eminem", year: "2002" },
      { title: "HUMBLE.", artist: "Kendrick Lamar", year: "2017" },
      { title: "N.Y. State of Mind", artist: "Nas", year: "1994" },
      { title: "God's Plan", artist: "Drake", year: "2018" }
    ]
  },
  {
    id: "jazz",
    name: "Jazz",
    category: "Modern & Improvised",
    color: "#0D9488",
    gradient: "from-teal-600 to-slate-900",
    description: "Smooth, spontaneous and sophisticated music with swinging rhythms, mellow horns, walking upright bass, and piano improvisation.",
    characteristics: ["Swinging rhythm & syncopation", "Lush extended jazz chords", "Saxophone & trumpet solos", "Relaxed cafe ambience"],
    exampleTracks: [
      { title: "Fly Me to the Moon", artist: "Frank Sinatra", year: "1964" },
      { title: "So What", artist: "Miles Davis", year: "1959" },
      { title: "Take Five", artist: "The Dave Brubeck Quartet", year: "1959" },
      { title: "Autumn Leaves", artist: "Cannonball Adderley & Miles Davis", year: "1958" },
      { title: "What a Wonderful World", artist: "Louis Armstrong", year: "1967" }
    ]
  },
  {
    id: "metal",
    name: "Metal",
    category: "Heavy & Amplified",
    color: "#DC2626",
    gradient: "from-red-600 to-neutral-950",
    description: "Intense, adrenaline-fueled sound featuring screaming distorted electric guitars, lightning-fast double-bass drums, and powerful raw vocals.",
    characteristics: ["Heavily distorted power chords", "Rapid double-kick drumming", "High-octane aggression & speed", "Virtuosic guitar solos"],
    exampleTracks: [
      { title: "Master of Puppets", artist: "Metallica", year: "1986" },
      { title: "Enter Sandman", artist: "Metallica", year: "1991" },
      { title: "Paranoid", artist: "Black Sabbath", year: "1970" },
      { title: "The Trooper", artist: "Iron Maiden", year: "1983" },
      { title: "Chop Suey!", artist: "System of a Down", year: "2001" }
    ]
  },
  {
    id: "pop",
    name: "Pop",
    category: "Mainstream & Melodic",
    color: "#DB2777",
    gradient: "from-pink-500 to-rose-900",
    description: "Super-catchy, upbeat tunes designed to get stuck in your head with polished vocal melodies, sparkling synths, and unforgettable chorus hooks.",
    characteristics: ["Ultra-catchy earworm hooks", "Crisp vocal production", "Upbeat feel-good rhythm", "Anthemic singalong choruses"],
    exampleTracks: [
      { title: "Blinding Lights", artist: "The Weeknd", year: "2019" },
      { title: "Billie Jean", artist: "Michael Jackson", year: "1982" },
      { title: "Shape of You", artist: "Ed Sheeran", year: "2017" },
      { title: "As It Was", artist: "Harry Styles", year: "2022" },
      { title: "Levitating", artist: "Dua Lipa", year: "2020" }
    ]
  },
  {
    id: "reggae",
    name: "Reggae",
    category: "Caribbean & Dub",
    color: "#059669",
    gradient: "from-emerald-600 to-teal-950",
    description: "Sunny, laid-back Caribbean vibes defined by an easy offbeat guitar chop, warm bubbling bass, and peaceful feel-good lyrics.",
    characteristics: ["Signature offbeat guitar chop (skank)", "Deep warm rolling bass", "One-drop drum rhythm", "Relaxed uplifting vibe"],
    exampleTracks: [
      { title: "Three Little Birds", artist: "Bob Marley & The Wailers", year: "1977" },
      { title: "Could You Be Loved", artist: "Bob Marley", year: "1980" },
      { title: "Red Red Wine", artist: "UB40", year: "1983" },
      { title: "Welcome to Jamrock", artist: "Damian Marley", year: "2005" },
      { title: "54-46 Was My Number", artist: "Toots and the Maytals", year: "1968" }
    ]
  },
  {
    id: "rock",
    name: "Rock",
    category: "Electric & Guitar",
    color: "#E11D48",
    gradient: "from-rose-600 to-stone-950",
    description: "Driving, energetic anthems built on loud electric guitar riffs, punchy drums, and powerful passionate vocals that get you hyped.",
    characteristics: ["Punchy 4/4 drum beats", "Overdriven guitar riffs & power chords", "Raw passionate vocal delivery", "High-energy stadium hooks"],
    exampleTracks: [
      { title: "Sweet Child O' Mine", artist: "Guns N' Roses", year: "1987" },
      { title: "Smells Like Teen Spirit", artist: "Nirvana", year: "1991" },
      { title: "Back in Black", artist: "AC/DC", year: "1980" },
      { title: "Seven Nation Army", artist: "The White Stripes", year: "2003" },
      { title: "Livin' on a Prayer", artist: "Bon Jovi", year: "1986" }
    ]
  },
  {
    id: "electronic",
    name: "Electronic / EDM",
    category: "Digital & Synthesized",
    color: "#06B6D4",
    gradient: "from-cyan-500 to-blue-900",
    description: "Pumping festival beats with energetic synthesizer melodies, tension-building risers, and euphoric bass drops.",
    characteristics: ["Synthesizer leads & arpeggios", "Massive energetic drops", "128 BPM festival rhythm", "Crisp digital sound design"],
    exampleTracks: [
      { title: "Levels", artist: "Avicii", year: "2011" },
      { title: "Clarity", artist: "Zedd ft. Foxes", year: "2012" },
      { title: "Titanium", artist: "David Guetta ft. Sia", year: "2011" },
      { title: "Wake Me Up", artist: "Avicii", year: "2013" },
      { title: "Strobe", artist: "deadmau5", year: "2009" }
    ]
  },
  {
    id: "lofi",
    name: "Lo-Fi Chillhop",
    category: "Atmospheric & Study",
    color: "#8B5CF6",
    gradient: "from-purple-500 to-indigo-950",
    description: "Calming background beats with vinyl crackle, cozy dusty piano chords, and sleepy hip-hop drums made for studying or relaxing.",
    characteristics: ["Warm vinyl static & tape flutter", "Mellow jazzy piano chords", "Laid-back unhurried drums", "Peaceful study vibe"],
    exampleTracks: [
      { title: "Affection", artist: "Jinsang", year: "2016" },
      { title: "Snowman", artist: "WYS", year: "2020" },
      { title: "controlla", artist: "Idealism", year: "2017" },
      { title: "Again", artist: "Wun Two", year: "2015" },
      { title: "5:32pm", artist: "The Deli", year: "2016" }
    ]
  },
  {
    id: "synthwave",
    name: "Synthwave / Cyber",
    category: "Retro & Neon",
    color: "#EC4899",
    gradient: "from-pink-600 to-purple-950",
    description: "80s retro-futuristic soundscapes with pulsing analog synths, gated reverb drums, and late-night cyberpunk driving vibes.",
    characteristics: ["Analog synthesizer arpeggios", "Gated reverb snare drums", "Nostalgic 1980s aesthetic", "Neon night-drive tempo"],
    exampleTracks: [
      { title: "Resonance", artist: "HOME", year: "2014" },
      { title: "Tech Noir", artist: "Gunship", year: "2015" },
      { title: "Nightcall", artist: "Kavinsky", year: "2010" },
      { title: "Endless Summer", artist: "The Midnight", year: "2016" },
      { title: "Turbo Killer", artist: "Carpenter Brut", year: "2015" }
    ]
  },
  {
    id: "indie",
    name: "Indie Rock / Alternative",
    category: "Alternative & Garage",
    color: "#14B8A6",
    gradient: "from-teal-500 to-emerald-950",
    description: "Creative, authentic and atmospheric music with jangly guitars, introspective lyrics, and genuine DIY spirit.",
    characteristics: ["Jangle electric guitars", "Honest emotional vocals", "Atmospheric indie production", "Thoughtful poetic lyrics"],
    exampleTracks: [
      { title: "Do I Wanna Know?", artist: "Arctic Monkeys", year: "2013" },
      { title: "Somebody Told Me", artist: "The Killers", year: "2004" },
      { title: "Take Me Out", artist: "Franz Ferdinand", year: "2004" },
      { title: "Sweater Weather", artist: "The Neighbourhood", year: "2013" },
      { title: "Float On", artist: "Modest Mouse", year: "2004" }
    ]
  },
  {
    id: "rnb",
    name: "R&B / Neo-Soul",
    category: "Urban & Groove",
    color: "#F43F5E",
    gradient: "from-rose-500 to-zinc-950",
    description: "Silky smooth vocals, dreamy electric keyboards, and romantic slow-groove basslines that set a cozy late-night mood.",
    characteristics: ["Silky falsetto & rich vocal runs", "Lush Rhodes electric piano", "Unhurried pocket bass groove", "Sensual heartfelt themes"],
    exampleTracks: [
      { title: "Earned It", artist: "The Weeknd", year: "2015" },
      { title: "Redbone", artist: "Childish Gambino", year: "2016" },
      { title: "Leave the Door Open", artist: "Silk Sonic (Bruno Mars & Anderson .Paak)", year: "2021" },
      { title: "Location", artist: "Khalid", year: "2017" },
      { title: "Best Part", artist: "Daniel Caesar ft. H.E.R.", year: "2017" }
    ]
  },
  {
    id: "ambient",
    name: "Ambient & Drone",
    category: "Texture & Soundscape",
    color: "#6366F1",
    gradient: "from-indigo-600 to-slate-950",
    description: "Weightless atmospheric sounds, soothing echo effects, and calm continuous tones designed for deep relaxation or meditation.",
    characteristics: ["Expansive reverberant echoes", "Absence of rigid beats", "Meditative calming frequencies", "Dreamy textures"],
    exampleTracks: [
      { title: "An Ending (Ascent)", artist: "Brian Eno", year: "1983" },
      { title: "Weightless", artist: "Marconi Union", year: "2011" },
      { title: "Avril 14th", artist: "Aphex Twin", year: "2001" },
      { title: "Treefingers", artist: "Radiohead", year: "2000" },
      { title: "Dayvan Cowboy", artist: "Boards of Canada", year: "2005" }
    ]
  },
  {
    id: "punk",
    name: "Punk Rock",
    category: "Fast & Rebellious",
    color: "#EF4444",
    gradient: "from-red-500 to-stone-950",
    description: "Super fast, raw and rebellious tracks with loud crunchy three-chord guitars, speedy drum beats, and shouted lyrics.",
    characteristics: ["Blistering fast 180+ BPM tempos", "Simple loud three-chord power riffs", "Anthemic shouted vocals", "High-energy rebellion"],
    exampleTracks: [
      { title: "Blitzkrieg Bop", artist: "Ramones", year: "1976" },
      { title: "Basket Case", artist: "Green Day", year: "1994" },
      { title: "All the Small Things", artist: "blink-182", year: "1999" },
      { title: "Anarchy in the U.K.", artist: "Sex Pistols", year: "1977" },
      { title: "The Middle", artist: "Jimmy Eat World", year: "2001" }
    ]
  },
  {
    id: "funk",
    name: "Funk & Groove",
    category: "Rhythm & Syncopation",
    color: "#F59E0B",
    gradient: "from-amber-500 to-stone-950",
    description: "Unstoppable infectious dance grooves driven by slapping bass, punchy brass horns, and irresistible syncopated rhythms.",
    characteristics: ["Heavy emphasis on beat 1", "Slap electric basslines", "Punchy brass horns", "Irresistible danceable pocket"],
    exampleTracks: [
      { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", year: "2014" },
      { title: "Superstition", artist: "Stevie Wonder", year: "1972" },
      { title: "Get Lucky", artist: "Daft Punk ft. Pharrell Williams", year: "2013" },
      { title: "Give Up the Funk", artist: "Parliament", year: "1975" },
      { title: "Pick Up the Pieces", artist: "Average White Band", year: "1974" }
    ]
  },
  {
    id: "latin",
    name: "Latin / Reggaeton",
    category: "Global & Tropical",
    color: "#10B981",
    gradient: "from-emerald-500 to-neutral-950",
    description: "Vibrant tropical party rhythms powered by the bouncy Dembow drum pattern, acoustic montuno pianos, and infectious festive energy.",
    characteristics: ["Infectious Dembow drum beat", "Montuno acoustic piano riffs", "Tropical conga & bongo percussion", "Festive danceable hooks"],
    exampleTracks: [
      { title: "Despacito", artist: "Luis Fonsi ft. Daddy Yankee", year: "2017" },
      { title: "Dákiti", artist: "Bad Bunny & Jhay Cortez", year: "2020" },
      { title: "Gasolina", artist: "Daddy Yankee", year: "2004" },
      { title: "Havana", artist: "Camila Cabello ft. Young Thug", year: "2017" },
      { title: "Mi Gente", artist: "J Balvin & Willy William", year: "2017" }
    ]
  },
  {
    id: "folk",
    name: "Acoustic Folk",
    category: "Acoustic & Storytelling",
    color: "#84CC16",
    gradient: "from-lime-600 to-stone-950",
    description: "Intimate and heartfelt songs played on fingerpicked acoustic guitars, harmonicas, and warm natural voices singing meaningful stories.",
    characteristics: ["Fingerpicked acoustic guitar", "Warm natural vocal delivery", "Harmonica & mandolin accents", "Poetic narrative lyricism"],
    exampleTracks: [
      { title: "Blowin' in the Wind", artist: "Bob Dylan", year: "1963" },
      { title: "The Sound of Silence", artist: "Simon & Garfunkel", year: "1964" },
      { title: "Ho Hey", artist: "The Lumineers", year: "2012" },
      { title: "Little Lion Man", artist: "Mumford & Sons", year: "2009" },
      { title: "Fast Car", artist: "Tracy Chapman", year: "1988" }
    ]
  },

  // --- Indian Music Genres & Regional Traditions ---
  {
    id: "punjabi",
    name: "Punjabi / Bhangra & Hip-Hop",
    category: "Indian Regional",
    color: "#F59E0B",
    gradient: "from-amber-500 to-orange-950",
    description: "High-octane energetic beats driven by traditional Punjabi Dhol rhythms, tumbi strings, vibrant folk vocal hooks, and modern hard-hitting trap beats.",
    characteristics: ["Thunderous Punjabi Dhol & Tumbi riffs", "High-energy Chaal beat rhythm", "Vibrant folk & urban melodic hooks", "Celebratory swagger & upbeat tempos"],
    exampleTracks: [
      { title: "Kangna Tera Ni", artist: "Dr Zeus & Lehmber Hussainpuri", year: "2003" },
      { title: "Brown Munde", artist: "AP Dhillon, Gurinder Gill & Shinda Kahlon", year: "2020" },
      { title: "295", artist: "Sidhu Moose Wala", year: "2021" },
      { title: "Lover", artist: "Diljit Dosanjh", year: "2021" },
      { title: "Mundian To Bach Ke", artist: "Panjabi MC", year: "1998" }
    ]
  },
  {
    id: "haryanvi",
    name: "Haryanvi / Ragni & Desi Beats",
    category: "Indian Regional",
    color: "#E11D48",
    gradient: "from-rose-600 to-red-950",
    description: "Punchy, dynamic and bass-heavy desi anthems rooted in Haryanvi folk Ragni melodies, raw acoustic dholak, chimta, and modern club synthesizers.",
    characteristics: ["Punchy heavy 808 sub-bass & desi Dholak", "Distinct earthy colloquial vocal delivery", "Folk Ragni melodies & chimta clatter", "Viral energetic dance anthems"],
    exampleTracks: [
      { title: "Solid Body", artist: "Raju Punjabi & Sheenam Katholic", year: "2015" },
      { title: "52 Gaj Ka Daman", artist: "Renuka Panwar", year: "2020" },
      { title: "Teri Aakhya Ka Yo Kajal", artist: "DC Madana", year: "2018" },
      { title: "Goli Chal Javegi", artist: "Pradeep Boora & Pooja Hooda", year: "2017" },
      { title: "Chatak Matak", artist: "Renuka Panwar & Sapna Choudhary", year: "2020" }
    ]
  },
  {
    id: "bhojpuri",
    name: "Bhojpuri / Bihari Folk & Beats",
    category: "Indian Regional",
    color: "#D97706",
    gradient: "from-yellow-600 to-orange-900",
    description: "Lively folk and electronic beats featuring the syncopated dholak, harmonium, casio synths, and high-energy celebratory singing popular across Bihar and UP.",
    characteristics: ["Fast syncopated Bihari Dholak & kartal", "Lively accordion & harmonium counter-melodies", "Call-and-response upbeat vocal cadences", "Festive folk wedding and Chhath rhythms"],
    exampleTracks: [
      { title: "Lollypop Lagelu", artist: "Pawan Singh", year: "2008" },
      { title: "Raja Ji", artist: "Khesari Lal Yadav", year: "2019" },
      { title: "Piyawa Se Pahile", artist: "Ritesh Pandey", year: "2017" },
      { title: "Dhibari Me Rahue Na Tel", artist: "Pawan Singh", year: "2021" },
      { title: "Chhath Ghate Chali", artist: "Sharda Sinha", year: "1995" }
    ]
  },
  {
    id: "bollywood",
    name: "Bollywood / Filmi",
    category: "Indian Classical & Fusion",
    color: "#EC4899",
    gradient: "from-pink-600 to-purple-950",
    description: "The grand cinematic musical style of Indian cinema, blending lush Western orchestral strings with traditional Indian instruments like tabla, sitar, and bansuri.",
    characteristics: ["Rich melodic film orchestration", "Tabla, dholak, and bansuri flute leads", "Virtuosic playback singing with emotive vibrato", "Fusion of Indian classical and Western pop"],
    exampleTracks: [
      { title: "Chaiyya Chaiyya", artist: "A.R. Rahman & Sukhwinder Singh", year: "1998" },
      { title: "Tum Hi Ho", artist: "Arijit Singh & Mithoon", year: "2013" },
      { title: "Kal Ho Naa Ho", artist: "Sonu Nigam & Shankar-Ehsaan-Loy", year: "2003" },
      { title: "Kesariya", artist: "Arijit Singh & Pritam", year: "2022" },
      { title: "Tere Bina", artist: "A.R. Rahman & Chinmayi", year: "2007" }
    ]
  },
  {
    id: "indian_classical",
    name: "Indian Classical (Hindustani & Carnatic)",
    category: "Indian Classical & Fusion",
    color: "#8B5CF6",
    gradient: "from-purple-600 to-indigo-950",
    description: "Ancient, meditative modal tradition built on melodic Ragas and rhythmic Talas, featuring virtuosic acoustic sitar, sarod, tabla, and bansuri flutes.",
    characteristics: ["Elaborate Raga scale development", "Microtonal ornamentation (meend & gamak)", "Complex rhythmic cycles (Tala & teental)", "Acoustic sitar, tabla, tanpura & bansuri"],
    exampleTracks: [
      { title: "Raga Yaman (Evening Sitar)", artist: "Pandit Ravi Shankar", year: "1968" },
      { title: "Bhoopali Bansuri Meditation", artist: "Pandit Hariprasad Chaurasia", year: "1984" },
      { title: "Raga Darbari Sarod", artist: "Ustad Amjad Ali Khan", year: "1990" },
      { title: "Vatapi Ganapatim (Carnatic)", artist: "M.S. Subbulakshmi", year: "1972" },
      { title: "Tabla Teental Solo", artist: "Ustad Zakir Hussain", year: "1987" }
    ]
  },
  {
    id: "sufi_qawwali",
    name: "Sufi & Qawwali",
    category: "Indian Classical & Fusion",
    color: "#059669",
    gradient: "from-emerald-600 to-teal-950",
    description: "Spiritual, ecstatic devotional poetry driven by rhythmic handclaps, pumping harmoniums, dholak percussion, and soaring impassioned vocal crescendos.",
    characteristics: ["Rhythmic syncopated group handclapping", "Driving acoustic harmonium chords", "Impassioned vocal improvisations (Alaap)", "Trance-inducing spiritual crescendo builds"],
    exampleTracks: [
      { title: "Dama Dam Mast Qalandar", artist: "Nusrat Fateh Ali Khan", year: "1988" },
      { title: "Kun Faya Kun", artist: "A.R. Rahman, Javed Ali & Mohit Chauhan", year: "2011" },
      { title: "Piya Haji Ali", artist: "A.R. Rahman & Ghulam Mustafa Khan", year: "2000" },
      { title: "Chaap Tilak Sab Cheeni", artist: "Abida Parveen & Rahat Fateh Ali Khan", year: "2016" },
      { title: "Bhar Do Jholi Meri", artist: "Sabri Brothers", year: "1975" }
    ]
  }
];
