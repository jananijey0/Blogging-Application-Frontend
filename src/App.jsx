import { Route, Routes} from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";
import { createContext,useEffect,useState } from "react";
import {lookInSession} from "./common/session.jsx"
import Editor from './pages/editor.pages';
import HomePage from "./pages/home.page.jsx";
import SearchPage from "./pages/search.page.jsx";
import PageNotFound from "./pages/404.page.jsx";
import ProfilePage from "./pages/profile.page.jsx";
import BlogPage from "./pages/blog.page.jsx";
import SideNav from "./components/sidenavbar.component.jsx";
import ChangePassword from "./pages/change-password.page.jsx";
import EditProfile from "./pages/edit-profile.page.jsx";
import Notifications from "./pages/notifications.page.jsx";
import ManageBlog from "./pages/manage-blogs.page.jsx";
 export const UserContext = createContext({});
    //global state can access it from anywhere on the port - context

    const darkThemePref =() => window.matchMedia("(prefers-color-scheme: dark)").matches;
export const ThemeContext = createContext({});
    const App = () => {
    const [userAuth,setUserAuth] = useState({});
    const [theme, setTheme] = useState(()=> darkThemePref()? "dark":"light");
    
    useEffect(()=>
    {
        
 let userInSession = lookInSession("user");
 let ThemeInSession = lookInSession("theme");
userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({access_token: null})
if(ThemeInSession){
    setTheme(()=> {
        document.body.setAttribute('data-theme', ThemeInSession);
        return ThemeInSession;

    })
} else{
   document.body.setAttribute('data-theme', theme)
}
},[])  //runs only once when rendering is complete
   
    return (
            <ThemeContext.Provider value={{theme, setTheme}}>
            <UserContext.Provider value={{ userAuth, setUserAuth }}>
       <Routes>
        <Route path ='/editor' element ={<Editor/>}/>
        <Route path ='/editor/:blog_id' element ={<Editor/>}/>
        <Route Route path = '/' element ={<Navbar/>}>
        <Route index element = {<HomePage/>}/>
        <Route path="dashboard" element ={<SideNav/>}>
            <Route path ="blogs" element={<ManageBlog/>}/>
            <Route path ="notifications" element={<Notifications/>}/>
        </Route>
        <Route path="settings" element ={<SideNav/>}>
            <Route path ="edit-profile" element={<EditProfile/>}/>
            <Route path ="change-password" element={<ChangePassword/>}/>
        </Route>

        <Route  path = 'signin' element ={<UserAuthForm type= 'sign-in'/> }/>
        <Route  path = 'signup' element ={<UserAuthForm type= 'sign-up'/>}/>
        <Route  path = 'search/:query' element = {<SearchPage/>}/>
        <Route  path = 'user/:id' element = {<ProfilePage/>}/>
        <Route path ="blog/:blog_id" element = {<BlogPage/>}/>
        <Route path ='*'element ={<PageNotFound/>}/>
       
    </Route>
       </Routes>
       </UserContext.Provider>
       </ThemeContext.Provider>

    )
}

export default App;
