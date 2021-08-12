export const csvToJson = (csv: string) => {
  const lines=csv.split("\n")

  const result = []
  const headers=lines[0].replaceAll(/[^a-zA-Z0-9,]/g,'').split(",")

  for(let i=1; i<lines.length; i++){
      const obj: {[key: string]: any} = {}
      const currentline=lines[i].split(",")
      if (currentline.length === headers.length) {
        for(let j = 0; j < headers.length; j++){
          obj[headers[j]] = currentline[j]?.replaceAll(/[^a-zA-Z0-9,]/g,'')
        }
        result.push(obj)
      }
  }
  return result
}
