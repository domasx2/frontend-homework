import { useCallback, useState, useMemo, useEffect } from "react"
import { usePromise } from "./use-promise"

interface EmailSendErrorBody {
  error: string,
  emails: string[]
}
type SendFn = (emails: Set<string>) => void

export class EmailSendError extends Error {
  failedEmails: string[]
  constructor(msg: string, failedEmails: string[]) {
    super(msg)
    this.failedEmails = failedEmails
  }
}

interface RequestState {
  loading: boolean
  error?: Error | EmailSendError
  success: boolean
}


type UseEmailSenderBag = [SendFn, RequestState]

const POST_URL = 'https://frontend-homework.togglhire.vercel.app/api/send'

export function useEmailSender(deps: any[]): UseEmailSenderBag {
  /*
  I know it's kinda convoluted, but:
  we gotta use usePromise to avoid setState error in case component was unmounted before request completes
  */

  const [reqPromise, setReqPromise] = useState<Promise<{ response: Response, content?: EmailSendErrorBody }> | null>(null)

  useEffect(() => setReqPromise(null), deps)

  const { result, error, loading } = usePromise(reqPromise)

  const send = useCallback(async (emails: Set<string>) => setReqPromise((async () => {
      const response = await fetch(POST_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ emails: Array.from(emails) })
      })
      return {
        response,
        content: response.headers.get('Content-Type')?.includes('application/json') ?  await response.json() : null
      }
    })()), [])

  return useMemo(() => {

    const err = (() => {
      if (error) return error 
      if (result?.content && result.response.status === 500) {
        return new EmailSendError(result.content.error, result.content.emails)
      }
      if (result?.response.ok === false) {
        return new Error(`Unexpected API response, code ${result?.response.status}`)
      }
    })()
    
    return [
      send, 
      {
        loading,
        success: !!result?.response.ok,
        error: err
      }]
    }, [send, result, error, loading])
  }