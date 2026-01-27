import { CssBaseline, StyledEngineProvider, ThemeProvider } from "@mui/material"
import { theme } from "./Pallete/DarkPallete";

const ThemeConfig = ({ children }) => {

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </StyledEngineProvider>
    )
}

export default ThemeConfig;