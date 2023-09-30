// create first simple middleware
const midOne = async(req, res, next) => {
  console.log('Run Middlware One');
  next();
  // next() function used to continue to the controller process
}

// export function to another file
module.exports = {
  midOne
}