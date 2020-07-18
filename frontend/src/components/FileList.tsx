import React,  { FC } from 'react'
import { ParsedFile } from '../hooks/use-parsed-files';

export interface FileListProps {
  files: ParsedFile[]
}

export const FileList: FC<FileListProps> = ({ files }) => (
  <ul>
    {files.map(({ file, lines }) => <li key={file.name}>{file.name} ({lines.size} emails)</li>)}
  </ul>
)