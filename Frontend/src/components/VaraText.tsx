import { useEffect } from "react";
import Vara from "vara";

/**
 * Creates a component which is an animated handwritten text. 
 * @param Text The text to animate
 * @returns The div of the animated text.
 */
export const VaraText = ({ text }: { text: string }) => {
    useEffect(() => {
        const container = document.getElementById("vara-container");
        if (container) {
            container.innerHTML = ""; // Clear previous content
        }

        new Vara(
            "#vara-container",
            "https://raw.githubusercontent.com/akzhy/Vara/master/fonts/Parisienne/Parisienne.json",
            [
                {
                    color: "white",
                    text: text,
                    fontSize: 50,
                    strokeWidth: 1.3,
                    textAlign: "center"
                },
            ]
        );
    }, [text]); // You could also include text here in case it ever changes

    return <div id="vara-container"></div>;
};
