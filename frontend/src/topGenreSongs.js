// Curated top 10 iconic tracks per genre, split by culture / regional origin (e.g. Hindi/Indian vs Global)
// This ensures that when a Hindi/Indian track is classified (even as Pop, Blues, Folk, Rock or Classical),
// vibecheck.ai suggests the top 10 relevant Hindi/Indian songs, and for Western tracks it suggests the top 10 global hits.

export const TOP_GENRE_SONGS = {
  reggae: {
    global: [
      { title: "Three Little Birds", artist: "Bob Marley & The Wailers", year: "1977" },
      { title: "Could You Be Loved", artist: "Bob Marley", year: "1980" },
      { title: "Red Red Wine", artist: "UB40", year: "1983" },
      { title: "Welcome to Jamrock", artist: "Damian Marley", year: "2005" },
      { title: "54-46 Was My Number", artist: "Toots and the Maytals", year: "1968" },
      { title: "No Woman, No Cry", artist: "Bob Marley & The Wailers", year: "1974" },
      { title: "One Love / People Get Ready", artist: "Bob Marley", year: "1977" },
      { title: "Bad Boys", artist: "Inner Circle", year: "1987" },
      { title: "Sweat (A La La La La Long)", artist: "Inner Circle", year: "1992" },
      { title: "I Shot The Sheriff", artist: "Eric Clapton & Bob Marley", year: "1974" }
    ],
    indian: [
      { title: "Sun Mere Humsafar (Reggae Groove Mix)", artist: "Akhil Sachdeva & Mansheel", year: "2017" },
      { title: "Dard-E-Disco (Reggae Vibe)", artist: "Sukhwinder Singh & Vishal-Shekhar", year: "2007" },
      { title: "Duma Dum (Reggae Dub)", artist: "Ska Vengers", year: "2012" },
      { title: "Modi Aani Re (Reggae Roots)", artist: "Delhi Sultanate & Begum X", year: "2015" },
      { title: "Frankie Bollywood", artist: "The Ska Vengers", year: "2016" },
      { title: "Jailhouse (Indian Dub)", artist: "Reggae Rajahs", year: "2013" },
      { title: "Roots & Culture Desi", artist: "Dakta Dub", year: "2018" },
      { title: "Rasta Man In Mumbai", artist: "Apache Indian", year: "1993" },
      { title: "Arranged Marriage", artist: "Apache Indian", year: "1992" },
      { title: "Boom Shack-A-Lak", artist: "Apache Indian", year: "1993" }
    ]
  },
  pop: {
    global: [
      { title: "Blinding Lights", artist: "The Weeknd", year: "2019" },
      { title: "Billie Jean", artist: "Michael Jackson", year: "1982" },
      { title: "Shape of You", artist: "Ed Sheeran", year: "2017" },
      { title: "As It Was", artist: "Harry Styles", year: "2022" },
      { title: "Levitating", artist: "Dua Lipa", year: "2020" },
      { title: "Bad Guy", artist: "Billie Eilish", year: "2019" },
      { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", year: "2014" },
      { title: "Cruel Summer", artist: "Taylor Swift", year: "2019" },
      { title: "Starboy", artist: "The Weeknd ft. Daft Punk", year: "2016" },
      { title: "Rolling in the Deep", artist: "Adele", year: "2010" }
    ],
    indian: [
      { title: "Kesariya", artist: "Arijit Singh & Pritam", year: "2022" },
      { title: "Tum Hi Ho", artist: "Arijit Singh & Mithoon", year: "2013" },
      { title: "Apna Bana Le", artist: "Arijit Singh & Sachin-Jigar", year: "2022" },
      { title: "Raataan Lambiyan", artist: "Jubin Nautiyal & Asees Kaur", year: "2021" },
      { title: "Pee Loon", artist: "Mohit Chauhan & Pritam", year: "2010" },
      { title: "Shayad", artist: "Arijit Singh & Pritam", year: "2020" },
      { title: "Heeriye", artist: "Jasleen Royal & Arijit Singh", year: "2023" },
      { title: "Kal Ho Naa Ho", artist: "Sonu Nigam & Shankar-Ehsaan-Loy", year: "2003" },
      { title: "Channa Mereya", artist: "Arijit Singh & Pritam", year: "2016" },
      { title: "Agar Tum Saath Ho", artist: "Alka Yagnik & Arijit Singh", year: "2015" }
    ]
  },
  rock: {
    global: [
      { title: "Sweet Child O' Mine", artist: "Guns N' Roses", year: "1987" },
      { title: "Smells Like Teen Spirit", artist: "Nirvana", year: "1991" },
      { title: "Back in Black", artist: "AC/DC", year: "1980" },
      { title: "Seven Nation Army", artist: "The White Stripes", year: "2003" },
      { title: "Livin' on a Prayer", artist: "Bon Jovi", year: "1986" },
      { title: "Hotel California", artist: "Eagles", year: "1976" },
      { title: "Stairway to Heaven", artist: "Led Zeppelin", year: "1971" },
      { title: "Bohemian Rhapsody", artist: "Queen", year: "1975" },
      { title: "In the End", artist: "Linkin Park", year: "2000" },
      { title: "Dream On", artist: "Aerosmith", year: "1973" }
    ],
    indian: [
      { title: "Sadda Haq", artist: "Mohit Chauhan & A.R. Rahman", year: "2011" },
      { title: "Nadaan Parinde", artist: "A.R. Rahman & Mohit Chauhan", year: "2011" },
      { title: "Rock On!!", artist: "Farhan Akhtar & Shankar-Ehsaan-Loy", year: "2008" },
      { title: "Bhaag D.K. Bose", artist: "Ram Sampath", year: "2011" },
      { title: "Pichle Saat Dinon Mein", artist: "Farhan Akhtar", year: "2008" },
      { title: "Sayonee", artist: "Junoon", year: "1997" },
      { title: "Jazba", artist: "Junoon", year: "1996" },
      { title: "Khajuraho Rock", artist: "Indian Ocean", year: "2000" },
      { title: "Kandisa", artist: "Indian Ocean", year: "2000" },
      { title: "Bandeh", artist: "Indian Ocean (Black Friday)", year: "2004" }
    ]
  },
  blues: {
    global: [
      { title: "The Thrill Is Gone", artist: "B.B. King", year: "1969" },
      { title: "Sweet Home Chicago", artist: "Buddy Guy", year: "1991" },
      { title: "Cross Road Blues", artist: "Robert Johnson", year: "1936" },
      { title: "Pride and Joy", artist: "Stevie Ray Vaughan", year: "1983" },
      { title: "Mannish Boy", artist: "Muddy Waters", year: "1955" },
      { title: "Red House", artist: "Jimi Hendrix", year: "1967" },
      { title: "Born Under a Bad Sign", artist: "Albert King", year: "1967" },
      { title: "Stormy Monday", artist: "T-Bone Walker", year: "1947" },
      { title: "Texas Flood", artist: "Stevie Ray Vaughan", year: "1983" },
      { title: "Ain't No Sunshine", artist: "Bill Withers", year: "1971" }
    ],
    indian: [
      { title: "Meri Aashiqui (Blues Acoustic)", artist: "Arijit Singh & Mithoon", year: "2013" },
      { title: "Kabira (Acoustic Soul)", artist: "Tochi Raina & Rekha Bhardwaj", year: "2013" },
      { title: "Maula Mere Maula", artist: "Roopkumar Rathod", year: "2007" },
      { title: "Tu Kisi Rail Si", artist: "Swanand Kirkire & Indian Ocean", year: "2015" },
      { title: "Iktara (Soulful Blues Version)", artist: "Kavita Seth & Amit Trivedi", year: "2009" },
      { title: "Bulleya (Sufi Blues)", artist: "Papon & Pritam", year: "2016" },
      { title: "Alvida (Blues Rock)", artist: "KK & Pritam", year: "2007" },
      { title: "Aoge Jab Tum", artist: "Ustad Rashid Khan", year: "2007" },
      { title: "Jiya Dhadak Dhadak Jaye", artist: "Rahat Fateh Ali Khan", year: "2005" },
      { title: "Phir Le Aya Dil (Bluesy Ghazal)", artist: "Arijit Singh & Pritam", year: "2012" }
    ]
  },
  classical: {
    global: [
      { title: "Nocturne Op. 9 No. 2", artist: "Frédéric Chopin", year: "1832" },
      { title: "Clair de Lune", artist: "Claude Debussy", year: "1905" },
      { title: "Symphony No. 5 in C Minor", artist: "Ludwig van Beethoven", year: "1808" },
      { title: "Canon in D", artist: "Johann Pachelbel", year: "1680" },
      { title: "Four Seasons (Spring)", artist: "Antonio Vivaldi", year: "1723" },
      { title: "Für Elise", artist: "Ludwig van Beethoven", year: "1810" },
      { title: "Air on the G String", artist: "Johann Sebastian Bach", year: "1730" },
      { title: "Moonlight Sonata (1st Movement)", artist: "Ludwig van Beethoven", year: "1801" },
      { title: "Swan Lake (Scene)", artist: "Pyotr Ilyich Tchaikovsky", year: "1876" },
      { title: "Gymnopédie No. 1", artist: "Erik Satie", year: "1888" }
    ],
    indian: [
      { title: "Raga Yaman (Evening Sitar)", artist: "Pandit Ravi Shankar", year: "1968" },
      { title: "Bhoopali Bansuri Meditation", artist: "Pandit Hariprasad Chaurasia", year: "1984" },
      { title: "Raga Darbari Sarod", artist: "Ustad Amjad Ali Khan", year: "1990" },
      { title: "Vatapi Ganapatim (Carnatic)", artist: "M.S. Subbulakshmi", year: "1972" },
      { title: "Tabla Teental Solo (16 Beats)", artist: "Ustad Zakir Hussain", year: "1987" },
      { title: "Raga Bhairavi (Shehnai & Sitar)", artist: "Ustad Bismillah Khan & Ravi Shankar", year: "1964" },
      { title: "Raga Malkauns (Sarangi Melody)", artist: "Pandit Ram Narayan", year: "1975" },
      { title: "Raga Bageshree (Santoor)", artist: "Pandit Shivkumar Sharma", year: "1986" },
      { title: "Albela Sajan Aayo Re (Ahir Bhairav)", artist: "Ustad Sultan Khan & Shankar Mahadevan", year: "1999" },
      { title: "Ghoomar (Traditional Rajasthani Classical)", artist: "Swaroop Khan & Shreya Ghoshal", year: "2018" }
    ]
  },
  hiphop: {
    global: [
      { title: "Lose Yourself", artist: "Eminem", year: "2002" },
      { title: "Juicy", artist: "The Notorious B.I.G.", year: "1994" },
      { title: "HUMBLE.", artist: "Kendrick Lamar", year: "2017" },
      { title: "N.Y. State of Mind", artist: "Nas", year: "1994" },
      { title: "God's Plan", artist: "Drake", year: "2018" },
      { title: "California Love", artist: "2Pac ft. Dr. Dre", year: "1995" },
      { title: "In Da Club", artist: "50 Cent", year: "2003" },
      { title: "Sicko Mode", artist: "Travis Scott", year: "2018" },
      { title: "SICKO MODE", artist: "Travis Scott & Drake", year: "2018" },
      { title: "All of the Lights", artist: "Kanye West", year: "2010" }
    ],
    indian: [
      { title: "Meri Gully Mein", artist: "DIVINE & Naezy", year: "2015" },
      { title: "Apna Time Aayega", artist: "Ranveer Singh & DIVINE", year: "2019" },
      { title: "Kaam 25", artist: "DIVINE", year: "2018" },
      { title: "Machayenge", artist: "Emiway Bantai", year: "2019" },
      { title: "Mirchi", artist: "DIVINE ft. MC Altaf, Phenom & Stylz", year: "2020" },
      { title: "Kohinoor", artist: "DIVINE", year: "2019" },
      { title: "Khatta Sadak", artist: "Seedhe Maut & Sez On The Beat", year: "2019" },
      { title: "Namastute", artist: "Seedhe Maut", year: "2021" },
      { title: "Asal G Hustle", artist: "MC Stan", year: "2021" },
      { title: "Basti Ka Hasti", artist: "MC Stan", year: "2022" }
    ]
  },
  disco: {
    global: [
      { title: "Stayin' Alive", artist: "Bee Gees", year: "1977" },
      { title: "Le Freak", artist: "CHIC", year: "1978" },
      { title: "I Will Survive", artist: "Gloria Gaynor", year: "1978" },
      { title: "September", artist: "Earth, Wind & Fire", year: "1978" },
      { title: "Don't Stop 'Til You Get Enough", artist: "Michael Jackson", year: "1979" },
      { title: "Disco Inferno", artist: "The Trammps", year: "1976" },
      { title: "Y.M.C.A.", artist: "Village People", year: "1978" },
      { title: "Hot Stuff", artist: "Donna Summer", year: "1979" },
      { title: "Celebration", artist: "Kool & The Gang", year: "1980" },
      { title: "Boogie Wonderland", artist: "Earth, Wind & Fire", year: "1979" }
    ],
    indian: [
      { title: "Disco Deewane", artist: "Nazia Hassan & Biddu", year: "1981" },
      { title: "I Am A Disco Dancer", artist: "Vijay Benedict & Bappi Lahiri", year: "1982" },
      { title: "Jimmy Jimmy Jimmy Aaja", artist: "Parvati Khan & Bappi Lahiri", year: "1982" },
      { title: "Aap Jaisa Koi", artist: "Nazia Hassan & Biddu", year: "1980" },
      { title: "Jawani Jan-E-Man", artist: "Asha Bhosle & Bappi Lahiri", year: "1982" },
      { title: "Raat Baaki Baat Baaki", artist: "Bappi Lahiri & Asha Bhosle", year: "1982" },
      { title: "Yaar Bina Chain Kaha Re", artist: "S. Janaki & Bappi Lahiri", year: "1985" },
      { title: "The Disco Song (SOTY)", artist: "Sunidhi Chauhan & Vishal-Shekhar", year: "2012" },
      { title: "It's The Time To Disco", artist: "Shaan, KK & Vasundhara Das", year: "2003" },
      { title: "Where's The Party Tonight", artist: "Shaan, Vasundhara Das & Shankar-Ehsaan-Loy", year: "2006" }
    ]
  },
  jazz: {
    global: [
      { title: "Fly Me to the Moon", artist: "Frank Sinatra", year: "1964" },
      { title: "So What", artist: "Miles Davis", year: "1959" },
      { title: "Take Five", artist: "The Dave Brubeck Quartet", year: "1959" },
      { title: "Autumn Leaves", artist: "Cannonball Adderley & Miles Davis", year: "1958" },
      { title: "What a Wonderful World", artist: "Louis Armstrong", year: "1967" },
      { title: "My Favorite Things", artist: "John Coltrane", year: "1961" },
      { title: "Round Midnight", artist: "Thelonious Monk", year: "1944" },
      { title: "Blue in Green", artist: "Miles Davis & Bill Evans", year: "1959" },
      { title: "Cantaloupe Island", artist: "Herbie Hancock", year: "1964" },
      { title: "Feeling Good", artist: "Nina Simone", year: "1965" }
    ],
    indian: [
      { title: "Pyar Encore (Jazz / Lofi Vibe)", artist: "Nanku & Lambo Drive", year: "2023" },
      { title: "Kaisi Paheli Zindagani (Jazz Hindi)", artist: "Sunidhi Chauhan & Shantanu Moitra", year: "2005" },
      { title: "Muskaanein Jhooti Hai (Talaash Jazz)", artist: "Suman Sridhar & Ram Sampath", year: "2012" },
      { title: "Mohabbat Buri Bimari (Bombay Velvet)", artist: "Shalmali Kholgade & Amit Trivedi", year: "2015" },
      { title: "Girls Like To Swing", artist: "Sunidhi Chauhan & Shankar-Ehsaan-Loy", year: "2015" },
      { title: "Dheemi Dheemi (1947 Earth)", artist: "Hariharan & A.R. Rahman", year: "1999" },
      { title: "Fifi (Bombay Velvet)", artist: "Suman Sridhar & Amit Trivedi", year: "2015" },
      { title: "Darbaan (Indie Jazz Vibe)", artist: "Ankur Tewari", year: "2020" },
      { title: "Baawra (Jazz Fusion)", artist: "Swanand Kirkire & Shantanu Moitra", year: "2010" },
      { title: "Chhoti Si Umar Mein (Folk Jazz)", artist: "Mame Khan & Amit Trivedi", year: "2015" }
    ]
  },
  metal: {
    global: [
      { title: "Master of Puppets", artist: "Metallica", year: "1986" },
      { title: "Enter Sandman", artist: "Metallica", year: "1991" },
      { title: "Paranoid", artist: "Black Sabbath", year: "1970" },
      { title: "The Trooper", artist: "Iron Maiden", year: "1983" },
      { title: "Chop Suey!", artist: "System of a Down", year: "2001" },
      { title: "Holy Wars... The Punishment Due", artist: "Megadeth", year: "1990" },
      { title: "Painkiller", artist: "Judas Priest", year: "1990" },
      { title: "Walk", artist: "Pantera", year: "1992" },
      { title: "Duality", artist: "Slipknot", year: "2004" },
      { title: "Toxicity", artist: "System of a Down", year: "2001" }
    ],
    indian: [
      { title: "Maa Rewa (Indian Folk Metal)", artist: "Bloodywood", year: "2019" },
      { title: "Ari Ari (Desi Punjabi Metal)", artist: "Bloodywood", year: "2018" },
      { title: "Gaddaar (Heavy Hindi Metal)", artist: "Bloodywood", year: "2022" },
      { title: "Jee Veerey", artist: "Bloodywood", year: "2018" },
      { title: "Dana Dan", artist: "Bloodywood", year: "2022" },
      { title: "Acrophobia", artist: "Demonic Resurrection", year: "2005" },
      { title: "The Unrelenting Surge of Vengeance", artist: "Demonic Resurrection", year: "2010" },
      { title: "Nonsense Crusader", artist: "Scribe", year: "2010" },
      { title: "Desi Metal Anthem", artist: "Bhayanak Maut", year: "2009" },
      { title: "Machhar Ka Jhol", artist: "Undying Inc", year: "2014" }
    ]
  },
  country: {
    global: [
      { title: "Take Me Home, Country Roads", artist: "John Denver", year: "1971" },
      { title: "Ring of Fire", artist: "Johnny Cash", year: "1963" },
      { title: "Jolene", artist: "Dolly Parton", year: "1973" },
      { title: "Tennessee Whiskey", artist: "Chris Stapleton", year: "2015" },
      { title: "Before He Cheats", artist: "Carrie Underwood", year: "2005" },
      { title: "The Gambler", artist: "Kenny Rogers", year: "1978" },
      { title: "Friends in Low Places", artist: "Garth Brooks", year: "1990" },
      { title: "Man! I Feel Like A Woman!", artist: "Shania Twain", year: "1997" },
      { title: "Wagon Wheel", artist: "Darius Rucker", year: "2013" },
      { title: "I Walk the Line", artist: "Johnny Cash", year: "1956" }
    ],
    indian: [
      { title: "Kabira (Acoustic Folk Country)", artist: "Tochi Raina & Rekha Bhardwaj", year: "2013" },
      { title: "Chaudhary", artist: "Mame Khan & Amit Trivedi", year: "2012" },
      { title: "Khaabon Ke Parinday", artist: "Mohit Chauhan & Alyssa Mendonsa", year: "2011" },
      { title: "Safarnama", artist: "Lucky Ali & A.R. Rahman", year: "2015" },
      { title: "Hairat (Road Trip Vibe)", artist: "Lucky Ali & Vishal-Shekhar", year: "2010" },
      { title: "Patakha Guddi (Highway)", artist: "Sultana & Jyoti Nooran", year: "2014" },
      { title: "O Humdum Suniyo Re (Acoustic)", artist: "KK & Shaan", year: "2002" },
      { title: "Ilahi", artist: "Arijit Singh & Pritam", year: "2013" },
      { title: "Yun Hi Chala Chal", artist: "Udit Narayan, Hariharan & Kailash Kher", year: "2004" },
      { title: "Maahi Ve (Highway)", artist: "A.R. Rahman", year: "2014" }
    ]
  },
  punjabi: {
    indian: [
      { title: "Kangna Tera Ni", artist: "Dr Zeus & Lehmber Hussainpuri", year: "2003" },
      { title: "Brown Munde", artist: "AP Dhillon, Gurinder Gill & Shinda Kahlon", year: "2020" },
      { title: "295", artist: "Sidhu Moose Wala", year: "2021" },
      { title: "Lover", artist: "Diljit Dosanjh", year: "2021" },
      { title: "Mundian To Bach Ke", artist: "Panjabi MC", year: "1998" },
      { title: "Excuses", artist: "AP Dhillon & Gurinder Gill", year: "2020" },
      { title: "So High", artist: "Sidhu Moose Wala", year: "2017" },
      { title: "G.O.A.T.", artist: "Diljit Dosanjh", year: "2020" },
      { title: "Same Beef", artist: "Bohemia & Sidhu Moose Wala", year: "2019" },
      { title: "High Rated Gabru", artist: "Guru Randhawa", year: "2017" }
    ]
  },
  haryanvi: {
    indian: [
      { title: "52 Gaj Ka Daman", artist: "Renuka Panwar", year: "2020" },
      { title: "Solid Body", artist: "Raju Punjabi & Sheenam Katholic", year: "2015" },
      { title: "Teri Aakhya Ka Yo Kajal", artist: "DC Madana", year: "2018" },
      { title: "Chatak Matak", artist: "Renuka Panwar & Sapna Choudhary", year: "2020" },
      { title: "Goli Chal Javegi", artist: "Pradeep Boora & Pooja Hooda", year: "2017" },
      { title: "Chetak", artist: "Sapna Choudhary & Raj Mawar", year: "2018" },
      { title: "Badli Badli Laage", artist: "Vicky Kajla", year: "2017" },
      { title: "Moto", artist: "Diler Kharkiya", year: "2020" },
      { title: "Gulzar Chhaniwala (Desi Billo)", artist: "Gulzar Chhaniwala", year: "2019" },
      { title: "Middle Class", artist: "Gulzar Chhaniwala", year: "2019" }
    ]
  },
  bhojpuri: {
    indian: [
      { title: "Lollypop Lagelu", artist: "Pawan Singh", year: "2008" },
      { title: "Raja Ji", artist: "Khesari Lal Yadav", year: "2019" },
      { title: "Piyawa Se Pahile", artist: "Ritesh Pandey", year: "2017" },
      { title: "Dhibari Me Rahue Na Tel", artist: "Pawan Singh", year: "2021" },
      { title: "Chhath Ghate Chali", artist: "Sharda Sinha", year: "1995" },
      { title: "Hello Koun", artist: "Ritesh Pandey & Sneh Upadhya", year: "2019" },
      { title: "Maroon Color Sadiya", artist: "Pawan Singh & Kalpana", year: "2024" },
      { title: "Thik Hai", artist: "Khesari Lal Yadav", year: "2018" },
      { title: "Pudina Ae Haseena", artist: "Pawan Singh", year: "2021" },
      { title: "Raate Diya Butake", artist: "Pawan Singh & Indu Sonali", year: "2017" }
    ]
  },
  bollywood: {
    indian: [
      { title: "Chaiyya Chaiyya", artist: "A.R. Rahman & Sukhwinder Singh", year: "1998" },
      { title: "Tum Hi Ho", artist: "Arijit Singh & Mithoon", year: "2013" },
      { title: "Kal Ho Naa Ho", artist: "Sonu Nigam & Shankar-Ehsaan-Loy", year: "2003" },
      { title: "Kesariya", artist: "Arijit Singh & Pritam", year: "2022" },
      { title: "Tere Bina", artist: "A.R. Rahman & Chinmayi", year: "2007" },
      { title: "Ghungroo", artist: "Arijit Singh & Shilpa Rao", year: "2019" },
      { title: "Pee Loon", artist: "Mohit Chauhan & Pritam", year: "2010" },
      { title: "Tujh Mein Rab Dikhta Hai", artist: "Roopkumar Rathod & Salim-Sulaiman", year: "2008" },
      { title: "Balam Pichkari", artist: "Vishal Dadlani & Shalmali Kholgade", year: "2013" },
      { title: "Senorita (ZNMD)", artist: "Farhan Akhtar, Hrithik Roshan & Abhay Deol", year: "2011" }
    ]
  },
  sufi_qawwali: {
    indian: [
      { title: "Dama Dam Mast Qalandar", artist: "Nusrat Fateh Ali Khan", year: "1988" },
      { title: "Kun Faya Kun", artist: "A.R. Rahman, Javed Ali & Mohit Chauhan", year: "2011" },
      { title: "Piya Haji Ali", artist: "A.R. Rahman & Ghulam Mustafa Khan", year: "2000" },
      { title: "Chaap Tilak Sab Cheeni", artist: "Abida Parveen & Rahat Fateh Ali Khan", year: "2016" },
      { title: "Bhar Do Jholi Meri", artist: "Sabri Brothers", year: "1975" },
      { title: "Afreen Afreen", artist: "Rahat Fateh Ali Khan & Momina Mustehsan", year: "2016" },
      { title: "Tere Rashke Qamar", artist: "Nusrat Fateh Ali Khan", year: "1988" },
      { title: "Maula Mere Maula", artist: "Roopkumar Rathod", year: "2007" },
      { title: "Sanu Ik Pal Chain Na Aave", artist: "Nusrat Fateh Ali Khan", year: "1993" },
      { title: "Arziyan (Delhi-6)", artist: "Javed Ali & Kailash Kher", year: "2009" }
    ]
  }
};

/**
 * Detects whether a song title or artist is Indian / Hindi / Punjabi / Desi based on common keywords,
 * phonetic markers, Devanagari script, or Bollywood artist names.
 */
export function isIndianContext(title = "", artist = "") {
  const combined = `${title} ${artist}`.toLowerCase();
  
  // Devanagari Unicode block
  if (/[\u0900-\u097F]/.test(combined)) return true;

  const indianMarkers = [
    "pyar", "pyaar", "ishq", "mohabbat", "aashiqui", "dil", "tere", "meri", "mera", "humsafar",
    "kangna", "punjabi", "haryanvi", "bhojpuri", "bhangra", "hindi", "desi", "bollywood", "sufi",
    "qawwali", "arijit", "neha kakkar", "badshah", "honey singh", "diljit", "sidhu", "moose wala",
    "rahat", "nusrat", "kailash kher", "shreya ghoshal", "sonu nigam", "alka yagnik", "udit narayan",
    "kumar sanu", "kishore kumar", "lata mangeshkar", "mohit chauhan", "jubin nautiyal", "dr zeus",
    "lehmber", "renuka panwar", "sapna choudhary", "pawan singh", "khesari", "nanku", "lambo drive",
    "t-series", "zee music", "yrf", "warner music india", "speed records", "sony music india",
    "ap dhillon", "seedhe maut", "mc stan", "divine", "emiway", "raftaar", "kr$na", "bappi lahiri",
    "shankar-ehsaan-loy", "pritam", "mithoon", "sachin-jigar", "vishal-shekhar", "amit trivedi"
  ];

  return indianMarkers.some(marker => combined.includes(marker));
}

/**
 * Returns the top 10 recommended songs for a given genre, intelligently picking
 * Hindi/Indian songs if the input context is Indian/Hindi, or Global hits otherwise.
 */
export function getTopTenSongsForGenre(genreId = "pop", contextTitle = "", contextArtist = "") {
  const normalizedGenre = (genreId || "").toLowerCase().replace(/[^a-z_]/g, "");
  const genreBucket = TOP_GENRE_SONGS[normalizedGenre] || TOP_GENRE_SONGS["pop"];
  const isIndian = isIndianContext(contextTitle, contextArtist);

  if (isIndian && genreBucket.indian && genreBucket.indian.length > 0) {
    return {
      songs: genreBucket.indian.slice(0, 10),
      isIndian: true
    };
  }

  if (genreBucket.global && genreBucket.global.length > 0) {
    return {
      songs: genreBucket.global.slice(0, 10),
      isIndian: false
    };
  }

  if (genreBucket.indian) {
    return {
      songs: genreBucket.indian.slice(0, 10),
      isIndian: true
    };
  }

  return {
    songs: TOP_GENRE_SONGS.pop.global.slice(0, 10),
    isIndian: false
  };
}
