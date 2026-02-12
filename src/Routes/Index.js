import React, { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation, useRoutes, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import jwtDecode from "jwt-decode";

// Layouts
import LoginLayout from "../Layout/Auth/LoginLayout";
import DashboardLayout from "../Layout/Dasboard/DashboardLayout";
import MachineLayout from "../Layout/Machine/MachineLayout";
import SenarioMachineLayout from "../Layout/scenarioConsole";
import UnderConstructorLayout from "../Layout/UnderConstructionLayout";
import ErrorPageLayout from "../Layout/ErrorPages/ErrorPageLayout";
import InfraCreate from "../container/CyberDrill/components/InfraCreate";
// Core pages
import Dashboard from "../container/Dashboard";
import LoginPage from "../container/Auth/login";
import ForgotPassword from "../container/ForgotPassword";
import MobileView from "../components/MobileView";
import LoaderImg from "../components/ui/loader";


// SuperAdmin Pages
import ActiveScenarioList from "../container/SuperAdmin/ActiveScenarioList";
import ActiveScenarioDetails from "../container/SuperAdmin/ActiveScenarioDetails";

// Auth/OTP
import OtpBox from "../components/OTPBox/otp";
import Phonenum from "../components/OTPBox/Phonenum";

// User/Winning wall
import WinningWall from "../container/WinningWall";
import PlayerProfile from "../container/WinningWall/PlayerProfile";

// Machines & Uploads
import MachineProfile from "../container/MachineProfile";
import UploadMachine from "../container/createSolo";
import UploadFile from "../container/createSolo/uploadFile";
import UploadEnding from "../container/createSolo/UploadEnding";
import Popup from "../container/MachineProfile/popup";

// Games & Scenarios
import ActiveGame from "../container/ActiveGame";
import CyberDrill from "../container/CyberDrill";
import Gamedetails from "../container/Dashboard/GameDetails";
import ScenarioDetails from "../container/ViewScenariosCommon/ScenarioDetails";
import ScenarioCategory from "../container/ViewScenariosCommon/ScenarioCategory";
import ScenarioCreation from "../container/CorporateScenarioCreation";
import SenariosUploadEnding from "../container/ViewScenariosCommon/ScenarioDetails/endingPage";
import ActiveGameScenario from "../container/CorporateScenarioCreation/CreateCorporate/scenarioActiveGame";
import MachineProfileSenario from "../container/ViewScenariosCommon/ScenarioDetails/scenarioConsole";
import ActiveGameSenario from "../container/ViewScenariosCommon/ActiveGame";
import WhiteTeamConsole from "../container/ViewScenariosCommon/ActiveGame/WhiteConsole/whiteConsole";
import ScenarioPage from "../container/ViewScenariosCommon/ScenarioDetails/scenarioPage";
import ScenarioChat from "../container/ViewScenariosCommon/ScenarioChat/ScenarioChat";


// Admin
import Map from "../container/Admin/CTF/Mapping";
import ScenarioApproval from "../container/Admin/Senario/SceanrioApproval";
import ScenarioUnApproval from "../container/Admin/Senario/ScenarioUnApproval";
import { UserUpdate } from "../container/Admin/user/UserUpdate";
import CtfCategory from "../container/Solo/SoloCategory";
import CTFCategories from "../container/Admin/CTF/CTFCategories";
import CreateCTFCategories from "../container/Admin/CTF/createCTFCategories";
import EditCTFCategories from "../container/Admin/CTF/EditCTFCategories";
import ScenarioCategories from "../container/Admin/Senario/squadCategories";
import CreateScenarioCategories from "../container/Admin/Senario/CreateScenarioCategories";
import EditScenarioCategories from "../container/Admin/Senario/senario-upadate/EditScenarioCategories";
import Users from "../container/Admin/users/Users";
import AddUser from "../container/Admin/users/AddUser";
import UpdateUser from "../container/Admin/users/UpdateUser";
import ScenarioRequests from "../container/Admin/Senario/ScenarioRequests";
import CTFRequests from "../container/Admin/CTF/CTFRequests";
import CreateCTFRequest from "../container/Admin/CTF/CreateCTFRequest";
import CtfUpdate from "../container/Admin/CTF/CTF-UPDATE";
import UpadateCtf from "../container/Admin/CTF/CTF-UPDATE/upadeCtf";
import UpdateScenario from "../container/Admin/Senario/senario-upadate";
import OngoingCTFChallenge from "../container/Admin/ongoingCTFChallenges";
import CorporateRequests from "../container/Admin/CyberDrill/CyberDrillRequests";
import CorporateInfraReview from "../container/Admin/CyberDrill/CorporateInfraReview";
import CyberDrillUpdate from "../container/Admin/CyberDrill/Cyberdrill-Update/CyberDrillUpdate";
import CyberDrillScenarioList from "../container/Admin/CyberDrill/CyberDrillScenarioList";


// Web Scenarios (admin & user)
import WebScenarioCategories from "../container/Admin/WebScenarios/WebScenarioCategories";
import WebScenarioRequests from "../container/Admin/WebScenarios/WebScenarioRequests";
import WebScenarioUpdate from "../container/Admin/WebScenarios/WebScenarioUpdate";
import CreateWebScenarios from "../container/Admin/WebScenarios/CreateWebScenarios";
import EditWebScenarioCategories from "../container/Admin/WebScenarios/EditWebScenarioCategories";
import CreateWebScenarioCategories from "../container/Admin/WebScenarios/CreateWebScenarioCategories";
import WebScenarioUserCategories from "../container/webScenarios/WebScenarioUserCategories";
import ActiveWebScenario from "../container/webScenarios/ActiveWebScenario";
import WebScenarioDetails from "../container/webScenarios/WebScenarioDetails";
import ConsoleWebScenario from "../container/webScenarios/ConsoleWebScenario";

// Squad v2
import ScenarioCategoryVersion2 from "../container/Squad/ScenarioCategory";
import ScenarioDetailsVersion2 from "../container/Squad/ScenarioDetails";
import CreateSquad from "../container/Squad/Create";

// Reports & misc
import NotificationPage from "../components/navbar/NotificationPage";
import UnderConstruction from "../container/ErrorPages/UnderConstruction";
import PageNotFound from "../container/ErrorPages/PageNotFound";
import ServerError from "../container/ErrorPages/ServerError";
import CalderaPage from "../components/pages/CalderaPage";
import Report from "../container/Report/Report";

// Redux
import { setPathUrl } from "../RTK/features/path";
import MakeChallengeCTF from "../container/Admin/challenge/make-challenge-CTF";
import MakeChallengeScenario from "../container/Admin/challenge/make-challenge-scenario";

// ---------- Helpers ----------
const safeDecode = (token) => {
    try {
        return jwtDecode(token);
    } catch (_) {
        return null;
    }
};

const useAuth = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    const refresh = typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;
    const user = useMemo(() => (token ? safeDecode(token) : null), [token]);
    return {
        token,
        refresh,
        isLogin: Boolean(token),
        isVerified: Boolean(user?.is_verified),
    };
};

const RequireAuth = ({ children, verifiedOnly = true }) => {
    const { isLogin, isVerified } = useAuth();
    if (!isLogin) return <Navigate to="/auth/login" replace />;
    if (verifiedOnly && !isVerified) return <Navigate to="/auth/login" replace />;
    return children;
};

const useViewportKind = () => {
    const [kind, setKind] = useState("desktop");
    useEffect(() => {
        const setByWidth = () => setKind(window.innerWidth <= 900 ? "mobile" : "desktop");
        setByWidth();
        window.addEventListener("resize", setByWidth);
        return () => window.removeEventListener("resize", setByWidth);
    }, []);
    return kind;
};

// ---------- Router ----------
// DRY wrappers for common protected layouts
const ProtectedDashboard = () => (
    <RequireAuth>
        <DashboardLayout />
    </RequireAuth>
);

const ProtectedMachine = () => (
    <RequireAuth>
        <MachineLayout />
    </RequireAuth>
);

const ProtectedScenarioConsole = () => (
    <RequireAuth>
        <SenarioMachineLayout />
    </RequireAuth>
);

const ProtectedUnderConstruction = () => (
    <RequireAuth>
        <UnderConstructorLayout />
    </RequireAuth>
);

// ---------- Router ----------
const Router = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const sizeState = useViewportKind();
    const { token, refresh } = useAuth();

    // Remember path for post-login redirect if unauthenticated and not under /auth
    useEffect(() => {
        const currentPath = location.pathname;
        const underAuth = currentPath.toLowerCase().includes("/auth");
        if (!token && !underAuth) {
            dispatch(setPathUrl({ currentPath }));
        }
    }, [location.pathname, token, dispatch]);

    // Refresh token expiry handling
    useEffect(() => {
        if (!refresh) return;
        const decoded = safeDecode(refresh);
        if (!decoded?.exp) return;
        const isExpired = decoded.exp * 1000 < Date.now();
        if (isExpired) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            navigate("/auth/login", { replace: true });
        }
    }, [refresh, navigate]);

    const authOrMobile = sizeState === "mobile" ? <MobileView /> : <LoginLayout />;

    // --- Route config split into logical groups ---
    const routes = [
        // Auth
        {
            path: "/auth",
            element: authOrMobile,
            children: [
                { index: true, element: <Navigate to="login" replace /> },
                { path: "login", element: <LoginPage /> },
                { path: "forgotPassword", element: <ForgotPassword /> },
            ],
        },

        // OTP/Verification
        {
            path: "/verify",
            element: authOrMobile,
            children: [
                { path: "verification", element: <OtpBox /> },
                { path: "mobileNumber", element: <Phonenum /> },
            ],
        },

        // App (Dashboard index)
        {
            path: "/",
            element: <ProtectedDashboard />,
            children: [
                {
                    index: true,
                    element: (
                        <React.Suspense fallback={<LoaderImg />}>
                            <Dashboard />
                        </React.Suspense>
                    ),
                },
            ],
        },

        // Winning wall & profile
        {
            path: "/winningWall",
            element: <ProtectedDashboard />,
            children: [{ index: true, element: <WinningWall /> }],
        },
        {
            path: "/playerProfile/:userId",
            element: <ProtectedDashboard />,
            children: [{ index: true, element: <PlayerProfile /> }],
        },

        // Scenarios (v1)
        {
            path: "/squad",
            element: <ProtectedDashboard />,
            children: [
                {
                    path: "scenarioDetails/:userId",
                    element: (
                        <React.Suspense fallback={<LoaderImg />}>
                            <ScenarioDetails />
                        </React.Suspense>
                    ),
                },
                { path: "createSquad", element: <CreateSquad /> },
                { path: "scenarioCategory", element: <ScenarioCategory /> },
            ],
        },

        // Categories
        {
            path: "/categories",
            element: <ProtectedDashboard />,
            children: [
                { path: "gameDetails/:userId", element: <Gamedetails /> },
                { path: "soloCategory", element: <CtfCategory /> },
            ],
        },

        // Machine profile
        {
            path: "/machineProfile/:machineId",
            element: <ProtectedMachine />,
            children: [{ index: true, element: <MachineProfile /> }],
        },

     // Create Cyberdrill
       {
    path: "/cyberdrill",
    element: <ProtectedDashboard />,
    children: [{ index: true, element: <CyberDrill /> }],
    },

// CyberDrill Infra Create
{
  path: "/infra/:scenarioId",
  element: <ProtectedDashboard />,
  children: [
    {
      index: true,
      element: <InfraCreate />,
    },
  ],
},
        // Create scenarios (v1)
        {
            path: "/createCorporate",
            element: <ProtectedDashboard />,
            children: [
                { index: true, element: <ScenarioCreation /> },
                { path: "endingPage", element: <SenariosUploadEnding /> },
                { path: "activeScenario", element: <ActiveGameScenario /> },
            ],
        },

        // Scenario console
        {
            path: "/scenarioConsole/:id",
            element: <ProtectedScenarioConsole />,
            children: [{ index: true, element: <MachineProfileSenario /> }],
        },

        {
        path: "/scenario-chat/:activeScenarioId",
        element: (
            <RequireAuth>
            <ScenarioChat />
            </RequireAuth>
        ),
        },


        
        // Upload machine
        {
            path: "/createSolo",
            element: <ProtectedDashboard />,
            children: [
                { index: true, element: <UploadMachine /> },
                { path: "uploadFile", element: <UploadFile /> },
                { path: "uploadEnding", element: <UploadEnding /> },
                { path: "popup", element: <Popup /> },
            ],
        },

        // Under construction wrapper
        {
            path: "/underConstructionPage",
            element: <ProtectedUnderConstruction />,
            children: [{ index: true, element: <UnderConstruction /> }],
        },

        // Notifications
        {
            path: "/notification",
            element: <ProtectedDashboard />,
            children: [{ index: true, element: <NotificationPage /> }],
        },

        // Web Scenarios (user)
        {
            path: "/webScenarios",
            element: <ProtectedDashboard />,
            children: [
                { path: "categories", element: <WebScenarioUserCategories /> },
                { path: "active", element: <ActiveWebScenario /> },
                { path: "webScenarioDetails/:gameId", element: <WebScenarioDetails /> },
            ],
        },

        // Console web scenario (standalone)
        {
            path: "/consoleWebScenario/:userId",
            element: (
                <RequireAuth>
                    <ConsoleWebScenario />
                </RequireAuth>
            ),
        },

        // Create scenarios (v1)
        {
            path: "/createCorporate",
            element: <ProtectedDashboard />,
            children: [
                { index: true, element: <ScenarioCreation /> },
                { path: "endingPage", element: <SenariosUploadEnding /> },
                { path: "activeScenario", element: <ActiveGameScenario /> },
            ],
        },


        // Admin
        {
            path: "/admin",
            element: <ProtectedDashboard />,
            children: [
                { index: true, element: <PageNotFound /> },
                { path: "soloCatgories", element: <CTFCategories /> },
                { path: "createSoloCategories", element: <CreateCTFCategories /> },
                { path: "createSoloCategories/:categoryId", element: <EditCTFCategories /> },

                { path: "squadCategories", element: <ScenarioCategories /> },
                { path: "createSquadCategories", element: <CreateScenarioCategories /> },
                { path: "editSquadCategories/:categoryId", element: <EditScenarioCategories /> },

                { path: "corporateRequests", element: <CorporateRequests /> },
                { path: "cyberdrill", element: <CyberDrillScenarioList /> },
                { path: "cyberdrill/:scenarioId/edit", element: <CyberDrillUpdate /> },

                { path:"/admin/corporateRequests/:id/review", element:<CorporateInfraReview />},
                { path: "webScenarioRequests", element: <WebScenarioRequests /> },
                { path: "squadRequests", element: <ScenarioRequests /> },
                { path: "soloRequests", element: <CTFRequests /> },
                { path: "soloRequests/:categoryId", element: <CreateCTFRequest /> },
                { path: "mapping", element: <Map /> },

                { path: "scenarioApproval", element: <ScenarioApproval /> },
                { path: "scenarioUnapproval", element: <ScenarioUnApproval /> },

                { path: "users", element: <Users /> },
                { path: "addUser", element: <AddUser /> },
                { path: "updateUser/:userId", element: <UpdateUser /> },
                { path: "userGetCtf/:userId", element: <UpdateUser /> },
                { path: "userUpdate", element: <UserUpdate /> },

                { path: "ctfUpdate", element: <CtfUpdate /> },
                { path: "webScenarioUpdate", element: <WebScenarioUpdate /> },
                { path: "webScenarioUpdate/:id", element: <CreateWebScenarios /> },
                { path: "editSolo/:userId", element: <UpadateCtf /> },
                { path: "updateSquad/:userId", element: <UpdateScenario /> },

                { path: "allSquads", element: <ScenarioCategory variant="edit" /> },
                { path: "allSolo", element: <CtfCategory variant="edit" /> },
                { path: "webScenarioCategories", element: <WebScenarioCategories variant="edit" /> },
                { path: "editWebScenarioCategories/:categoryId", element: <EditWebScenarioCategories /> },
                { path: "createWebScenarioCategories", element: <CreateWebScenarioCategories /> },
                {
                    path: "makeSoloChallenge/:gameid",
                    element: <MakeChallengeCTF />,
                },
                {
                    path: "makeSquadChallenge/:gameid",
                    element: <MakeChallengeScenario />,
                },

                { path: "challenges", element: <OngoingCTFChallenge /> },
                { path: "allSquadScenarios", element: <ScenarioCategory variant="scenarios" /> },
                { path: "userScenarios", element: <ScenarioCategory variant="userScenarios" /> },
                { path: "userAddScenarios/:userId", element: <ScenarioCategory variant="userAddScenarios" /> },
                { path: "allSoloScenarios", element: <CtfCategory variant="ctf" /> },
                { path: "userAddCtf/:userId", element: <CtfCategory variant="userAddCtf" /> },
                { path: "userAddCorporate/:userId", element: <ScenarioCategory variant="userAddCorporate" /> },
                { path: "webScenariosCreate", element: <CreateWebScenarios /> },
            ],
        },
        {
        path: "/superadmin",
        element: <ProtectedDashboard />,
        children: [
            { index: true, element: <ActiveScenarioList /> },
            { path: "scenarios", element: <ActiveScenarioList /> },
            { path: "scenario/:activeScenarioId", element: <ActiveScenarioDetails /> },
        ],
        },

        // Error pages
        {
            path: "/error",
            element: <ErrorPageLayout />,
            children: [
                { path: "underConstruction", element: <UnderConstruction /> },
                { path: "pageNotFound", element: <PageNotFound /> },
                { path: "serverError", element: <ServerError /> },
            ],
        },

        // Reports
        {
            path: "/report/:archiveScenarioId",
            element: <ProtectedDashboard />,
            children: [{ index: true, element: <Report /> }],
        },

        // ActiveGameSenario console
        {
            path: "/activeGameScenario",
            element: <ProtectedDashboard />,
            children: [
                { path: "solo", element: <ActiveGame /> },
                { path: "squad", element: <ActiveGameSenario variant="scenario" /> },
                { path: "corporate", element: <ActiveGameSenario variant="corporate" /> },
            ],
        },


        { path: "/activeGameScenario/consolePage/:scenarioId/:userId", element: <WhiteTeamConsole /> },

        // Scenario page in console layout
        {
            path: "/scenarioPage",
            element: <ProtectedScenarioConsole />,
            children: [{ index: true, element: <ScenarioPage /> }],
        },

        // Corporate (v2)
        {
            path: "/corporate",
            element: <ProtectedDashboard />,
            children: [
                {
                    path: "details/:userId",
                    element: (
                        <React.Suspense fallback={<LoaderImg />}>
                            <ScenarioDetailsVersion2 />
                        </React.Suspense>
                    ),
                },
                { path: "category", element: <ScenarioCategoryVersion2 /> },
            ],
        },

        // Caldera
        {
            path: "/mitreAttackAutomation",
            element: <ProtectedDashboard />,
            children: [{ index: true, element: <CalderaPage /> }],
        },

        // Fallback
        { path: "*", element: <PageNotFound /> },
    ];

    return useRoutes(routes);
};

export default Router;


