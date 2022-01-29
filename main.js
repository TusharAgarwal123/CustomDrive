(function fn() {

  // console.log("Hello everyone");

  let btn = document.querySelector("#myButton1");

  let file = document.querySelector("#myTextFile");

  let divContainer = document.querySelector("#container");
  let divBreadCrumb = document.querySelector("#divBreadCrumb");
  let myTemplate = document.querySelector("#myTemplate");
  //this is for root
  let rootPath = document.querySelector(".path");


  let fid = -1;

  let cfid = -1; //id of folder in which we are.

  let folders = [];

  rootPath.addEventListener("click", navigateBreadCrumb);

  btn.addEventListener("click", addFolder);

  file.addEventListener("click", addFile);

  function addFile() {
    let fname = prompt("Enter the folder name");
  }

  function addFolder() {

    let fname = prompt("Enter the folder name");

    fname=fname.trim();

    if (fname.length == 0) {
      alert("Empty folder name is not allowed");
      return;
    }

    //    if(fname==null){
    //        return;
    //    }

    let fidx = folders.filter(f => f.pid == cfid).findIndex(i => i.name == fname);
    if (fidx == -1) {

      fid++;
      addFolderInPage(fname, fid, cfid);


      //storing all folders in array.
      folders.push({

        id: fid,
        name: fname,
        pid: cfid,
        type: "folder"

      });


      persistFolder();
    } else {
      alert("folder with this name already exist");
    }


  }

  //fid is folder id
  //pid is parent id
  function addFolderInPage(fname, fid, pid) {

    //accessing the div inside the template

    let divFolderTemplate = myTemplate.content.querySelector(".folder");

    //making copy of divFolderTemplate
    let divFolder = document.importNode(divFolderTemplate, true);

    let divName = divFolder.querySelector("[purpose='name']");
    //  divFolder.innerHTML=fname;

    divName.innerHTML = fname;

    divFolder.setAttribute("fid", fid);
    divFolder.setAttribute("pid", pid);

    //deletion logic
    let spanDelete = divFolder.querySelector("span[action='delete']");

    //this function() will make closure of variable it is using.
    spanDelete.addEventListener("click", deletFolder);
    //deletion logic end


    //edit logic
    let spanRename = divFolder.querySelector("span[action='rename']");
    spanRename.addEventListener("click", renameFolder);
    //in editFolder() function address of spanEdit will be pass in this.
    //edit logic end

    //view logic
    let spanView = divFolder.querySelector("span[action='view']");
    spanView.addEventListener("click", viewFolder);





    divContainer.appendChild(divFolder);


  }


  function navigateBreadCrumb() {

    let fname = this.innerHTML;
    let cfid = parseInt(this.getAttribute("fid"));

    divContainer.innerHTML = "";
    folders.filter(f => f.pid == cfid).forEach(f => {
      addFolderInPage(f.name, f.id, f.pid);
    });

    //if we have directory like that a1/a2/a3/a4/a5
    //if we click on a3 so directory should look like a1/a2/a3.
    //a4/a5 should be remove.

    while (this.nextSibling) {
      this.parentNode.removeChild(this.nextSibling);
    }

    //  this.parentNode will give the divBreadCrumb

  }

  function viewFolder() {

    let divFolder = this.parentNode;
    let divName = divFolder.querySelector("[purpose='name']");

    //changing current folder id.
    cfid = parseInt(divFolder.getAttribute("fid"));

    //it will add in breadCrumb.

    let pathTemplate = myTemplate.content.querySelector(".path");
    let anchorPath = document.importNode(pathTemplate, true);
    anchorPath.innerHTML = divName.innerHTML;
    anchorPath.setAttribute("fid", cfid);
    anchorPath.addEventListener("click", navigateBreadCrumb);
    divBreadCrumb.appendChild(anchorPath);




    //first removing all folder
    divContainer.innerHTML = "";

    //showing only those folder which has pid equal to cfid.
    folders.filter(f => f.pid == cfid).forEach(f => {
      addFolderInPage(f.name, f.id, f.pid);
    })

  }

  function viewTextFile() {

  }

  function deletFolder() {

    let divFolder = this.parentNode;
    let divName = divFolder.querySelector("[purpose='name']");

    // let flag = confirm("do you really want to delete the folder " + fname);
    //we are using fname but it's carry a problem when we
    //edit and then delete.

    let flag = confirm("do you really want to delete the folder " + divName.innerHTML);

    if (flag == true) {

      let exist = folders.some(f => f.pid == parseInt(divFolder.getAttribute("fid")));

      if (exist == false) {

        divContainer.removeChild(divFolder);


        //we have to also remove from array.
        let idx = folders.findIndex(i => i.id == parseInt(divFolder.getAttribute("fid")));

        folders.splice(idx, 1);

        persistFolder();
      } else {
        alert("Can't delete, it has Childrens")
      }

    }

  }


  function deleteTextFile() {

  }

  function renameFolder() {

    let divFolder = this.parentNode;
    //parentNode will give the parent of this i.e span which is a div.

    let divName = divFolder.querySelector("[purpose='name']");

    let fname = prompt("Enter the new folder name");

    fname=fname.trim();

    if (fname.length == 0) {
      alert("Please enter something");
      return;
    }

    if (fname == divName.innerHTML) {

      alert("This is old name please enter something new!!!");
      return;
    }

    let fidx = folders.filter(f => f.pid == cfid).findIndex(i => i.name == fname);

    if (fidx == -1) {

      divName.innerHTML = fname;

      let folder = folders.find(i => i.id == parseInt(divFolder.getAttribute("fid")));

      folder.name = fname;
      persistFolder();

    } else {
      alert("folder with name already exist");
    }

  }

  function renameTextFile() {

  }

  function persistFolder() {
    console.log(folders);
    let fjson = JSON.stringify(folders);
    localStorage.setItem("data", fjson);
  }


  //on refresh our data will not remove bcoz of this function.
  function loadDataFromStorage() {

    let fjson = localStorage.getItem("data");
    if (!!fjson) {    //means fjson is not null.
      folders = JSON.parse(fjson);
      folders.forEach(function (f) {
        if (f.id > fid) {
          fid = f.id;
        }
        if (f.pid == cfid) {
          addFolderInPage(f.name, f.id, f.pid);
        }



      })

    }

  }

  loadDataFromStorage();


})();