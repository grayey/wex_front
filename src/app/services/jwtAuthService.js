import axios from "axios";
import localStorageService from "./localStorageService";
import jwt_decode from "jwt-decode";

class JwtAuthService {
  
  user = {
    userId: "1",
    role: 'ADMIN',
    displayName: "Watson Joyce",
    email: "watsonjoyce@gmail.com",
    photoURL: "/assets/images/face-7.jpg",
    age: 25,
    token: "faslkhfh423oiu4h4kj432rkj23h432u49ufjaklj423h4jkhkjh"
  }

  loginWithEmailAndPassword = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.user);
      }, 1000);
    }).then(data => {
      this.setSession(data.token);
      this.setUser(data);
      return data;
    });
  };

  loginWithToken = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.user);
      }, 100);
    }).then(data => {
      this.setSession(data.token);
      this.setAuthUser(data);
      return data;
    });
  };

  

  logout = () => {
    this.setSession(null);
    this.removeUser();
  }

  setSession = token => {
    if (token) {
      localStorage.setItem("wex_commerce_user", token);
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    } else {
      localStorage.removeItem("wex_commerce_user");
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  getAuthUser = () => {
    const token = localStorageService.getItem('wex_commerce_user');
    const authUser = jwt_decode(token);
    return authUser;
  }

  setAuthUser = (token) => {    
    // localStorageService.setItem("auth_user", user);
    this.setSession(token);
  }

  removeUser = () => {
    localStorage.removeItem("auth_user");
  }
}

export default new JwtAuthService();
