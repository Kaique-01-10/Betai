'use client'

import { ComposableMap, Geographies, Geography, Marker, Line } from 'react-simple-maps'

const GEO_URL = '/geo/countries-110m.json'

// Códigos ISO numéricos de los países de América Latina (world-atlas ids).
const LATAM_IDS = new Set([
  '484', // México
  '320', // Guatemala
  '084', // Belice
  '340', // Honduras
  '222', // El Salvador
  '558', // Nicaragua
  '188', // Costa Rica
  '591', // Panamá
  '170', // Colombia
  '862', // Venezuela
  '218', // Ecuador
  '604', // Perú
  '068', // Bolivia
  '076', // Brasil
  '600', // Paraguay
  '858', // Uruguay
  '152', // Chile
  '032', // Argentina
  '192', // Cuba
  '214', // República Dominicana
  '332', // Haití
  '388', // Jamaica
  '328', // Guyana
  '740', // Surinam
  '630', // Puerto Rico
])

// Puntos de actividad repartidos por toda la región (lon, lat).
// Ningún punto está destacado por encima de los demás: la lectura es regional.
type ActivityPoint = {
  coordinates: [number, number]
  gold?: boolean
  wave?: boolean
  delay: number
}

const ACTIVITY_POINTS: ActivityPoint[] = [
  { coordinates: [-99.1, 19.4], wave: true, delay: 0.55 }, // Ciudad de México
  { coordinates: [-103.3, 20.7], delay: 0.7 }, // Guadalajara
  { coordinates: [-74.1, 4.7], gold: true, wave: true, delay: 0.62 }, // Bogotá
  { coordinates: [-66.9, 10.5], delay: 0.85 }, // Caracas
  { coordinates: [-78.5, -0.2], delay: 0.78 }, // Quito
  { coordinates: [-77.0, -12.0], wave: true, delay: 0.68 }, // Lima
  { coordinates: [-68.1, -16.5], delay: 0.9 }, // La Paz
  { coordinates: [-70.6, -33.4], gold: true, delay: 0.82 }, // Santiago
  { coordinates: [-58.4, -34.6], wave: true, delay: 0.74 }, // Buenos Aires
  { coordinates: [-56.2, -34.9], delay: 0.96 }, // Montevideo
  { coordinates: [-57.6, -25.3], delay: 1.02 }, // Asunción
  { coordinates: [-46.6, -23.5], gold: true, wave: true, delay: 0.88 }, // São Paulo
  { coordinates: [-38.5, -12.97], delay: 1.08 }, // Salvador de Bahía
]

// Conexiones muy sutiles entre algunos polos de actividad.
const CONNECTIONS: Array<[[number, number], [number, number]]> = [
  [[-99.1, 19.4], [-74.1, 4.7]],
  [[-74.1, 4.7], [-77.0, -12.0]],
  [[-77.0, -12.0], [-70.6, -33.4]],
  [[-70.6, -33.4], [-58.4, -34.6]],
  [[-58.4, -34.6], [-46.6, -23.5]],
  [[-74.1, 4.7], [-66.9, 10.5]],
]

// Partículas decorativas flotando (lon, lat).
const PARTICLES: Array<{ coordinates: [number, number]; delay: number }> = [
  { coordinates: [-90, -5], delay: 0.2 },
  { coordinates: [-52, -18], delay: 1.1 },
  { coordinates: [-63, 2], delay: 0.7 },
  { coordinates: [-64, -40], delay: 1.4 },
  { coordinates: [-95, 8], delay: 0.9 },
]

export function LatamMap() {
  return (
    <div className="betai-map-in relative w-full [filter:drop-shadow(0_18px_40px_oklch(0.58_0.118_166/0.28))]">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [-72, -18], scale: 340 }}
        width={520}
        height={620}
        style={{ width: '100%', height: 'auto' }}
      >
        {/* Capa de relleno de los países */}
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies
              .filter((geo) => LATAM_IDS.has(String(geo.id)))
              .map((geo) => (
                <Geography
                  key={`fill-${geo.rsmKey}`}
                  geography={geo}
                  className="betai-map-fill"
                  tabIndex={-1}
                  style={{
                    default: {
                      fill: 'oklch(0.58 0.118 166 / 0.14)',
                      stroke: 'none',
                      outline: 'none',
                    },
                    hover: {
                      fill: 'oklch(0.58 0.118 166 / 0.14)',
                      outline: 'none',
                    },
                    pressed: {
                      fill: 'oklch(0.58 0.118 166 / 0.14)',
                      outline: 'none',
                    },
                  }}
                />
              ))
          }
        </Geographies>

        {/* Capa de contorno luminoso que se dibuja */}
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies
              .filter((geo) => LATAM_IDS.has(String(geo.id)))
              .map((geo) => (
                <Geography
                  key={`line-${geo.rsmKey}`}
                  geography={geo}
                  className="betai-map-path"
                  pathLength={1}
                  tabIndex={-1}
                  style={{
                    default: {
                      fill: 'none',
                      stroke: 'oklch(0.72 0.14 164 / 0.9)',
                      strokeWidth: 0.7,
                      outline: 'none',
                    },
                    hover: {
                      fill: 'none',
                      stroke: 'oklch(0.72 0.14 164 / 0.9)',
                      strokeWidth: 0.7,
                      outline: 'none',
                    },
                    pressed: {
                      fill: 'none',
                      stroke: 'oklch(0.72 0.14 164 / 0.9)',
                      strokeWidth: 0.7,
                      outline: 'none',
                    },
                  }}
                />
              ))
          }
        </Geographies>

        {/* Conexiones sutiles entre polos */}
        {CONNECTIONS.map(([from, to], i) => (
          <Line
            key={`conn-${i}`}
            from={from}
            to={to}
            stroke="oklch(0.72 0.14 164 / 0.28)"
            strokeWidth={0.5}
            strokeLinecap="round"
            className="betai-map-fill"
          />
        ))}

        {/* Partículas flotantes */}
        {PARTICLES.map((p, i) => (
          <Marker key={`particle-${i}`} coordinates={p.coordinates}>
            <circle
              r={0.9}
              className="animate-betai-particle"
              style={{ animationDelay: `${p.delay}s` }}
              fill="oklch(0.891 0.174 100 / 0.7)"
            />
          </Marker>
        ))}

        {/* Puntos de actividad */}
        {ACTIVITY_POINTS.map((point, i) => {
          const color = point.gold
            ? 'oklch(0.891 0.174 100)'
            : 'oklch(0.7 0.15 164)'
          return (
            <Marker key={`point-${i}`} coordinates={point.coordinates}>
              {/* Onda de actividad */}
              {point.wave ? (
                <circle
                  r={4}
                  className="betai-marker-wave"
                  style={{ animationDelay: `${point.delay + 0.3}s` }}
                  fill="none"
                  stroke={color}
                  strokeWidth={0.8}
                />
              ) : null}
              {/* Halo */}
              <circle
                r={3}
                className="animate-betai-marker-in"
                style={{ animationDelay: `${point.delay}s` }}
                fill={color}
                opacity={0.18}
              />
              {/* Núcleo */}
              <circle
                r={1.5}
                className="animate-betai-marker-in"
                style={{ animationDelay: `${point.delay}s` }}
                fill={color}
              />
              <circle r={0.6} fill="oklch(0.99 0.006 150)" opacity={0.9} />
            </Marker>
          )
        })}
      </ComposableMap>
    </div>
  )
}
