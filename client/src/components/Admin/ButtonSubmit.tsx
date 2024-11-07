type Prop={
    content:string,
  }
  const ButtonSubmit = ({content}:Prop) => {
    return (
      <button
        type="submit"
        className="flex items-center py-1.5 px-4 bg-primary text-util rounded-md hover:bg-util hover:text-primary hover:outline hover:outline-primary transition-all "
      >{content}</button>
    );
  };
  
  export default ButtonSubmit;
  