import React, { useState, useEffect } from "react";
import { 
  Check, 
  Lock, 
  Award, 
  Clock, 
  TrendingUp, 
  Code, 
  Cpu, 
  Database,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ==========================================
// COURSE DATA STRUCTURE
// ==========================================
interface Course {
  id: string;
  title: string;
  shortTitle: string;
  duration: string;
  learningMode: string;
  description: string;
  badge: string;
  certificates: string[];
}

const COURSES: Course[] = [
  {
    id: "CDA",
    title: "Certified Data Analyst",
    shortTitle: "CDA",
    duration: "6 Months",
    learningMode: "Live Interactive Training with Internship support",
    description: "Equip yourself with data transformation techniques, SQL proficiency, advanced corporate spreadsheet modeling, and industry-standard dashboard visualization suites.",
    badge: "Enterprise Analytics",
    certificates: [
      "IABAC Certified Data Analyst",
      "DataMites Certification of Completion",
      "Rubixe Internship Certificate (6 Months)"
    ]
  },
  {
    id: "CDS",
    title: "Certified Data Science Program",
    shortTitle: "CDS",
    duration: "8 Months",
    learningMode: "Live Interactive Training + Internship",
    description: "The premier global curriculum covering statistical analysis, machine learning algorithms, deep neural network configurations, and programmatic Python modeling.",
    badge: "Most Selected Track",
    certificates: [
      "IABAC Certified Data Analyst (CDA)",
      "IABAC Certified Data Scientist (CDS)",
      "DataMites Global Professional Certification",
      "Rubixe Internship Experience Letter (8 Months)"
    ]
  },
  {
    id: "AEN",
    title: "Artificial Intelligence Engineer",
    shortTitle: "AEN",
    duration: "10 Months",
    learningMode: "Advanced Live Training + AI Capstone + Internship",
    description: "Architect neural network structures, program computer vision intelligence layers, and deploy custom transformers for enterprise environments.",
    badge: "Advanced Engineering",
    certificates: [
      "IABAC Certified AI Specialist",
      "DataMites Advanced AI Engineer Credential",
      "Rubixe Experience Letter (10 Months)"
    ]
  },
  {
    id: "AIE",
    title: "AI Expert / Developer Track",
    shortTitle: "AIE",
    duration: "5 Months",
    learningMode: "Intensive Hands-on AI Bootcamp",
    description: "Accelerated development paradigm. Configure prompt structures, build vector search indexes, and integrate production-grade external AI application APIs.",
    badge: "Developer Focus",
    certificates: [
      "IABAC Certified AI Associate",
      "DataMites AI Developer Certification",
      "Rubixe Experience Letter (5 Months)"
    ]
  },
  {
    id: "CDE",
    title: "Certified Data Engineer",
    shortTitle: "CDE",
    duration: "7 Months",
    learningMode: "Big Data Infrastructures + Automated ETL Pipelines",
    description: "Master distributed computing frameworks (Hadoop, Spark), design transactional cloud ingest pipelines, and configure production architectures.",
    badge: "Infrastructure Focus",
    certificates: [
      "IABAC Certified Data Engineer",
      "DataMites Cloud Architecture Credential",
      "Rubixe Experience Letter (7 Months)"
    ]
  }
];

// ==========================================
// DATAMITES VECTOR LOGO COMPONENT
// ==========================================
function LogoDataMites() {
  return (
    <div className="flex items-center gap-3 select-none">
      <svg
        id="datamites-official-vector-logo"
        width="210"
        height="50"
        viewBox="0 0 420 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 sm:h-11 w-auto"
      >
        <path
          d="M15 12H45C68 12 85 28 85 50C85 72 68 88 45 88H15V12Z"
          fill="#0070C0"
        />
        <path
          d="M28 22H42C56 22 66 33 66 50C66 67 56 78 42 78H28V22Z"
          fill="white"
        />
        
        <path d="M31 38H45" stroke="#F7941D" strokeWidth="4" strokeLinecap="round" />
        <circle cx="48" cy="38" r="4" fill="#F7941D" />

        <path d="M31 50H53" stroke="#F7941D" strokeWidth="4" strokeLinecap="round" />
        <circle cx="56" cy="50" r="4" fill="#F7941D" />

        <path d="M31 62H41" stroke="#F7941D" strokeWidth="4" strokeLinecap="round" />
        <circle cx="44" cy="62" r="4" fill="#F7941D" />

        <text
          x="100"
          y="62"
          fontFamily="'Poppins', 'Inter', sans-serif"
          fontWeight="700"
          fontSize="50"
          letterSpacing="-1.5"
        >
          <tspan fill="#0070C0">ata</tspan>
          <tspan fill="#F7941D">mites</tspan>
        </text>

        <text
          x="355"
          y="35"
          fontFamily="'Poppins', sans-serif"
          fontWeight="700"
          fontSize="14"
          fill="#F7941D"
        >
          ®
        </text>

        <line x1="102" y1="72" x2="350" y2="72" stroke="#E5E7EB" strokeWidth="2.5" />

        <text
          x="102"
          y="90"
          fontFamily="'Inter', sans-serif"
          fontWeight="500"
          fontSize="15"
          fill="#6B7280"
          letterSpacing="0.5"
        >
          Global Institute for Data Science
        </text>
      </svg>
    </div>
  );
}

export default function App() {
  const [selectedCourseId] = useState<string>("CDS"); // Strictly lock to CDS as selected
  const [coupon, setCoupon] = useState<string>(""); // Remove prefilled coupon code
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  // Custom verification states
  const [verificationProgress, setVerificationProgress] = useState<number>(0);
  const [verificationStep, setVerificationStep] = useState<string>("");
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [couponError, setCouponError] = useState<{ title: string; subtext: string; type: 'error' | 'warning' | 'locked' | null } | null>(null);

  // Confetti particles local state
  interface Particle {
    id: number;
    x: number;
    y: number;
    color: string;
    size: number;
    rotate: number;
    delay: number;
    duration: number;
  }
  const [particles, setParticles] = useState<Particle[]>([]);

  const VALID_COUPON = "HARSHITH5000";

  // Dynamic state representing limited pre-approved seat urgency
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 42,
    seconds: 19
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const current = new Date();
      const cycleSecs = 12 * 3600;
      const currentSecs = Math.floor(current.getTime() / 1000);
      const remainingSecs = cycleSecs - (currentSecs % cycleSecs);
      
      const hours = Math.floor(remainingSecs / 3600);
      const minutes = Math.floor((remainingSecs % 3600) / 60);
      const seconds = remainingSecs % 60;
      
      return { hours, minutes, seconds };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeRemaining());
    }, 1000);

    setTimeLeft(calculateTimeRemaining());
    return () => clearInterval(timer);
  }, []);

  const triggerConfettiBurst = () => {
    const colors = ["#0070C0", "#F7941D", "#10B981", "#3B82F6", "#F59E0B"];
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < 35; i++) {
      // Angle in radians (pointing upwards and outwards, e.g. from 200 to 340 degrees)
      const angle = (Math.random() * 140 + 200) * (Math.PI / 180);
      const speed = Math.random() * 140 + 70; // Distance in pixels
      const x = Math.cos(angle) * speed;
      const y = Math.sin(angle) * speed;

      newParticles.push({
        id: i,
        x,
        y,
        color: colors[i % colors.length],
        size: Math.random() * 4 + 4, // 4px to 8px
        rotate: Math.random() * 360,
        delay: Math.random() * 0.1,
        duration: Math.random() * 0.3 + 0.5 // 0.5s to 0.8s
      });
    }
    setParticles(newParticles);
    
    // Clear particles after 1.2 seconds to free up DOM
    setTimeout(() => {
      setParticles([]);
    }, 1200);
  };

  const finalizeVerification = () => {
    setIsVerifying(false);
    
    const normalizedInput = coupon.trim().toUpperCase();
    
    if (normalizedInput === VALID_COUPON) {
      setIsUnlocked(true);
      setCouponError(null);
      triggerConfettiBurst();
    } else {
      const nextFailCount = failedAttempts + 1;
      setFailedAttempts(nextFailCount);
      
      if (nextFailCount === 1 || nextFailCount === 2) {
        setCouponError({
          title: "Invalid Authorization Code",
          subtext: "Please verify the code provided by your Admissions Manager.",
          type: "error"
        });
      } else if (nextFailCount === 3) {
        setCouponError({
          title: "Authorization verification failed.",
          subtext: "Only 2 attempts remaining.",
          type: "warning"
        });
      } else if (nextFailCount === 4) {
        setCouponError({
          title: "Authorization verification failed.",
          subtext: "Only 1 attempt remaining.",
          type: "warning"
        });
      } else if (nextFailCount >= 5) {
        setCouponError({
          title: "Maximum verification attempts exceeded.",
          subtext: "Please contact your Admissions Manager for assistance.",
          type: "locked"
        });
      }
    }
  };

  const handleUnlockScholarship = () => {
    // Check if input is empty or locked
    if (!coupon.trim()) {
      setCouponError({
        title: "Required Information Missing",
        subtext: "Please enter an authorized coupon code to proceed.",
        type: "error"
      });
      return;
    }

    if (failedAttempts >= 5) {
      return;
    }
    
    setIsVerifying(true);
    setVerificationProgress(0);
    setCouponError(null);
    setVerificationStep("Connecting to DataMites Authorization Database...");

    const startTime = Date.now();
    const duration = 5000; // Exactly 5 seconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setVerificationProgress(pct);

      if (elapsed < 1500) {
        setVerificationStep("Connecting to DataMites Authorization Database...");
      } else if (elapsed < 3000) {
        setVerificationStep("Validating Regional Manager Authorization...");
      } else if (elapsed < 4500) {
        setVerificationStep("Cross-checking Scholarship Allocation Records...");
      } else {
        setVerificationStep("Final Verification in Progress...");
      }

      if (elapsed >= duration) {
        clearInterval(interval);
        finalizeVerification();
      }
    }, 45);
  };

  const activeCourse = COURSES.find((c) => c.id === selectedCourseId) || COURSES[1];

  return (
    <div className="relative min-h-screen bg-white text-slate-800 font-sans selection:bg-[#0070C0]/10 selection:text-[#0070C0] leading-normal antialiased">
      
      {/* 1. TOP NAVIGATION BAR */}
      <nav id="header-nav" className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 py-3.5 px-6 md:px-12 flex justify-between items-center shadow-xs">
        <LogoDataMites />

        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100/80 border border-slate-200 text-slate-600 text-xs font-semibold rounded-md">
            Admissions Hub Verified
          </span>
        </div>
      </nav>

      {/* 2. MAIN ADMISSIONS HEADER SECTION */}
      <header id="admissions-header" className="relative z-10 bg-slate-50/50 border-b border-slate-150/70 py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Top minimal pre-approved badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0070C0]/10 border border-[#0070C0]/20 text-[#0070C0] text-[10.5px] font-bold tracking-wider uppercase mb-5 select-none">
            Admissions Office Pre-Approved Allocation
          </div>

          {/* Clean University Level Heading */}
          <h1 className="text-3xl sm:text-5xl font-display font-semibold tracking-tight text-slate-900 mb-4 select-none">
            Data Science Scholarship Opportunity
          </h1>

          {/* Subheading */}
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
            You have been shortlisted for a special enrollment opportunity for the Certified Data Scientist Program through the DataMites Admissions Team. Verified candidates can authenticate a registered coupon code below to reduce tuition fees directly.
          </p>

          {/* Live countdown timer bar */}
          <div className="inline-block">
            <div className="bg-white border border-slate-200/80 shadow-2xs rounded-lg px-4 py-2.5 flex items-center gap-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Evaluation Window Closes In:
              </span>
              <div className="h-3.5 w-px bg-slate-200" />
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#0070C0]">
                <span>{String(timeLeft.hours).padStart(2, "0")}h</span>
                <span className="text-slate-300">:</span>
                <span>{String(timeLeft.minutes).padStart(2, "0")}m</span>
                <span className="text-slate-300">:</span>
                <span className="text-[#F7941D]">{String(timeLeft.seconds).padStart(2, "0")}s</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 3. COURSE SELECTION SECTION */}
      <section id="program-selection" className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-[10px] font-bold tracking-widest text-[#0070C0] uppercase mb-1">
            Offered Curriculum Track
          </h2>
          <p className="text-sm font-semibold text-slate-500">
            Certified Data Scientist (CDS) is pre-selected for this allocation campaign. Other courses are currently locked.
          </p>
        </div>

        {/* 5 Cards grid - CDS preselected, others unselectable & blurred */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {COURSES.map((course) => {
            const isCDS = course.id === "CDS";
            return (
              <div
                key={course.id}
                id={`course-card-${course.id}`}
                className={`relative p-5 rounded-lg border h-36 flex flex-col justify-between transition-all duration-300 ${
                  isCDS
                    ? "bg-[#0070C0]/5 border-[#0070C0] ring-1 ring-[#0070C0]"
                    : "opacity-40 blur-[1px] pointer-events-none cursor-not-allowed bg-slate-50 border-slate-200"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div className={`p-1.5 rounded-md ${
                      isCDS ? "bg-[#0070C0]/10 text-[#0070C0]" : "bg-slate-100 text-slate-400"
                    }`}>
                      {course.id === "CDA" && <TrendingUp className="w-4 h-4" />}
                      {course.id === "CDS" && <Cpu className="w-4 h-4" />}
                      {course.id === "AEN" && <Database className="w-4 h-4" />}
                      {course.id === "AIE" && <Code className="w-4 h-4" />}
                      {course.id === "CDE" && <Award className="w-4 h-4" />}
                    </div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                      {course.id}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 leading-snug">
                    {course.id === "CDS" ? "Certified Data Scientist" : course.title.split(" Program")[0].split(" Track")[0]}
                  </h3>
                </div>

                <p className="text-[9px] font-semibold text-slate-500">{course.duration}</p>

                {isCDS && (
                  <div className="absolute top-2.5 right-2.5 flex items-center justify-center w-4 h-4 rounded-full bg-[#0070C0] text-white">
                    <Check className="w-2.5 h-2.5 stroke-[3px]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Course Display Board */}
        <div
          id="curriculum-detailed-card"
          className="border border-slate-200 bg-white rounded-xl p-6 md:p-8 shadow-2xs relative overflow-hidden"
        >
          {/* Official minimalist dual band at top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0070C0] to-[#F7941D]" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Program specifications */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[9px] font-bold uppercase tracking-wider">
                  {activeCourse.badge}
                </span>
                <span className="text-[10px] text-[#0075CD] font-semibold uppercase">
                  Admissions Core Curriculum Overview
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-900 mb-2">
                Certified Data Science Program (CDS)
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
                The leading global curriculum covering mathematical structures, classical machine learning regressions, deep artificial neural network layouts, and professional Python data analysis packages.
              </p>

              {/* Specifications Subgrid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 bg-slate-50/50 p-4 rounded-lg">
                <div>
                  <span className="block text-[9px] font-bold uppercase text-slate-400 tracking-wider mb-0.5">
                    Program Duration
                  </span>
                  <p className="text-xs font-bold text-slate-800">
                    8 Months Core Track
                  </p>
                </div>
                <div>
                  <span className="block text-[9px] font-bold uppercase text-slate-400 tracking-wider mb-0.5">
                    Learning Mode & Practicum
                  </span>
                  <p className="text-xs font-bold text-slate-800">
                    Live Interactive Training + Practical Internship
                  </p>
                </div>
              </div>
            </div>

            {/* Certifications on Right side */}
            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-5">
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3.5">
                Official Certifications Included
              </span>

              <div className="space-y-2">
                {activeCourse.certificates.map((cert, index) => (
                  <div key={index} className="flex items-center gap-2.5 p-2.5 bg-white rounded-md border border-slate-150 shadow-2xs">
                    <div className="w-4 h-4 rounded-full bg-[#10B981]/10 text-[#10B981] flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3.5px]" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-800">{cert}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. SYLLABUS ARCHITECTURE / TRAINING FRAMEWORK */}
      <section id="syllabus-highlights" className="bg-slate-50/50 border-y border-slate-150/70 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-[10px] font-bold tracking-widest text-[#F7941D] uppercase mb-1">
              Curriculum Architecture
            </h2>
            <p className="text-sm font-bold text-slate-500">
              Enterprise Outcomes & Integrated Internships
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { title: "Python Programming", text: "Analytical libraries & functions" },
              { title: "Machine Learning", text: "Supervised models & data patterns" },
              { title: "Deep Learning", text: "Neural networks & visual classifiers" },
              { title: "Generative AI", text: "Prompt parameters & fine-tuning models" },
              { title: "Industry Projects", text: "Production-grade enterprise modules" },
              { title: "Internship Support", text: "Guaranteed experience letters" }
            ].map((benefit, i) => (
              <div 
                key={i} 
                className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs min-h-[140px] flex flex-col justify-between"
              >
                <div className="w-6 h-6 rounded-md bg-[#0070C0]/5 text-[#0070C0] flex items-center justify-center mb-2">
                  <Check className="w-3.5 h-3.5 stroke-[3px]" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 mb-1 leading-tight">{benefit.title}</h3>
                  <p className="text-[10px] text-slate-500 leading-normal">{benefit.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PRICING & SCHOLARSHIP SECTION */}
      <section id="enrollment-pricing" className="max-w-3xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* Baseline Tuition Pricing Card */}
          <div className="relative bg-white border border-slate-150 rounded-xl p-6 sm:p-8 flex flex-col justify-between shadow-xs overflow-hidden">
            {/* Elegant Confetti Burst */}
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 }}
                animate={{ 
                  x: p.x, 
                  y: p.y, 
                  scale: 0.25, 
                  opacity: 0, 
                  rotate: p.rotate + p.x
                }}
                transition={{ 
                  duration: p.duration, 
                  delay: p.delay, 
                  ease: "easeOut" 
                }}
                className="absolute pointer-events-none rounded-full"
                style={{
                  left: "50%",
                  top: "45%",
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  backgroundColor: p.color,
                  zIndex: 50,
                }}
              />
            ))}

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9px] font-bold tracking-widest uppercase">
                  Admissions Ledger Fee
                </span>
                <span className="text-[9px] font-bold text-rose-500 line-through tracking-wider uppercase">
                  Original Rate
                </span>
              </div>

              {/* Faded Regular Fee */}
              <div className="mb-6 opacity-30 select-none">
                <p className="text-xs font-semibold text-slate-400 line-through">
                  Regular Fee: $689 USD
                </p>
                <p className="text-[9px] text-slate-400 font-medium">Standard baseline seat cost</p>
              </div>

              <div className="h-px bg-slate-100 my-4" />

              {/* Interactive Offer Price: $423 USD remains completely hidden initially */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 tracking-wider block mb-1 uppercase">
                  Approved Admission Offer
                </span>

                <div className="relative overflow-hidden inline-block min-w-[200px]">
                  <AnimatePresence mode="popLayout">
                    {isUnlocked ? (
                      <motion.div
                        key="unlocked-fee"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.35 }}
                        className="space-y-1"
                      >
                        <div className="text-xs font-semibold text-slate-400 line-through">$480.00 USD</div>
                        <div className="text-3xl font-extrabold text-[#0070C0] font-mono tracking-tight">
                          $423.00 <span className="text-xs font-semibold">USD</span>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="locked-fee"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-3xl font-extrabold text-[#0070C0] font-mono tracking-tight"
                      >
                        $480.00 <span className="text-xs font-semibold text-slate-400">USD</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <p className="text-[10px] text-slate-400 font-semibold">
                  {isUnlocked 
                    ? "Verified Scholarship Applied Successfully" 
                    : "Standard booking fee before verified campaign deductions"}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100">
              <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                Additional RM Campaign Allocation Available
              </div>
            </div>
          </div>

          {/* Coupon Input Box (Strictly Empty, placeholder updated) */}
          <div className={`bg-white rounded-xl p-6 sm:p-8 flex flex-col justify-between shadow-xs relative transition-all duration-300 border-2 ${
            isUnlocked 
              ? "border-emerald-500" 
              : isVerifying
              ? "border-blue-500 bg-slate-50/25"
              : failedAttempts >= 5
              ? "border-slate-400 bg-slate-50"
              : couponError && couponError.type === 'error'
              ? "border-rose-500"
              : couponError && couponError.type === 'warning'
              ? "border-amber-500"
              : "border-[#F7941D]/60"
          }`}>
            <div className={`absolute top-[-10px] right-6 text-white font-bold text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider transition-all duration-300 ${
              isUnlocked 
                ? "bg-emerald-500" 
                : isVerifying
                ? "bg-blue-500 animate-pulse"
                : failedAttempts >= 5
                ? "bg-slate-500"
                : "bg-[#F7941D]"
            }`}>
              {isUnlocked 
                ? "AUTHORIZATION APPROVED" 
                : isVerifying 
                ? "SECURITY VERIFICATION RUNNING" 
                : failedAttempts >= 5 
                ? "SECURITY VERIFICATION LOCKED" 
                : "AUTHORIZED CAMPAIGN VERIFIER"}
            </div>

            <div>
              <span className={`block text-[9px] font-bold tracking-widest uppercase mb-3 text-left transition-colors duration-300 ${
                isUnlocked 
                  ? "text-emerald-600" 
                  : isVerifying 
                  ? "text-blue-600" 
                  : failedAttempts >= 5 
                  ? "text-slate-500" 
                  : "text-[#F7941D]"
              }`}>
                {isUnlocked 
                  ? "SCHOLARSHIP STATUS: VERIFIED" 
                  : isVerifying 
                  ? "STATUS: VERIFYING PROTOCOL" 
                  : failedAttempts >= 5 
                  ? "STATUS: DISALLOWED ACCESS" 
                  : "AUTHORIZED CAMPAIGN SLOT"}
              </span>

              {isVerifying ? (
                /* Bank-style Verification Loader (No emojis, no gaming animations, use progress bar) */
                <div id="bank-verification-loader" className="space-y-6 py-4">
                  <div className="border border-slate-200 bg-slate-50 rounded-lg p-5 text-left font-mono space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <span>SECURE CHECKSUM GATEWAY</span>
                      <span className="text-[#0070C0] animate-pulse">Running check</span>
                    </div>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex items-start gap-2.5">
                        <span className="text-[#0070C0] font-bold">●</span>
                        <span className="text-slate-800 font-semibold leading-relaxed">{verificationStep}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-[9px] font-bold text-slate-500 font-mono">
                        <span>TRANSACTION STATUS</span>
                        <span>{Math.round(verificationProgress)}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-200 rounded overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#0070C0] to-[#F7941D] transition-all duration-75 ease-out rounded"
                          style={{ width: `${verificationProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 text-center font-mono">
                    Encryption Layer: SHA-256 / SSL Admissions handshake active.
                  </p>
                </div>
              ) : (
                /* Standard form or locked state */
                <div className="space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed mb-6 font-medium">
                    {failedAttempts >= 5 
                      ? "This portal is locked due to multiple failed verification attempts. Please get in touch with your assigned Admissions Manager for official assistance."
                      : "Verify the pre-authorized coupon code issued by RM Harshith Kumar H.S. to deduct $57 USD directly from your enrollment ledger."}
                  </p>

                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Authorized Promo Code
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        aria-label="Admissions coupon field"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        disabled={isUnlocked || failedAttempts >= 5}
                        placeholder="Enter Authorized Coupon Code"
                        className={`w-full font-mono text-xs tracking-widest text-slate-900 uppercase rounded-lg pl-3 pr-20 py-3 focus:outline-none focus:ring-1 font-bold ${
                          failedAttempts >= 5 
                            ? "bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed select-none border" 
                            : isUnlocked 
                            ? "bg-slate-50 border-emerald-350 text-emerald-950 border" 
                            : "bg-slate-50 border-slate-300 focus:border-[#0070C0] focus:ring-[#0070C0] border"
                        }`}
                      />
                      
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                        {isUnlocked ? (
                          <span className="text-[9px] font-bold bg-[#10B981]/10 text-[#10B981] px-2.5 py-0.5 rounded">
                            ACTIVE
                          </span>
                        ) : failedAttempts >= 5 ? (
                          <span className="text-[9px] font-bold bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded">
                            LOCKED
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold bg-slate-200 text-slate-500 px-2.5 py-0.5 rounded select-none">
                            REQUIRED
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Verification Attempt Errors/Warnings */}
                  {couponError && (
                    <div className={`p-4 rounded-lg border text-left flex flex-col gap-1.5 ${
                      couponError.type === 'locked' 
                        ? "bg-slate-50 border-slate-300 text-slate-800" 
                        : couponError.type === 'warning'
                        ? "bg-amber-50/70 border-amber-300 text-amber-900"
                        : "bg-rose-50/70 border-rose-300 text-rose-900"
                    }`}>
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          couponError.type === 'locked'
                            ? "bg-slate-700"
                            : couponError.type === 'warning'
                            ? "bg-amber-600 animate-pulse"
                            : "bg-rose-600 animate-pulse"
                        }`} />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                          {couponError.title}
                        </span>
                      </div>
                      <p className="text-[11px] font-medium leading-relaxed font-sans text-slate-600">
                        {couponError.subtext}
                      </p>
                    </div>
                  )}

                  {/* Verify Action Button */}
                  <button
                    id="unlock-campaign-btn"
                    onClick={handleUnlockScholarship}
                    disabled={isUnlocked || failedAttempts >= 5}
                    className={`w-full py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 ${
                      isUnlocked
                        ? "bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] cursor-default"
                        : failedAttempts >= 5
                        ? "bg-slate-100 border border-slate-250 text-slate-400 cursor-not-allowed select-none"
                        : "bg-[#F7941D] text-white hover:bg-[#e08112] shadow-xs cursor-pointer"
                    }`}
                  >
                    {isUnlocked ? (
                      <span>Authorized Slot Active</span>
                    ) : failedAttempts >= 5 ? (
                      <span>Verification Locked</span>
                    ) : (
                      <span>Verify Coupon</span>
                    )}
                  </button>
                </div>
              )}
            </div>

            <p className="text-[10px] text-slate-400 text-center mt-6 pt-4 border-t border-slate-100 font-medium">
              {failedAttempts >= 5 
                ? "Security verification access locked. Code evaluation terminated."
                : "Valid only for allocation references under current registry criteria."}
            </p>
          </div>

        </div>
      </section>

      {/* 6. SCHOLARSHIP VERIFIED ELEGANT SUCCESS STATE (Minimalist approval checklist format, NO CONFETTI, NO EMOJIS) */}
      <AnimatePresence>
        {isUnlocked && (
          <motion.section 
            id="success-clearance-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-3xl mx-auto px-4 mb-8"
          >
            <div className="bg-slate-50/50 border border-[#10B981]/30 rounded-xl p-6 sm:p-8 relative overflow-hidden shadow-2xs">
              
              {/* Premium green indicator bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#10B981]" />

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#10B981]/10 text-[#10B981] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-7 h-7 stroke-[2.5px]" />
                  </div>
                  <div>
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#10B981] mb-1">
                      SCHOLARSHIP VERIFIED
                    </h3>
                    <p className="text-sm font-bold text-slate-900">
                      Additional RM Scholarship Applied Successfully
                    </p>
                    <p className="text-xs text-slate-550 mt-1 max-w-md font-medium leading-relaxed">
                      Admissions records confirmed. Deductible voucher value applied immediately to final tuition enrollment metrics.
                    </p>
                  </div>
                </div>

                {/* Ledger calculations */}
                <div className="bg-white border border-slate-200 rounded-lg p-4 min-w-[210px] shadow-2xs text-right space-y-1.5">
                  <div className="flex justify-between gap-4 text-[11px] font-semibold text-slate-550">
                    <span>Discount Applied:</span>
                    <span className="font-mono text-[#F7941D] font-bold">-$57.00 USD</span>
                  </div>
                  <div className="h-px bg-slate-150" />
                  <div className="flex justify-between gap-4 text-xs font-bold text-slate-900">
                    <span>Final Enrollment Fee:</span>
                    <span className="font-mono text-[#0070C0] font-extrabold">$423.00 USD</span>
                  </div>
                </div>

              </div>

              {/* References */}
              <div className="mt-5 pt-4 border-t border-slate-200/50 flex justify-between items-center text-xs">
                <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Verification ID: DM-SCH-HS-2026</span>
                <span className="bg-[#10B981]/10 text-[#10B981] px-3.5 py-1.5 rounded-md font-bold uppercase text-[10px] tracking-wider font-mono">
                  Saved $57 USD
                </span>
              </div>

            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* 7. ENROLLMENT SUBMISSION */}
      <section id="enrollment-portal-cta" className="max-w-lg mx-auto px-4 py-8 text-center">
        <div className="relative inline-block w-full">
          {/* Dynamic redirect button updated text & prominence */}
          <button
            onClick={() => {
              window.open("https://rzp.io/l/cBDBUnFh", "_blank");
            }}
            id="primary-enrollment-btn"
            className={`w-full text-white font-bold text-base sm:text-lg rounded-xl py-4.5 px-6 shadow-sm transition-all transform hover:translate-y-[-1px] cursor-pointer flex items-center justify-center gap-2 ${
              isUnlocked 
                ? "bg-[#0070C0] hover:bg-[#005ea1] shadow-md ring-2 ring-emerald-400" 
                : "bg-[#0070C0] hover:bg-[#005d9a]"
            }`}
          >
            <Lock className="w-4.5 h-4.5" />
            <span>
              {isUnlocked ? "Secure Seat at $423 USD" : "Proceed to Enrollment"}
            </span>
            <ArrowRight className="w-4.5 h-4.5 shrink-0" />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs font-bold text-[#10B981]">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Payment Server Secured with 256-Bit SSL Admissions Credentials</span>
        </div>
      </section>

      {/* 8. ADMISSIONS AUTHORITY SOCIAL PROOF Grid */}
      <section id="institution-accreditation" className="max-w-5xl mx-auto px-4 py-12 border-t border-slate-150mt-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            { metric: "100,000+ Learners", label: "Global Alumni Network" },
            { metric: "12+ Years Excellence", label: "Education Authority" },
            { metric: "20+ Global Accreditations", label: "IABAC / ISO British Certified" },
            { metric: "2,500+ Hiring Partners", label: "Enterprise Placement Network" }
          ].map((stat, idx) => (
            <div key={idx} className="p-5 bg-slate-50 border border-slate-150 rounded-lg">
              <h3 className="text-lg font-bold text-[#0070C0] mb-0.5">{stat.metric}</h3>
              <p className="text-[10.5px] font-bold text-slate-550 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. BOTTOM SECTION / COPORATE FOOTER */}
      <footer id="institution-footer" className="border-t border-slate-200 bg-slate-50 py-12 px-6 text-center text-slate-500">
        <div className="max-w-4xl mx-auto">
          {/* Security / Quality Certifications Badge Array with NO EMOJIS */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-8 text-xs font-semibold text-slate-705">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-205 rounded-full shadow-2xs">
              <Lock className="w-3.5 h-3.5 text-[#0070C0]" />
              Secure Payment Gateway
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-205 rounded-full shadow-2xs">
              <Award className="w-3.5 h-3.5 text-[#F7941D]" />
              Official Enrollment Program
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-205 rounded-full shadow-2xs">
              <Globe className="w-3.5 h-3.5 text-[#0070C0]" />
              International Certification Authority
            </span>
          </div>

          {/* Refined clean footer info */}
          <div className="space-y-1.5 max-w-xl mx-auto border-t border-slate-200 pt-6">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest text-[11px]">
              Authorized Admissions Support Portal
            </h4>
            
            <p className="text-xs font-bold text-slate-600">
              RM: Harshith Kumar H.S.
            </p>

            <p className="text-xs font-bold text-[#0070C0]">
              DataMites Global Institute for Data Science
            </p>
          </div>

          <p className="text-[10px] text-slate-400 mt-6 pt-4 border-t border-slate-100">
            &copy; 2026 DataMites Global Admissions Hub. Administered by authorized IABAC & Rubixe educational partners. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
