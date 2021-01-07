import React, { useEffect } from "react";
import classes from "./yeti.module.scss";
import { Expo, gsap, Power2, Quad } from "gsap";
import useEffectExceptMount from "use-effect-except-mount";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { interpolate } from "flubber";
interface Props {
    eyesCovered: boolean;
    fingersSpread: boolean;
    emailRef: React.RefObject<HTMLInputElement>;
    emailChangeTrigger: boolean;
    emailBlurTrigger: boolean;
}

const chinMin = 0.5;

type Coordinates = { x: number; y: number };

const Yeti: React.FC<Props> = ({
    eyesCovered: covered,
    fingersSpread,
    emailRef,
    emailChangeTrigger,
    emailBlurTrigger,
}) => {
    // For delayed animations via callbacks
    const isMounted = React.useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => (isMounted.current = false);
    }, []);

    const armL = React.useRef<SVGGElement>(null),
        armR = React.useRef<SVGGElement>(null),
        bodyBG = React.useRef<SVGPathElement>(null),
        bodyBGChanged = React.useRef<SVGPathElement>(null),
        mySVG = React.useRef<HTMLDivElement>(null),
        twoFingers = React.useRef<SVGGElement>(null),
        eyeL = React.useRef<SVGGElement>(null),
        eyeR = React.useRef<SVGGElement>(null),
        nose = React.useRef<SVGPathElement>(null),
        mouth = React.useRef<SVGGElement>(null),
        mouthBG = React.useRef<SVGPathElement>(null),
        mouthSmallBG = React.useRef<SVGPathElement>(null),
        mouthMediumBG = React.useRef<SVGPathElement>(null),
        mouthLargeBG = React.useRef<SVGPathElement>(null),
        mouthMaskPath = React.useRef<SVGPathElement>(null),
        mouthOutline = React.useRef<SVGPathElement>(null),
        tooth = React.useRef<SVGPathElement>(null),
        tongue = React.useRef<SVGGElement>(null),
        chin = React.useRef<SVGPathElement>(null),
        face = React.useRef<SVGPathElement>(null),
        eyebrow = React.useRef<SVGGElement>(null),
        outerEarL = React.useRef<SVGGElement>(null),
        outerEarR = React.useRef<SVGGElement>(null),
        earHairL = React.useRef<SVGGElement>(null),
        earHairR = React.useRef<SVGGElement>(null),
        hair = React.useRef<SVGPathElement>(null);

    const blinkingAnimation = React.useRef<gsap.core.Tween | null>(null);
    const blinkingFlag = React.useRef(true);
    const eyeScale = React.useRef(1);
    const emailScrollMax = React.useRef(0);
    const screenCenter = React.useRef(0);
    const emailCoords = React.useRef<Coordinates>({ x: 0, y: 0 });
    const eyeLCoords = React.useRef<Coordinates>({ x: 0, y: 0 });
    const eyeRCoords = React.useRef<Coordinates>({ x: 0, y: 0 });
    const noseCoords = React.useRef<Coordinates>({ x: 0, y: 0 });
    const mouthCoords = React.useRef<Coordinates>({ x: 0, y: 0 });

    useEffect(() => {
        // Place arms in correct position initially
        gsap.set(armL.current, {
            x: -93,
            y: 220,
            rotation: 105,
            transformOrigin: "top left",
        });
        gsap.set(armR.current, {
            x: -93,
            y: 220,
            rotation: -105,
            transformOrigin: "top right",
        });
    }, []);

    function _startBlinking(delay = 10) {
        // If blinking has been disabled
        if (!blinkingFlag.current) return;

        delay = Math.max(Math.floor(Math.random() * Math.floor(delay)), 2);

        blinkingAnimation.current = gsap.to([eyeL.current, eyeR.current], {
            duration: 0.1,
            delay: delay,
            scaleY: 0,
            yoyo: true,
            repeat: 1,
            transformOrigin: "center center",
            onComplete: function () {
                // No need to check for mounted state. Think why?
                _startBlinking(10);
            },
        });
    }
    function _stopBlinking() {
        blinkingAnimation.current?.kill();
        blinkingAnimation.current = null;
        if (isMounted.current)
            gsap.to([eyeL.current, eyeR.current], {
                scaleY: eyeScale.current,
            });
    }

    function enableBlinking() {
        blinkingFlag.current = true;
        _startBlinking();
    }

    function disableBlinking() {
        blinkingFlag.current = false;
        _stopBlinking();
    }

    function coverEyes() {
        gsap.killTweensOf([armL.current, armR.current]);
        gsap.set([armL.current, armR.current], { visibility: "visible" });
        gsap.to(armL.current, {
            duration: 0.45,
            x: -93,
            y: 10,
            rotation: 0,
            ease: Quad.easeOut,
        });
        gsap.to(armR.current, {
            duration: 0.45,
            x: -93,
            y: 10,
            rotation: 0,
            ease: Quad.easeOut,
            delay: 0.1,
        });
        // gsap.to(bodyBG.current, {
        //   duration: 0.45,
        //   attr: { d: bodyBGChanged.current.getAttribute("d") },
        //   ease: Quad.easeOut,
        // });
    }

    function uncoverEyes() {
        gsap.killTweensOf([armL.current, armR.current]);
        gsap.to(armL.current, { duration: 1.35, y: 220, ease: Quad.easeOut });
        gsap.to(armL.current, {
            duration: 1.35,
            rotation: 105,
            ease: Quad.easeOut,
            delay: 0.1,
        });
        gsap.to(armR.current, { duration: 1.35, y: 220, ease: Quad.easeOut });
        gsap.to(armR.current, {
            duration: 1.35,
            rotation: -105,
            ease: Quad.easeOut,
            delay: 0.1,
            onComplete: function () {
                if (isMounted.current)
                    gsap.set([armL.current, armR.current], {
                        visibility: "hidden",
                    });
            },
        });
        // gsap.to(bodyBG.current, {
        //   duration: 0.45,
        //   // attr: { d: bodyBG.current.getAttribute("d") },
        //   ease: Quad.easeOut,
        // });
    }

    function spreadFingers() {
        gsap.to(twoFingers.current, {
            duration: 0.35,
            transformOrigin: "bottom left",
            rotation: 30,
            x: -9,
            y: -2,
            ease: Power2.easeInOut,
        });
    }

    function closeFingers() {
        gsap.to(twoFingers.current, {
            duration: 0.35,
            transformOrigin: "bottom left",
            rotation: 0,
            x: 0,
            y: 0,
            ease: Power2.easeInOut,
        });
    }

    // When eyes covered
    useEffectExceptMount(() => {
        if (covered) coverEyes();
        else uncoverEyes();
    }, [covered]);

    // When fingers spread
    useEffectExceptMount(() => {
        if (fingersSpread) spreadFingers();
        else closeFingers();
    }, [fingersSpread]);

    // Set up blinking and other effects
    useEffect(() => {
        enableBlinking();
        if (fingersSpread) spreadFingers();
        if (covered) coverEyes();

        const svgCoords = getPosition(mySVG.current);
        emailCoords.current = getPosition(emailRef.current);
        screenCenter.current = svgCoords.x + mySVG.current.offsetWidth / 2;
        eyeLCoords.current = { x: svgCoords.x + 84, y: svgCoords.y + 76 };
        eyeRCoords.current = { x: svgCoords.x + 113, y: svgCoords.y + 76 };
        noseCoords.current = { x: svgCoords.x + 97, y: svgCoords.y + 81 };
        mouthCoords.current = { x: svgCoords.x + 100, y: svgCoords.y + 100 };
        emailScrollMax.current = emailRef.current.scrollWidth;
        return () => {
            gsap.killTweensOf("*");
            disableBlinking();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function getAngle(x1: number, y1: number, x2: number, y2: number) {
        return Math.atan2(y1 - y2, x1 - x2);
    }

    function getPosition(el: HTMLElement): Coordinates {
        let xPos = 0;
        let yPos = 0;

        while (el) {
            if (el.tagName == "BODY") {
                // deal with browser quirks with body/window/document and page scroll
                const xScroll =
                    el.scrollLeft || document.documentElement.scrollLeft;
                const yScroll =
                    el.scrollTop || document.documentElement.scrollTop;

                xPos += el.offsetLeft - xScroll + el.clientLeft;
                yPos += el.offsetTop - yScroll + el.clientTop;
            } else {
                // for all other non-BODY elements
                xPos += el.offsetLeft - el.scrollLeft + el.clientLeft;
                yPos += el.offsetTop - el.scrollTop + el.clientTop;
            }

            el = el.offsetParent as HTMLElement;
        }
        return {
            x: xPos,
            y: yPos,
        };
    }
    const dFromC = React.useRef(0);
    function calculateFaceMove() {
        // The email element
        let carPos = emailRef.current.selectionEnd;
        const div = document.createElement("div"),
            span = document.createElement("span"),
            copyStyle = getComputedStyle(emailRef.current);
        let caretCoords: Coordinates;

        // if browser doesn't support 'selectionEnd' property on input[type="email"], use 'value.length' property instead
        if (!carPos) {
            carPos = emailRef.current.value.length;
        }

        Array.prototype.forEach.call(copyStyle, function (prop: string) {
            div.style[prop] = copyStyle[prop];
        });
        div.style.position = "absolute";
        document.body.appendChild(div);
        div.textContent = emailRef.current.value.substr(0, carPos);
        span.textContent = emailRef.current.value.substr(carPos) || ".";
        div.appendChild(span);

        let eyeLAngle: number,
            eyeRAngle: number,
            noseAngle: number,
            mouthAngle: number;

        if (emailRef.current.scrollWidth <= emailScrollMax.current) {
            caretCoords = getPosition(span);
            dFromC.current =
                screenCenter.current - (caretCoords.x + emailCoords.current.x);
            eyeLAngle = getAngle(
                eyeLCoords.current.x,
                eyeLCoords.current.y,
                emailCoords.current.x + caretCoords.x,
                emailCoords.current.y + 25
            );
            eyeRAngle = getAngle(
                eyeRCoords.current.x,
                eyeRCoords.current.y,
                emailCoords.current.x + caretCoords.x,
                emailCoords.current.y + 25
            );
            noseAngle = getAngle(
                noseCoords.current.x,
                noseCoords.current.y,
                emailCoords.current.x + caretCoords.x,
                emailCoords.current.y + 25
            );
            mouthAngle = getAngle(
                mouthCoords.current.x,
                mouthCoords.current.y,
                emailCoords.current.x + caretCoords.x,
                emailCoords.current.y + 25
            );
        } else {
            eyeLAngle = getAngle(
                eyeLCoords.current.x,
                eyeLCoords.current.y,
                emailCoords.current.x + emailScrollMax.current,
                emailCoords.current.y + 25
            );
            eyeRAngle = getAngle(
                eyeRCoords.current.x,
                eyeRCoords.current.y,
                emailCoords.current.x + emailScrollMax.current,
                emailCoords.current.y + 25
            );
            noseAngle = getAngle(
                noseCoords.current.x,
                noseCoords.current.y,
                emailCoords.current.x + emailScrollMax.current,
                emailCoords.current.y + 25
            );
            mouthAngle = getAngle(
                mouthCoords.current.x,
                mouthCoords.current.y,
                emailCoords.current.x + emailScrollMax.current,
                emailCoords.current.y + 25
            );
        }

        const eyeLX = Math.cos(eyeLAngle) * 20;
        const eyeLY = Math.sin(eyeLAngle) * 10;
        const eyeRX = Math.cos(eyeRAngle) * 20;
        const eyeRY = Math.sin(eyeRAngle) * 10;
        const noseX = Math.cos(noseAngle) * 23;
        const noseY = Math.sin(noseAngle) * 10;
        const mouthX = Math.cos(mouthAngle) * 23;
        const mouthY = Math.sin(mouthAngle) * 10;
        const mouthR = Math.cos(mouthAngle) * 6;
        const chinX = mouthX * 0.8;
        const chinY = mouthY * 0.5;
        let chinS = 1 - (dFromC.current * 0.15) / 100;
        if (chinS > 1) {
            chinS = 1 - (chinS - 1);
            if (chinS < chinMin) {
                chinS = chinMin;
            }
        }
        const faceX = mouthX * 0.3;
        const faceY = mouthY * 0.4;
        const faceSkew = Math.cos(mouthAngle) * 5;
        const eyebrowSkew = Math.cos(mouthAngle) * 25;
        const outerEarX = Math.cos(mouthAngle) * 4;
        const outerEarY = Math.cos(mouthAngle) * 5;
        const hairX = Math.cos(mouthAngle) * 6;
        const hairS = 1.2;

        gsap.to(eyeL.current, { x: -eyeLX, y: -eyeLY, ease: Expo.easeOut });
        gsap.to(eyeR.current, { x: -eyeRX, y: -eyeRY, ease: Expo.easeOut });
        gsap.to(nose.current, {
            duration: 1,
            x: -noseX,
            y: -noseY,
            rotation: mouthR,
            transformOrigin: "center center",
            ease: Expo.easeOut,
        });
        gsap.to(mouth.current, {
            duration: 1,
            x: -mouthX,
            y: -mouthY,
            rotation: mouthR,
            transformOrigin: "center center",
            ease: Expo.easeOut,
        });
        gsap.to(chin.current, {
            duration: 1,
            x: -chinX,
            y: -chinY,
            scaleY: chinS,
            ease: Expo.easeOut,
        });
        gsap.to(face.current, {
            duration: 1,
            x: -faceX,
            y: -faceY,
            skewX: -faceSkew,
            transformOrigin: "center top",
            ease: Expo.easeOut,
        });
        gsap.to(eyebrow.current, {
            duration: 1,
            x: -faceX,
            y: -faceY,
            skewX: -eyebrowSkew,
            transformOrigin: "center top",
            ease: Expo.easeOut,
        });
        gsap.to(outerEarL.current, {
            duration: 1,
            x: outerEarX,
            y: -outerEarY,
            ease: Expo.easeOut,
        });
        gsap.to(outerEarR.current, {
            duration: 1,
            x: outerEarX,
            y: outerEarY,
            ease: Expo.easeOut,
        });
        gsap.to(earHairL.current, {
            duration: 1,
            x: -outerEarX,
            y: -outerEarY,
            ease: Expo.easeOut,
        });
        gsap.to(earHairR.current, {
            duration: 1,
            x: -outerEarX,
            y: outerEarY,
            ease: Expo.easeOut,
        });
        gsap.to(hair.current, {
            duration: 1,
            x: hairX,
            scaleY: hairS,
            transformOrigin: "center bottom",
            ease: Expo.easeOut,
        });

        document.body.removeChild(div);
    }

    const mouthStatus = React.useRef<"small" | "medium" | "large">("small");
    useEffectExceptMount(() => {
        calculateFaceMove();

        const value = emailRef.current.value;
        const curEmailIndex = value.length;

        // very crude email validation to trigger effects
        if (curEmailIndex > 0) {
            if (value.length > 3) {
                mouthStatus.current = "large";
                const target = mouthLargeBG.current.getAttribute("d");
                [
                    mouthBG.current,
                    mouthOutline.current,
                    mouthMaskPath.current,
                ].forEach((el: SVGPathElement) => {
                    const source = el.getAttribute("d");
                    const obj = { t: 0 };
                    const interpolator = interpolate(source, target, {
                        maxSegmentLength: 2,
                    });
                    gsap.to(obj, {
                        duration: 1,
                        t: 1,
                        ease: Expo.easeOut,
                        onUpdate: () => {
                            if (!isMounted.current) return;
                            el.setAttribute("d", interpolator(obj.t));
                        },
                    });
                });
                gsap.to(tooth.current, {
                    duration: 1,
                    x: 3,
                    y: -2,
                    ease: Expo.easeOut,
                });
                gsap.to(tongue.current, {
                    duration: 1,
                    y: 2,
                    ease: Expo.easeOut,
                });
                gsap.to([eyeL.current, eyeR.current], {
                    duration: 1,
                    scaleX: 0.65,
                    scaleY: 0.65,
                    ease: Expo.easeOut,
                    transformOrigin: "center center",
                });
                eyeScale.current = 0.65;
            } else {
                mouthStatus.current = "medium";
                const target = mouthMediumBG.current.getAttribute("d");
                [
                    mouthBG.current,
                    mouthOutline.current,
                    mouthMaskPath.current,
                ].forEach((el: SVGPathElement) => {
                    const source = el.getAttribute("d");
                    const obj = { t: 0 };
                    const interpolator = interpolate(source, target, {
                        maxSegmentLength: 2,
                    });
                    gsap.to(obj, {
                        duration: 1,
                        t: 1,
                        ease: Expo.easeOut,
                        onUpdate: () => {
                            if (!isMounted.current) return;
                            el.setAttribute("d", interpolator(obj.t));
                        },
                    });
                });
                gsap.to(tooth.current, {
                    duration: 1,
                    x: 0,
                    y: 0,
                    ease: Expo.easeOut,
                });
                gsap.to(tongue.current, {
                    duration: 1,
                    x: 0,
                    y: 1,
                    ease: Expo.easeOut,
                });
                gsap.to([eyeL.current, eyeR.current], {
                    duration: 1,
                    scaleX: 0.85,
                    scaleY: 0.85,
                    ease: Expo.easeOut,
                });
                eyeScale.current = 0.85;
            }
        } else {
            mouthStatus.current = "small";
            const target = mouthSmallBG.current.getAttribute("d");
            [
                mouthBG.current,
                mouthOutline.current,
                mouthMaskPath.current,
            ].forEach((el: SVGPathElement) => {
                const source = el.getAttribute("d");
                const obj = { t: 0 };
                const interpolator = interpolate(source, target, {
                    maxSegmentLength: 2,
                });
                gsap.to(obj, {
                    duration: 1,
                    t: 1,
                    ease: Expo.easeOut,
                    onUpdate: () => {
                        if (!isMounted.current) return;
                        el.setAttribute("d", interpolator(obj.t));
                    },
                });
            });
            gsap.to(tooth.current, {
                duration: 1,
                x: 0,
                y: 0,
                ease: Expo.easeOut,
            });
            gsap.to(tongue.current, {
                duration: 1,
                x: 0,
                y: 1,
                ease: Expo.easeOut,
            });
            gsap.to([eyeL.current, eyeR.current], {
                duration: 1,
                scaleX: 1,
                scaleY: 1,
                ease: Expo.easeOut,
            });
            eyeScale.current = 1;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [emailChangeTrigger]);

    function resetFace() {
        gsap.to([eyeL.current, eyeR.current], {
            duration: 1,
            x: 0,
            y: 0,
            ease: Expo.easeOut,
        });
        gsap.to(nose.current, {
            duration: 1,
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            ease: Expo.easeOut,
        });
        gsap.to(mouth.current, {
            duration: 1,
            x: 0,
            y: 0,
            rotation: 0,
            ease: Expo.easeOut,
        });
        gsap.to(chin.current, {
            duration: 1,
            x: 0,
            y: 0,
            scaleY: 1,
            ease: Expo.easeOut,
        });
        gsap.to([face.current, eyebrow.current], 1, {
            x: 0,
            y: 0,
            skewX: 0,
            ease: Expo.easeOut,
        });
        gsap.to(
            [
                outerEarL.current,
                outerEarR.current,
                earHairL.current,
                earHairR.current,
                hair.current,
            ],
            {
                duration: 1,
                x: 0,
                y: 0,
                scaleY: 1,
                ease: Expo.easeOut,
            }
        );
    }

    useEffectExceptMount(() => {
        resetFace();
    }, [emailBlurTrigger]);

    return (
        <>
            <div className={classes["svgContainer"]} ref={mySVG}>
                <div>
                    <svg
                        className={classes["mySVG"]}
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 200 200">
                        <defs>
                            <circle
                                id="armMaskPath"
                                cx="100"
                                cy="100"
                                r="100"
                            />
                        </defs>
                        <clipPath id="armMask">
                            <use xlinkHref="#armMaskPath" overflow="visible" />
                        </clipPath>
                        <circle cx="100" cy="100" r="100" fill="#a9ddf3" />
                        <g className="body">
                            <path
                                ref={bodyBGChanged}
                                className="bodyBGchanged"
                                style={{ display: "none" }}
                                fill="#FFFFFF"
                                d="M200,122h-35h-14.9V72c0-27.6-22.4-50-50-50s-50,22.4-50,50v50H35.8H0l0,91h200L200,122z"
                            />
                            <path
                                ref={bodyBG}
                                className="bodyBGnormal"
                                stroke="#3A5E77"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                stroke-linejoinn="round"
                                fill="#FFFFFF"
                                d="M200,158.5c0-20.2-14.8-36.5-35-36.5h-14.9V72.8c0-27.4-21.7-50.4-49.1-50.8c-28-0.5-50.9,22.1-50.9,50v50 H35.8C16,122,0,138,0,157.8L0,213h200L200,158.5z"
                            />
                            <path
                                fill="#DDF1FA"
                                d="M100,156.4c-22.9,0-43,11.1-54.1,27.7c15.6,10,34.2,15.9,54.1,15.9s38.5-5.8,54.1-15.9 C143,167.5,122.9,156.4,100,156.4z"
                            />
                        </g>
                        <g className="earL">
                            <g
                                ref={outerEarL}
                                className="outerEar"
                                fill="#ddf1fa"
                                stroke="#3a5e77"
                                strokeWidth="2.5">
                                <circle cx="47" cy="83" r="11.5" />
                                <path
                                    d="M46.3 78.9c-2.3 0-4.1 1.9-4.1 4.1 0 2.3 1.9 4.1 4.1 4.1"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </g>
                            <g className="earHair" ref={earHairL}>
                                <rect
                                    x="51"
                                    y="64"
                                    fill="#FFFFFF"
                                    width="15"
                                    height="35"
                                />
                                <path
                                    d="M53.4 62.8C48.5 67.4 45 72.2 42.8 77c3.4-.1 6.8-.1 10.1.1-4 3.7-6.8 7.6-8.2 11.6 2.1 0 4.2 0 6.3.2-2.6 4.1-3.8 8.3-3.7 12.5 1.2-.7 3.4-1.4 5.2-1.9"
                                    fill="#fff"
                                    stroke="#3a5e77"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </g>
                        </g>
                        <g className="earR">
                            <g className="outerEar" ref={outerEarR}>
                                <circle
                                    fill="#DDF1FA"
                                    stroke="#3A5E77"
                                    strokeWidth="2.5"
                                    cx="153"
                                    cy="83"
                                    r="11.5"
                                />
                                <path
                                    fill="#DDF1FA"
                                    stroke="#3A5E77"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M153.7,78.9 c2.3,0,4.1,1.9,4.1,4.1c0,2.3-1.9,4.1-4.1,4.1"
                                />
                            </g>
                            <g className="earHair" ref={earHairR}>
                                <rect
                                    x="134"
                                    y="64"
                                    fill="#FFFFFF"
                                    width="15"
                                    height="35"
                                />
                                <path
                                    fill="#FFFFFF"
                                    stroke="#3A5E77"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M146.6,62.8 c4.9,4.6,8.4,9.4,10.6,14.2c-3.4-0.1-6.8-0.1-10.1,0.1c4,3.7,6.8,7.6,8.2,11.6c-2.1,0-4.2,0-6.3,0.2c2.6,4.1,3.8,8.3,3.7,12.5 c-1.2-0.7-3.4-1.4-5.2-1.9"
                                />
                            </g>
                        </g>
                        <path
                            className="chin"
                            ref={chin}
                            d="M84.1 121.6c2.7 2.9 6.1 5.4 9.8 7.5l.9-4.5c2.9 2.5 6.3 4.8 10.2 6.5 0-1.9-.1-3.9-.2-5.8 3 1.2 6.2 2 9.7 2.5-.3-2.1-.7-4.1-1.2-6.1"
                            fill="none"
                            stroke="#3a5e77"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            ref={face}
                            className="face"
                            fill="#DDF1FA"
                            d="M134.5,46v35.5c0,21.815-15.446,39.5-34.5,39.5s-34.5-17.685-34.5-39.5V46"
                        />
                        <path
                            ref={hair}
                            className="hair"
                            fill="#FFFFFF"
                            stroke="#3A5E77"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M81.457,27.929 c1.755-4.084,5.51-8.262,11.253-11.77c0.979,2.565,1.883,5.14,2.712,7.723c3.162-4.265,8.626-8.27,16.272-11.235 c-0.737,3.293-1.588,6.573-2.554,9.837c4.857-2.116,11.049-3.64,18.428-4.156c-2.403,3.23-5.021,6.391-7.852,9.474"
                        />
                        <g className="eyebrow" ref={eyebrow}>
                            <path
                                fill="#FFFFFF"
                                d="M138.142,55.064c-4.93,1.259-9.874,2.118-14.787,2.599c-0.336,3.341-0.776,6.689-1.322,10.037 c-4.569-1.465-8.909-3.222-12.996-5.226c-0.98,3.075-2.07,6.137-3.267,9.179c-5.514-3.067-10.559-6.545-15.097-10.329 c-1.806,2.889-3.745,5.73-5.816,8.515c-7.916-4.124-15.053-9.114-21.296-14.738l1.107-11.768h73.475V55.064z"
                            />
                            <path
                                fill="#FFFFFF"
                                stroke="#3A5E77"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M63.56,55.102 c6.243,5.624,13.38,10.614,21.296,14.738c2.071-2.785,4.01-5.626,5.816-8.515c4.537,3.785,9.583,7.263,15.097,10.329 c1.197-3.043,2.287-6.104,3.267-9.179c4.087,2.004,8.427,3.761,12.996,5.226c0.545-3.348,0.986-6.696,1.322-10.037 c4.913-0.481,9.857-1.34,14.787-2.599"
                            />
                        </g>
                        <g className="eyeL" ref={eyeL}>
                            <circle
                                cx="85.5"
                                cy="78.5"
                                r="3.5"
                                fill="#3a5e77"
                            />
                            <circle cx="84" cy="76" r="1" fill="#fff" />
                        </g>
                        <g className="eyeR" ref={eyeR}>
                            <circle
                                cx="114.5"
                                cy="78.5"
                                r="3.5"
                                fill="#3a5e77"
                            />
                            <circle cx="113" cy="76" r="1" fill="#fff" />
                        </g>
                        <g className="mouth" ref={mouth}>
                            <path
                                className="mouthBG"
                                ref={mouthBG}
                                fill="#617E92"
                                d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z"
                            />
                            <path
                                style={{ display: "none" }}
                                ref={mouthSmallBG}
                                className="mouthSmallBG"
                                fill="#617E92"
                                d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z"
                            />
                            <path
                                style={{ display: "none" }}
                                className="mouthMediumBG"
                                ref={mouthMediumBG}
                                d="M95,104.2c-4.5,0-8.2-3.7-8.2-8.2v-2c0-1.2,1-2.2,2.2-2.2h22c1.2,0,2.2,1,2.2,2.2v2 c0,4.5-3.7,8.2-8.2,8.2H95z"
                            />
                            <path
                                style={{ display: "none" }}
                                ref={mouthLargeBG}
                                className="mouthLargeBG"
                                d="M100 110.2c-9 0-16.2-7.3-16.2-16.2 0-2.3 1.9-4.2 4.2-4.2h24c2.3 0 4.2 1.9 4.2 4.2 0 9-7.2 16.2-16.2 16.2z"
                                fill="#617e92"
                                stroke="#3a5e77"
                                strokeLinejoin="round"
                                strokeWidth="2.5"
                            />
                            <defs>
                                <path
                                    ref={mouthMaskPath}
                                    id="mouthMaskPath"
                                    d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z"
                                />
                            </defs>
                            <clipPath id="mouthMask">
                                <use
                                    xlinkHref="#mouthMaskPath"
                                    overflow="visible"
                                />
                            </clipPath>
                            <g clipPath="url(#mouthMask)">
                                <g className="tongue" ref={tongue}>
                                    <circle
                                        cx="100"
                                        cy="107"
                                        r="8"
                                        fill="#cc4a6c"
                                    />
                                    <ellipse
                                        className="tongueHighlight"
                                        cx="100"
                                        cy="100.5"
                                        rx="3"
                                        ry="1.5"
                                        opacity=".1"
                                        fill="#fff"
                                    />
                                </g>
                            </g>
                            <path
                                clipPath="url(#mouthMask)"
                                className="tooth"
                                ref={tooth}
                                fill="#FFFFFF"
                                d="M106,97h-4c-1.1,0-2-0.9-2-2v-2h8v2C108,96.1,107.1,97,106,97z"
                            />
                            <path
                                className="mouthOutline"
                                ref={mouthOutline}
                                fill="none"
                                stroke="#3A5E77"
                                strokeWidth="2.5"
                                strokeLinejoin="round"
                                d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z"
                            />
                        </g>
                        <path
                            className="nose"
                            ref={nose}
                            d="M97.7 79.9h4.7c1.9 0 3 2.2 1.9 3.7l-2.3 3.3c-.9 1.3-2.9 1.3-3.8 0l-2.3-3.3c-1.3-1.6-.2-3.7 1.8-3.7z"
                            fill="#3a5e77"
                        />
                        <g className="arms" clipPath="url(#armMask)">
                            <g
                                className="armL"
                                ref={armL}
                                style={{ visibility: "hidden" }}>
                                <polygon
                                    fill="#DDF1FA"
                                    stroke="#3A5E77"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeMiterlimit="10"
                                    points="121.3,98.4 111,59.7 149.8,49.3 169.8,85.4"
                                />
                                <path
                                    fill="#DDF1FA"
                                    stroke="#3A5E77"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeMiterlimit="10"
                                    d="M134.4,53.5l19.3-5.2c2.7-0.7,5.4,0.9,6.1,3.5v0c0.7,2.7-0.9,5.4-3.5,6.1l-10.3,2.8"
                                />
                                <path
                                    fill="#DDF1FA"
                                    stroke="#3A5E77"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeMiterlimit="10"
                                    d="M150.9,59.4l26-7c2.7-0.7,5.4,0.9,6.1,3.5v0c0.7,2.7-0.9,5.4-3.5,6.1l-21.3,5.7"
                                />

                                <g className="twoFingers" ref={twoFingers}>
                                    <path
                                        fill="#DDF1FA"
                                        stroke="#3A5E77"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeMiterlimit="10"
                                        d="M158.3,67.8l23.1-6.2c2.7-0.7,5.4,0.9,6.1,3.5v0c0.7,2.7-0.9,5.4-3.5,6.1l-23.1,6.2"
                                    />
                                    <path
                                        fill="#A9DDF3"
                                        d="M180.1,65l2.2-0.6c1.1-0.3,2.2,0.3,2.4,1.4v0c0.3,1.1-0.3,2.2-1.4,2.4l-2.2,0.6L180.1,65z"
                                    />
                                    <path
                                        fill="#DDF1FA"
                                        stroke="#3A5E77"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeMiterlimit="10"
                                        d="M160.8,77.5l19.4-5.2c2.7-0.7,5.4,0.9,6.1,3.5v0c0.7,2.7-0.9,5.4-3.5,6.1l-18.3,4.9"
                                    />
                                    <path
                                        fill="#A9DDF3"
                                        d="M178.8,75.7l2.2-0.6c1.1-0.3,2.2,0.3,2.4,1.4v0c0.3,1.1-0.3,2.2-1.4,2.4l-2.2,0.6L178.8,75.7z"
                                    />
                                </g>
                                <path
                                    fill="#A9DDF3"
                                    d="M175.5,55.9l2.2-0.6c1.1-0.3,2.2,0.3,2.4,1.4v0c0.3,1.1-0.3,2.2-1.4,2.4l-2.2,0.6L175.5,55.9z"
                                />
                                <path
                                    fill="#A9DDF3"
                                    d="M152.1,50.4l2.2-0.6c1.1-0.3,2.2,0.3,2.4,1.4v0c0.3,1.1-0.3,2.2-1.4,2.4l-2.2,0.6L152.1,50.4z"
                                />
                                <path
                                    fill="#FFFFFF"
                                    stroke="#3A5E77"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M123.5,97.8 c-41.4,14.9-84.1,30.7-108.2,35.5L1.2,81c33.5-9.9,71.9-16.5,111.9-21.8"
                                />
                                <path
                                    fill="#FFFFFF"
                                    stroke="#3A5E77"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M108.5,60.4 c7.7-5.3,14.3-8.4,22.8-13.2c-2.4,5.3-4.7,10.3-6.7,15.1c4.3,0.3,8.4,0.7,12.3,1.3c-4.2,5-8.1,9.6-11.5,13.9 c3.1,1.1,6,2.4,8.7,3.8c-1.4,2.9-2.7,5.8-3.9,8.5c2.5,3.5,4.6,7.2,6.3,11c-4.9-0.8-9-0.7-16.2-2.7"
                                />
                                <path
                                    fill="#FFFFFF"
                                    stroke="#3A5E77"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M94.5,103.8 c-0.6,4-3.8,8.9-9.4,14.7c-2.6-1.8-5-3.7-7.2-5.7c-2.5,4.1-6.6,8.8-12.2,14c-1.9-2.2-3.4-4.5-4.5-6.9c-4.4,3.3-9.5,6.9-15.4,10.8 c-0.2-3.4,0.1-7.1,1.1-10.9"
                                />
                                <path
                                    fill="#FFFFFF"
                                    stroke="#3A5E77"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M97.5,63.9 c-1.7-2.4-5.9-4.1-12.4-5.2c-0.9,2.2-1.8,4.3-2.5,6.5c-3.8-1.8-9.4-3.1-17-3.8c0.5,2.3,1.2,4.5,1.9,6.8c-5-0.6-11.2-0.9-18.4-1 c2,2.9,0.9,3.5,3.9,6.2"
                                />
                            </g>
                            <g
                                className="armR"
                                ref={armR}
                                style={{ visibility: "hidden" }}>
                                <path
                                    fill="#ddf1fa"
                                    stroke="#3a5e77"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeMiterlimit="10"
                                    strokeWidth="2.5"
                                    d="M265.4 97.3l10.4-38.6-38.9-10.5-20 36.1z"
                                />
                                <path
                                    fill="#ddf1fa"
                                    stroke="#3a5e77"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeMiterlimit="10"
                                    strokeWidth="2.5"
                                    d="M252.4 52.4L233 47.2c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l10.3 2.8M226 76.4l-19.4-5.2c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l18.3 4.9M228.4 66.7l-23.1-6.2c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l23.1 6.2M235.8 58.3l-26-7c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l21.3 5.7"
                                />
                                <path
                                    fill="#a9ddf3"
                                    d="M207.9 74.7l-2.2-.6c-1.1-.3-2.2.3-2.4 1.4-.3 1.1.3 2.2 1.4 2.4l2.2.6 1-3.8zM206.7 64l-2.2-.6c-1.1-.3-2.2.3-2.4 1.4-.3 1.1.3 2.2 1.4 2.4l2.2.6 1-3.8zM211.2 54.8l-2.2-.6c-1.1-.3-2.2.3-2.4 1.4-.3 1.1.3 2.2 1.4 2.4l2.2.6 1-3.8zM234.6 49.4l-2.2-.6c-1.1-.3-2.2.3-2.4 1.4-.3 1.1.3 2.2 1.4 2.4l2.2.6 1-3.8z"
                                />
                                <path
                                    fill="#fff"
                                    stroke="#3a5e77"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2.5"
                                    d="M263.3 96.7c41.4 14.9 84.1 30.7 108.2 35.5l14-52.3C352 70 313.6 63.5 273.6 58.1"
                                />
                                <path
                                    fill="#fff"
                                    stroke="#3a5e77"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2.5"
                                    d="M278.2 59.3l-18.6-10 2.5 11.9-10.7 6.5 9.9 8.7-13.9 6.4 9.1 5.9-13.2 9.2 23.1-.9M284.5 100.1c-.4 4 1.8 8.9 6.7 14.8 3.5-1.8 6.7-3.6 9.7-5.5 1.8 4.2 5.1 8.9 10.1 14.1 2.7-2.1 5.1-4.4 7.1-6.8 4.1 3.4 9 7 14.7 11 1.2-3.4 1.8-7 1.7-10.9M314 66.7s5.4-5.7 12.6-7.4c1.7 2.9 3.3 5.7 4.9 8.6 3.8-2.5 9.8-4.4 18.2-5.7.1 3.1.1 6.1 0 9.2 5.5-1 12.5-1.6 20.8-1.9-1.4 3.9-2.5 8.4-2.5 8.4"
                                />
                            </g>
                        </g>
                    </svg>
                </div>
            </div>
        </>
    );
};

export default Yeti;
