import useAxiosPrivate from "../../shared/hooks/useAxiosPrivate";


export const uploadDocument = (formData) => {
  const axiosPrivate = useAxiosPrivate();
  return axiosPrivate.post("/documents/upload", formData);
};