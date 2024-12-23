import { SiMicrosoftexcel } from "react-icons/si";
import CommonExportExecel from "../../../utils/CommonExportExecel";

type Props = {
  data: any;
  nameSheet: string;
  nameFile: string;
  nameButton: string;
};
const ButtonExport = ({ data, nameSheet, nameFile, nameButton }: Props) => {
  return (
    <div>
      <button
        className="py-1.5 px-3.5 bg-[#29C27F] text-util flex items-center gap-1.5 text-sm rounded-sm"
        onClick={() => CommonExportExecel(data, nameSheet, nameFile)}
      >
        <SiMicrosoftexcel size={25} />
        <p className="text-nowrap">{nameButton}</p>
      </button>
    </div>
  );
};

export default ButtonExport;
