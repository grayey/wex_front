import * as apiService from "./apiService";

class ChatService {
  constructor() {}

   getContactById = async (id) => {
       const url = `chat/contacts/${id}`
    return apiService.get(url);
  };

   getRecentContact = async (id) => {
    const url = `chat/contacts/recent/${id}`

    return apiService.get(url);
  };

   getAllContact = async (currentUserId) => {
    const url = `chat/contacts/all/${currentUserId}`

    return apiService.get(url);
  };

  getChatRoomByContactId = async (currentUser, contactId) => {
    return apiService.get("chat/chat-room", { data: { currentUser, contactId } });
  };

  deleteMessage = async (message) => {
    return apiService.post("chat/delete", message);
  };

  sendNewMessage = async (message) => {
    return apiService.post("chat/add", message);
  };

  updateMessage = async (message) => {
    return apiService.post("chat/update", message);
  };
  
 
}

export default new ChatService();