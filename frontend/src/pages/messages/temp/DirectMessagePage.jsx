/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import DirectMessageCard from "./DirectMessageCard";
import MessageService from "../../../services/MessageService";
import UnauthorizedError from "../../../errors/UnauthorizedError";
import ForbiddenError from "../../../errors/ForbiddenError";

const DirectMessagePage = ({ userName }) => {
  const [newMessage, setNewMessage] = useState({
    message: "",
  });

  const [messages, setMessages] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMessage((prevMessage) => ({
      ...prevMessage,
      [name]: value,
    }));
  };
  const fetchMessages = async () => {
    try {
      const response = await MessageService.getGroupMessages(groupName);
      //id is the date/time created
      console.log("Response: ", response);
      const sortedByTime = response.sort((a, b) => {
        parseInt(a.id) - parseInt(b.id);
      });
      setMessages(sortedByTime);
    } catch (error) {
      console.log(error);
      if (error instanceof UnauthorizedError) {
        //TODO: navigate to login and display a message
      } else if (error instanceof ForbiddenError) {
        //TODO: display message and navigate to home page
      } else {
        //TODO: display message
      }
    }
  };
  const sendMessage = async () => {
    try {
      await MessageService.sendGroupMessage({ ...newMessage, userName });
      setNewMessage({ message: "" });
      console.log("success");
      fetchMessages();
    } catch (error) {
      console.log(error);
      if (error instanceof UnauthorizedError) {
        //TODO: navigate to login and display a message
      } else if (error instanceof ForbiddenError) {
        //TODO: display message and navigate to home page
      } else {
        //TODO: display message
      }
    }
  };
  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="flex flex-col items-center flex-grow-[10] max-h-[90vh]">
      <div className="overflow-y-auto border border-gray-300  mx-10 mt-10 w-[95vw] max-w-[1000px] flex-grow-[5] ">
        {messages.map((message, index) => (
          <DirectMessageCard key={index} message={message} />
        ))}
      </div>

      <div className="bg-gray-100 p-5 flex items-center justify-center w-[95vw] max-w-[1000px] mb-[2vh] ">
        <textarea
          name="message"
          value={newMessage.message}
          onChange={handleInputChange}
          className="border rounded-md p-2 w-full mr-5 hover-bg-gray-100 hover:border-black"
        />

        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-300 text-white px-4 py-2 rounded-md font-bold shadow-md"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default DirectMessagePage;
