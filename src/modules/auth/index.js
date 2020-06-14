import { sign, verify } from 'jsonwebtoken';
//  the JWT class  => handles generation and verification of jwt token
class JWT {
  static genToken({ payload }) {
    try {
      // remove password in case it was passed
      delete payload.password;
      const token = sign({ data: payload }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      return token;
    } catch (error) {
      throw new Error("Couldn't generate token");
    }
  }
  static verifyToken({ token }) {
    let decodedToken;
    try {
      decodedToken = verify(token, process.env.JWT_SECRET);
      if (!decodedToken) {
        throw new Error("Couldn't verify the token");
      }
      return decodedToken;
    } catch (error) {
      throw new Error("Couldn't verify the token");
    }
  }
}

export default JWT;
