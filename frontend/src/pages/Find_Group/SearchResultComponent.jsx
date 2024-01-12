/* eslint-disable react/prop-types */
import UnauthorizedError from "../../errors/UnauthorizedError";
import GroupService from "../../services/GroupService";
const SearchResultComponent = ({ group }) => {
  const { name, description, imageUrl } = group;
  const joinGroup = async () => {
    try {
      await GroupService.userJoinGroup(name);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        //TODO: logg out and display message
      } else {
        //TODO: display message
      }
    }
    console.log("Joined group: ", name);
  };
  return (
    <div className="shadow-md border-sky-200 border-[2px] flex m-5 list-none ">
      <img src={imageUrl} alt="" className="m-4 h-[80px] object-cover rounded-full aspect-square "/>
      <div>
      <h1 className="font-roboto text-2xl font-bold text-[#484bff]">{name}</h1>
      <p className="m-0 w-full text-[#30638e] break-words p-2">{description}</p>
      </div>
      <button onClick={joinGroup} className="bg-blue-500 hover:bg-blue-300 text-white px-4 py-2 rounded-md font-bold shadow-md h-[40%] ml-auto my-10 mx-5">Join</button>
    </div>
  );
};

export default SearchResultComponent;