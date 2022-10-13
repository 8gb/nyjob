import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "./UserProvider";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
  Outlet,
} from 'react-router-dom'
import { Breadcrumb, Card } from 'antd';
import { Layout, Button, Divider } from "antd";
import Login from './login';
import { auth } from './firebase';

import "./App.css";

import ProjectList from './projectlist';
import ChartPage from "./chart";

const ButtonGroup = Button.Group;

function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return (
      <Component
        {...props}
        router={{ location, navigate, params }}
      />
    );
  }

  return ComponentWithRouterProp;
}

const Public = () => <h2>This page is public, no sign in required.</h2>
const NoWhere = () => <h2>??</h2>






const AuthButton = withRouter(({ history }) => (
  <Bb hh={history} />
))

const Bb = (props) => {
  const history = props.hh
  const user = useContext(UserContext);

  if (user === 'loading')
    return (
      <div></div>
    )

  return (

    user && (
      <div>
        <Card className='margin-low'>
          <a className='properp' href='/'>
            nyjob
          </a>
          <Divider type="vertical" />
          <Button size="large" onClick={e => {
            e.preventDefault()
            auth.doSignOut().then(function () {
              // history.push('/')
            }).catch(function (error) {
              message.error('signout error')
            })
          }}>Sign out
          </Button>
          <ButtonGroup size='large' className="np" >
            <Button type='primary' size='large' ghost>
              <Link to='/stats'>
                Stats
              </Link>
            </Button>
            <Button type='primary' >
              <Link to='/settings'>
                Settings
              </Link>
            </Button>
          </ButtonGroup>
        </Card>
        <Card className='crumbb'>
          <Bread />
        </Card>
      </div>
    )
  )
}

// <div>
//   <Card className='margin-low'>
//     <div className='properp'>Welcome!</div>
//     <Divider type="vertical" />
//     <Button size="large" onClick={() => {
//       auth.doSignOut().then(function () {
//         // Sign-out successful.
//         fakeAuth.signout(() => history.push('/'))
//       }).catch(function (error) {
//         console.log('signout error')
//       })
//     }}>Sign out
//     </Button>
//     <Divider type="vertical" />
//     <Button type='primary' size='large' ghost><Link to='/changepw'>
//       Change Password
//     </Link></Button>
//     <ButtonGroup size='large' className="np" >
//       <Button type='primary' ><Link to='/dashboard/events'>
//         Events
//       </Link></Button>
//       <Button type='primary' ><Link to='/dashboard/projects'>
//         Projects
//       </Link></Button>
//     </ButtonGroup>
//   </Card>
// </div>









const breadcrumbNameMap = {
  '/admin': 'Admin',
  '/login': 'Login',
  '/dashboard': 'Dashboard',
  'packages': 'Packages',
  '/dashboard/events': 'Events',
  '/dashboard/projects': 'Projects',
  '/dashboard/projects/:id': 'ff',
};
const Bread = withRouter((props) => {
  const { location } = props;
  // const pathSnippets = location.pathname.split('/').filter(i => i);
  const pathSnippets = []
  // var id = pathSnippets[2];
  // console.log(pathSnippets)

  var name_packages = 'projectname';

  // if url is packages of individual project
  if (pathSnippets.length > 3) {
    // pathSnippets.splice(2, 1)
    name_packages = pathSnippets[3];
  }

  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    if (index == 2)
      return
    var url = `/${pathSnippets.slice(0, index + 1).join('/')}`;

    // console.log('url' + url)
    if (url.includes('/packages')) {
      url = 'packages'
    }

    if (index == 3) {
      return (
        <Breadcrumb.Item key={url}>
          <Link to={url}>
            {name_packages}
          </Link>
        </Breadcrumb.Item>
      );
    } else {
      return (
        <Breadcrumb.Item key={url}>
          <Link to={url}>
            {index != 2 ? breadcrumbNameMap[url] : name_packages}
          </Link>
        </Breadcrumb.Item>
      );
    }
  });

  const breadcrumbItems = [(
    <Breadcrumb.Item key="home">
      <Link to="/">Home</Link>
    </Breadcrumb.Item>
  )].concat(extraBreadcrumbItems);

  return (
    <Breadcrumb>
      {breadcrumbItems}
    </Breadcrumb>

  );
});

const PrivateRoute2 = ({ component: Component, ...rest }) => {

  const user = useContext(UserContext);

  return (
    <Route {...rest} render={(props) => (
      user
        ? (
          user.emailVerified ?
            <Component {...props} />
            :
            <Verify />
        )
        : <Login lastLocation={props.location.pathname} />
    )} />
  );
}

function RequireAuth({ children }) {
  const user = useContext(UserContext);

  let location = useLocation();

  if (user === 'loading')
    return (
      <div className="center-star">

        <img src={process.env.PUBLIC_URL + '/loading.gif'} />
      </div>
    )

  if (!user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    user
      ? (
        user.emailVerified ?
          children
          :
          <Verify />
      )
      : <Login lastLocation={props.location.pathname} />
  );
}

function Layout2() {
  return (

    <div>
      <div className="oh">
        <AuthButton className="nq" />
      </div>
      <Outlet />
    </div>
  );
}

function Landy() {
  const user = useContext(UserContext);

  let location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  } else {
    return <Navigate to="/dash" state={{ from: location }} replace />;

  }
}

export default function AuthExample() {
  return (
    <Router>
      <div>
        <Layout className="bigold">

          <Routes>
            <Route element={<Layout2 />}>
              <Route path="/" element={
                <RequireAuth>
                  <Landy />
                </RequireAuth>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/public" element={<Public />} />
              <Route
                path="/stats"
                element={
                  <RequireAuth>
                    <ChartPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/dash"
                element={
                  <RequireAuth>
                    <ProjectList />
                  </RequireAuth>
                }
              />
              <Route path="*" element={<NoWhere />} />

            </Route>
          </Routes>

          {/* <Route path="/public" component={Public} /> */}

          {/* <Route exact path='/' element={<Login />}>
            </Route> */}

          {/* below is private route */}
          {/* <Route exact path='/dashboard' component={Dashboard} />
            <Route exact path='/changepw' component={ChangePW} />
            <Route exact path='/admin' component={Landing} />

            <Route exact path='/dashboard/projects' component={ProjectList} />
            <Route path='/dashboard/projects/:id/:name/packages' component={Values} />
            <Route path='/dashboard/projects/:id/:name' component={EditableTable} />

            <Route exact path='/dashboard/events' component={Events} />
            <Route path='/dashboard/events/:id/:title' component={Media} /> */}

        </Layout>
      </div>
    </Router>
  )
}