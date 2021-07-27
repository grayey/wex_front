import * as apiService from "./apiService";

export default class BidService {
  constructor() {}


  /**
   *
   * @param {*} bidData
   * this method creates a new bid
   */
  async createBid(bidData) {
    const url = "bids/";
    return await apiService.post(url, bidData);
  }

  /**
   *
   * @param {*} bid
   * @param {*} id
   * This method updates a bid
   */
  async updateBid(bid, id) {
    const url = `bids/${id}/`;
    return await apiService.put(url, bid);
  }

  /**
   *
   * @param {*} bid
   * @param {*} id
   * This method updates a bid
   */
  async getBidById(idOrSlug) {
    const url = `bids/${idOrSlug}/`;
    return await apiService.get(url);
  }

  /**
   *
   * @param {*} bid
   * This method deletes a bid
   */
  async deleteBid(bid) {
    const url = `bids/${bid._id}`;
    return await apiService.del(url);
  }

  /**
   *
   * @param {*} bid
   * This method toggles a bid
   */
  async toggleBid(bid) {
    bid.status = !bid.status;
    return this.updateBid(bid, bid._id);
  }

   /**
   *
   * @param {*} bid
   * This method saves a rating for a bid
   */
    async saveBidReview(ratingData, updateId='') {
      const url = `reviews/${updateId}`;
      const method = updateId ? 'put' : 'post';
      return apiService[method](url, ratingData);
    }



  /**
   * This method fetches a buyer's bids
   * @param {*} authUserId 
   * @returns 
   */
  getAllBidsBBuyerId =  async (authUserId) =>{
    const url = `bids/user/${authUserId}/`;
    return await apiService.get(url);
  }

  /**
   * This method fetches a user's wallet information and transactions
   * @param {*} authUserId 
   * @returns 
   */
   getWalletByUserId =  async (authUserId) =>{
    const url = `wallet-transactions/wallet/${authUserId}/`;
    return await apiService.get(url);
  }

  /**
   * 
   * @param {*} authUserId 
   * @param {*} data 
   * @returns 
   */
  createTransactionAndUpdateWallet =  async (data) => {
    const url = `wallet-transactions/`;
    return await apiService.post(url, data);

  }



}
