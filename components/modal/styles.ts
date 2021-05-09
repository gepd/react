import { GeistUIThemesPalette } from '../themes/presets'
import { NormalTypes } from '../utils/prop-types'

export type ActionColor = {
  color: string
  background: string
}

export const getColors = (
  palette: GeistUIThemesPalette,
  status?: NormalTypes,
): ActionColor => {
  const colors: { [key in NormalTypes]: ActionColor } = {
    default: {
      background: palette.background,
      color: palette.accents_5,
    },
    secondary: {
      background: palette.foreground,
      color: palette.background,
    },
    success: {
      background: palette.success,
      color: '#fff',
    },
    warning: {
      background: palette.warning,
      color: '#fff',
    },
    error: {
      background: palette.error,
      color: '#fff',
    },
  }

  if (!status) return colors.default
  return colors[status]
}
