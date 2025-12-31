export const generateStudentId = (): string => {
  const timestamp = Date.now().toString(); 
  const randomNum = Math.floor(1000 + Math.random() * 9000).toString(); 
  return `STU-${timestamp}-${randomNum}`;
};
