import React from 'react';

const FilterBar = props => {
  const publicUrl = process.env.PUBLIC_URL || '';

  return (
    <div className="filter-bar row justify-content-around">
      <div className={"col-auto" + (props.currentFilter.gender !== "none" ? " sort-active" : "")} data-toggle="modal" data-target="#filter-modal">
        <img src={publicUrl + "/img/filter.png"} alt="filter" />
        <span>Filter</span>
      </div>
      <div className={"col-auto" + (props.currentSort === "desc" ? " sort-active" : "")} onClick={() => props.updateSort("desc")}>
        <img src={publicUrl + "/img/desc.png"} alt="sort-desc" />
        <span>Highest rent first</span>
      </div>
      <div className={"col-auto" + (props.currentSort === "asc" ? " sort-active" : "")} onClick={() => props.updateSort("asc")}>
        <img src={publicUrl + "/img/asc.png"} alt="sort-asc" />
        <span>Lowest rent first</span>
      </div>
    </div>
  );
}

export default FilterBar;
