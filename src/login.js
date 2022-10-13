import React, {
  useContext,
  useEffect,
  useState
} from 'react';
import { UserContext } from "./UserProvider";

import {
  Navigate,
  useLocation,
  useNavigate
} from 'react-router-dom'
import { auth } from './firebase';
import { message, Input, Button } from "antd";

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});


const Login = (props) => {

  let location = useLocation();
  let navigate = useNavigate();

  const user = useContext(UserContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [form, setForm] = useState('');
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);


  useEffect(() => {

    // console.log(JSON.stringify(user))
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user]);

  function onSubmit() {

    let from = location.state?.from?.pathname || "/";

    switch (form) {
      case 'forgot':
        message.info("Sending email...")

        break;
      case 'signup':
        message.info("Creating account...")
        auth.doCreateUserWithEmailAndPassword(email, password)
          .then((e) => {
            e.user.getIdToken().then(k => {

              console.log(k)
              localStorage.setItem("nyjob-id-token", k);
              e.user.sendEmailVerification().then(function () {
                // Email sent.
                console.log("322 account...")
              }).catch(function (error) {
                // An error happened.
                console.log("555 account...")
              });
            })

            setEmail('')
            setPassword('')
            message.destroy()
            message.success('Welcome!')
            setRedirectToReferrer(true)
          })
          .catch(er => {
            message.destroy()
            message.error(er.message)
          });
        break;

      default:
        message.info("Logging in...")
        auth.doSignInWithEmailAndPassword(email, password)
          .then((e) => {
            e.user.getIdToken().then(e => {

              console.log(e)
              localStorage.setItem("nyjob-id-token", e);
            })

            setEmail('')
            setPassword('')
            message.destroy()
            message.success('Welcome!')
            navigate(from, { replace: true });
          })
          .catch(er => {
            message.destroy()
            message.error(er.message)
          });
        break;
    }
  }

  function loginla() {
    let k = (process.env.REACT_APP_SA)
    console.log(k)
    setEmail(process.env.REACT_APP_EMAIL)
    setPassword(process.env.REACT_APP_PW)
  }

  function signup() {
    setForm('signup')
  }

  function signin() {
    setForm('')
  }
  function forgot() {
    setForm('forgot')
  }
  function handleKey(event) {
    // 'keypress' event misbehaves on mobile so we track 'Enter' key via 'keydown' event
    if (event.key === 'Enter') {
      if (email !== "" && password !== "") {
        event.preventDefault();
        event.stopPropagation();
        onSubmit();
      }
    }
  }

  const from = props.lastLocation || '/'



  const isInvalid =
    password === '' ||
    email === '';

  // if (redirectToReferrer === true) {
  //   return <Redirect to={from} />
  // }


  if (!user)
    return (
      <div className="loginform" onKeyDown={handleKey}>
        {process.env.NODE_ENV !== 'production' ?
          <Button onClick={loginla}>CHEAT LOG IN</Button> :
          <div />
        }
        <div id='logoimg'>
        <a className='properp' href='/'>
          <h1>nyjob</h1>
        </a>
        </div>
        {(form == 'forgot') && (
          <div>
            <form className="inputforma">
              <Input
                size="large"
                className="inputforma"
                value={email}
                onChange={event => setEmail(event.target.value)}
                type="text"
                placeholder="Email Address"
              />
              <Button type="primary" size="large" className="buttona" disabled={isInvalid} onClick={onSubmit}>
                Reset Password
              </Button>
            </form>
            <br />
            <br />
            <Button onClick={signin}>Sign In</Button>
          </div>
        )}
        {(form == 'signup') && (
          <div>
            <form className="inputforma">
              <Input
                size="large"
                className="inputforma"
                value={email}
                onChange={event => setEmail(event.target.value)}
                type="text"
                placeholder="Email Address"
              />
              <Input
                size="large"
                className="inputforma"
                value={password}
                onChange={event => setPassword(event.target.value)}
                type="password"
                placeholder="Password"
              />

              <Button type="primary" size="large" className="buttona" disabled={isInvalid} onClick={onSubmit}>
                Create Account
              </Button>
            </form>
            <br />
            <br />
            <Button onClick={signin}>Sign In</Button>
          </div>
        )}
        {(form == '') && (
          <div>
            <form className="inputforma">
              <Input
                size="large"
                className="inputforma"
                value={email}
                onChange={event => setEmail(event.target.value)}
                type="text"
                placeholder="Email Address"
              />
              <Input
                size="large"
                className="inputforma"
                value={password}
                onChange={event => setPassword(event.target.value)}
                type="password"
                placeholder="Password"
              />

              <Button type="primary" size="large" className="buttona" disabled={isInvalid} onClick={onSubmit}>
                Sign In
              </Button>
            </form>
            <br />
            <br />
            <Button onClick={signup}>Create an account</Button>
            <br />
            <br />
            <Button onClick={forgot}>Forgot password</Button>
          </div>
        )}
        <br />
        <br />
       

      </div>
    )
}

export default Login;