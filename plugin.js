/* global $ */
function ShowDovetail() {
    var domText = window.ace.edit($('#domainSelection').find(':selected').val()).getSession().getValue();
    var probText = window.ace.edit($('#problemSelection').find(':selected').val()).getSession().getValue();

    $('#chooseFilesModal').modal('toggle');
    $('#plannerURLInput').show();
    window.toastr.info('Generating Dovetail...');

    $.ajax({type: 'POST',
            url: 'https://web-planner.herokuapp.com/dovetail',
            data: {domain: domText, problem: probText}
        })
        .done(function (res) {
            if(res.svg)
                window.toastr.success('Dovetail complete!');
            else
                window.toastr.error('Problem with the server.');
            updateHTML(res.svg);
        })
        .fail(function (res) {
            window.toastr.error('Error: Malformed URL?');
        });
}

function updateHTML(output) {
    var tab_name = 'Dovetail (' + (Object.keys(window.dovetails).length + 1) + ')';
    window.new_tab(tab_name, function(editor_name) {
        window.dovetails[editor_name] = output;
        var plan_html = '<div class="plan-display">\n';
        plan_html += '<h2>Dovetail</h2>\n';
        plan_html += '<div class="well plan-list" style="background-color:white;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif">\n';
        plan_html += output;
        plan_html += '</div>';
        $('#' + editor_name).html(plan_html);
    });
}

define(function () {
    // Store dovetails
    window.dovetails = {};

    return {
        name: 'Dovetail',
        author: 'Mau Magnaguagno',
        email: 'mauricio.magnaguagno@acad.pucrs.br',
        description: 'Visualize how predicates change during plan execution using the Dovetail metaphor',

        // This will be called whenever the plugin is loaded or enabled
        initialize: function() {

            // Add button to the top menu
            window.add_menu_button('Dovetail', 'dovetailMenuItem', 'glyphicon glyphicon-indent-left', "chooseFiles('dovetail')");

            // Register this as a user of the file chooser interface
            window.register_file_chooser('dovetail', {
                showChoice: function() {
                    window.setup_file_chooser('Dovetail', 'Generate Dovetail');
                    $('#plannerURLInput').hide();
                },
                selectChoice: ShowDovetail
            });
        },

        // This is called whenever the plugin is disabled
        disable: function() { window.remove_menu_button('dovetailMenuItem'); },

        // Used to save the plugin settings for later
        save: function() { return {}; },

        // Restore the plugin settings from a previous save call
        load: function(settings) {}
    };
});