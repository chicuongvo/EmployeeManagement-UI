import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface LayoutState {
    lang: "vi" | "en";
    toggleLanguage: () => void;
}

const useLayoutStore = create<LayoutState>()(
    devtools(
        persist(
            (set) => ({
                lang: "vi",
                toggleLanguage: () => {
                    set((state) => ({
                        ...state,
                        lang: state.lang === "vi" ? "en" : "vi",
                    }));
                },
            }),
            {
                name: "layout_store",
            }
        ),
        { enabled: import.meta.env.MODE !== "production" }
    )
);

export default useLayoutStore;
