export function formatDate(timestamp: string) {
  const date = new Date(timestamp)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // getMonth() is zero-indexed
  const year = date.getFullYear()
  const hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const formattedHours = (hours % 12 || 12).toString().padStart(2, '0') // Convert to 12-hour format

  return `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`
}
