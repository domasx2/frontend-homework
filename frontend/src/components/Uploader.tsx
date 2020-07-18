import React, { FC, ChangeEventHandler } from 'react'

export interface UploaderProps {
  onUpload: (files: File[]) => void
}

export const Uploader: FC<UploaderProps> = ({ onUpload }) => {

  const onChange: ChangeEventHandler<HTMLInputElement> = e =>  e.target.files && onUpload(Array.from(e.target.files))

  return (
    <input type="file" placeholder="select text files" onChange={onChange} multiple accept="text/plain"/>
  )
}