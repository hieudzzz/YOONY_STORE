import { useState, useEffect, useMemo } from "react";
import { Wheel } from "react-custom-roulette";

const ProbabilityWheel = ({ coupons }) => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // Khởi tạo các âm thanh
  const [spinSound] = useState(
    new Audio("../../../../src/assets/audio/conquay.mp3")
  );
  const [winSound] = useState(
    new Audio("../../../../src/assets/audio/votay.mp3")
  );

  // Định nghĩa 2 màu cố định
  const colors = ["#FF8C00", "#FEEFD8"]; // cam và trắng

  // Chuyển đổi coupons thành format phù hợp cho Wheel với 2 màu xen kẽ
  const data = useMemo(() => {
    return coupons.map((coupon, index) => ({
      option: coupon.name,
      style: {
        backgroundColor: colors[index % 2],
        textColor: index % 2 === 0 ? "#FEEFD8" : "#FF8C00", // Text màu trắng trên nền cam, text màu cam trên nền trắng
      },
      optionSize: 20,
      description: coupon.description,
      code: coupon.code,
      discount: `${coupon.discount}${
        coupon.discount_type === "percentage" ? "%" : "đ"
      }`,
    }));
  }, [coupons]);

  // Lấy mảng probability từ coupon
  const probabilities = coupons.map((coupon) => coupon.probability_percentage);

  useEffect(() => {
    if (mustSpin) {
      spinSound.loop = true;
      spinSound
        .play()
        .catch((error) => console.log("Audio playback failed:", error));
    } else {
      spinSound.pause();
      spinSound.currentTime = 0;
    }
    return () => {
      spinSound.pause();
      spinSound.currentTime = 0;
    };
  }, [mustSpin, spinSound]);

  const handleSpinClick = () => {
    if (!mustSpin) {
      setShowResult(false);
      const random = Math.random() * 100;
      let sum = 0;
      let selectedPrize = data.length - 1;

      for (let i = 0; i < probabilities.length; i++) {
        sum += probabilities[i];
        if (random <= sum) {
          selectedPrize = i;
          break;
        }
      }

      setPrizeNumber(selectedPrize);
      setMustSpin(true);
    }
  };

  const handleStopSpinning = () => {
    setMustSpin(false);
    setShowResult(true);
    winSound
      .play()
      .catch((error) => console.log("Audio playback failed:", error));
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative z-50">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data}
          onStopSpinning={handleStopSpinning}
          backgroundColors={colors}
          textColors={["#FEEFD8", "#FF8C00"]}
          outerBorderColor="#ff9900"
          outerBorderWidth={20}
          innerBorderColor="#FEEFD8"
          innerBorderWidth={20}
          innerRadius={20}
          radiusLineColor="black"
          radiusLineWidth={0}
          fontSize={16}
          textDistance={60}
          spinDuration={0.45}
        />
        <button
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                     p-5 rounded-full bg-gradient-to-br from-primary/50 to-primary/90
                     text-white font-bold transform transition-all 
                     hover:from-primary/75 hover:to-primary/90 active:scale-95 
                     disabled:opacity-50 disabled:cursor-not-allowed text-2xl shadow-btn-wheel"
          onClick={handleSpinClick}
          disabled={mustSpin}
        >
          GO
        </button>
      </div>
      {showResult && (
        <div className="space-y-4 w-full max-w-md">
          <div
            className="p-4 rounded-lg text-center font-bold animate-fade-in"
            style={{
              backgroundColor: colors[prizeNumber % 2],
              color: prizeNumber % 2 === 0 ? "#FEEFD8" : "#FF8C00",
              animation: "fadeIn 0.4s ease-in",
            }}
          >
            <p className="text-xl mb-2">Chúc mừng! Bạn đã trúng:</p>
            <p className="text-2xl">{data[prizeNumber].option}</p>
            <p className="text-lg mt-2">Giảm: {data[prizeNumber].discount}</p>
            <p className="text-sm mt-2">Mã: {data[prizeNumber].code}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProbabilityWheel;
