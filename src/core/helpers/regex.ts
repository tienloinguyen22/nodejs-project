export const regex = {
  password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
  email: /^[a-zA-Z][a-zA-Z0-9_.-]{0,40}@[a-z0-9]{2,}(.[a-z0-9]{2,4}){1,}$/,
  phoneNumber: /^([+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*){8,}$/,
  isoDate: /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/,
  imageExt: /\.(gif|jpg|jpeg|tiff|png|JPG|PNG|JPEG|GIF|TIFF)$/i,
};
