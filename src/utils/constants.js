export const MATERIAL_TYPES = {
  notes: { label: "Notes", icon: "FileText", color: "#6366f1" },
  pdf: { label: "PDFs & Handouts", icon: "File", color: "#8b5cf6" },
  video: { label: "Videos", icon: "Video", color: "#ec4899" },
  audio: { label: "Audio Lectures", icon: "Headphones", color: "#14b8a6" },
  question_bank: { label: "Question Banks", icon: "HelpCircle", color: "#f59e0b" },
  lab_manual: { label: "Lab Manuals", icon: "FlaskConical", color: "#22c55e" },
  animation: { label: "3D Animations", icon: "Box", color: "#06b6d4" },
  previous_paper: { label: "Previous Year Papers", icon: "ScrollText", color: "#f97316" },
};

export const COURSE_CATEGORIES = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Engineering",
  "Commerce",
  "Arts",
  "Medical",
  "Law",
];

export const CONTENT_TYPES = [
  { value: "school", label: "School" },
  { value: "university", label: "University" },
];

export const NAV_LINKS = [
  { path: "/", label: "Home", icon: "Home" },
  { path: "/dashboard", label: "Dashboard", icon: "LayoutDashboard", protected: true },
  { path: "/courses", label: "Courses", icon: "BookOpen" },
  { path: "/mock-tests", label: "Mock Tests", icon: "ClipboardCheck", protected: true },
  { path: "/profile", label: "Profile", icon: "User", protected: true },
];

export const FEATURES = [
  {
    title: "Structured Notes",
    description: "Handwritten & digital notes organized unit-wise for easy revision",
    icon: "FileText",
  },
  {
    title: "Video Lectures",
    description: "Concept explanation videos and recorded lectures for visual learning",
    icon: "Video",
  },
  {
    title: "Mock Tests",
    description: "Practice tests simulating real exam conditions with instant feedback",
    icon: "ClipboardCheck",
  },
  {
    title: "Question Banks",
    description: "Curated question collections for thorough exam preparation",
    icon: "HelpCircle",
  },
  {
    title: "Lab Manuals",
    description: "Step-by-step practical guides with detailed procedures",
    icon: "FlaskConical",
  },
  {
    title: "Audio Lectures",
    description: "Listen and learn on-the-go with educational podcasts and audiobooks",
    icon: "Headphones",
  },
];

// Demo data for when Firebase is not connected
export const DEMO_COURSES = [
  {
    id: "demo-1",
    title: "Data Structures & Algorithms",
    description: "Master fundamental data structures and algorithms with practical implementations. Covers arrays, linked lists, trees, graphs, sorting, and searching techniques.",
    thumbnail: "",
    category: "Computer Science",
    contentType: "university",
    enrolledCount: 1247,
    units: [
      {
        unitNumber: 1,
        title: "Introduction to Data Structures",
        description: "Arrays, stacks, queues",
        items: {
          notes: "https://res.cloudinary.com/dwotpk840/image/upload/v1777482718/DSA_Unit_1_Notes_uepbsh.pdf",
          PDFs: "https://res.cloudinary.com/dwotpk840/image/upload/v1777482706/Comprehensive_DSA_Notes_Typed_mhsoqq.pdf",
          videos: "https://res.cloudinary.com/dwotpk840/video/upload/v1777485372/dsa_video_csscoh.mp4",
          questionBanks: "https://res.cloudinary.com/dwotpk840/image/upload/v1777486859/DSA_Question_Bank_txp9pj.pdf",
          audioLectures: "https://res.cloudinary.com/dwotpk840/video/upload/v1777485372/dsa_video_csscoh.mp4"
        }
      },
      {
        unitNumber: 2,
        title: "Linked Lists",
        description: "Singly, doubly, circular linked lists",
        items: {
          notes: "https://res.cloudinary.com/dwotpk840/image/upload/v1777482722/DSA_Unit_2_Notes_ntb9lq.pdf",
          PDFs: "https://res.cloudinary.com/dwotpk840/image/upload/v1777482706/Comprehensive_DSA_Notes_Typed_mhsoqq.pdf",
          videos: "https://res.cloudinary.com/dwotpk840/video/upload/v1777485372/dsa_video_csscoh.mp4",
          questionBanks: "https://res.cloudinary.com/dwotpk840/image/upload/v1777486859/DSA_Question_Bank_txp9pj.pdf",
          audioLectures: "https://res.cloudinary.com/dwotpk840/video/upload/v1777485372/dsa_video_csscoh.mp4"
        }
      },
      {
        unitNumber: 3,
        title: "Trees & Graphs",
        description: "BST, AVL, BFS, DFS",
        items: {
          notes: "https://res.cloudinary.com/dwotpk840/image/upload/v1777482736/DSA_Unit_4_Notes_zwwuma.pdf",
          PDFs: "https://res.cloudinary.com/dwotpk840/image/upload/v1777482706/Comprehensive_DSA_Notes_Typed_mhsoqq.pdf",
          videos: "https://res.cloudinary.com/dwotpk840/video/upload/v1777485372/dsa_video_csscoh.mp4",
          questionBanks: "https://res.cloudinary.com/dwotpk840/image/upload/v1777486859/DSA_Question_Bank_txp9pj.pdf",
          audioLectures: "https://res.cloudinary.com/dwotpk840/video/upload/v1777485372/dsa_video_csscoh.mp4"
        }
      },
      {
        unitNumber: 4,
        title: "Sorting & Searching",
        description: "QuickSort, MergeSort, Binary Search",
        items: {
          notes: "https://res.cloudinary.com/dwotpk840/image/upload/v1777482740/DSA_Unit_5_Notes_nmxufu.pdf",
          PDFs: "https://res.cloudinary.com/dwotpk840/image/upload/v1777482706/Comprehensive_DSA_Notes_Typed_mhsoqq.pdf",
          videos: "https://res.cloudinary.com/dwotpk840/video/upload/v1777485372/dsa_video_csscoh.mp4",
          questionBanks: "https://res.cloudinary.com/dwotpk840/image/upload/v1777486859/DSA_Question_Bank_txp9pj.pdf",
          audioLectures: "https://res.cloudinary.com/dwotpk840/video/upload/v1777485372/dsa_video_csscoh.mp4"
        }
      },
      {
        unitNumber: 5,
        title: "Dynamic Programming",
        description: "Memoization, tabulation techniques",
        items: {
          notes: "https://res.cloudinary.com/dwotpk840/image/upload/v1777482743/DSA_Unit_6_Notes_oqwbow.pdf",
          PDFs: "https://res.cloudinary.com/dwotpk840/image/upload/v1777482706/Comprehensive_DSA_Notes_Typed_mhsoqq.pdf",
          videos: "https://res.cloudinary.com/dwotpk840/video/upload/v1777485372/dsa_video_csscoh.mp4",
          questionBanks: "https://res.cloudinary.com/dwotpk840/image/upload/v1777486859/DSA_Question_Bank_txp9pj.pdf",
          audioLectures: "https://res.cloudinary.com/dwotpk840/video/upload/v1777485372/dsa_video_csscoh.mp4"
        }
      }
    ],

  },
  {
    id: "demo-2",
    title: "Web Development Fundamentals",
    description: "Learn HTML, CSS, and JavaScript from scratch. Build responsive websites with modern frameworks and tools.",
    thumbnail: "",
    category: "Computer Science",
    contentType: "university",
    enrolledCount: 2341,
    units: [
      {
        unitNumber: 1,
        title: "HTML Fundamentals",
        description: "Elements, forms, semantic HTML",
        items: {
          notes: "https://res.cloudinary.com/dwotpk840/image/upload/v1777483534/web_development_brief_notes_eiagmg.pdf",
          PDFs: "https://res.cloudinary.com/dwotpk840/image/upload/v1777483097/web_dev_notes_gghl1v.pdf",
          videos: "https://res.cloudinary.com/dwotpk840/image/upload/v1777485374/web_dev_gr88ke.jpg",
          questionBanks: "https://res.cloudinary.com/dwotpk840/image/upload/v1777481744/web_dev_question_bank_ra4wgd.pdf",
          audioLectures: "https://res.cloudinary.com/dwotpk840/image/upload/v1777485374/web_dev_gr88ke.jpg"
        }
      },
      {
        unitNumber: 2,
        title: "CSS & Layouts",
        description: "Flexbox, Grid, responsive design",
        items: {
          notes: "https://res.cloudinary.com/dwotpk840/image/upload/v1777483534/web_development_brief_notes_eiagmg.pdf",
            PDFs: "https://res.cloudinary.com/dwotpk840/image/upload/v1777142649/Screenshot_2026-04-26_001353_y2hzfu.png",
          videos: "https://res.cloudinary.com/dwotpk840/image/upload/v1777485374/web_dev_gr88ke.jpg",
          questionBanks: "https://res.cloudinary.com/dwotpk840/image/upload/v1777481744/web_dev_question_bank_ra4wgd.pdf",
          audioLectures: "https://res.cloudinary.com/dwotpk840/image/upload/v1777485374/web_dev_gr88ke.jpg"
        }
      },
      {
        unitNumber: 3,
        title: "JavaScript Basics",
        description: "Variables, functions, DOM",
        items: {
          notes: "https://res.cloudinary.com/dwotpk840/image/upload/v1777483534/web_development_brief_notes_eiagmg.pdf",
          PDFs: "https://res.cloudinary.com/dwotpk840/image/upload/v1777483097/web_dev_notes_gghl1v.pdf",
          videos: "https://res.cloudinary.com/dwotpk840/image/upload/v1777485374/web_dev_gr88ke.jpg",
          questionBanks: "https://res.cloudinary.com/dwotpk840/image/upload/v1777481744/web_dev_question_bank_ra4wgd.pdf",
          audioLectures: "https://res.cloudinary.com/dwotpk840/image/upload/v1777485374/web_dev_gr88ke.jpg"

        }
      },
      {
        unitNumber: 4,
        title: "Advanced JavaScript",
        description: "Async, APIs, ES6+",
        items: {
          notes: "https://res.cloudinary.com/dwotpk840/image/upload/v1777483534/web_development_brief_notes_eiagmg.pdf",
          PDFs: "https://res.cloudinary.com/dwotpk840/image/upload/v1777483097/web_dev_notes_gghl1v.pdf",
          videos: "https://res.cloudinary.com/dwotpk840/image/upload/v1777485374/web_dev_gr88ke.jpg",
          questionBanks: "https://res.cloudinary.com/dwotpk840/image/upload/v1777481744/web_dev_question_bank_ra4wgd.pdf",
          audioLectures: "https://res.cloudinary.com/dwotpk840/image/upload/v1777485374/web_dev_gr88ke.jpg"
        }
      },
      {
        unitNumber: 5,
        title: "React Framework",
        description: "Components, state, hooks",
        items: {
          notes: "https://res.cloudinary.com/dwotpk840/image/upload/v1777483534/web_development_brief_notes_eiagmg.pdf",
          PDFs: "https://res.cloudinary.com/dwotpk840/image/upload/v1777483097/web_dev_notes_gghl1v.pdf",
          videos: "https://res.cloudinary.com/dwotpk840/image/upload/v1777485374/web_dev_gr88ke.jpg",
          questionBanks: "https://res.cloudinary.com/dwotpk840/image/upload/v1777481744/web_dev_question_bank_ra4wgd.pdf",
          audioLectures: "https://res.cloudinary.com/dwotpk840/image/upload/v1777485374/web_dev_gr88ke.jpg"
        }
      }

    ],
  },
  {
    id: "demo-3",
    title: "Engineering Mathematics",
    description: "Comprehensive mathematics course covering calculus, linear algebra, differential equations, and probability theory.",
    thumbnail: "",
    category: "Mathematics",
    contentType: "university",
    enrolledCount: 983,
    units: [
      {
        unitNumber: 1,
        title: "Differential Calculus",
        description: "Limits, derivatives, applications",
        items: {
          notes: "https://res.cloudinary.com/dwotpk840/image/upload/v1777481898/engineering_maths_notes_sbxsdf.pdf",
          PDFs: "https://res.cloudinary.com/dwotpk840/image/upload/v1777483775/engineering_mathematics_description_o80tjm.pdf",
          videos: "https://res.cloudinary.com/dwotpk840/image/upload/v1777485373/enginnering_mathematics_bkrigv.jpg",
          questionBanks: "https://res.cloudinary.com/dwotpk840/image/upload/v1777482367/eg_question_bank_l2wdna.pdf",
          labManuals: "https://res.cloudinary.com/dwotpk840/image/upload/v1777486282/Engineering_Mathematics_Lab_Manual_g4tmwe.pdf",
          audioLectures: "https://res.cloudinary.com/dwotpk840/image/upload/v1777485373/enginnering_mathematics_bkrigv.jpg"
        }
      },
      {
        unitNumber: 2,
        title: "Integral Calculus",
        description: "Integration techniques, applications",
        items: {
          notes: "https://res.cloudinary.com/dwotpk840/image/upload/v1777481898/engineering_maths_notes_sbxsdf.pdf",
          PDFs: "https://res.cloudinary.com/dwotpk840/image/upload/v1777142649/Screenshot_2026-04-26_001353_y2hzfu.png",
          videos: "https://res.cloudinary.com/dwotpk840/image/upload/v1777485373/enginnering_mathematics_bkrigv.jpg",
          questionBanks: "https://res.cloudinary.com/dwotpk840/image/upload/v1777482367/eg_question_bank_l2wdna.pdf",
          labManuals: "https://res.cloudinary.com/dwotpk840/image/upload/v1777486282/Engineering_Mathematics_Lab_Manual_g4tmwe.pdf",
          audioLectures: "https://res.cloudinary.com/dwotpk840/image/upload/v1777485373/enginnering_mathematics_bkrigv.jpg"

        }
      },
      {
        unitNumber: 3,
        title: "Linear Algebra",
        description: "Matrices, vectors, eigenvalues",
        items: {
          notes: "https://res.cloudinary.com/dwotpk840/image/upload/v1777481898/engineering_maths_notes_sbxsdf.pdf",
          PDFs: "https://res.cloudinary.com/dwotpk840/image/upload/v1777142649/Screenshot_2026-04-26_001353_y2hzfu.png",
          videos: "https://res.cloudinary.com/dwotpk840/image/upload/v1777485373/enginnering_mathematics_bkrigv.jpg",
          questionBanks: "https://res.cloudinary.com/dwotpk840/image/upload/v1777482367/eg_question_bank_l2wdna.pdf",
          labManuals: "https://res.cloudinary.com/dwotpk840/image/upload/v1777486282/Engineering_Mathematics_Lab_Manual_g4tmwe.pdf",
          audioLectures: "https://res.cloudinary.com/dwotpk840/image/upload/v1777485373/enginnering_mathematics_bkrigv.jpg"

        }
      },
      {
        unitNumber: 4,
        title: "Differential Equations",
        description: "ODE, PDE, Laplace transforms",
        items: {
          notes: "https://res.cloudinary.com/dwotpk840/image/upload/v1777481898/engineering_maths_notes_sbxsdf.pdf",
          PDFs: "https://res.cloudinary.com/dwotpk840/image/upload/v1777142649/Screenshot_2026-04-26_001353_y2hzfu.png",
          videos: "https://res.cloudinary.com/dwotpk840/image/upload/v1777485373/enginnering_mathematics_bkrigv.jpg",
          questionBanks: "https://res.cloudinary.com/dwotpk840/image/upload/v1777482367/eg_question_bank_l2wdna.pdf",
          labManuals: "https://res.cloudinary.com/dwotpk840/image/upload/v1777486282/Engineering_Mathematics_Lab_Manual_g4tmwe.pdf",
          audioLectures: "https://res.cloudinary.com/dwotpk840/image/upload/v1777485373/enginnering_mathematics_bkrigv.jpg"

        }
      },
      {
        unitNumber: 5,
        title: "Probability & Statistics",
        description: "Distributions, hypothesis testing",
        items: {
          notes: "https://res.cloudinary.com/dwotpk840/image/upload/v1777481898/engineering_maths_notes_sbxsdf.pdf",
          PDFs: "https://res.cloudinary.com/dwotpk840/image/upload/v1777142649/Screenshot_2026-04-26_001353_y2hzfu.png",
          videos: "https://res.cloudinary.com/dwotpk840/image/upload/v1777485373/enginnering_mathematics_bkrigv.jpg",
          questionBanks: "https://res.cloudinary.com/dwotpk840/image/upload/v1777482367/eg_question_bank_l2wdna.pdf",
          labManuals: "https://res.cloudinary.com/dwotpk840/image/upload/v1777486282/Engineering_Mathematics_Lab_Manual_g4tmwe.pdf",
          audioLectures: "https://res.cloudinary.com/dwotpk840/image/upload/v1777485373/enginnering_mathematics_bkrigv.jpg"

        }
      }
    ],
  },
  {
    id: "demo-4",
    title: "Digital Electronics",
    description: "Study digital logic design, Boolean algebra, combinational and sequential circuits with practical lab experiments.",
    thumbnail: "",
    category: "Engineering",
    contentType: "university",
    enrolledCount: 756,
    units:
      [
        {
          unitNumber: 1,
          title: "Number Systems",
          description: "Binary, octal, hexadecimal conversions",
          items: {
          notes: "https://res.cloudinary.com/dwotpk840/image/upload/v1777481898/engineering_maths_notes_sbxsdf.pdf",
            PDFs: "https://res.cloudinary.com/dwotpk840/image/upload/v1777487528/digital_electronics_complete_notes_sxpp4s.pdf",
          videos: "https://res.cloudinary.com/dwotpk840/video/upload/v1777485374/digital_physics_e9zxge.mp4",
          questionBanks: "https://res.cloudinary.com/dwotpk840/image/upload/v1777482367/eg_question_bank_l2wdna.pdf",
            labManuals: "https://res.cloudinary.com/dwotpk840/image/upload/v1777486484/Detailed_Digital_Electronics_Lab_Manual_hdldyw.pdf",
            audioLectures: "https://res.cloudinary.com/dwotpk840/video/upload/v1777485374/digital_physics_e9zxge.mp4"

          }
        },
        {
          unitNumber: 2,
          title: "Boolean Algebra",
          description: "Logic gates, simplification",
          items: {
          notes: "https://res.cloudinary.com/dwotpk840/image/upload/v1777481898/engineering_maths_notes_sbxsdf.pdf",
            PDFs: "https://res.cloudinary.com/dwotpk840/image/upload/v1777487528/digital_electronics_complete_notes_sxpp4s.pdf",
          videos: "https://res.cloudinary.com/dwotpk840/video/upload/v1777485374/digital_physics_e9zxge.mp4",
            questionBanks: "https://res.cloudinary.com/dwotpk840/image/upload/v1777482367/eg_question_bank_l2wdna.pdf",
            labManuals: "https://res.cloudinary.com/dwotpk840/image/upload/v1777486484/Detailed_Digital_Electronics_Lab_Manual_hdldyw.pdf",
            audioLectures: "https://res.cloudinary.com/dwotpk840/video/upload/v1777485374/digital_physics_e9zxge.mp4"
          }
        },
  
  {
    unitNumber: 3,
    title: "Combinational Circuits",
    description: "Multiplexers, decoders, adders",
    items: {
          notes: "https://res.cloudinary.com/dwotpk840/image/upload/v1777481898/engineering_maths_notes_sbxsdf.pdf",
            PDFs: "https://res.cloudinary.com/dwotpk840/image/upload/v1777487528/digital_electronics_complete_notes_sxpp4s.pdf",
          videos: "https://res.cloudinary.com/dwotpk840/video/upload/v1777485374/digital_physics_e9zxge.mp4",
      questionBanks: "https://res.cloudinary.com/dwotpk840/image/upload/v1777482367/eg_question_bank_l2wdna.pdf",
            labManuals: "https://res.cloudinary.com/dwotpk840/image/upload/v1777486484/Detailed_Digital_Electronics_Lab_Manual_hdldyw.pdf",
      audioLectures: "https://res.cloudinary.com/dwotpk840/video/upload/v1777485374/digital_physics_e9zxge.mp4"

    }
  },
  {
    unitNumber: 4,
    title: "Sequential Circuits",
    description: "Flip-flops, counters, registers",
    items: {
          notes: "https://res.cloudinary.com/dwotpk840/image/upload/v1777481898/engineering_maths_notes_sbxsdf.pdf",
            PDFs: "https://res.cloudinary.com/dwotpk840/image/upload/v1777487528/digital_electronics_complete_notes_sxpp4s.pdf",
          videos: "https://res.cloudinary.com/dwotpk840/video/upload/v1777485374/digital_physics_e9zxge.mp4",
      questionBanks: "https://res.cloudinary.com/dwotpk840/image/upload/v1777482367/eg_question_bank_l2wdna.pdf",
            labManuals: "https://res.cloudinary.com/dwotpk840/image/upload/v1777486484/Detailed_Digital_Electronics_Lab_Manual_hdldyw.pdf",
      audioLectures: "https://res.cloudinary.com/dwotpk840/video/upload/v1777485374/digital_physics_e9zxge.mp4"
    }
  },

  {
    unitNumber: 5,
    title: "Memory & PLDs",
    description: "RAM, ROM, programmable logic",
    items: {
          notes: "https://res.cloudinary.com/dwotpk840/image/upload/v1777481898/engineering_maths_notes_sbxsdf.pdf",
            PDFs: "https://res.cloudinary.com/dwotpk840/image/upload/v1777487528/digital_electronics_complete_notes_sxpp4s.pdf",
          videos: "https://res.cloudinary.com/dwotpk840/video/upload/v1777485374/digital_physics_e9zxge.mp4",
      questionBanks: "https://res.cloudinary.com/dwotpk840/image/upload/v1777482367/eg_question_bank_l2wdna.pdf",
            labManuals: "https://res.cloudinary.com/dwotpk840/image/upload/v1777486484/Detailed_Digital_Electronics_Lab_Manual_hdldyw.pdf",
      audioLectures: "https://res.cloudinary.com/dwotpk840/video/upload/v1777485374/digital_physics_e9zxge.mp4"

    }
  },
      ],},

  {
    id: "demo-5",
    title: "Physics for Engineers",
    description: "Explore mechanics, thermodynamics, optics, electromagnetism and modern physics concepts with real-world applications.",
    thumbnail: "",
    category: "Physics",
    contentType: "university",
    enrolledCount: 1102,
    units: [
      {
        unitNumber: 1,
        title: "Mechanics",
        description: "Newton's laws, energy, momentum",
        items: {
          notes: "https://res.cloudinary.com/dwotpk840/image/upload/v1777481898/engineering_maths_notes_sbxsdf.pdf",
          PDFs: "https://res.cloudinary.com/dwotpk840/image/upload/v1777142649/Screenshot_2026-04-26_001353_y2hzfu.png",
          videos: "https://res.cloudinary.com/dwotpk840/video/upload/v1777485374/digital_physics_e9zxge.mp4",
          questionBanks: "https://res.cloudinary.com/dwotpk840/image/upload/v1777482367/eg_question_bank_l2wdna.pdf",
            labManuals: "https://res.cloudinary.com/dwotpk840/image/upload/v1777486669/Engineering_Physics_Lab_Manual_ktluje.pdf",
          audioLectures: "https://res.cloudinary.com/dwotpk840/video/upload/v1777485374/digital_physics_e9zxge.mp4"

        }
      },
      {
        unitNumber: 2,
        title: "Thermodynamics",
        description: "Laws, entropy, heat engines",
        items: {
          notes: "https://res.cloudinary.com/dwotpk840/image/upload/v1777481898/engineering_maths_notes_sbxsdf.pdf",
          PDFs: "https://res.cloudinary.com/dwotpk840/image/upload/v1777142649/Screenshot_2026-04-26_001353_y2hzfu.png",
          videos: "https://res.cloudinary.com/dwotpk840/video/upload/v1777485374/digital_physics_e9zxge.mp4",
          questionBanks: "https://res.cloudinary.com/dwotpk840/image/upload/v1777482367/eg_question_bank_l2wdna.pdf",
            labManuals: "https://res.cloudinary.com/dwotpk840/image/upload/v1777486669/Engineering_Physics_Lab_Manual_ktluje.pdf",
          audioLectures: "https://res.cloudinary.com/dwotpk840/video/upload/v1777485374/digital_physics_e9zxge.mp4"
        }
      },
      {
        unitNumber: 3,
        title: "Waves & Optics",
        description: "Interference, diffraction, polarization",
        items: {
          notes: "https://res.cloudinary.com/dwotpk840/image/upload/v1777481898/engineering_maths_notes_sbxsdf.pdf",
          PDFs: "https://res.cloudinary.com/dwotpk840/image/upload/v1777142649/Screenshot_2026-04-26_001353_y2hzfu.png",
          videos: "https://res.cloudinary.com/dwotpk840/video/upload/v1777485374/digital_physics_e9zxge.mp4",
          questionBanks: "https://res.cloudinary.com/dwotpk840/image/upload/v1777482367/eg_question_bank_l2wdna.pdf",
            labManuals: "https://res.cloudinary.com/dwotpk840/image/upload/v1777486669/Engineering_Physics_Lab_Manual_ktluje.pdf",
          audioLectures: "https://res.cloudinary.com/dwotpk840/video/upload/v1777485374/digital_physics_e9zxge.mp4"
        }
      },
      {
        unitNumber: 4,
        title: "Electromagnetism",
        description: "Maxwell's equations, EM waves",
        items: {
          notes: "https://res.cloudinary.com/dwotpk840/image/upload/v1777481898/engineering_maths_notes_sbxsdf.pdf",
          PDFs: "https://res.cloudinary.com/dwotpk840/image/upload/v1777142649/Screenshot_2026-04-26_001353_y2hzfu.png",
          videos: "https://res.cloudinary.com/dwotpk840/video/upload/v1777485374/digital_physics_e9zxge.mp4",
          questionBanks: "https://res.cloudinary.com/dwotpk840/image/upload/v1777482367/eg_question_bank_l2wdna.pdf",
            labManuals: "https://res.cloudinary.com/dwotpk840/image/upload/v1777486669/Engineering_Physics_Lab_Manual_ktluje.pdf",
          audioLectures: "https://res.cloudinary.com/dwotpk840/video/upload/v1777485374/digital_physics_e9zxge.mp4"

        }
      },
      {
        unitNumber: 5,
        title: "Modern Physics",
        description: "Quantum mechanics, relativity",
        items: {
          notes: "https://res.cloudinary.com/dwotpk840/image/upload/v1777481898/engineering_maths_notes_sbxsdf.pdf",
          PDFs: "https://res.cloudinary.com/dwotpk840/image/upload/v1777142649/Screenshot_2026-04-26_001353_y2hzfu.png",
          videos: "https://res.cloudinary.com/dwotpk840/video/upload/v1777485374/digital_physics_e9zxge.mp4",
          questionBanks: "https://res.cloudinary.com/dwotpk840/image/upload/v1777482367/eg_question_bank_l2wdna.pdf",
            labManuals: "https://res.cloudinary.com/dwotpk840/image/upload/v1777486669/Engineering_Physics_Lab_Manual_ktluje.pdf",
          audioLectures: "https://res.cloudinary.com/dwotpk840/video/upload/v1777485374/digital_physics_e9zxge.mp4"

        }
      }
    ],
  },
  {
    id: "demo-6",
    title: "Database Management Systems",
    description: "Learn relational databases, SQL, normalization, transaction management, and NoSQL databases.",
    thumbnail: "",
    category: "Computer Science",
    contentType: "university",
    enrolledCount: 1589,
    units:
      [
        {
          unitNumber: 1,
          title: "Introduction to DBMS",
          description: "Data models, ER diagrams",
          items: {
          notes: "https://res.cloudinary.com/dwotpk840/image/upload/v1777484090/dbms_complete_notes_uwkofc.pdf",
              PDFs: "https://res.cloudinary.com/dwotpk840/image/upload/v1777484090/dbms_complete_notes_uwkofc.pdf",
            videos: "https://res.cloudinary.com/dwotpk840/video/upload/v1777485372/dbms_video_qjxpbt.mp4",
            questionBanks: "https://res.cloudinary.com/dwotpk840/image/upload/v1777482167/DBMS_Question_Bank_40_iilqnp.pdf",
            audioLectures: "https://res.cloudinary.com/dwotpk840/video/upload/v1777485372/dbms_video_qjxpbt.mp4"

          }
        },
        {
          unitNumber: 2,
          title: "Relational Model & SQL",
          description: "Tables, queries, joins",
          items: {
          notes: "https://res.cloudinary.com/dwotpk840/image/upload/v1777484090/dbms_complete_notes_uwkofc.pdf",
            PDFs: "https://res.cloudinary.com/dwotpk840/image/upload/v1777484090/dbms_complete_notes_uwkofc.pdf",
            videos: "https://res.cloudinary.com/dwotpk840/video/upload/v1777485372/dbms_video_qjxpbt.mp4",
            questionBanks: "https://res.cloudinary.com/dwotpk840/image/upload/v1777482167/DBMS_Question_Bank_40_iilqnp.pdf",
            audioLectures: "https://res.cloudinary.com/dwotpk840/video/upload/v1777485372/dbms_video_qjxpbt.mp4"

          }
        },
        {
          unitNumber: 3,
          title: "Normalization",
          description: "1NF, 2NF, 3NF, BCNF",
          items: {
          notes: "https://res.cloudinary.com/dwotpk840/image/upload/v1777484090/dbms_complete_notes_uwkofc.pdf",
            PDFs: "https://res.cloudinary.com/dwotpk840/image/upload/v1777484090/dbms_complete_notes_uwkofc.pdf",
            videos: "https://res.cloudinary.com/dwotpk840/video/upload/v1777485372/dbms_video_qjxpbt.mp4",
            questionBanks: "https://res.cloudinary.com/dwotpk840/image/upload/v1777482167/DBMS_Question_Bank_40_iilqnp.pdf",
            audioLectures: "https://res.cloudinary.com/dwotpk840/video/upload/v1777485372/dbms_video_qjxpbt.mp4"

          }
        },
        {
          unitNumber: 4,
          title: "Transaction Management",
          description: "ACID, concurrency control",
          items: {
          notes: "https://res.cloudinary.com/dwotpk840/image/upload/v1777484090/dbms_complete_notes_uwkofc.pdf",
            PDFs: "https://res.cloudinary.com/dwotpk840/image/upload/v1777484090/dbms_complete_notes_uwkofc.pdf",
            videos: "https://res.cloudinary.com/dwotpk840/video/upload/v1777485372/dbms_video_qjxpbt.mp4",
            questionBanks: "https://res.cloudinary.com/dwotpk840/image/upload/v1777482167/DBMS_Question_Bank_40_iilqnp.pdf",
            audioLectures: "https://res.cloudinary.com/dwotpk840/video/upload/v1777485372/dbms_video_qjxpbt.mp4"

          }
        },
        {
          unitNumber: 5,
          title: "NoSQL Databases",
          description: "MongoDB, Firebase, key-value stores",
          items: {
          notes: "https://res.cloudinary.com/dwotpk840/image/upload/v1777484090/dbms_complete_notes_uwkofc.pdf",
            PDFs: "https://res.cloudinary.com/dwotpk840/image/upload/v1777484090/dbms_complete_notes_uwkofc.pdf",
            videos: "https://res.cloudinary.com/dwotpk840/video/upload/v1777485372/dbms_video_qjxpbt.mp4",
            questionBanks: "https://res.cloudinary.com/dwotpk840/image/upload/v1777482167/DBMS_Question_Bank_40_iilqnp.pdf",
            audioLectures: "https://res.cloudinary.com/dwotpk840/video/upload/v1777485372/dbms_video_qjxpbt.mp4"

          }
        }
      ]
    ,
  },
];

export const DEMO_TESTS = [
  {
    id: "test-1",
    courseId: "demo-1",
    title: "DSA Mid-Term Mock Test",
    description: "Practice test covering arrays, linked lists, stacks, and queues",
    duration: 30,
    totalQuestions: 10,
    difficulty: "medium",
  },
  {
    id: "test-2",
    courseId: "demo-2",
    title: "Web Development Quiz",
    description: "Test your knowledge of HTML, CSS, and JavaScript fundamentals",
    duration: 20,
    totalQuestions: 10,
    difficulty: "easy",
  },
  {
    id: "test-3",
    courseId: "demo-3",
    title: "Engineering Maths Final Mock",
    description: "Comprehensive test on calculus, linear algebra, and differential equations",
    duration: 45,
    totalQuestions: 10,
    difficulty: "hard",
  },
  {
    id: "test-4",
    courseId: "demo-4",
    title: "DBMS Final Mock",
    description: "Comprehensive test on SQL, normalization, transactions, and NoSQL",
    duration: 45,
    totalQuestions: 10,
    difficulty: "hard",
  },
  {
    id: "test-5",
    courseId: "demo-5",
    title: "Physics Final Mock",
    description: "Comprehensive test on mechanics, thermodynamics, electromagnetism, and modern physics",
    duration: 45,
    totalQuestions: 10,
    difficulty: "hard",
  }
];

export const DEMO_QUESTIONS = {
  "test-1": [
    { id: "q1", testId: "test-1", questionText: "What is the time complexity of accessing an element in an array by index?", options: ["O(1)", "O(n)", "O(log n)", "O(n²)"], correctAnswer: 0, explanation: "Array access by index is constant time O(1) as it directly computes the memory address.", order: 1 },
    { id: "q2", testId: "test-1", questionText: "Which data structure uses LIFO (Last In First Out) principle?", options: ["Queue", "Stack", "Linked List", "Tree"], correctAnswer: 1, explanation: "Stack follows LIFO — the last element pushed is the first one popped.", order: 2 },
    { id: "q3", testId: "test-1", questionText: "What is the worst-case time complexity of Quick Sort?", options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"], correctAnswer: 2, explanation: "Quick Sort's worst case is O(n²) when the pivot selection is poor (already sorted array).", order: 3 },
    { id: "q4", testId: "test-1", questionText: "Which traversal of a BST gives elements in sorted order?", options: ["Preorder", "Postorder", "Inorder", "Level order"], correctAnswer: 2, explanation: "Inorder traversal (Left-Root-Right) of a BST gives nodes in ascending order.", order: 4 },
    { id: "q5", testId: "test-1", questionText: "What data structure is used for BFS traversal?", options: ["Stack", "Queue", "Heap", "Array"], correctAnswer: 1, explanation: "BFS uses a Queue to explore nodes level by level.", order: 5 },
    { id: "q6", testId: "test-1", questionText: "What is the space complexity of a singly linked list with n nodes?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], correctAnswer: 2, explanation: "Each node stores data and a pointer, so total space is O(n).", order: 6 },
    { id: "q7", testId: "test-1", questionText: "Which sorting algorithm is considered stable?", options: ["Quick Sort", "Heap Sort", "Merge Sort", "Selection Sort"], correctAnswer: 2, explanation: "Merge Sort maintains the relative order of equal elements, making it stable.", order: 7 },
    { id: "q8", testId: "test-1", questionText: "What is the maximum number of nodes in a binary tree of height h?", options: ["2^h", "2^(h+1) - 1", "2h + 1", "h²"], correctAnswer: 1, explanation: "A complete binary tree of height h has at most 2^(h+1) - 1 nodes.", order: 8 },
    { id: "q9", testId: "test-1", questionText: "Which operation is NOT efficient in a singly linked list?", options: ["Insert at head", "Delete at head", "Access by index", "Insert at head"], correctAnswer: 2, explanation: "Accessing by index requires O(n) traversal in a linked list unlike arrays.", order: 9 },
    { id: "q10", testId: "test-1", questionText: "What is a hash collision?", options: ["Two keys having same hash value", "Hash table being full", "Key not found", "Empty bucket"], correctAnswer: 0, explanation: "A collision occurs when two different keys produce the same hash value.", order: 10 },
  ],
  "test-2": [
    { id: "q11", testId: "test-2", questionText: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"], correctAnswer: 0, explanation: "HTML stands for HyperText Markup Language.", order: 1 },
    { id: "q12", testId: "test-2", questionText: "Which CSS property is used to change the text color?", options: ["font-color", "text-color", "color", "foreground-color"], correctAnswer: 2, explanation: "The 'color' property sets the text color in CSS.", order: 2 },
    { id: "q13", testId: "test-2", questionText: "What is the correct way to declare a JavaScript variable?", options: ["variable x = 5;", "let x = 5;", "v x = 5;", "declare x = 5;"], correctAnswer: 1, explanation: "The 'let' keyword is the modern way to declare variables in JavaScript.", order: 3 },
    { id: "q14", testId: "test-2", questionText: "Which HTML tag is used for the largest heading?", options: ["<heading>", "<h6>", "<h1>", "<head>"], correctAnswer: 2, explanation: "<h1> is the largest heading tag in HTML.", order: 4 },
    { id: "q15", testId: "test-2", questionText: "What does CSS stand for?", options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"], correctAnswer: 1, explanation: "CSS stands for Cascading Style Sheets.", order: 5 },
    { id: "q16", testId: "test-2", questionText: "Which method adds an element to the end of a JavaScript array?", options: ["push()", "append()", "addEnd()", "insert()"], correctAnswer: 0, explanation: "The push() method adds elements to the end of an array.", order: 6 },
    { id: "q17", testId: "test-2", questionText: "Which CSS property makes a flex container?", options: ["display: block", "display: flex", "display: grid", "display: inline"], correctAnswer: 1, explanation: "display: flex creates a flex container.", order: 7 },
    { id: "q18", testId: "test-2", questionText: "What is the DOM?", options: ["Document Object Model", "Data Object Mapper", "Digital Output Machine", "Document Order Method"], correctAnswer: 0, explanation: "DOM stands for Document Object Model — the programming interface for HTML.", order: 8 },
    { id: "q19", testId: "test-2", questionText: "Which HTML tag creates a hyperlink?", options: ["<link>", "<a>", "<href>", "<url>"], correctAnswer: 1, explanation: "The <a> (anchor) tag creates hyperlinks in HTML.", order: 9 },
    { id: "q20", testId: "test-2", questionText: "Which JavaScript keyword is used to define a constant?", options: ["var", "let", "const", "final"], correctAnswer: 2, explanation: "The 'const' keyword declares a constant that cannot be reassigned.", order: 10 },
  ],
  "test-3": [
    { id: "q21", testId: "test-3", questionText: "What is the derivative of e^x?", options: ["xe^(x-1)", "e^x", "e^(x+1)", "x·e^x"], correctAnswer: 1, explanation: "The derivative of e^x is e^x itself.", order: 1 },
    { id: "q22", testId: "test-3", questionText: "What is the determinant of a 2×2 identity matrix?", options: ["0", "1", "2", "Undefined"], correctAnswer: 1, explanation: "The determinant of any identity matrix is 1.", order: 2 },
    { id: "q23", testId: "test-3", questionText: "What is ∫sin(x)dx?", options: ["cos(x) + C", "-cos(x) + C", "sin(x) + C", "-sin(x) + C"], correctAnswer: 1, explanation: "The integral of sin(x) is -cos(x) + C.", order: 3 },
    { id: "q24", testId: "test-3", questionText: "A matrix with equal rows and columns is called?", options: ["Rectangular", "Square", "Diagonal", "Singular"], correctAnswer: 1, explanation: "A square matrix has equal number of rows and columns.", order: 4 },
    { id: "q25", testId: "test-3", questionText: "What is the Laplace transform of 1?", options: ["1/s", "s", "1/s²", "1"], correctAnswer: 0, explanation: "L{1} = 1/s for s > 0.", order: 5 },
    { id: "q26", testId: "test-3", questionText: "What is the limit of sin(x)/x as x approaches 0?", options: ["0", "1", "∞", "Undefined"], correctAnswer: 1, explanation: "This is a fundamental limit: lim(x→0) sin(x)/x = 1.", order: 6 },
    { id: "q27", testId: "test-3", questionText: "The rank of a null matrix is:", options: ["1", "0", "n", "Undefined"], correctAnswer: 1, explanation: "A null matrix has all zero elements, so its rank is 0.", order: 7 },
    { id: "q28", testId: "test-3", questionText: "What is the order of the differential equation y'' + 3y' + 2y = 0?", options: ["1", "2", "3", "0"], correctAnswer: 1, explanation: "The order is 2 because y'' is the highest derivative.", order: 8 },
    { id: "q29", testId: "test-3", questionText: "What is the mean of a standard normal distribution?", options: ["-1", "0", "1", "0.5"], correctAnswer: 1, explanation: "The standard normal distribution has mean 0 and standard deviation 1.", order: 9 },
    { id: "q30", testId: "test-3", questionText: "What is d/dx(ln x)?", options: ["1/x", "x", "ln(x)/x", "e^x"], correctAnswer: 0, explanation: "The derivative of ln(x) is 1/x.", order: 10 },
  ],
  "test-4": [
    { id: "q31", testId: "test-4", questionText: "What does DBMS stand for?", options: ["Data Backup Management System", "Database Management System", "Data Binary Management System", "Database Monitoring System"], correctAnswer: 1, explanation: "DBMS stands for Database Management System.", order: 1 },

    { id: "q32", testId: "test-4", questionText: "Which key uniquely identifies a record?", options: ["Foreign Key", "Primary Key", "Candidate Key", "Composite Key"], correctAnswer: 1, explanation: "A primary key uniquely identifies each record in a table.", order: 2 },

    { id: "q33", testId: "test-4", questionText: "Which SQL command is used to retrieve data?", options: ["INSERT", "UPDATE", "SELECT", "DELETE"], correctAnswer: 2, explanation: "SELECT is used to fetch data from a database.", order: 3 },

    { id: "q34", testId: "test-4", questionText: "What is normalization?", options: ["Data duplication", "Organizing data to reduce redundancy", "Deleting tables", "Creating indexes"], correctAnswer: 1, explanation: "Normalization reduces redundancy and improves data integrity.", order: 4 },

    { id: "q35", testId: "test-4", questionText: "Which normal form removes partial dependency?", options: ["1NF", "2NF", "3NF", "BCNF"], correctAnswer: 1, explanation: "2NF removes partial dependency.", order: 5 },

    { id: "q36", testId: "test-4", questionText: "ACID properties are related to?", options: ["Security", "Transactions", "Indexes", "Views"], correctAnswer: 1, explanation: "ACID ensures reliable transaction processing.", order: 6 },

    { id: "q37", testId: "test-4", questionText: "Which type of join returns all records when there is a match in either table?", options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN"], correctAnswer: 3, explanation: "FULL JOIN returns all matching and non-matching rows.", order: 7 },

    { id: "q38", testId: "test-4", questionText: "Which database is NoSQL?", options: ["MySQL", "Oracle", "MongoDB", "PostgreSQL"], correctAnswer: 2, explanation: "MongoDB is a NoSQL database.", order: 8 },

    { id: "q39", testId: "test-4", questionText: "Which constraint ensures values cannot be null?", options: ["UNIQUE", "PRIMARY KEY", "NOT NULL", "CHECK"], correctAnswer: 2, explanation: "NOT NULL constraint prevents null values.", order: 9 },

    { id: "q40", testId: "test-4", questionText: "Which language is used to define database schema?", options: ["DML", "DDL", "DCL", "TCL"], correctAnswer: 1, explanation: "DDL (Data Definition Language) defines schema.", order: 10 }
  ],
  "test-5": [
    { id: "q41", testId: "test-5", questionText: "What is Newton's First Law also known as?", options: ["Law of Motion", "Law of Inertia", "Law of Acceleration", "Law of Force"], correctAnswer: 1, explanation: "It is called the Law of Inertia.", order: 1 },

    { id: "q42", testId: "test-5", questionText: "SI unit of force is?", options: ["Joule", "Newton", "Watt", "Pascal"], correctAnswer: 1, explanation: "Force is measured in Newton (N).", order: 2 },

    { id: "q43", testId: "test-5", questionText: "What is the formula for kinetic energy?", options: ["mv", "½mv²", "mgh", "F=ma"], correctAnswer: 1, explanation: "Kinetic energy = ½mv².", order: 3 },

    { id: "q44", testId: "test-5", questionText: "What is the speed of light?", options: ["3×10^8 m/s", "3×10^6 m/s", "3×10^5 km/s", "3×10^3 m/s"], correctAnswer: 0, explanation: "Speed of light is 3×10^8 m/s.", order: 4 },

    { id: "q45", testId: "test-5", questionText: "Which law states F = ma?", options: ["First Law", "Second Law", "Third Law", "Law of Gravitation"], correctAnswer: 1, explanation: "Newton's Second Law defines force.", order: 5 },

    { id: "q46", testId: "test-5", questionText: "Unit of electric current?", options: ["Volt", "Ohm", "Ampere", "Watt"], correctAnswer: 2, explanation: "Current is measured in Ampere.", order: 6 },

    { id: "q47", testId: "test-5", questionText: "What is frequency measured in?", options: ["Hertz", "Newton", "Joule", "Tesla"], correctAnswer: 0, explanation: "Frequency is measured in Hertz (Hz).", order: 7 },

    { id: "q48", testId: "test-5", questionText: "What type of lens converges light?", options: ["Concave", "Convex", "Plane", "None"], correctAnswer: 1, explanation: "Convex lens converges light rays.", order: 8 },

    { id: "q49", testId: "test-5", questionText: "Which particle has negative charge?", options: ["Proton", "Neutron", "Electron", "Alpha"], correctAnswer: 2, explanation: "Electron carries negative charge.", order: 9 },

    { id: "q50", testId: "test-5", questionText: "What is unit of power?", options: ["Joule", "Newton", "Watt", "Volt"], correctAnswer: 2, explanation: "Power is measured in Watt.", order: 10 }
  ]
};

export const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    course: "Computer Science",
    text: "StudyMaterials helped me organize my entire semester's preparation. The unit-wise materials and mock tests were incredibly useful!",
    rating: 5,
  },
  {
    name: "Rahul Verma",
    course: "Engineering",
    text: "The 3D animations and concept videos made complex physics topics so much easier to understand. Highly recommended!",
    rating: 5,
  },
  {
    name: "Ananya Gupta",
    course: "Mathematics",
    text: "Previous year papers and question banks helped me identify important topics. I scored 95% in my finals!",
    rating: 4,
  },
];

export const DEMO_REVIEWS = {
  "demo-1": [
    { id: "r1", userName: "Amit Kumar", rating: 5, text: "Excellent course! The unit-wise structure made DSA concepts very clear.", date: "15 Apr 2026" },
    { id: "r2", userName: "Sneha Patel", rating: 4, text: "Great explanations. The dynamic programming section was especially helpful.", date: "12 Apr 2026" },
    { id: "r3", userName: "Vikram Singh", rating: 5, text: "Best DSA course I've taken. Mock tests helped me prepare for placements.", date: "8 Apr 2026" },
  ],
  "demo-2": [
    { id: "r4", userName: "Riya Sharma", rating: 5, text: "Loved the hands-on approach to web development. Very practical!", date: "18 Apr 2026" },
    { id: "r5", userName: "Arjun Mehta", rating: 4, text: "Good coverage of React. Would love more advanced topics.", date: "10 Apr 2026" },
  ],
  "demo-3": [
    { id: "r6", userName: "Priyanka Joshi", rating: 4, text: "Calculus sections were well explained with plenty of examples.", date: "14 Apr 2026" },
    { id: "r7", userName: "Karan Gupta", rating: 5, text: "Helped me score 90+ in my university exams!", date: "5 Apr 2026" },
  ],
  "demo-4": [
    { id: "r8", userName: "Deepak Yadav", rating: 5, text: "Boolean algebra and circuit design explained perfectly.", date: "20 Apr 2026" },
  ],
  "demo-5": [
    { id: "r9", userName: "Ananya Reddy", rating: 4, text: "Modern physics section was fascinating. Great video content.", date: "16 Apr 2026" },
  ],
  "demo-6": [
    { id: "r10", userName: "Rohit Agarwal", rating: 5, text: "SQL and normalization concepts became crystal clear. Highly recommend!", date: "19 Apr 2026" },
  ],
};
