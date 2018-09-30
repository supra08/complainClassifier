
function departmentModule() {

}

departmentModule.authenticate = (department, password) => {
    return new Promise((resolve, reject) => {
        resolve(department);
    });
}


module.exports = departmentModule;