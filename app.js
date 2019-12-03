
const ItemCtrl = (function(){

    const Item=function(id,name,calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    const data={
        items:[
               {id: 0,name: 'Steak Dinner' ,calories: 600},
               {id: 1,name: 'CookieJar' , calories: 500},
               {id: 2,name: 'Slampon' ,calories: 890}
        ],
        currentItem: null,
        totalCalories: 0
    }

    return {
        getItems:function(){
            return data.items
        },

        getItembyID: function(id){
            let found = null;
            data.items.forEach((item)=>{
                if(item.id === id){
                    found = item;
                }
            });
            return found;
        },

        updatedItem: function(name,calories){
            calories = parseInt(calories);
            let found = null;
            data.items.forEach((item)=>{
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },

        addItem: function(name,calories){
            let id= 0; 
            if(data.items.length > 0){
                id=data.items[data.items.length -1].id + 1 ;
            }else{
                id = 0 ;  
             } 
            calories = parseInt(calories);
            newItem = new Item(id,name,calories);
            data.items.push(newItem); //Add the newly created item to the primary DataStructure
            return newItem; 
        },

        setCurrentItem: function(item){
            data.currentItem = item ;
        },

        getCurrentItem: function(){
            return data.currentItem;
        },

        getTotalCalories: function(){
            let total = 0;
            data.items.forEach(function(item){
                total += item.calories ;
            });
            data.totalCalories = total;
            return data.totalCalories;
        },

        logData: function(){ 
        return data;
        }
    };
})();

const UICtrl = (function(){
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories',
        updateBtn: '.update-btn',
        deleteBtn: '.del-btn',
        backBtn: '.back-btn' ,
        listItems:  '#item-list li'
    };

    return {
        getSelectors: function(){
            return UISelectors;
        },

        hideList: function(){
            document.querySelector(UISelectors.itemList).getElementsByClassName.display = 'none';
        },

        addItemtoForm: function(){
            console.log=`${ItemCtrl.getCurrentItem().name}  ${ItemCtrl.getCurrentItem().name}`;
            document.querySelector(UISelectors.itemNameInput).value=ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },

        clearEditState: function(){
           document.querySelector(UISelectors.addBtn).style.display = 'inline'; 
           document.querySelector(UISelectors.deleteBtn).style.display = 'none';
           document.querySelector(UISelectors.backBtn).style.display = 'none';
           document.querySelector(UISelectors.updateBtn).style.display = 'none';
           UICtrl.clearInput();
       },
        
        showEditState: function(){
            document.querySelector(UISelectors.addBtn).style.display = 'none'; 
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
        },

        getItemInput: function(){
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },

        addListItem: function(item){
            document.querySelector(UISelectors.itemList).style.display = 'block';
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = `
            <strong>${item.name} :</strong>
            <em>${item.calories} Calories</em>
            <a href='#' class='secondary-content'>
                <i class='edit-item fa fa-pencil'></i>
            </a>
            `;
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li);
        },

        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems); //returns a nodelist
            listItems = Array.from(listItems);
            listItems.forEach((listItem)=>{
                const itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `
                    <strong>${item.name} :</strong>
                    <em>${item.calories} Calories</em>
                    <a href='#' class='secondary-content'>
                        <i class='edit-item fa fa-pencil'></i>
                    </a>
                    `; 
                }
            });
        },

        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },

        populateItemList: function(items){
            let html = '';
            items.forEach(item => {
                html += `<li id='item-${item.id}' class='collection-item'>
                            <strong>${item.name} :</strong>
                            <em>${item.calories} Calories</em>
                            <a href='#' class='secondary-content'>
                                <i class='edit-item fa fa-pencil'></i>
                            </a>
                        </li>`;
            });

            document.querySelector(UISelectors.itemList).innerHTML = html;
        } ,

        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        }
    };
})();

const App = (function(ItemCtrl,UICtrl){
    const loadEventListeners = function(){
        const UISelectors = UICtrl.getSelectors();
        document.querySelector(UISelectors.addBtn).addEventListener('click',itemAddSubmit);
      document.addEventListener('keypress',(e)=>{
        if(e.keyCode === 13 || e.which === 13){
            e.preventDefault() ;
            return false ;
        }
      }) //disable submit on enter
        document.querySelector(UISelectors.itemList).addEventListener('click',itemEditClick);
        document.querySelector(UISelectors.updateBtn).addEventListener('click',itemUpdateSubmit);
    }

    const itemAddSubmit = function(e){
        const input = UICtrl.getItemInput();
        if(input.name !== '' && input.calories!== ''){
            const newItem = ItemCtrl.addItem(input.name,input.calories);
            UICtrl.addListItem(newItem);
            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.showTotalCalories(totalCalories);
            UICtrl.clearInput();
        }
        e.preventDefault();
    }

    const itemEditClick = function(e){
        if(e.target.classList.contains('edit-item')){
            const listId = e.target.parentNode.parentNode.id;
            const id = parseInt(listId.split('-')[1]);
            const itemToEdit = ItemCtrl.getItembyID(id);
            ItemCtrl.setCurrentItem(itemToEdit);
            UICtrl.addItemtoForm();
        }
        e.preventDefault();
    };

    const itemUpdateSubmit = function(e){
        const input = UICtrl.getItemInput();
        const updatedItem = ItemCtrl.updatedItem(input.name,input.calories);
        UICtrl.updateListItem(updatedItem);
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);
        UICtrl.clearEditState();
        e.preventDefault(); 
    }

    return {
        init: function(){
            UICtrl.clearEditState();
            const items = ItemCtrl.getItems();
            if(items.length === 0){
                UICtrl.hideList();
            } else{
                UICtrl.populateItemList(items);
            }
            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.showTotalCalories(totalCalories);
            loadEventListeners();
        }
    };
})(ItemCtrl,UICtrl);

App.init();