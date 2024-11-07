import ProbabilityWheel from "./ProbabilityWheel"

const EventUser = () => {
    const coupons=[
        {
            "id": 2,
            "name": "coupon2",
            "description": "132132",
            "code": "13123231",
            "discount": 31,
            "discount_type": "fixed",
            "winning_probability": 0.1,
            "probability_percentage": 11.11
        },
        {
            "id": 3,
            "name": "coupon3",
            "description": "2313",
            "code": "1233",
            "discount": 1233,
            "discount_type": "percentage",
            "winning_probability": 0.1,
            "probability_percentage": 11.11
        },
        {
            "id": 4,
            "name": "coupon4",
            "description": "123132",
            "code": "12323",
            "discount": 2133,
            "discount_type": "fixed",
            "winning_probability": 0.1,
            "probability_percentage": 11.11
        },
        {
            "id": 5,
            "name": "coupon5",
            "description": "123132",
            "code": "12323",
            "discount": 2133,
            "discount_type": "fixed",
            "winning_probability": 0.1,
            "probability_percentage": 11.11
        },
        {
            "id": 6,
            "name": "coupon6",
            "description": "123132",
            "code": "12323",
            "discount": 2133,
            "discount_type": "fixed",
            "winning_probability": 0.1,
            "probability_percentage": 11.11
        },
        {
            "id": 7,
            "name": "coupon7",
            "description": "123132",
            "code": "12323",
            "discount": 2133,
            "discount_type": "fixed",
            "winning_probability": 0.1,
            "probability_percentage": 11.11
        },
        {
            "id": 8,
            "name": "coupon8",
            "description": "123132",
            "code": "12323",
            "discount": 2133,
            "discount_type": "fixed",
            "winning_probability": 0.1,
            "probability_percentage": 11.11
        },
        {
            "id": 9,
            "name": "coupon9",
            "description": "123132",
            "code": "12323",
            "discount": 2133,
            "discount_type": "fixed",
            "winning_probability": 0.1,
            "probability_percentage": 11.11
        },
        
    ]
  return (
    <div>
        <ProbabilityWheel coupons={coupons} />
    </div>
  )
}

export default EventUser