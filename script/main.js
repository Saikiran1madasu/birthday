// automatically play music and start animation
const playSong = () => {
    const song = document.querySelector('.song');
    if (song) {
        // Set volume and ensure not muted
        song.volume = 0.10;
        song.muted = false;
        
        // Load the audio first
        song.load();
        
        // Wait for audio to be ready
        const tryPlay = () => {
            const playPromise = song.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        // Audio started playing successfully
                        console.log('Song is playing');
                        song.muted = false;
                    })
                    .catch((error) => {
                        console.log('Autoplay blocked, trying muted approach:', error);
                        // If autoplay fails, try with muted first (browsers allow muted autoplay)
                        song.muted = true;
                        const mutedPlay = song.play();
                        if (mutedPlay !== undefined) {
                            mutedPlay
                                .then(() => {
                                    // Once playing, unmute it
                                    setTimeout(() => {
                                        song.muted = false;
                                        console.log('Song unmuted and playing');
                                    }, 100);
                                })
                                .catch(() => {
                                    // If still blocked, enable on first user interaction
                                    console.log('Setting up user interaction handler');
                                    const enableAudio = () => {
                                        song.muted = false;
                                        song.play().catch((err) => {
                                            console.log('Play failed on interaction:', err);
                                        });
                                        document.removeEventListener('click', enableAudio);
                                        document.removeEventListener('touchstart', enableAudio);
                                    };
                                    document.addEventListener('click', enableAudio);
                                    document.addEventListener('touchstart', enableAudio);
                                });
                        }
                    });
            }
        };
        
        // Try to play when audio is ready
        if (song.readyState >= 2) {
            // Audio is already loaded
            tryPlay();
        } else {
            // Wait for audio to load
            song.addEventListener('canplaythrough', tryPlay, { once: true });
            song.addEventListener('loadeddata', tryPlay, { once: true });
            // Fallback: try after a short delay
            setTimeout(() => {
                if (song.paused) {
                    tryPlay();
                }
            }, 500);
        }
    }
};

// Try to play as soon as DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        playSong();
        animationTimeline();
    });
} else {
    // DOM is already ready
    playSong();
    animationTimeline();
}


// animation timeline
const animationTimeline = () => {
    // split chars that needs to be animated individually
    const textBoxChars = document.getElementsByClassName("hbd-chatbox")[0];
    const hbd = document.getElementsByClassName("wish-hbd")[0];

    textBoxChars.innerHTML = `<span>${textBoxChars.innerHTML
        .split("")
        .join("</span><span>")}</span>`;

    // Split text while preserving emojis properly
    const splitTextWithEmojis = (text) => {
        // Use Array.from to properly handle emojis and other Unicode characters
        return Array.from(text);
    };

    const hbdText = hbd.innerHTML.trim();
    const hbdParts = splitTextWithEmojis(hbdText);
    hbd.innerHTML = hbdParts.map(part => {
        // Preserve spaces as non-breaking spaces for better display
        if (part === ' ') {
            return '<span>&nbsp;</span>';
        }
        return `<span>${part}</span>`;
    }).join('');

    const ideaTextTrans = {
        opacity: 0,
        y: -20,
        rotationX: 5,
        skewX: "15deg"
    }

    const ideaTextTransLeave = {
        opacity: 0,
        y: 20,
        rotationY: 5,
        skewX: "-15deg"
    }

    // timeline
    const tl = new TimelineMax();

    tl.to(".container", 0.6, {
        visibility: "visible"
    })
    .from(".one", 0.7, {
        opacity: 0,
        y: 10
    })
    .from(".two", 0.4, {
        opacity: 0,
        y: 10
    })
    .to(".one",
        0.7,
        {
            opacity: 0,
            y: 10
        },
    "+=3.5")
    .to(".two",
        0.7,
        {
            opacity: 0,
            y: 10
        },
    "-=1")
    .from(".three", 0.7, {
        opacity: 0,
        y: 10
    })
    .to(".three",
        0.7,
        {
            opacity: 0,
            y: 10
        },
    "+=3")
    .from(".four", 0.7, {
        scale: 0.2,
        opacity: 0,
    })
    .staggerTo(
        ".hbd-chatbox span",
        1.5, {
            visibility: "visible",
        },
        0.05
    )
    .to(
        ".four",
        0.5, {
            scale: 0.2,
            opacity: 0,
            y: -150
        },
    "+=1")
    .from(".idea-1", 0.7, ideaTextTrans)
    .to(".idea-1", 0.7, ideaTextTransLeave, "+=2.5")
    .from(".idea-2", 0.7, ideaTextTrans)
    .to(".idea-2", 0.7, ideaTextTransLeave, "+=2.5")
    .from(".idea-3", 0.7, ideaTextTrans)
    .to(".idea-3 strong", 0.5, {
        scale: 1.2,
        x: 10,
        backgroundColor: "rgb(21, 161, 237)",
        color: "#fff",
    })
    .to(".idea-3", 0.7, ideaTextTransLeave, "+=2.5")
    .from(".idea-4", 0.7, ideaTextTrans)
    .to(".idea-4", 0.7, ideaTextTransLeave, "+=2.5")
    .from(
        ".idea-5",
        0.7, {
            rotationX: 15,
            rotationZ: -10,
            skewY: "-5deg",
            y: 50,
            z: 10,
            opacity: 0,
        },
        "+=0.5"
    )
    .to(
        ".idea-5 span",
        0.7, {
            rotation: 90,
            x: 8,
        },
        "+=0.5"
    )
    .to(
        ".idea-5",
        0.7, {
            scale: 0.2,
            opacity: 0,
        },
        "+=0.8"
    )
    .staggerFrom(
        ".idea-6 span",
        0.8, {
            scale: 3,
            opacity: 0,
            rotation: 15,
            ease: Expo.easeOut,
        },
        0.2
    )
    .staggerTo(
        ".idea-6 span",
        0.8, {
            scale: 3,
            opacity: 0,
            rotation: -15,
            ease: Expo.easeOut,
        },
        0.2,
        "+=1.5"
    )
    .staggerFromTo(
        ".baloons img",
        2.5, {
            opacity: 0.9,
            y: 1400,
        }, {
            opacity: 1,
            y: -1000,
        },
        0.2
    )
    .from(
        ".profile-picture",
        0.5, {
            scale: 3.5,
            opacity: 0,
            x: 25,
            y: -25,
            rotationZ: -45,
        },
        "-=2"
    )
    .from(".hat", 0.5, {
        x: -100,
        y: 350,
        rotation: -180,
        opacity: 0,
    })
    .staggerFrom(
        ".wish-hbd span",
        0.7, {
            opacity: 0,
            y: -50,
            // scale: 0.3,
            rotation: 150,
            skewX: "30deg",
            ease: Elastic.easeOut.config(1, 0.5),
        },
        0.1
    )
    .staggerFromTo(
        ".wish-hbd span",
        0.7, {
            scale: 1.4,
            rotationY: 150,
        }, {
            scale: 1,
            rotationY: 0,
            color: "#ff69b4",
            ease: Expo.easeOut,
        },
        0.1,
        "party"
    )
    .from(
        ".wish h5",
        0.5, {
            opacity: 0,
            y: 10,
            skewX: "-15deg",
        },
        "party"
    )
    .staggerTo(
        ".eight svg",
        1.5, {
            visibility: "visible",
            opacity: 0,
            scale: 80,
            repeat: 3,
            repeatDelay: 1.4,
        },
        0.3
    )
    .to(".six", 0.5, {
        opacity: 0,
        y: 30,
        zIndex: "-1",
    })
    .staggerFrom(".nine p", 1, ideaTextTrans, 1.2)
    .to(
        ".last-smile",
        0.5, {
            rotation: 90,
        },
        "+=1"
    );

    // Restart Animation on click
    const replyBtn = document.getElementById("replay");
    replyBtn.addEventListener("click", () => {
        tl.restart();
    });
}
