import React from "react"
import { Route, Switch } from "react-router-dom"
import Auth from "./pages/auth"
import NotFound from "./components/NotFound"
import Home from "./pages/Home"
import Dashboard from "./pages/DashBoard"
import Login from "./pages/login"
import Signup from "./pages/signup"
import Admin from "./pages/admin"
import ProtectedRoute from "./components/protectedRoute"
import CreatePost from "./pages/createPost"
import Explore from "./pages/explore"

const Router = () => (
  <Switch>
    <Route path="/" exact component={Auth} />
    <Route path="/home" exact component={Home} />
    <Route path="/login" exact component={Login} />
    <Route path="/explore" exact component={Explore} />
    <Route path="/signup" exact component={Signup} />
    <Route path="/post" exact component={CreatePost} />
    <Route path="/admin" exact component={Admin} />
    <ProtectedRoute path="/dashboard" component={Dashboard} />
    <Route component={NotFound} />
  </Switch>
)
export default Router
