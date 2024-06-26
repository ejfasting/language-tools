import { theme, lightTheme } from './converted.ts';

export async function loadTheme(editor: typeof import('monaco-editor').editor): Promise<{ dark: string, light: string }> {
    const themeNameDark = 'vs-code-theme-converted-dark';
    editor.defineTheme(themeNameDark, theme);
    const themeNameLight = 'vs-code-theme-converted-light';
    editor.defineTheme(themeNameLight, lightTheme);
    return { dark: themeNameDark, light: themeNameLight };
}