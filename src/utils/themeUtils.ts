// Theme utility classes for consistent dark mode implementation
export const themeClasses = {
  // Background classes
  backgrounds: {
    primary: 'bg-white dark:bg-gray-800',
    secondary: 'bg-gray-50 dark:bg-gray-900',
    tertiary: 'bg-gray-100 dark:bg-gray-700',
    page: 'bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900',
    card: 'bg-white dark:bg-gray-800',
    modal: 'bg-white dark:bg-gray-800',
    overlay: 'bg-black/20 dark:bg-black/40',
  },

  // Text classes
  text: {
    primary: 'text-gray-900 dark:text-white',
    secondary: 'text-gray-600 dark:text-gray-300',
    tertiary: 'text-gray-500 dark:text-gray-400',
    muted: 'text-gray-400 dark:text-gray-500',
    inverse: 'text-white dark:text-gray-900',
  },

  // Border classes
  borders: {
    primary: 'border-gray-200 dark:border-gray-700',
    secondary: 'border-gray-300 dark:border-gray-600',
    light: 'border-gray-100 dark:border-gray-700',
    focus: 'focus:border-blue-500 dark:focus:border-blue-400',
  },

  // Shadow classes
  shadows: {
    sm: 'shadow-sm dark:shadow-gray-900/20',
    md: 'shadow-md dark:shadow-gray-900/30',
    lg: 'shadow-lg dark:shadow-gray-900/40',
    xl: 'shadow-xl dark:shadow-gray-900/50',
    '2xl': 'shadow-2xl dark:shadow-gray-900/60',
  },

  // Interactive classes
  interactive: {
    hover: 'hover:bg-gray-50 dark:hover:bg-gray-700',
    hoverCard: 'hover:bg-gray-50 dark:hover:bg-gray-700/50',
    hoverButton: 'hover:bg-gray-100 dark:hover:bg-gray-600',
    active: 'active:bg-gray-200 dark:active:bg-gray-600',
    focus: 'focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800',
  },

  // Input classes
  inputs: {
    base: 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400',
    focus: 'focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400',
  },

  // Button classes
  buttons: {
    primary: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white',
    ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
  },

  // Transition class
  transition: 'theme-transition',
};

// Helper function to combine theme classes
export const combineThemeClasses = (...classes: string[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Common component theme combinations
export const componentThemes = {
  card: combineThemeClasses(
    themeClasses.backgrounds.card,
    themeClasses.borders.light,
    themeClasses.shadows.lg,
    themeClasses.transition
  ),
  
  pageContainer: combineThemeClasses(
    'min-h-screen',
    themeClasses.backgrounds.page,
    'px-4 sm:px-6 lg:px-8',
    themeClasses.transition
  ),
  
  input: combineThemeClasses(
    themeClasses.inputs.base,
    themeClasses.inputs.focus,
    'rounded-lg border px-3 py-2',
    themeClasses.transition
  ),
  
  button: {
    primary: combineThemeClasses(
      themeClasses.buttons.primary,
      'px-4 py-2 rounded-lg font-medium',
      themeClasses.interactive.focus,
      themeClasses.transition
    ),
    secondary: combineThemeClasses(
      themeClasses.buttons.secondary,
      'px-4 py-2 rounded-lg font-medium',
      themeClasses.interactive.focus,
      themeClasses.transition
    ),
  },
  
  modal: combineThemeClasses(
    themeClasses.backgrounds.modal,
    themeClasses.borders.primary,
    'rounded-lg',
    themeClasses.shadows.xl,
    themeClasses.transition
  ),
};
