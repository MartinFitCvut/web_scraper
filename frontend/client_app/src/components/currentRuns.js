import React, { useEffect, useState } from 'react';

function SSEComponent({ name }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource(`http://localhost:5000/events/${name}`);

    eventSource.onmessage = function(event) {
      const data = JSON.parse(event.data);
      const newMessage = data.status;
      setMessages(newMessage);
    };

    return () => {
      eventSource.close();
    };
  }, [name]);

  return (
    <div>
      {messages}
    </div>
  );
}

export default SSEComponent;
