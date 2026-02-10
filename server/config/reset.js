import { pool } from './database.js'

const dropTables = `
  DROP TABLE IF EXISTS events;
  DROP TABLE IF EXISTS locations;
`

const createLocationsTable = `
  CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip TEXT NOT NULL,
    sport TEXT NOT NULL,
    hero_image TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
`

const createEventsTable = `
  CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    location_id INTEGER NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    price NUMERIC(8,2) DEFAULT 0,
    image TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
`

const locations = [
  {
    slug: 'gridiron-grove',
    name: 'Gridiron Grove',
    description: 'Friday night lights under the city skyline. Casual leagues and pop-up showcases make this the go-to spot for football fanatics.',
    address: '123 Championship Way',
    city: 'Dallas',
    state: 'TX',
    zip: '75201',
    sport: 'Football',
    hero_image: '/images/football1.jpg'
  },
  {
    slug: 'skyline-pitch',
    name: 'Skyline Pitch',
    description: 'A rooftop soccer haven where supporters drum up chants and freestyle battles kick off after each match.',
    address: '500 Victory Ave',
    city: 'Dallas',
    state: 'TX',
    zip: '75202',
    sport: 'Soccer',
    hero_image: '/images/soccer1.jpg'
  },
  {
    slug: 'frostbyte-forum',
    name: 'Frostbyte Forum',
    description: 'Late-night hockey showdowns meet neon lights. Bring a sweater and your best slapshot.',
    address: '88 Blueline Blvd',
    city: 'Dallas',
    state: 'TX',
    zip: '75203',
    sport: 'Hockey',
    hero_image: '/images/hockey1.jpg'
  },
  {
    slug: 'uptown-arena',
    name: 'Uptown Arena',
    description: 'Pick-up legends and local leagues share the hardwood at this buzzing basketball venue.',
    address: '220 Crosscourt St',
    city: 'Dallas',
    state: 'TX',
    zip: '75204',
    sport: 'Basketball',
    hero_image: '/images/basketball.webp'
  }
]

const events = [
  {
    locationSlug: 'gridiron-grove',
    title: 'Flag Football Kickoff Classic',
    description: 'Co-ed 7-on-7 under the lights with live DJs and food trucks.',
    start_time: '2024-09-12T23:30:00.000Z',
    price: 25,
    image: '/images/football2.webp'
  },
  {
    locationSlug: 'gridiron-grove',
    title: 'Legends Film Review Night',
    description: 'Break down pro game film with former NCAA coaches and players.',
    start_time: '2024-08-05T00:00:00.000Z',
    price: 18,
    image: '/images/football3.jpg'
  },
  {
    locationSlug: 'gridiron-grove',
    title: 'Spring Scrimmage Throwback',
    description: 'Alumni vs. current squad exhibition and tailgate.',
    start_time: '2024-03-17T19:00:00.000Z',
    price: 15,
    image: '/images/football4.jpg'
  },
  {
    locationSlug: 'gridiron-grove',
    title: 'Championship Bracket Bash',
    description: 'Postseason-style bracket with live commentary and fan prediction lounge.',
    start_time: '2025-04-12T22:00:00.000Z',
    price: 32,
    image: '/images/football2.webp'
  },
  {
    locationSlug: 'skyline-pitch',
    title: 'Midnight Futsal Frenzy',
    description: 'Fast-paced futsal tournament with glow-in-the-dark gear.',
    start_time: '2024-10-05T04:00:00.000Z',
    price: 22,
    image: '/images/soccer2.jpg'
  },
  {
    locationSlug: 'skyline-pitch',
    title: 'Supporters Tifo Workshop',
    description: 'Create massive supporter art ahead of derby weekend.',
    start_time: '2024-07-20T19:00:00.000Z',
    price: 12,
    image: '/images/soccer3.jpg'
  },
  {
    locationSlug: 'skyline-pitch',
    title: 'Legends Charity Match',
    description: 'Retired pros face local influencers to raise funds for youth clubs.',
    start_time: '2024-02-02T21:30:00.000Z',
    price: 30,
    image: '/images/soccer4.jpg'
  },
  {
    locationSlug: 'skyline-pitch',
    title: 'City Lights Derby',
    description: 'Local clubs clash under neon-lit boards with DJ sets between halves.',
    start_time: '2025-05-18T01:30:00.000Z',
    price: 28,
    image: '/images/soccer3.jpg'
  },
  {
    locationSlug: 'frostbyte-forum',
    title: 'Neon Night Shifts',
    description: '3v3 pond-style tourney with custom LED boards.',
    start_time: '2024-11-16T02:30:00.000Z',
    price: 28,
    image: '/images/hockey2.jpg'
  },
  {
    locationSlug: 'frostbyte-forum',
    title: 'Rookie Combine',
    description: 'Skating drills, stick handling clinics, and advanced coaching.',
    start_time: '2024-06-22T15:00:00.000Z',
    price: 35,
    image: '/images/hockey3.jpg'
  },
  {
    locationSlug: 'frostbyte-forum',
    title: 'Retro Stick Swap',
    description: 'Trade vintage sticks and jerseys, then scrimmage.',
    start_time: '2024-01-10T18:00:00.000Z',
    price: 10,
    image: '/images/hockey4.jpg'
  },
  {
    locationSlug: 'frostbyte-forum',
    title: 'Polar Power Play Finals',
    description: 'Top squads battle for the Frostbyte Cup in a best-of-three showdown.',
    start_time: '2025-02-08T02:00:00.000Z',
    price: 40,
    image: '/images/hockey2.jpg'
  },
  {
    locationSlug: 'uptown-arena',
    title: 'Open Court Throwdowns',
    description: 'Ranked runs with a live MC and digital leaderboards.',
    start_time: '2024-09-01T01:00:00.000Z',
    price: 20,
    image: '/images/basketball2.jpg'
  },
  {
    locationSlug: 'uptown-arena',
    title: 'Skills Lab Sunday',
    description: 'Ball handling + shooting clinics capped with a 3-point contest.',
    start_time: '2024-07-14T18:00:00.000Z',
    price: 16,
    image: '/images/basketball3.jpg'
  },
  {
    locationSlug: 'uptown-arena',
    title: 'Legends Reunion Run',
    description: 'Throwback jerseys, alumni teams, and halftime trick-shot show.',
    start_time: '2024-03-03T21:30:00.000Z',
    price: 18,
    image: '/images/basketball4.jpg'
  },
  {
    locationSlug: 'uptown-arena',
    title: 'Skyline Slam Showcase',
    description: 'High-flying dunk contest featuring local pros and viral hoopers.',
    start_time: '2025-03-22T00:00:00.000Z',
    price: 26,
    image: '/images/basketball3.jpg'
  }
]

const resetDatabase = async () => {
  try {
    console.log('Resetting database...')
    await pool.query(dropTables)
    await pool.query(createLocationsTable)
    await pool.query(createEventsTable)

    const locationIdBySlug = new Map()
    for (const location of locations) {
      const insertLocationText = `
        INSERT INTO locations
          (slug, name, description, address, city, state, zip, sport, hero_image)
        VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id;
      `

      const { rows } = await pool.query(insertLocationText, [
        location.slug,
        location.name,
        location.description,
        location.address,
        location.city,
        location.state,
        location.zip,
        location.sport,
        location.hero_image
      ])

      locationIdBySlug.set(location.slug, rows[0].id)
    }

    for (const event of events) {
      const locationId = locationIdBySlug.get(event.locationSlug)
      if (!locationId) {
        console.warn(`No location found for slug ${event.locationSlug}. Skipping event seed.`)
        continue
      }

      const insertEventText = `
        INSERT INTO events
          (location_id, title, description, start_time, price, image)
        VALUES
          ($1, $2, $3, $4, $5, $6);
      `

      await pool.query(insertEventText, [
        locationId,
        event.title,
        event.description,
        event.start_time,
        event.price,
        event.image
      ])
    }

    console.log('Database reset complete.')
  } catch (error) {
    console.error('Error resetting database:', error)
    throw error
  } finally {
    await pool.end()
  }
}

resetDatabase()
