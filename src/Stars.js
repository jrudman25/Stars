import React, { useEffect, useRef } from "react";
import "./styles.css";

const Stars = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const addStars = (container, count) => {
            for (let i = 0; i < count; i++) {
                const star = document.createElement("div");
                star.className = "star";
                star.style.left = `${Math.random() * 100}vw`;
                star.style.top = `${Math.random() * 100}vh`;
                star.style.animationDuration = `${Math.random() * 1 + 0.5}s`;
                container.appendChild(star);
            }
        };

        const starContainer = containerRef.current;
        addStars(starContainer, 100); // You can change the number of stars here

        return () => {
            starContainer.innerHTML = "";
        };
    }, []);

    return <div ref={containerRef} />;
};

export default Stars;
