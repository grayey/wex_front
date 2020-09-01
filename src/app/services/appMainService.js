import { Component } from 'react';
import * as apiService from './apiService';


export default class AppMainService extends Component {

    constructor(props) {
        super(props);
    }

    
    /**
     * 
     * --- ROLES SECTION HERE ----
     * 
     */


     /**
      * This method returns a list of all roles
      */
    async getAllRoles(){
        const url = 'roles';
        return await apiService.get(url);
    }


    /**
     * 
     * @param {*} roleData 
     * this method creates a new role
     */
    async createRole(roleData){
        const url = 'roles/';
        return await apiService.post(url,roleData);
    }

    /**
     * 
     * @param {*} role 
     * @param {*} id 
     * This method updates a role
     */
    async updateRole(role, id){
        const url =`roles/${id}/`;
        return await apiService.put(url,role);

    }

    /**
     * 
     * @param {*} role
     * This method deletes a role
     */
    async deleteRole(role){
        const url = `roles/${role._id}`
        return await apiService.del(url);
    }

    /**
     * 
     * @param {*} role 
     * This method toggles a role
     */
    async toggleRole(role){
        role.status = !role.status
      return this.updateRole(role, role._id);
    }

    /**
      * This method returns a role by its slug
      * 
      */
     async getRoleBySlug(roleSlug){
        const url = `roles/${roleSlug}`;
        return await apiService.get(url);
    }




     /**
     * 
     * --- CATEGORIES SECTION HERE ----
     * 
     */


     /**
      * This method returns a list of all categories
      */
     async getAllCategories(){
        const url = 'categories';
        return await apiService.get(url);
    }


    
    

    /**
     * 
     * @param {*} categoryData 
     * this method creates a new category
     */
    async createCategory(categoryData){
        const url = 'categories/';
        return await apiService.post(url,categoryData);
    }

    /**
     * 
     * @param {*} category 
     * @param {*} id 
     * This method updates a category
     */
    async updateCategory(category, id){
        const url =`categories/${id}/`;
        return await apiService.put(url,category);

    }

    /**
     * 
     * @param {*} category
     * This method deletes a category
     */
    async deleteCategory(category){
        const url = `categories/${category._id}`
        return await apiService.del(url);
    }

    /**
     * 
     * @param {*} category 
     * This method toggles a category
     */
    async toggleCategory(category){
        category.status = !category.status
      return this.updateCategory(category, category._id);
    }



    /**
     * 
     * TASKS SECTION --------
     * 
     */
      /**
      * This method returns a list of all categories
      */
     async getAllTasks(){
        const url = 'tasks';
        return await apiService.get(url);
    }

}