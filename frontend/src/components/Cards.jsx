import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { cardStyles } from "../assets/dummystyle";
import {
  Clock,
  Edit,
  Trash2,
  Award,
  TrendingUp,
  Zap,
  Check,
  Copy,
  Download,
  Eye,
  Layers
} from "lucide-react";
import dayjs from "dayjs";

// ✅ Profile info card (Neo-Brutalist Theme)
export const ProfileInfoCard = () => {
  const navigate = useNavigate();
  const { user, clearUser } = useContext(UserContext);

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/");
  };

  return (
    user && (
      <div className="flex items-center gap-3 p-2 bg-white border-2 border-black rounded-none shadow-[4px_4px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_#000] transition-all">
        <div className="w-9 h-9 bg-[#ffe17c] border-2 border-black flex items-center justify-center text-black font-black text-base shadow-[2px_2px_0px_#000]">
          {user.name ? user.name[0].toUpperCase() : "U"}
        </div>
        <div className="pr-1 text-left">
          <div className="text-xs font-black text-black leading-tight uppercase">
            {user.name || "User"}
          </div>
          <button
            className="text-red-500 text-[10px] font-black uppercase tracking-wider block hover:underline text-left cursor-pointer mt-0.5"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    )
  );
};

// ✅ ResumeSummaryCard Component (Neo-Brutalist Redesign)
export const ResumeSummaryCard = ({
  title = "Untitled Resume",
  createdAt = null,
  updatedAt = null,
  onSelect,
  onDelete,
  onDuplicate,
  onDownload,
  completion = 85,
  templateUsed = "Modern"
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const formattedCreatedDate = createdAt
    ? dayjs(createdAt).format("DD/MM/YYYY")
    : "—";
  const formattedUpdatedDate = updatedAt
    ? dayjs(updatedAt).format("DD/MM/YYYY")
    : "—";

  // Simulate ATS Score based on completion
  const atsScore = Math.min(100, Math.round(completion * 0.9 + 10));

  const getStatusBadge = () => {
    if (completion >= 80) {
      return (
        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border border-black bg-emerald-300 text-black">
          Completed
        </span>
      );
    }
    return (
      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border border-black bg-orange-300 text-black">
        Draft
      </span>
    );
  };

  const generateDesign = () => {
    const colors = [
      "bg-white",
      "bg-white",
      "bg-white",
    ];
    return colors[title.length % colors.length];
  };

  return (
    <div
      className={`relative bg-white border-2 border-black rounded-none p-5 shadow-[8px_8px_0px_#000] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[5px_5px_0px_#000] transition-all flex flex-col justify-between h-[280px] text-black overflow-hidden`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div>
        {/* Top Info row */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex flex-col gap-1 items-start">
            <h4 className="font-extrabold text-lg uppercase tracking-tight truncate max-w-[170px] text-black">
              {title}
            </h4>
            <div className="flex gap-1.5 items-center">
              {getStatusBadge()}
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 border border-slate-300 px-1">
                {templateUsed || "Modern"}
              </span>
            </div>
          </div>
          
          {/* Highlighted Yellow ATS score box */}
          <div className="bg-[#ffe17c] border-2 border-black p-2 text-center shadow-[2px_2px_0px_#000]">
            <div className="text-xs font-black uppercase tracking-wider text-black">ATS</div>
            <div className="text-lg font-black text-black leading-none">{atsScore}</div>
          </div>
        </div>

        {/* Date strings */}
        <div className="text-[10px] font-bold text-slate-600 space-y-0.5 mb-4 border-l-2 border-black pl-2">
          <div className="flex items-center gap-1.5">
            <Clock size={11} />
            <span>Updated: {formattedUpdatedDate}</span>
          </div>
        </div>
      </div>

      <div>
        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1 text-[9px] font-black uppercase tracking-wider text-slate-800">
            <span>Completion</span>
            <span>{completion}%</span>
          </div>
          <div className="w-full h-3 bg-white border-2 border-black rounded-none overflow-hidden">
            <div
              className="h-full bg-[#b7c6c2] border-r-2 border-black transition-all duration-300"
              style={{ width: `${completion}%` }}
            ></div>
          </div>
        </div>

        {/* Action Panel: Push-buttons collapsing animations */}
        <div className="flex gap-2 w-full">
          <button
            onClick={onSelect}
            className="flex-1 py-1.5 border border-black bg-[#ffe17c] text-black font-extrabold text-[10px] uppercase tracking-wider shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000] transition-all cursor-pointer"
            title="Edit resume"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onDuplicate) onDuplicate();
            }}
            className="p-1.5 border border-black bg-white text-black font-extrabold text-[10px] shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000] transition-all cursor-pointer"
            title="Duplicate"
          >
            <Copy size={12} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onDownload) onDownload();
            }}
            className="p-1.5 border border-black bg-white text-black font-extrabold text-[10px] shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000] transition-all cursor-pointer"
            title="Download PDF"
          >
            <Download size={12} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onDelete) onDelete();
            }}
            className="p-1.5 border border-black bg-white hover:bg-red-400 text-black font-extrabold text-[10px] shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000] transition-all cursor-pointer"
            title="Delete"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ✅ TemplateCard Component (Neo-Brutalist Layout)
export const TemplateCard = ({ thumbnailImg, isSelected, onSelect }) => {
  return (
    <div
      className={`group relative aspect-[4/5] flex flex-col bg-white border-2 border-black rounded-none cursor-pointer transition-all duration-200 shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] ${
        isSelected ? "bg-[#ffe17c]/10 ring-2 ring-black" : ""
      }`}
      onClick={onSelect}
    >
      {thumbnailImg ? (
        <div className="relative w-full h-full">
          <img
            src={thumbnailImg}
            alt="Template preview"
            className="w-full h-full object-cover border-b-2 border-black"
          />
          {isSelected && (
            <div className="absolute top-2 right-2 w-6 h-6 bg-[#ffe17c] border-2 border-black rounded-none flex items-center justify-center shadow-[2px_2px_0px_#000]">
              <Check size={12} className="text-black stroke-[3px]" />
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
          <div className="w-10 h-10 bg-[#ffe17c] border border-black rounded-none flex items-center justify-center text-black mb-2 shadow-[2px_2px_0px_#000]">
            <Layers size={18} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider text-black">No Preview</span>
        </div>
      )}
    </div>
  );
};
