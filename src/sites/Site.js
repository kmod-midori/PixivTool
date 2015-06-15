/**
 * Base class for all sites.
 */
export default class Site {
  /**
   * @unused
   */
  constructor(){}
  /**
   * Loader will call this method to decide
   * whether or not to continue loading.
   * @return {boolean}
   */
  static match(){
    return false;
  }

  /**
   * Loader will call this method if match returns true.
   */
  static run(){
    throw new Error('This is abstract!');
  }
}
