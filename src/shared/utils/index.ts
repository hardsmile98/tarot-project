function formatWithOffset (date: Date, offset: string): string {
  const yyyy = date.getUTCFullYear()
  const MM = String(date.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(date.getUTCDate()).padStart(2, '0')
  const hh = String(date.getUTCHours()).padStart(2, '0')
  const mm = String(date.getUTCMinutes()).padStart(2, '0')
  const ss = String(date.getUTCSeconds()).padStart(2, '0')

  return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}${offset}`
}

export { formatWithOffset }
