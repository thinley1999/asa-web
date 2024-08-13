export const replaceDash = (ref) => {
    let refString = String(ref);
    let newRef = refString.replace(/_/g, "/");
      return `RMA\/${newRef}`;
  };
