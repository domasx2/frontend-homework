import React, { FC } from 'react'
import { EmailSendError } from '../hooks/use-email-sender'

interface SendErrorProps {
  error: Error | EmailSendError
}

export const SendError: FC<SendErrorProps> = ({ error }) => {
  return (
    <>
      <p className='error'>{error.message}</p>
      {error instanceof EmailSendError ? (
        <ul className='error'>
          {error.failedEmails.map(email => <li key={email}>{email}</li>)}
        </ul>
      ) : null}
    </>
  )
}
