import React, { useState } from 'react';
import { Uploader } from './components/Uploader';
import { useParsedFiles } from './hooks/use-parsed-files';
import { FileList } from './components/FileList';
import { useEmailSender } from './hooks/use-email-sender';
import { SendError } from './components/SendError';

function App() {

  const [files, setFiles] = useState<File[] | null>(null)

  console.log(files)
  
  const parsedFilesBag = useParsedFiles(files)

  const [send, { error, success, loading }] = useEmailSender([parsedFilesBag])

  const sendEmails = () => {
    if (parsedFilesBag.result) {
      const emails = parsedFilesBag.result.reduce((emails, parsedFile) => [...emails, ...Array.from(parsedFile.lines)], [] as string[])
      send(new Set(emails))
    }  
  }

  return (
    <>
      <Uploader onUpload={setFiles} />
      {parsedFilesBag.result && <FileList files={parsedFilesBag.result}/>}
      {parsedFilesBag.error && <p className="error">Error reading files: {parsedFilesBag.error.message}</p>}
      {success && <p className="success">Emails sent! Yay!</p>}
      {error && <SendError error={error}/>}
      {parsedFilesBag.result && !success && <button disabled={loading} onClick={sendEmails}>{loading ? 'Sending...' : 'Send emails'}</button>}
    </>
  )
}

export default App;
