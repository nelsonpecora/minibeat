var app = {
    //app properties
    data: [], //array of all the pages loaded onto the client-side

    //app methods
    init: function() {
        //begins polling and does other stuff
        this.poll();
    },
    poll: function() {
        // this polls the api every three seconds
        var url = 'http://api.chartbeat.com/live/toppages/v3/?apikey=317a25eccba186e0f6b558f45214c0e7&host=avc.com',
            xhr = new XMLHttpRequest();

        xhr.onreadystatechange = ensureReadiness;

        function ensureReadiness() {
            if(xhr.readyState < 4) {
                return;
            }
            if(xhr.status !== 200) {
                return;
            }

            // all is well
            if(xhr.readyState === 4) {
                app.data = JSON.parse(this.response).pages;
                app.render();
            }
        }

        xhr.open('GET', url, true);
        xhr.send('');
    },
    render: function() {
        //this renders the main list
        document.getElementById('MainList').innerHTML = '';
        for(var i = 0, l = app.data.length; i < l; i++) {
            var listItem = document.createElement('li');
            listItem.className = 'ml_item';
            listItem.setAttribute('data-index',i);
            listItem.innerHTML = '<h3><span class="ml_item_number">'
                + app.data[i].stats.people
                + '</span> <span class="ml_item_title" title="'
                + app.data[i].title.slice(5)
                + '">'
                + ( app.data[i].title.match('A VC:') ? app.data[i].title.slice(5) : 'Home' )
                + '</span> <span class="ml_item_link">' //<a href="http://www.avc.com'
                // + app.data[i].path
                // + '" title="'
                // + app.data[i].path
                // + '" target="_blank">'
                // + 'link'
                // + '</a>
                + '</span></h3>';   //should I include a link to the page? The titles aren't very descriptive...

            listItem.addEventListener('click', function() {
                var index = this.getAttribute('data-index');
                app.subRender(index);
            });
            document.getElementById('MainList').appendChild(listItem);
        }
    },
    subRender: function(index) {
        // this switches the second list and renders it
        var refs = app.data[index].stats.toprefs;

        //document.getElementById('SubList').innerHTML = '';
        document.getElementById('SubList').innerHTML = (refs.length === 0) ? '<p class="no_items">No Referring Pages</p>' : '';
        for(var i = 0, l = refs.length; i < l; i++) {
            var subListItem = document.createElement('li');
            subListItem.className = 'sl_item';
            subListItem.innerHTML = '<h4><span class="sl_item_number">'
                + refs[i].visitors
                + '</span> <span class="sl_item_title"><a href="http://'
                + refs[i].domain
                + '">'
                + refs[i].domain
                + '</a></span></h4></li>';

            document.getElementById('SubList').appendChild(subListItem);
        }
    }
}

app.init();
































