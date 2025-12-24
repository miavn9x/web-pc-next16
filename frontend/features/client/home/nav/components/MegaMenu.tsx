import MegaMenuContent from './MegaMenuContent';

const MegaMenu = () => {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-full max-w-[1050px] z-50">
        <div className="bg-white text-gray-800 shadow-2xl rounded-lg border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top">
            <MegaMenuContent />
        </div>
    </div>
  );
};

export default MegaMenu;
