/**
 * Firebase Tools
 * FB results management
 * @author Elihu A. Cruz
 * @version 1.0.1
 */
module.exports = {
  /**
   * Get Firebase object and convert into 
   * Collection of scheme
   * @param {Object} snapshot 
   * @returns {Array}
   */
  objectToArray (snapshot) {
    // iteration
    let collection = []
    // data to array
    for (const key in snapshot) {
      if (snapshot.hasOwnProperty(key)) {
        // get current value
        let data = snapshot[key]
        data.id = key
        // make collection
        collection.push(data)
      }
    } return collection
  }
}