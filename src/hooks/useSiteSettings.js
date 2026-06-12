import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { defaultSiteSettings, mergeSiteSettings } from '../utils/siteSettings'

function useSiteSettings() {
  const [settings, setSettings] = useState(defaultSiteSettings)

  useEffect(() => {
    let isMounted = true

    api
      .getSettings()
      .then((data) => {
        if (isMounted) {
          setSettings(mergeSiteSettings(data))
        }
      })
      .catch(() => undefined)

    return () => {
      isMounted = false
    }
  }, [])

  return settings
}

export default useSiteSettings
