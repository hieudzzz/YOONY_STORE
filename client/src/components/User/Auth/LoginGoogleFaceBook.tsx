import instance from "../../../instance/instance";

const LoginGoogleFaceBook = () => {
  const handleLoginGoogle = async () => {
    try {
      const {data:responseCreatLogin} = await instance.get("auth/google");
      window.location.assign(responseCreatLogin.url);
    } catch (error) {
      console.log(error);
    }
  };
  const handleLoginFacebook = async () => {
    try {
        const {data: responseCreatLogin} = await instance.get("auth/facebook");
        if (responseCreatLogin?.url) {
            window.location.assign(responseCreatLogin.url);
        } else {
            throw new Error('Facebook login URL not found');
        }
        
    } catch (error) {
        console.error('Facebook login error:', error);
    }
};
  return (
    <div className="flex items-center justify-center gap-3">
      {/* <button
        type="button"
        onClick={handleLoginFacebook}
        className="flex items-center gap-2 py-2 px-3 rounded-full border border-[#f1f1f1]"
      >
        <svg
          className="size-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.001 2C6.47813 2 2.00098 6.47715 2.00098 12C2.00098 16.9913 5.65783 21.1283 10.4385 21.8785V14.8906H7.89941V12H10.4385V9.79688C10.4385 7.29063 11.9314 5.90625 14.2156 5.90625C15.3097 5.90625 16.4541 6.10156 16.4541 6.10156V8.5625H15.1931C13.9509 8.5625 13.5635 9.33334 13.5635 10.1242V12H16.3369L15.8936 14.8906H13.5635V21.8785C18.3441 21.1283 22.001 16.9913 22.001 12C22.001 6.47715 17.5238 2 12.001 2Z"
            fill="#007AFF"
          />
        </svg>
        Facebook
      </button> */}
      <button
        type="button"
        onClick={handleLoginGoogle}
        className="flex items-center gap-2 py-2 px-3 rounded-full border border-[#f1f1f1]"
      >
        <svg
          className="size-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_247_676)">
            <path
              d="M23.9873 12.2245C23.9873 11.2413 23.9057 10.5238 23.729 9.77966H12.239V14.2176H18.9833C18.8474 15.3205 18.1132 16.9815 16.4814 18.0976L16.4585 18.2462L20.0915 20.9964L20.3431 21.0209C22.6547 18.9347 23.9873 15.8653 23.9873 12.2245Z"
              fill="#4285F4"
            />
            <path
              d="M12.2391 23.9176C15.5433 23.9176 18.3171 22.8545 20.3432 21.0209L16.4815 18.0976C15.4481 18.8018 14.0611 19.2934 12.2391 19.2934C9.00291 19.2934 6.25622 17.2074 5.27711 14.324L5.13359 14.3359L1.35604 17.1927L1.30664 17.3269C3.31906 21.2334 7.45273 23.9176 12.2391 23.9176Z"
              fill="#34A853"
            />
            <path
              d="M5.27726 14.324C5.01892 13.5799 4.8694 12.7826 4.8694 11.9588C4.8694 11.1349 5.01892 10.3377 5.26367 9.5936L5.25683 9.43513L1.43194 6.53241L1.3068 6.59058C0.477385 8.21168 0.00146484 10.0321 0.00146484 11.9588C0.00146484 13.8855 0.477385 15.7058 1.3068 17.3269L5.27726 14.324Z"
              fill="#FBBC05"
            />
            <path
              d="M12.2391 4.62403C14.5371 4.62403 16.0871 5.59402 16.971 6.40461L20.4248 3.10928C18.3036 1.1826 15.5433 0 12.2391 0C7.45273 0 3.31906 2.68406 1.30664 6.59056L5.26351 9.59359C6.25622 6.7102 9.00291 4.62403 12.2391 4.62403Z"
              fill="#EB4335"
            />
          </g>
          <defs>
            <clipPath id="clip0_247_676">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
        Google
      </button>
    </div>
  );
};

export default LoginGoogleFaceBook
