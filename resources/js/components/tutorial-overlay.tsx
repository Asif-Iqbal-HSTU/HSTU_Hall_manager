import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TutorialOverlay() {
    const isMobile = useIsMobile();
    const [step, setStep] = useState<number | null>(null);
    const [rect, setRect] = useState<DOMRect | null>(null);

    // Initialize from localStorage
    useEffect(() => {
        const storedStep = localStorage.getItem('student_tutorial_step');
        if (storedStep) {
            setStep(parseInt(storedStep, 10));
        }
    }, []);

    // Monitor page URL and DOM changes to update steps automatically
    useEffect(() => {
        if (step === null) return;

        const currentUrl = window.location.pathname;

        // Auto-complete or advance based on navigation
        if (currentUrl.includes('/settings/security')) {
            localStorage.removeItem('student_tutorial_step');
            setStep(null);
            return;
        }

        const handleDomCheck = () => {
            let targetId = '';
            
            if (isMobile) {
                // Mobile steps
                if (step === 1) {
                    targetId = 'sidebar-trigger';
                    // If sidebar is already open (meaning user menu trigger is visible), auto advance
                    if (document.getElementById('user-menu-trigger')) {
                        updateStep(2);
                        return;
                    }
                } else if (step === 2) {
                    targetId = 'user-menu-trigger';
                    // If settings link is visible, dropdown is open, advance
                    if (document.getElementById('settings-menu-link')) {
                        updateStep(3);
                        return;
                    }
                } else if (step === 3) {
                    targetId = 'settings-menu-link';
                } else if (step === 4) {
                    targetId = 'security-settings-tab';
                }
            } else {
                // Desktop steps
                if (step === 1) {
                    targetId = 'user-menu-trigger';
                    if (document.getElementById('settings-menu-link')) {
                        updateStep(2);
                        return;
                    }
                } else if (step === 2) {
                    targetId = 'settings-menu-link';
                } else if (step === 3) {
                    targetId = 'security-settings-tab';
                }
            }

            const element = document.getElementById(targetId);
            if (element) {
                setRect(element.getBoundingClientRect());
            } else {
                setRect(null);
            }
        };

        // Check on mount, scroll, resize, and periodically
        handleDomCheck();
        window.addEventListener('resize', handleDomCheck);
        window.addEventListener('scroll', handleDomCheck, true);
        const interval = setInterval(handleDomCheck, 300);

        return () => {
            window.removeEventListener('resize', handleDomCheck);
            window.removeEventListener('scroll', handleDomCheck, true);
            clearInterval(interval);
        };
    }, [step, isMobile]);

    const updateStep = (newStep: number) => {
        localStorage.setItem('student_tutorial_step', newStep.toString());
        setStep(newStep);
    };

    const handleSkip = () => {
        localStorage.removeItem('student_tutorial_step');
        setStep(null);
    };

    if (step === null || !rect) return null;

    // Determine tooltip position
    let tooltipStyle: React.CSSProperties = {};
    let arrowStyle: React.CSSProperties = {};

    const padding = 12;
    const tooltipWidth = 280;

    if (isMobile) {
        if (step === 1) {
            // Below the header trigger
            tooltipStyle = {
                top: `${rect.bottom + padding}px`,
                left: `${Math.max(padding, rect.left)}px`,
            };
        } else if (step === 2) {
            // Above the profile menu in expanded sidebar
            tooltipStyle = {
                bottom: `${window.innerHeight - rect.top + padding}px`,
                left: `${Math.max(padding, rect.left)}px`,
            };
        } else {
            // Center floating or next to it
            tooltipStyle = {
                top: `${rect.top - 120}px`,
                left: `${Math.max(padding, rect.left)}px`,
            };
        }
    } else {
        // Desktop positioning
        if (step === 1) {
            // Above user trigger
            tooltipStyle = {
                bottom: `${window.innerHeight - rect.top + padding}px`,
                left: `${rect.left + rect.width / 2 - tooltipWidth / 2}px`,
            };
        } else if (step === 2) {
            // To the right of settings link
            tooltipStyle = {
                top: `${rect.top}px`,
                left: `${rect.right + padding}px`,
            };
        } else if (step === 3) {
            // Below the security tab
            tooltipStyle = {
                top: `${rect.bottom + padding}px`,
                left: `${rect.left + rect.width / 2 - tooltipWidth / 2}px`,
            };
        }
    }

    const tutorialContent = {
        web: [
            {
                title: "Welcome to HSTU Halls!",
                text: "First, let's reset your temporary password. Click on your profile at the bottom left to open the user menu."
            },
            {
                title: "Access Settings",
                text: "Now click on 'Settings' in the menu to manage your account options."
            },
            {
                title: "Reset Password",
                text: "Excellent! Finally, select the 'Security' tab to set your personalized secure password."
            }
        ],
        mobile: [
            {
                title: "Welcome to HSTU Halls!",
                text: "Let's update your password. First, tap on the hamburger menu icon at the top left to expand the navigation sidebar."
            },
            {
                title: "Expand User Menu",
                text: "Tap on your profile at the bottom of the sidebar to view setting links."
            },
            {
                title: "Go to Settings",
                text: "Tap on 'Settings' from the list to navigate to your profile dashboard."
            },
            {
                title: "Open Security settings",
                text: "Lastly, click the 'Security' tab from the settings menu to update your password."
            }
        ]
    };

    const currentText = isMobile 
        ? tutorialContent.mobile[step - 1] 
        : tutorialContent.web[step - 1];

    if (!currentText) return null;

    const totalSteps = isMobile ? 4 : 3;

    return (
        <div className="fixed inset-0 z-50 pointer-events-none">
            {/* Highlight ring overlay */}
            <div 
                className="absolute border-2 border-indigo-500 rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.6)] animate-pulse pointer-events-none transition-all duration-300"
                style={{
                    top: `${rect.top - 4}px`,
                    left: `${rect.left - 4}px`,
                    width: `${rect.width + 8}px`,
                    height: `${rect.height + 8}px`,
                }}
            />

            {/* Tooltip box */}
            <div 
                className="absolute bg-slate-900/95 dark:bg-slate-900/98 text-slate-100 p-5 rounded-2xl border border-indigo-500/30 shadow-2xl pointer-events-auto flex flex-col gap-4 backdrop-blur-md transition-all duration-300"
                style={{
                    width: `${tooltipWidth}px`,
                    ...tooltipStyle
                }}
            >
                <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm text-indigo-400">{currentText.title}</h4>
                    <button 
                        onClick={handleSkip} 
                        className="text-slate-400 hover:text-slate-200 transition-colors p-0.5 rounded-full hover:bg-slate-800"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
                
                <p className="text-xs leading-relaxed text-slate-300">
                    {currentText.text}
                </p>

                <div className="flex justify-between items-center mt-1 pt-2 border-t border-slate-800 text-xs">
                    <span className="text-slate-500">
                        Step {step} of {totalSteps}
                    </span>
                    <div className="flex gap-2">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleSkip}
                            className="h-7 text-xs text-slate-400 hover:text-slate-200 hover:bg-transparent px-2"
                        >
                            Skip
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
