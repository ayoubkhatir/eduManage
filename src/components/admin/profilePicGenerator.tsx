type propsType = {
  name: string
  imgSrc?: string
}

export default function ProfilePicGenerator({ name, imgSrc }: propsType) {
  function getInitials(fullName: string) {
    if (!fullName) return ''

    const parts = fullName.trim().split(' ').filter(Boolean)

    const first = parts[0]?.[0]?.toUpperCase() || ''
    const second = parts[1]?.[0]?.toUpperCase() || ''

    return first + second
  }
  function stringToColor(str: string) {
    let hash = 0

    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }

    const colors = [
      '#F44336',
      '#E91E63',
      '#9C27B0',
      '#673AB7',
      '#3F51B5',
      '#2196F3',
      '#009688',
      '#4CAF50',
      '#FF9800',
      '#795548',
    ]

    return colors[Math.abs(hash) % colors.length]
  }

  const bgColor = stringToColor(name)
  const initials = getInitials(name)
  return (
    <>
      {imgSrc ? (
        <img
          alt=""
          className="h-10 w-10 rounded-full object-cover border border-slate-600 ring-2 ring-transparent group-hover:ring-primary/50"
          src={imgSrc}
        />
      ) : (
        <div
          style={{ backgroundColor: bgColor, width: 40, height: 40 }}
          className="rounded-full text-white font-bold text-lg flex items-center justify-center"
        >
          {initials}
        </div>
      )}
    </>
  )
}
