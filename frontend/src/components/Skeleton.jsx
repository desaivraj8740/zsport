export default function Skeleton({ width = '100%', height = 20, borderRadius = 8, style = {} }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius, flexShrink: 0, ...style }}
    />
  )
}

export function SkeletonCard({ aspectRatio = '16/9' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className="skeleton" style={{ width: '100%', aspectRatio, borderRadius: 12 }} />
      <Skeleton height={16} width="80%" />
      <Skeleton height={12} width="50%" />
    </div>
  )
}

export function SkeletonBanner() {
  return (
    <div className="skeleton" style={{ width: '100%', height: 480, borderRadius: 24 }} />
  )
}
