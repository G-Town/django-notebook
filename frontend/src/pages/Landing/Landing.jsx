import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div>
      <h1>Welcome to EtherNote!</h1>
      <p>Your amazing note-taking app.</p>
      <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
      <hr />
      <p>If you&apos;re already logged in, go to your <Link to="/dashboard">Dashboard</Link>.</p>
    </div>
  );
}

export default Landing;
