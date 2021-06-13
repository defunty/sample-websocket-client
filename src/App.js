import React, { useState, useEffect }from 'react'

function App(props) {
  const [loginState,setLoginState] = useState(false);
  const [userName, setUserName] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  // init
  useEffect(() => {
    props.client.onopen = () => {
      console.log('Websocket Client Connected')
    }
    props.client.onmessage = (message) => {
      console.log('onMessage')
      const dataFromServer = JSON.parse(message.data);
      console.log(`On Message`, dataFromServer)
      if (dataFromServer.type === 'message') {
        console.log('setMessages')
        setMessages(prevMessages => [...prevMessages, {msg: dataFromServer.msg, user: dataFromServer.user}])
        if (userName === dataFromServer.user) {
          setInputText('');
        }
      }
    }
  }, [])

  useEffect(() => {
    console.log('useeffect')
  })

  const onButtonClicked = (value) => {
    console.log('send')
    props.client.send(JSON.stringify({
      type: "message",
      msg: value,
      user: userName
    }));
  }

  return (
    <div>
      app component
      {loginState ? 
      <div>
        <div>You're {userName}</div>
        <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)}/>
        <button onClick={() => onButtonClicked(inputText)}>Send Message</button>
        {messages.map((message, index) => <p key={index}>message: {message.msg}, user: {message.user}</p>)}
      </div>
      :
      <div>
        <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
        <button onClick={() => setLoginState(true)}>Login</button>
      </div>
      }
    </div>
  )
}

export default App;