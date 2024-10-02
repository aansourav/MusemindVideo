import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
    const containerRef = useRef(null);
    const videoRef = useRef(null);
    const textRefs = useRef([]);
    const [mute, setMute] = useState(true);
    const [isHovering, setIsHovering] = useState(false);

    const handleMute = () => {
        setMute((prevMute) => !prevMute);
        videoRef.current.muted = !mute;
    };

    const texts = ["Elevating UX", "Redefining", "Experiences", "Businesses"];

    useEffect(() => {
        if (!containerRef.current || !videoRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=1000",
                scrub: 2.5,
                pin: true,
            },
        });

        tl.to(videoRef.current, {
            width: "20vw", // Adjust video size as needed
            height: "20vw",
            duration: 1,
        });

        const initialPositions = [
            { top: "-30%", left: "50%", x: "-50%", y: "0%" }, // Top text starting position
            { top: "50%", right: "-30%", x: "0%", y: "-50%" }, // Right text starting position
            { bottom: "-30%", left: "50%", x: "-50%", y: "0%" }, // Bottom text starting position
            { top: "50%", left: "-30%", x: "0%", y: "-50%" }, // Left text starting position
        ];

        const finalPositions = [
            { top: "10%", left: "50%", x: "-50%", y: "0%" }, // Top text final position
            { top: "50%", right: "10%", x: "0%", y: "-50%" }, // Right text final position
            { bottom: "10%", left: "50%", x: "-50%", y: "0%" }, // Bottom text final position
            { top: "50%", left: "10%", x: "0%", y: "-50%" }, // Left text final position
        ];

        textRefs.current.forEach((textRef, index) => {
            tl.fromTo(
                textRef,
                {
                    opacity: 0,
                    ...initialPositions[index],
                },
                {
                    opacity: 1,
                    ...finalPositions[index],
                    duration: 1,
                },
                0 // Start all animations at the same time
            );
        });

        return () => {
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, []);

    const handleWheel = (e) => {
        if (isHovering) {
            e.preventDefault();
            const scrollAmount = e.deltaY;
            window.scrollBy(0, scrollAmount);
        }
    };

    return (
        <div
            ref={containerRef}
            className="h-screen relative overflow-hidden bg-gray-900"
            onWheel={handleWheel}
        >
            <div className="h-full flex items-center justify-center">
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted={mute}
                    playsInline
                    className="w-full h-auto max-w-full max-h-full object-cover"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    onClick={handleMute}
                >
                    <source src="../src/assets/musemind.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                {texts.map((text, index) => (
                    <div
                        key={text}
                        ref={(el) => (textRefs.current[index] = el)}
                        className="absolute text-7xl font-bold text-white opacity-0"
                    >
                        {text}
                    </div>
                ))}
            </div>
        </div>
    );
}
