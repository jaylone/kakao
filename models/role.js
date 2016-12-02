import Joi from 'joi';
import bookshelf from './base';
// import Post from './post';

/**
 * @class Role
 * @extends bookshelf.Model
 */
export default class extends bookshelf.Model {
  /**
   * 依赖表，删除时依据此项删除关联表中对应的数据
   * @static {array}
   */
  // static dependents = ['posts'];

  /**
   * 表名称
   * @member
   * @return {string}
   */
  get tableName() {
    return 'roles';
  }

  /**
   * 是否包含creted_at和updated_at
   * 默认不包含
   * @member
   * @return {boolean|array}
   */
  get hasTimestamps() {
    return true;
  }

  /**
   * schema验证
   */
  get validate() {
    return {
      name: Joi.string().required(),
    };
  }

  /**
   * 一对多关系
   * @method
   * @return {bookshelf.Model}
   */
  // posts() {
  //   return this.hasMany(Post);
  // }

};
