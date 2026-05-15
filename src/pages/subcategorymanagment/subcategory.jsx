import React from "react";
import AddCategory from "../categorymanagement/AddCategory";

const SubcategoryModal = ({ modalAdd, closeAndClear, refreshList }) => {
  return (
    <AddCategory
      modalAdd={modalAdd}
      closeAndClear={closeAndClear}
      catTabName="sub category"
      getCatListFun={refreshList}
      isEdit={false}
    />
  );
};

export default SubcategoryModal;
