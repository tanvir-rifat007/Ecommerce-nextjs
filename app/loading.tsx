import Image from "next/image";
import Loader from "@/assets/loader.gif";

const loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Image src={Loader} alt="Prostore logo" width={48} height={48} />
    </div>
  );
};

export default loading;
