import type { Thing, WithContext } from 'schema-dts'

export interface StructuredDataProps {
  data: WithContext<Thing> | WithContext<Thing>[]
}

/**
 * Escapes HTML entities in a string to prevent XSS in JSON-LD context.
 * This prevents breaking out of the script tag via </script> injection.
 */
function escapeJsonLd(json: string): string {
  return json.replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')
}

export default function StructuredData({ data }: StructuredDataProps) {
  const jsonLd = Array.isArray(data) ? data : [data]

  return (
    <>
      {jsonLd.map((item, index) => (
        <script
          dangerouslySetInnerHTML={{
            __html: escapeJsonLd(JSON.stringify(item)),
          }}
          key={index}
          type="application/ld+json"
        />
      ))}
    </>
  )
}
