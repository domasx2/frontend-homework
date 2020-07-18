import { usePromise, UsePromiseValue } from "./use-promise"
import { useMemo } from "react"

export interface ParsedFile {
  file: File,
  lines: Set<string>
}

function parseFile(file: File): Promise<ParsedFile> {
  return file.text().then(content => ({
    file,
    lines: new Set(content.split(/\r?\n/).map(x => x.trim()).filter(x => !!x))
  }))
}

export function useParsedFiles(files: File[] | null): UsePromiseValue<ParsedFile[], Error> {
  const promise = useMemo(() => files ? Promise.all(files.map(parseFile)) : null, [files])
  return usePromise(promise)
}