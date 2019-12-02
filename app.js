
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
        totalCalories: '.total-calories' 
    };

    return {
        getSelectors: function(){
            return UISelectors;
        },

        hideList: function(){
            document.querySelector(UISelectors.itemList).getElementsByClassName.display = 'none';
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

    return {
        init: function(){
            const items = ItemCtrl.getItems();
            if(items.length === 0){
                UICtrl.hideList();
            } else{
                UICtrl.populateItemList(items);
            }
            loadEventListeners();
        }
    };
})(ItemCtrl,UICtrl);

App.init();