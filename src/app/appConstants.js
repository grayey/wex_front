export const BID_STAGES = {
    BID_INIT:"OWNER_ACCEPT",
    OWNER_ACCEPT:"BUYER_PAYS",
    BUYER_PAYS:"PRODUCT_ENROUTE",
    PRODUCT_ENROUTE:"PRODUCT_DELIVERED",
    PRODUCT_DELIVERED:"RECEPTION_CONFIRMED",
    RECEPTION_CONFIRMED:"SELLER_IS_PAID",
    SELLER_IS_PAID:"SALE_COMPLETE"
}

export const BID_STAGE_PERCENTAGES = {
    BID_INIT:"20",
    OWNER_ACCEPT:"30",
    BUYER_PAYS:"50",
    PRODUCT_ENROUTE:"60",
    PRODUCT_DELIVERED:"70",
    RECEPTION_CONFIRMED:"80",
    SELLER_IS_PAID:"100"
    
}

export const BID_STAGE_TEXT = {
    OWNER_ACCEPT:"Initiated. Awaiting acceptance",
    BUYER_PAYS:"Accepted. Awaiting buyer's payment",
    PRODUCT_ENROUTE:"Paid. Awaiting shipping",
    PRODUCT_DELIVERED:"En route. Awaiting delivery",
    RECEPTION_CONFIRMED:"Delivered. Awaiting confirmation",
    SELLER_IS_PAID:"Confirmed. Awaiting pay transfer.",
    SALE_COMPLETE:"Seller paid. Sale complete."

}


export const BID_STAGE_SELLER_INPUTS = {
    OWNER_ACCEPT:{
        value:"OWNER_ACCEPT",
        label:"ACCEPT"
    },
    PRODUCT_ENROUTE:{
        value:"PRODUCT_ENROUTE",
        label:"PRODUCT ON THE WAY"
    },
    PRODUCT_DELIVERED:{
        value:"PRODUCT_DELIVERED",
        label:"PRODUCT DELIVERED"
    },
}

export const BID_STAGE_BUYER_INPUTS = {
    BUYER_PAYS:{
        value:"BUYER_PAYS",
        label:"PAY"
    },
    RECEPTION_CONFIRMED:{
        value:"RECEPTION_CONFIRMED",
        label:"PRODUCT RECEIVED"
    },
}

export const BID_MOVEMENT_MESSAGES = {
    OWNER_ACCEPT:{
        mainText:"You are about to accept this bid",
        subText:"Buyer can now make payment?",
        finalText:"Bid accepted."
    },
    PRODUCT_ENROUTE:{
        mainText:"Confirming that the product is now on its way",
        subText:"The buyer will be notified",
        finalText:"Buyer has been notified."
    },
    PRODUCT_DELIVERED:{
        mainText:"Confirming that the product has now been delivered",
        subText:"The buyer will have to confirm receipt.",
        finalText:"Buyer has been notified."

    },
    BUYER_PAYS:{
        mainText:"You about to make payment",
        subText:"The quantity will now be reserved for you.",
        finalText:"Redirecting.."

    },
    RECEPTION_CONFIRMED:{
        mainText:"Confirming that you have received the product",
        subText:"The seller will now be paid.",
        finalText:"Thank you."

    },
    CANCEL:{
        mainText:"You about to cancel this bid.",
        subText:"You cannot revert this action.",
        finalText:"Bid cancelled."

    }

}