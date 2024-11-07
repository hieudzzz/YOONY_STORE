const ShadowCardPolicy = () => {
  return (
    <div className="absolute">
      <div className="w-5 h-5 bg-[#FFFAF3]/15 absolute top-8 -left-10 rounded-full slide "></div>
      <div className="w-5 h-5 bg-[#FFFAF3]/15 absolute left-16  rounded-full slide"></div>
      <div className="w-5 h-5 bg-[#FFFAF3]/15 absolute -left-16 -top-5   rounded-full slide"></div>
      <div className="w-5 h-5 bg-[#FFFAF3]/15 absolute -left-28 -top-12  rounded-full slide"></div>
      <div className="w-12 h-12 bg-[#FFFAF3]/15 absolute -top-5 -translate-y-12 translate-x-16 rounded-full"></div>
    </div>
  );
};

export default ShadowCardPolicy;
