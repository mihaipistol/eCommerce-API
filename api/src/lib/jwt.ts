import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET as string;
export const JWT_EXPIRATION = parseInt(process.env.JWT_EXPIRATION ?? '', 10);
export const JWT_COOKIE_EXPIRATION = parseInt(
  process.env.JWT_COOKIE_EXPIRATION ?? '',
  10,
);

if (!JWT_SECRET || !JWT_EXPIRATION || !JWT_COOKIE_EXPIRATION) {
  throw new Error('JWT Values must be set in the environment variables');
}

const JWT_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: JWT_COOKIE_EXPIRATION,
  sameSite: 'strict',
};

export function jwtVerify(accessToken: string) {
  return new Promise((resolve, reject) => {
    jwt.verify(
      accessToken,
      JWT_SECRET,
      (error: any, accessTokenData: any = {}) => {
        const { data: user } = accessTokenData;
        // If we get an error or the user is not found we reject the promise
        if (error || !user) {
          reject();
        }
        resolve(user);
      },
    );
  });
}

// export function getUserData(accessToken: string): Promise<JwtUser> {
//   return jwtVerify(accessToken);
// }

// export function createToken(
//   user: IUser,
//   password: Password,
// ): Promise<string[]> {
//   // Extracting the user data
//   const { id, username, email, privilage, active } = user;

//   // Encrypting our password by combining the secrte key and the password and converting it to base64
//   const passwordEncrypted = setBase64(encrypt(`${secretKey}${password.hash}`));

//   // The 'token' is an alias for password in this case
//   const userData = {
//     id,
//     username,
//     email,
//     privilage,
//     active,
//     token: passwordEncrypted,
//   };

//   // We sign our JWT token and we save the data as Base64
//   const createToken = jwt.sign({ data: setBase64(userData) }, secretKey, {
//     expiresIn,
//   });

  return Promise.resolve([createToken]);
}
