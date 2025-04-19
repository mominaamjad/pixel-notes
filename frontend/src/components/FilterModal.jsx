import React, { useEffect, useState } from "react";
import noteService from "../services/noteService";
import { colorOptions } from "../utils/colors";
import Button from "./Button";

const FilterModal = ({
  selectedFilters,
  setSelectedFilters,
  onApply,
  onClear,
  onClose,
}) => {
  const [userTags, setUserTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      const token = localStorage.getItem("token");
      const tags = await noteService.getUserTags(token);
      setUserTags(tags);
    };

    fetchTags();
  }, []);

  const toggleTag = (tag) => {
    const tags = selectedFilters.tags.includes(tag)
      ? selectedFilters.tags.filter((t) => t !== tag)
      : [...selectedFilters.tags, tag];
    setSelectedFilters({ ...selectedFilters, tags });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-custom-offwhite p-6 w-[350px] space-y-4 shadow-lg">
        <h2 className="text-base text-custom-brown font-bold font-pixel">
          Filter Notes
        </h2>

        {/* Tags */}
        <div className="border-b border-custom-brown pb-3">
          <p className="font-bold font-mono text-sm mb-1">Tags</p>
          <div className="flex flex-wrap gap-3">
            {userTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-2 py-1 text-xs font-mono ${
                  selectedFilters.tags.includes(tag)
                    ? "bg-custom-dark-pink text-white shadow-[inset_-3px_-3px_0_0_rgba(0,0,0,0.3),inset_3px_3px_0_0_rgba(255,255,255,0.5)] transform scale-110"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div className="border-b border-custom-brown pb-3">
          <p className="font-bold font-mono text-sm mb-1">Color</p>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map((color) => (
              <button
                key={color}
                onClick={() =>
                  setSelectedFilters({ ...selectedFilters, color })
                }
                className={`w-6 h-6 ${
                  selectedFilters.color === color
                    ? "shadow-[inset_-3px_-3px_0_0_rgba(0,0,0,0.3),inset_3px_3px_0_0_rgba(255,255,255,0.5)] transform scale-110"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Favorite */}
        <div>
          <p className="font-bold font-mono text-sm mb-1">Favorite</p>
          <div className="flex gap-4">
            <label>
              <input
                type="radio"
                className="appearance-none w-3 h-3 border border-gray-400 rounded-none checked:bg-custom-dark-pink checked:border-transparent"
                name="favorite"
                checked={selectedFilters.favorite === true}
                onChange={() =>
                  setSelectedFilters({ ...selectedFilters, favorite: true })
                }
              />
              <span className="ml-1 font-mono">Yes</span>
            </label>
            <label>
              <input
                type="radio"
                className="appearance-none w-3 h-3 border border-gray-400 rounded-none checked:bg-custom-dark-pink checked:border-transparent"
                name="favorite"
                checked={selectedFilters.favorite === null}
                onChange={() =>
                  setSelectedFilters({ ...selectedFilters, favorite: null })
                }
              />
              <span className="ml-1 font-mono">Any</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mt-4 space-x-2">
          <Button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 text-sm"
          >
            Cancel
          </Button>
          <Button
            onClick={onClear}
            className="px-4 py-2 rounded bg-gray-200 text-sm"
          >
            Clear All
          </Button>
          <Button
            onClick={onApply}
            className="px-4 py-2 rounded bg-custom-dark-pink text-white hover:bg-custom-pink text-sm"
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
