import bcryptjs from 'bcryptjs';
// the Hash class => responsible for encryption and decription of password using bcryptjs
class Hash {
  static generateHash(password) {
    return bcryptjs.hashSync(password, 10);
  }

  static verifyHash(hash, password) {
    return bcryptjs.compareSync(password, hash);
  }
}

export default Hash;
