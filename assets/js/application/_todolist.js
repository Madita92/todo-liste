function createListEntry (value, state, index){
    let entryDiv = $('<div></div>').addClass('todo-list__entry');
    let entryInput = $('<input type="checkbox" id="'+ index +'" name="'+ index +'">');
    let entryLabel = $('<label for="'+ index +'">' + value + '</label>')
    let entryBtn = $('<span class="clear-entry">x</span>');

    if (state == true){
        entryInput .prop('checked', state);
        entryDiv.addClass('entry--selected');
    }

    let entryToAdd = entryDiv.append(entryInput).append(entryLabel).append(entryBtn);
    $('.todo-list__entry-list').prepend(entryToAdd);
}

function checkEntryValue(entry, entryState,  entryList) {
    if( entry.trim() == '' ) {
        return;
    } else if (entryList[0].includes(entry)) {
        $('.todo-list__entry-field').addClass('entry--error');
        $('.todo-list__entry-list').prepend('<div class="todo-list__entry-hint"> Already on the list. Type in a new to do.</div>');
    } else {
        let entryIndex = entryList[0].length
        entryList[0].push(entry);
        entryList[1].push(entryState)
        createListEntry(entryList[0][entryIndex], entryList[1][entryIndex], entryIndex);
        localStorage.setItem('todos', JSON.stringify(entryList));

        $('.todo-list__entry-field input').val('');
        checkClearAllLink();
    }
}

function removeEntry(entry, entryList) {
    entryList[0].splice(entry, 1);
    entryList[1].splice(entry, 1);
    localStorage.setItem('todos', JSON.stringify(entryList));
    $('input[type=checkbox]#'+entry).parent().remove();
}

function checkClearSelectLink(){
    let btn = $('.clear-selected-entries');
    $('.todo-list__entry input').each(function(){
        if ($(this).prop('checked')){
            btn.show();
            return false;

        } else {
            btn.hide();
        }
    });
}

function checkClearAllLink(){
    let btn = $('.clear-all');
    $('.todo-list__entry').length > 0 ? btn.show() : btn.hide();
}


$(document).ready(function() {
    let noteArray = [[],[]];

    // get stored data
    if(localStorage.length) {
        let todos = JSON.parse(localStorage.getItem('todos'));
        noteArray = todos;

        for (var i = 0; i < todos[0].length; i++) {
            createListEntry(todos[0][i],todos[1][i], i);
        }

        // check btn on reload
        checkClearSelectLink();
        checkClearAllLink()
    }


    //process user input
    $('.todo-list__entry-field input').on('keyup', function(e) {
        let entryTemp = $(this).val();

        //check input
        if ( e.key === 'Enter' ) {
            let stateToAdd = $(this).prop('checked');
            checkEntryValue(entryTemp, stateToAdd, noteArray);
            $(this).parent().addClass('init--state');
            return;
        }

        //remove error notifications
        $('.todo-list__entry-hint').remove();
        $(this).parent().removeClass('entry--error init--state');

        // init state
        if (entryTemp == 0){
            $(this).parent().addClass('init--state');
        }
    });

    // change todo state
    $('body').on('change', '.todo-list__entry input', function() {
        let indexOfEntry = $(this).attr('id');
        let entryState = $(this).prop('checked');
        noteArray[1][indexOfEntry] = entryState;
        localStorage.setItem('todos', JSON.stringify(noteArray));
        $(this).parent().toggleClass('entry--selected');
        checkClearSelectLink();
    });


    // remove specific entry
    $('body').on('click', '.clear-entry', function() {
        let noteToDelete = $(this).siblings('input').attr('id');
        removeEntry(noteToDelete, noteArray);
        checkClearSelectLink();
        checkClearAllLink();
    });

    // remove selected entries
    $('.clear-selected-entries').click(function(){
        $('input[type=checkbox]').each(function(){
           if($(this).prop('checked')) {
                let noteToDelete = $(this).attr('id');
                removeEntry(noteToDelete, noteArray)
            }
        });
        $('.clear-selected-entries').hide();
        checkClearAllLink();
    });

    // remove all entries
    $('.clear-all').click(function(){
        $('.todo-list__entry-list').empty();
        noteArray = [[],[]];
        localStorage.removeItem('todos');
        $('.clear-all').hide();
        $('.clear-selected-entries').hide();
    });
});

