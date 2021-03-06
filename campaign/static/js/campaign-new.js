function imageHandler() {
    var range = this.quill.getSelection();
    var value = prompt('Enter the image URL');
    if (value !== null) {
        this.quill.insertEmbed(range.index, 'image', value, Quill.sources.USER);
    }
}

var toolbarOptions = {
    container: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [ 'link', 'image' ],          // add's image support

        ['clean']
    ], handlers: {
        image: imageHandler
    }
};

var options = {
    modules: {
        toolbar: toolbarOptions
    },
    placeholder: 'Write mail content here ...',
    readOnly: false,
    theme: 'snow'
};
var editor = new Quill('.editor', options);
var csventry = {};
var emailVariable = '';

function preprocessHTML(html) {
    html = $.parseHTML(html)
    $(html).find('br').remove();
    let processed = '';
    for (var i = 0; i < html.length; i++) {
        if (html[i].tagName.toLowerCase() === 'p') {
            processed += html[i].innerHTML;
            if (i < html.length - 1 && html[i+1].tagName.toLowerCase() === 'p') {
                processed += '<br>';
            }
        } else {
            processed += html[i].outerHTML;
        }
    }
    processed = `<div style="white-space:pre-wrap">${processed}</div>`
    return processed
}

function textChange() {
    var html = preprocessHTML(editor.root.innerHTML);

    // Copy into form
    var html_copy = (' ' + html).slice(1);
    $('#template').val(html_copy);

    // Do variable substitution
    for (var key in csventry) {
        if (csventry.hasOwnProperty(key)) {
            var re = new RegExp(`{{${key}}}`, 'g');
            html = html.replace(re, csventry[key]);
        }
    }

    // Show the preview
    $('#tpreview').html(html);
}

editor.on('text-change', function() {
    textChange();
});

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function addvar(variable) {
    if (!editor.getSelection()) editor.setSelection(0);
    editor.insertText(editor.getSelection().index, `{{${variable}}}`);
}

function emvar(key) {
    emailVariable = key;
    $('#emailvar').val(key);
}

function openFile(input) {
    var reader = new FileReader();
    reader.onload = function(){
        /* Read one entry */
        csventry = ($.csv.toObjects(reader.result))[0];

        /* Keep adding buttons here */
        let html = '';
        let emailHtml = '';
        let foundEmail = false;

        /* Iterate all keys */
        for (var key in csventry) {
            html += `<button class="btn var-btn add" data-cobalt-key="${key}">${key}</button>\n`
            if (validateEmail(csventry[key])) {
                emailHtml += `<button class='btn var-btn email' data-cobalt-key="${key}">${key}</button>\n`
                foundEmail = true;
            }
        }

        /* Set html of variable buttons */
        $('#variables').html(html);
        $('#email-variables').html(emailHtml);

        /* Setup event listeners */
        $('.var-btn.add').on('click', function(event) {
            event.preventDefault();
            addvar($(this).attr('data-cobalt-key'));
        });

        $('.var-btn.email').on('click', function(event) {
            event.preventDefault();
            emvar($(this).attr('data-cobalt-key'));
            $('.var-btn.email').each(function() {
                $(this).removeClass('btn-primary');
            })
            $(event.target).addClass('btn-primary');
        });

        /* Trigger change in email field */
        if (foundEmail) {
            $('.var-btn.email:first').trigger('click');
        } else {
            alert('No valid emails found in first record! This will not work!');
        }
        textChange();
    };
    reader.readAsText(input.files[0]);
    $('#csvname').text(input.files[0].name);
};

function fromEmailChange() {
    let str = $('#from-email').val();
    if (str.includes('<') && str.includes('>')) {
        str = $.trim(str.substring(
            str.lastIndexOf('<') + 1,
            str.lastIndexOf('>')
        ));
    }
    if ($('#user-email-copy').text() == str) {
        $('#bcc_from_div').hide();
        $('#bcc_from').prop('checked', false);
    } else {
        $('#bcc_from_div').show();
    }
    $('#from-email-copy').text(str);
}

$('#from-email').on('input', function() {
    fromEmailChange();
});
fromEmailChange();
