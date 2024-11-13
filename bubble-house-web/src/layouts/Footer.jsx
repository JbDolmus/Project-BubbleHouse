import logo from "/logo.png";

export const Footer = () => {
    const year = new Date().getFullYear();
    return (
        <div className="bg-[#4F8EC9] text-white w-full py-4">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="text-center md:text-left">
                        <p className="m-0">{`© ${year} Todos los derechos reservados`}</p>
                    </div>
                    <div className="flex items-center justify-center md:justify-end">
                        <img src={logo} width={30} height={30} alt="Logo" className="rounded" />
                        <h6 className="ml-2 font-bold">BubbleHouseApp</h6>
                    </div>
                </div>
            </div>
        </div>
    );
};