import * as Yup from "yup";


export const createSquadValidationSchema = Yup.object({
    // Basic details
    scenario_name: Yup.string().min(5, "Enter minimum 5 characters").required("Squad name is required"),
    scenario_category_id: Yup.string().required("Category is required"),
    scenario_assigned_severity: Yup.string().required("Severity is required"),
    scenario_score: Yup.number()
        .required("Points are required")
        .typeError("Must be a number")
        .max(100, "Ensure this value is less than or equal to 100"),
    scenario_time: Yup.number()
        .required("Time duration is required")
        .typeError("Must be a number")
        .max(10, "Ensure this value is less than or equal to 10"),

    // Thumbnail
    scenario_thumbnail: Yup.mixed()
        .required("Thumbnail is required")
        .test(
            "fileType",
            "Only JPEG or PNG files are allowed",
            (file) =>
                !file ||
                (file && ["image/jpeg", "image/png"].includes(file.type))
        )
        .test(
            "fileSize",
            "File must be less than 5MB",
            (file) => !file || (file && file.size <= 5 * 1024 * 1024)
        ),

    // Walkthrough documents
    scenario_documents: Yup.array()
        .of(
            Yup.mixed().test(
                "fileType",
                "Only PDF files are allowed",
                (file) => !file || file.type === "application/pdf"
            )
        )
        .min(1, "At least one walkthrough file is required"),

    // Flags
    scenario_blue_team_flags: Yup.array()
        .of(
            Yup.object({
                name: Yup.string().required("Flag name cannot be empty"),
            })
        )
        .min(1, "At least one Blue Team flag is required"),

    scenario_purple_team_flags: Yup.array()
        .of(
            Yup.object({
                name: Yup.string().required("Flag name cannot be empty"),
            })
        )
        .min(1, "At least one Purple Team flag is required"),

    scenario_red_team_flags: Yup.array()
        .of(
            Yup.object({
                name: Yup.string().required("Flag name cannot be empty"),
            })
        )
        .min(1, "At least one Red Team flag is required"),

    scenario_yellow_team_flags: Yup.array()
        .of(
            Yup.object({
                name: Yup.string().required("Flag name cannot be empty"),
            })
        )
        .min(1, "At least one Yellow Team flag is required"),

    // Text editors (React Quill fields)
    scenario_description: Yup.string()
        .required("Description is required")
        .test("non-empty", "Description cannot be empty", (val) => {
            const plain = val?.replace(/<[^>]+>/g, "").trim();
            return !!plain;
        })
        .test("min-length", "Ensure this field has at least 50 characters", (val) => {
            const plain = val?.replace(/<[^>]+>/g, "").trim();
            return plain && plain.length >= 50;
        }),

    scenario_tools_and_technologies: Yup.string()
        .required("Tools & Technologies are required")
        .test("non-empty", "Tools & Technologies cannot be empty", (val) => {
            const plain = val?.replace(/<[^>]+>/g, "").trim();
            return !!plain;
        })
        .test("min-length", "Ensure this field has at least 100 characters", (val) => {
            const plain = val?.replace(/<[^>]+>/g, "").trim();
            return plain && plain.length >= 100;
        }),

    scenario_prerequisites: Yup.string()
        .required("Prerequisites are required")
        .test("non-empty", "Prerequisites cannot be empty", (val) => {
            const plain = val?.replace(/<[^>]+>/g, "").trim();
            return !!plain;
        })
        .test("min-length", "Ensure this field has at least 100 characters", (val) => {
            const plain = val?.replace(/<[^>]+>/g, "").trim();
            return plain && plain.length >= 100;
        }),

    // Members requirement object
    scenario_members_requirement: Yup.object({
        red: Yup.number()
            .typeError("Must be a number")
            .min(0, "Cannot be negative")
            .required("Red team members required"),
        blue: Yup.number()
            .typeError("Must be a number")
            .min(0, "Cannot be negative")
            .required("Blue team members required"),
        yellow: Yup.number()
            .typeError("Must be a number")
            .min(0, "Cannot be negative")
            .required("Yellow team members required"),
        white: Yup.number()
            .typeError("Must be a number")
            .min(0, "Cannot be negative")
            .required("White team members required"),
        purple: Yup.number()
            .typeError("Must be a number")
            .min(0, "Cannot be negative")
            .required("Purple team members required"),
    }),
});

export const webScenarioValidationSchema = Yup.object({
    gameName: Yup.string().min(5, 'Enter atleast 5 characters').required('Game name is required'),
    category: Yup.string().required('Category is required'),
    severity: Yup.string().required('Severity is required'),
    score: Yup.number()
        .required('Score is required')
        .min(1, 'Score must be at least 1')
        .typeError('Score must be a number'),
    time: Yup.string().required('Time is required'),
    websiteUrl: Yup.string().test("is-url-or-ip", "Enter a valid URL", (value) => {
        if (!value) return false;
        try {
            new URL(value);
            return true;
        } catch {
            return false;
        }
    }).required("URL is required"),
    flags: Yup.string(),
    flagChips: Yup.array()
        .of(Yup.string().required('Flag cannot be empty'))
        .min(1, 'At least one flag is required')
        .test('unique-flags', 'Flags must be unique', function (flags) {
            const uniqueFlags = new Set(flags);
            return uniqueFlags.size === flags.length;
        }),

    description: Yup.string().min(50, 'Enter atleast 50 characters').required('Description is required'),
    flagInformation: Yup.string().min(50, 'Enter atleast 50 characters').required('Flag information is required'),
    rulesAndRegulations: Yup.string().required('Rules and regulations are required'),
    walkthroughFile: Yup.mixed().required('Walkthrough file is required'),
    thumbnailFile: Yup.mixed().required('Thumbnail file is required'),
});
export const webScenarioEditValidationSchema = Yup.object({
    gameName: Yup.string().min(5, 'Enter atleast 5 characters').required('Game name is required'),
    category: Yup.string().required('Category is required'),
    severity: Yup.string().required('Severity is required'),
    score: Yup.number()
        .required('Score is required')
        .min(1, 'Score must be at least 1')
        .typeError('Score must be a number'),
    time: Yup.string().required('Time is required'),
    websiteUrl: Yup.string().test("is-url-or-ip", "Enter a valid URL", (value) => {
        if (!value) return false;
        try {
            new URL(value);
            return true;
        } catch {
            return false;
        }
    }).required("URL is required"),
    flags: Yup.string(),
    flagChips: Yup.array()
        .of(Yup.string().required('Flag cannot be empty'))
        .min(1, 'At least one flag is required')
        .test('unique-flags', 'Flags must be unique', function (flags) {
            const uniqueFlags = new Set(flags);
            return uniqueFlags.size === flags.length;
        }),

    description: Yup.string().min(50, 'Enter atleast 50 characters').required('Description is required'),
    flagInformation: Yup.string().min(50, 'Enter atleast 50 characters').required('Flag information is required'),
    rulesAndRegulations: Yup.string().required('Rules and regulations are required'),
    walkthroughFile: Yup.mixed().nullable().notRequired(),
    thumbnailFile: Yup.mixed().nullable().notRequired()
});


export const uploadMachineValidationSchema = Yup.object({
    ctf_name: Yup.string().min(5, 'Enter atleast 5 characters').required("Game name is required"),
    ctf_category_id: Yup.string().required("Category is required"),
    ctf_severity: Yup.string().required("Severity is required"),
    // Flags: require at least one chip

    ctf_time: Yup.string().required("Time is required"),
    ctf_score: Yup.number()
        .typeError("Score must be a number")
        .positive("Score must be positive")
        .required("Score is required"),
    ctf_description: Yup.string().min(50, 'Enter atleast 50 characters').required("Description is required"),
    ctf_flags_information: Yup.string().min(50, 'Enter atleast 50 characters').required("Flag information is required"),
    ctf_rules: Yup.string().min(50, 'Enter atleast 50 characters').required("Rules and regulations are required"),
    flagChips: Yup.array()
        .of(Yup.string().trim().required("Flag cannot be empty"))
        .min(1, "At least one flag is required"),
    ctf_walkthrough: Yup.mixed().required("Walkthrough PDF is required"),
    ctf_thumbnail: Yup.mixed().required("Thumbnail image is required"),
});

export const createScenarioValidationSchema = Yup.object({
    scenario_name: Yup.string().min(5, "Enter atleast 5 characters").required("Scenario name is required"),
    scenario_assigned_severity: Yup.string().required("Severity is required"),
    scenario_category_id: Yup.string().required("Category is required"),
    type: Yup.string().required("Exercise type is required"),
    scenario_thumbnail: Yup.mixed().required("Thumbnail is required"),
    scenario_description: Yup.string().required("Scenario description is required")
        .min(50, "Description must be more than 50 characters")
        .max(5000, "Description must be less than 5000 characters"),
    scenario_tools_and_technologies: Yup.string().required("Tools & Technologies are required")
        .min(50, "Tools & Technologies must be more than 50 characters")
        .max(5000, "Tools & Technologies must be less than 5000 characters"),
    scenario_prerequisites: Yup.string().required("Prerequisites are required")
        .min(50, "Prerequisites must be more than 50 characters")
        .max(5000, "Prerequisites must be less than 5000 characters"),


});


export const userValidationSchema = (template) => Yup.object({
    name: Yup.string().required("Full name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    team: Yup.string().required("Team is required"),
    mobileNumber: Yup.string()
        .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
        .required("Mobile number is required"),
    password:
        template === "Add User"
            ? Yup.string()
                .min(8, "Password must be at least 8 characters")
                .matches(/\D/, "Password cannot be entirely numeric")
                .required("Password is required")
            : Yup.string().nullable(),
    confirmPassword:
        template === "Add User"
            ? Yup.string()
                .oneOf([Yup.ref("password"), null], "Passwords must match")
                .required("Confirm Password is required")
            : Yup.string().nullable(),
});



export const updateSoloValidationSchema = Yup.object({
    ctf_name: Yup.string().required("Game name is required"),
    ctf_score: Yup.number()
        .typeError("Score must be a number")
        .required("CTF Score is required"),
    ctf_category_id: Yup.string().required("Category is required"),
    ctf_severity: Yup.string().required("Severity is required"),
    ctf_time: Yup.string().required("Time is required"),
    ctf_thumbnail: Yup.mixed().nullable(),
    ctf_walkthrough: Yup.mixed().nullable(),
});


export const updateSquadScenarioValidationSchema = Yup.object({
    scenario_name: Yup.string()
        .required("Scenario name is required")
        .min(3, "Scenario name must be at least 3 characters")
        .max(255, "Scenario name must not exceed 255 characters"),
    scenario_category_id: Yup.string().required("Category is required"),
    scenario_assigned_severity: Yup.string().required("Severity is required"),
    scenario_score: Yup.number()
        .required("Points are required")
        .positive("Points must be positive")
        .integer("Points must be a whole number")
        .min(1, "Points must be at least 1")
        .max(10000, "Points must not exceed 10000"),
    scenario_time: Yup.number()
        .typeError("Time duration must be a number")
        .required("Time duration is required")
        .positive("Time duration must be positive"),
    scenario_description: Yup.string()
        .required("Description is required")
        .min(50, "Description must be at least 50 characters").nullable(),
    scenario_prerequisites: Yup.string()
        .required("Prerequisites are required")
        .min(50, "Prerequisites must be at least 50 characters").nullable(),
    scenario_tools_technologies: Yup.string()
        .required("Tools & technologies are required")
        .min(20, "Tools & technologies must be at least 20 characters").nullable(),
    scenario_for_premium_user: Yup.boolean(),
    scenario_thumbnail: Yup.mixed()
        .nullable()
        .test("fileSize", "Thumbnail file is too large (max 5MB)", (value) => {
            if (!value || typeof value === "string") return true;
            return value.size <= 5 * 1024 * 1024;
        })
        .test("fileType", "Thumbnail must be a JPEG or PNG image", (value) => {
            if (!value || typeof value === "string") return true;
            return ["image/jpeg", "image/png"].includes(value.type);
        }),
    scenario_documents: Yup.array()
        .of(
            Yup.mixed().test("fileType", "Documents must be PDF files", (value) => {
                if (!value) return true;
                return value.type === "application/pdf";
            })
        )
        .max(10, "You can upload a maximum of 10 documents"),
});