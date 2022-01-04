import { Routes, Route, Link } from 'react-router-dom';

import './App.css';

const Hello = () => {
  return (
    <div>
      <span>hello</span>
    </div>
  );
};

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

export default function App() {
  return (
    <div>
      <span>routes</span>
      <Routes location="/">
        <Route path="/" element={<Hello />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </div>
  );
}
