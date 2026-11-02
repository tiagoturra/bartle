export type SessionStorageResult =
  | { ok: true; value: string | null }
  | { ok: false; error: Error }

export type SessionStorageWriteResult =
  | { ok: true }
  | { ok: false; error: Error }

export function readSessionStorage(key: string): SessionStorageResult {
  if (typeof window === 'undefined') {
    return { ok: true, value: null }
  }

  try {
    return { ok: true, value: window.sessionStorage.getItem(key) }
  } catch (error) {
    return {
      ok: false,
      error: new Error('Unable to read session storage.', { cause: error }),
    }
  }
}

export function writeSessionStorage(
  key: string,
  value: string,
): SessionStorageWriteResult {
  if (typeof window === 'undefined') {
    return { ok: true }
  }

  try {
    window.sessionStorage.setItem(key, value)
    return { ok: true }
  } catch (error) {
    return {
      ok: false,
      error: new Error('Unable to save session storage.', { cause: error }),
    }
  }
}

export function removeSessionStorage(key: string): SessionStorageWriteResult {
  if (typeof window === 'undefined') {
    return { ok: true }
  }

  try {
    window.sessionStorage.removeItem(key)
    return { ok: true }
  } catch (error) {
    return {
      ok: false,
      error: new Error('Unable to clear session storage.', { cause: error }),
    }
  }
}
