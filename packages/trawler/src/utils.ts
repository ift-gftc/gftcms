/**
 * @ignore
 */
export const parseCsvColumnList = ({
  csvData,
  index,
  indexKey,
  itemKeyList
}) => {
  const dataList = []

  const currentData = csvData[index]

  if (itemKeyList.filter((k) => !!currentData[k]).length === 0) return dataList

  if (index < csvData.length - 1) {
    let j = 0
    do {
      const nextItem = csvData[index + j]
      if (
        itemKeyList.filter((k: string | number) => !!nextItem[k]).length > 0
      ) {
        const newItem = {}

        itemKeyList.forEach((k: string | number) => {
          newItem[k] = nextItem[k] || currentData[k]
        })

        dataList.push(newItem)
      }
      j++
    } while (csvData[index + j] && !csvData[index + j][indexKey])
  }
  return dataList
}

/**
 * Parsing unit of measure string
 * @param s String to parse
 */
export const parseUom = (s: string) =>
  s && s[0].toLowerCase() === 'l' ? 'LBR' : 'KGM'
