module.exports = (theFunc) => (req, res, next) => {
  Promise.resolve(theFunc(req, res, next)).catch(next);
}; // ensure ki function agar Asychronocs operation
// perform karta rahata hai to infinte time run ho raha hai to
// throw error
