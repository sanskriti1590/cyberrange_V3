import { createTheme } from "@mui/material";
import { grey } from "@mui/material/colors";
import "../../App.css"

export const theme = createTheme({
  overrides: {
    MuiButton: {
      containedPrimary: {
        backgroundImage: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
        color: "white",
      },
      containedSecondary: {
        backgroundImage: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
        color: "white",
      },

    },
  },
  components: {
    // Name of the component
    MuiMenuItem: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          backgroundColor: "#12464C",
          color: 'white',
          fontSize: '1rem',
        },
      },
    },
    MuiMenuList: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          backgroundColor: "#656565 !important",
          color: 'white',
          fontSize: '1rem',
        },
      },
    },
    icon: {
      styleOverrides: {
        // Name of the slot
        root: {
          fill: '#12464C'
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS

          borderColor: "#acacac",
          borderRadius: '8px'
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          color: 'white',
          borderColor: "white",

          "&.Mui-selected": {
            borderBottom: "4px solid white", // Replace "red" with your desired underline color
            color: 'white'
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        // Name of the slot
        root: {
          '& label': {
            color: '#ACACAC !important',
          },
          '& label.Mui-focused': {
            color: '#ACACAC !important',
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: '#ACACAC !important',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#ACACAC !important',
            },
            '&:hover fieldset': {
              borderColor: '#ACACAC !important',
              borderWidth: '0.15rem',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#ACACAC !important',
            },
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#16181F', // Change this to your desired background color
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.variant === 'contained' && {
            fontSize: '14px',
            textTransform: 'capitalize',
            fontWeight: '700',
            maxHeight: '42px',
            padding: '12px 32px',
            width: 'fit-content',
            borderRadius: '50px',
            border: '2px solid #0FF',
            color: '#00FFFF',
            background: 'rgba(0, 255, 255, 0.20)',
            '&:hover': {
              color: '#0CC', border: '2px solid #0CC', background: ' rgba(0, 204, 204, 0.20)',
            },
          }), ...(ownerState.variant === 'outlined' && {
            fontSize: '14px',
            textTransform: 'capitalize',
            fontWeight: '700',
            maxHeight: '42px',
            padding: '10px 32px',
            width: 'fit-content',
            borderRadius: '50px',
            border: '2px solid #0FF',
            color: '#00FFFF',
            background: 'none',
            '&:hover': {
              color: '#00A3A3', border: '2px solid #00A3A3',
            },
          }), ...(ownerState.variant === 'text' && {
            fontSize: '14px',
            textTransform: 'capitalize',
            fontWeight: '700',
            padding: '12px 0px',
            maxHeight: '42px',
            width: 'fit-content',
            borderRadius: '50px',
            border: 'none',
            color: '#92E7E1',
            background: 'none',
          }),
        }),
      },
    },

  },

  palette: {
    primary: {
      main: "#111218",
      secondary: '#3C3142',
      light: '#002929',
      other: '#1C1F28',
      option: '#242833'
    },
    secondary: {
      main: '#12464C',
      secondary: '#313131',
      other: "#2A2C35",
      icon: '#002929'
    },
    custom: {
      main: '#16181F',
      primary: '#12464C',
      secondary: '#111218'
    },
    background: {
      default: '#111218',
      secondary: '#16181F',
      light: '#111218',
      secondary1: '#313131',
    },
    error: {
      main: "#E53935",      // base red
      dark: "#B71C1C",      // hover/dark mode
      light: "#FFCDD2",     // lighter tint
      contrastText: "#fff", // ensures readable text
    },
    basic: {
      main: "#16181F",
      light: "#1C1F28",
      dark: "#0E1016",
    },
    borderColor: {
      default: '#12464C'
    },
    text: {
      primary: '#212121'
    },

  },
  typography: {
    default: '#EAEAEB',
    secondary: grey[500],
    fontFamily: 'Poppins',
    h1: {
      color: '#EAEAEB',
      fontWeight: 500,
      fontSize: '32px',
      lineHeight: '48px'
    },
    h2: {
      color: '#EAEAEB',
      fontWeight: 500,
      fontSize: '24px',
      lineHeight: '36px'
    },
    h3: {
      color: '#EAEAEB',
      fontWeight: 500,
      fontSize: '18px',
      lineHeight: '27px'
    },
    h4: {
      color: '#EAEAEB',
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '24px',
      order: 1,
    }, h5: {
      color: '#EAEAEB',
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: '22px',
    },
    h6: {
      fontFamily: 'Manrope',
      fontSize: '10px',
      fontStyle: 'normal',
      fontWeight: 600,
      lineHeight: "normal"
    },
    body1: {
      fontWeight: 500,
      fontSize: '16px',
      lineHeight: '24px',
    },
    body2: {
      fontWeight: 500,
      fontSize: '12px',
      lineHeight: '18px',
    },
    body3: {
      fontWeight: 500,
      fontSize: '12px',
      lineHeight: '16px',
    },
    button: {
      fontWeight: 500,
      fontSize: '16px',
      lineHeight: '24px',
      letterSpacing: '0.01em'
    },
    display1: {
      fontWeight: 500,
      fontSize: '48px',
      lineHeight: '96px',

    },


  },


});