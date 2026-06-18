theme: {
  extend: {
    keyframes: {
      scrollCards: {
        "0%": { transform: "translateX(0)" },
        "100%": { transform: "translateX(-50%)" },
      },
    },
    animation: {
      scrollCards: "scrollCards 20s linear infinite",
    },
  },
},