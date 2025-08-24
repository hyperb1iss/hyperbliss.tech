import type { Thing, WithContext } from 'schema-dts'

export interface StructuredDataProps {
  data: WithContext<Thing> | WithContext<Thing>[]
}

export default function StructuredData({ data }: StructuredDataProps) {
  const jsonLd = Array.isArray(data) ? data : [data]

  return (
    <>
      {jsonLd.map((item, index) => (
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item),
          }}
          key={index}
          type="application/ld+json"
        />
      ))}
    </>
  )
}
