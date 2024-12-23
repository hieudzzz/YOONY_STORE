import ProbabilityWheel from "./ProbabilityWheel"

const EventUser = () => {
    const coupons=[
        {
            "id": 2,
            "name": "Hiếu",
            "description": "132132",
            "code": "131234231",
            "discount": 31,
            "discount_type": "fixed",
            "winning_probability": 0.1,
            "probability_percentage": 50
        },
        {
            "id": 3,
            "name": "Chinh",
            "description": "2313",
            "code": "1233",
            "discount": 1233,
            "discount_type": "percentage",
            "winning_probability": 0.1,
            "probability_percentage": 50
        },
        
    ]
  return (
    <div>
        <ProbabilityWheel coupons={coupons} />
    </div>
  )
}

export default EventUser