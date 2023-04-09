/** 사용자 인증 확인 */
export const loginValid = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(403).send({});
  }
};
