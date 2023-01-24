import "./style.css";
import logo from "./assets/logo.svg";

<%_if(services.express){_%>
import React, { useEffect, useState } from 'react';
<%_}_%>

const App = () => {
  <%_if(services.express){_%>
   const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/');
      const data = await response.json();
      setMessage(data.message);
    }
    fetchData();
  }, []);
  <%_}_%>

  return (
    <div className='container'>
      <%_if(services.express){_%>
      <h1>{message}</h1>
      <%_}else{_%>
      <h1>Simple React App made with Smartmake!</h1>
      <%_}_%>
      <img src={logo} alt="Smartmake Logo" id="logo"/>
    </div>
  );
};
export default App;
