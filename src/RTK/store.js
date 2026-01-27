import { configureStore } from '@reduxjs/toolkit'
import toggleTheme from '../RTK/features/theme/themeSlice'
import userReducer from '../RTK/features/userDetails/userSlice'
import CtfReducer from '../RTK/features/CtfPopUp/index'
import CorporateReducer from '../RTK/features/CorporatePopup/index'
import ScenarioReducer from '../RTK/features/ScenarioPopup/index'
import WebScenarioReducer from '../RTK/features/WebScenarioPopup/index'
import LeftReducer from '../RTK/features/Left/index'
import {CTFCategoriesSlice} from "./admin/CTF/CTFCategoriesSlice";
import {scenarioCategoriesSlice} from "./admin/scenario/scenarioCategoriesSlice";
import {allUsersSlice} from "./admin/users/allUsersSlice";
import networkReducer from './features/Infra/networkSlice'
import routerReducer from '../RTK/features/Infra/routerSlice'
import instanceReducer from '../RTK/features/Infra/instanceSlice'
import firewallReducer from '../RTK/features/Infra/firewallSlice'
import {news} from './features/dashboard/news'
import {forgotPasswordSlice} from "./features/forgotPassword/forgotPasswordSlice";
import PathUrl from './features/path/index'
import {webScenarioCategoriesSlice} from "./admin/webScenarios/webScenarioCategoriesSlice";

const store = configureStore({
  reducer: {
    theme: toggleTheme,
    user: userReducer,
    ctfBoolean: CtfReducer,
    scenarioBoolean: ScenarioReducer,
    webscenarioBoolean: WebScenarioReducer,
    corporateBoolean: CorporateReducer,
    LeftBoolean: LeftReducer,
    network: networkReducer,
    router: routerReducer,
    instance:instanceReducer,
    firewall:firewallReducer,
    newApi:news.reducer,
    webScenarioCategories: webScenarioCategoriesSlice.reducer,
    CTFCategories: CTFCategoriesSlice.reducer,
    scenarioCategories: scenarioCategoriesSlice.reducer,
    allUsers: allUsersSlice.reducer,
    forgotPassword: forgotPasswordSlice.reducer,
    pathUrl: PathUrl
  },
  middleware:(defaultMiddleware) => defaultMiddleware().concat(news.middleware),
  devTools: process.env.REACT_APP_PROJECT_ENV !== 'production',
})

export default store