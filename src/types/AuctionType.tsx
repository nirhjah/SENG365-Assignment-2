export interface AuctionType {
    auctionId: number;
    title: string;
    description: string;
    categoryId: number;
    endDate: string;
    reserve: number;
    highestBid: number;
    numBids: number;
    sellerId: number;
    sellerFirstName: string;
    sellerLastName: string;
}