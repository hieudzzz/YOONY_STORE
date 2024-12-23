import * as XLSX from 'xlsx';

const CommonExportExecel = async (data:any,nameSheet:string,nameFile:string) => {
  const wb=XLSX.utils.book_new(),
    ws=XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb,ws,nameSheet)
    XLSX.writeFile(wb,nameFile)
}

export default CommonExportExecel