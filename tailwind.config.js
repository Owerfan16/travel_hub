/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        roboto: "var(--font-roboto)",
      },
      colors: {
        background: "var(--color-background)",
        bg_header: "var(--color-header-background)",
        btn_header: "var(--color-header-button)",
        btn_header_profile: "var(--color-header-button-profile)",
        text_header_profile: "var(--color-header-text-profile)",
        btn_active_header: "var(--color-header-button_active)",
        bg_search: "var(--color-search-background)",
        btn_search_hover: "var(--color-btn-search-background-hover)",
        btn_search: "var(--color-btn-search-background)",
        text_primary: "var(--color-primary-text)",
        text_secondary: "var(--color-secondary-text)",
        text_crossed_out: "var(--color-crossed_out-text)",
        bg_arrow: "var(--color-arrow-button)",
        bg_hot_tickets: "var(--color-hot_tickets-background)",
        bg_footer: "var(--color-footer-background)",
        link_footer: "var(--color-footer-link)",
        text_footer: "var(--color-footer-text)",
        white_black: "var(--color-white-black)",
        text_header_button: "var(--color-header-text-button)",
        bg_menu_mobile: "var(--color-menu-mobile--background)",
        bg_burger_mobile: "var(--color-burger-mobile--background)",
        line_burger_mobile: "var(--color-line-mobile--burger)",
        bg_round_profile: "var(--color-round-profile)",
        bg_burger_pc: "var(--color-background--burger-pc)",
        text_heading: "var(--color-text-heading)",
      },
    },
  },
  plugins: [],
};
